"""Auth flow tests."""


def test_register_then_login(client):
    r = client.post("/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "secret123",
    })
    assert r.status_code == 200
    token = r.json()["access_token"]
    assert len(token) > 50

    r2 = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "secret123",
    })
    assert r2.status_code == 200
    assert r2.json()["role"] == "user"


def test_login_invalid_password(client):
    client.post("/auth/register", json={
        "full_name": "User",
        "email": "u@e.com",
        "password": "right",
    })
    r = client.post("/auth/login", json={"email": "u@e.com", "password": "wrong"})
    assert r.status_code == 401


def test_me_requires_token(client):
    r = client.get("/auth/me")
    assert r.status_code == 401


def test_me_with_token(client):
    reg = client.post("/auth/register", json={
        "full_name": "Me",
        "email": "me@e.com",
        "password": "p",
    })
    token = reg.json()["access_token"]
    r = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "me@e.com"


def test_protected_endpoint_requires_auth(client):
    r = client.put("/devices/1/state", json={"state_type": "ON/OFF", "state_value": "1"})
    assert r.status_code == 401
