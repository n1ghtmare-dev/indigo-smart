import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "3306")
    DB_NAME: str = os.getenv("DB_NAME", "smart_home_db")
    DB_SOCKET: str = os.getenv("DB_SOCKET", "")

    JWT_SECRET: str = os.getenv("JWT_SECRET", "indigo-smart-dev-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

    SIMULATOR_AUTOSTART: bool = os.getenv("SIMULATOR_AUTOSTART", "true").lower() == "true"
    SIMULATOR_INTERVAL_SECONDS: int = int(os.getenv("SIMULATOR_INTERVAL_SECONDS", "30"))

    @property
    def DATABASE_URL(self) -> str:
        if self.DB_SOCKET:
            return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@/{self.DB_NAME}?unix_socket={self.DB_SOCKET}&charset=utf8mb4"
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"


settings = Settings()
