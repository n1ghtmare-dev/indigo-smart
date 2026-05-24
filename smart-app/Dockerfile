FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN pip install --no-cache-dir \
    "fastapi>=0.135" "uvicorn[standard]>=0.42" \
    "sqlalchemy>=2.0" "pymysql>=1.1" "cryptography>=46" \
    "python-dotenv>=1.2" "python-jose[cryptography]" \
    "bcrypt" "pydantic[email]" "apscheduler"

COPY src/smart_app ./smart_app

EXPOSE 8000
CMD ["uvicorn", "smart_app.main:app", "--host", "0.0.0.0", "--port", "8000"]
