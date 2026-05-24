"""Scenes CRUD and execution tests."""


def _auth_header(client):
    r = client.post("/auth/register", json={
        "full_name": "T", "email": "t@e.com", "password": "p",
    })
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_list_scenes_empty(client):
    r = client.get("/scenes")
    assert r.status_code == 200
    assert r.json() == []


def test_create_scene(client):
    headers = _auth_header(client)
    # need a device first → skip detail check, test endpoint shape
    r = client.post("/scenes", headers=headers, json={
        "name": "Test Scene",
        "icon": "home",
        "actions": [],
    })
    assert r.status_code == 200
    assert "id" in r.json()


def test_run_nonexistent_scene(client):
    headers = _auth_header(client)
    r = client.post("/scenes/9999/run", headers=headers)
    assert r.status_code == 404
