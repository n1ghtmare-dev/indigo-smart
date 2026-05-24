"""Unit tests for security helpers."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "smart_app"))

from security import hash_password, verify_password, create_access_token, decode_token


def test_password_hash_round_trip():
    h = hash_password("secret123")
    assert h.startswith("$2b$")
    assert verify_password("secret123", h) is True
    assert verify_password("wrong", h) is False


def test_jwt_round_trip():
    token = create_access_token(user_id=42, role="admin")
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "42"
    assert payload["role"] == "admin"


def test_invalid_jwt():
    assert decode_token("not.a.token") is None
