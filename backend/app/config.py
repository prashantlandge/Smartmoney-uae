from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://smartmoney:smartmoney_dev@localhost:5432/smartmoney_uae"
    redis_url: str = "redis://localhost:6379"

    wise_api_key: str = ""
    wise_profile_id: str = ""
    remitly_api_key: str = ""
    xe_api_key: str = ""
    western_union_affiliate_id: str = ""

    anthropic_api_key: str = ""

    admin_username: str = "admin"
    admin_password: str = ""

    next_public_api_url: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
