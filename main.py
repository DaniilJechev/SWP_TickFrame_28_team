from tickframe.backend.main import app  # noqa: F401 — used by uvicorn via "main:app"


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
