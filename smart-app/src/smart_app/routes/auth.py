"""Auth endpoints: register / login / me."""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db
from models import User, AuditLog
from security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterIn(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: EmailStr
    role: str


@router.post("/register", response_model=TokenOut)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already registered")
    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id, user.role)
    return TokenOut(
        access_token=token, user_id=user.id,
        full_name=user.full_name, email=user.email, role=user.role,
    )


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")

    user.last_login = datetime.utcnow()
    db.add(AuditLog(user_id=user.id, action="login", entity_type="user", entity_id=user.id,
                    details={"email": user.email}))
    db.commit()
    token = create_access_token(user.id, user.role)
    return TokenOut(
        access_token=token, user_id=user.id,
        full_name=user.full_name, email=user.email, role=user.role,
    )


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "last_login": user.last_login,
    }


@router.post("/logout")
def logout(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.add(AuditLog(user_id=user.id, action="logout", entity_type="user", entity_id=user.id))
    db.commit()
    return {"ok": True}
