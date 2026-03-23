# Variables de entorno y configuracion
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from dotenv import load_dotenv, find_dotenv

# Cargar variables de entorno desde el archivo .env más cercano (buscando hacia arriba)
load_dotenv(find_dotenv())

class Settings(BaseSettings):
    """
    Clase que representa toda la configuración de la app.

    pydantic-settings lee automáticamente las variables de entorno
    y las mapea a los atributos de esta clase.

    El orden de prioridad para leer valores es:
    1. Variables de entorno del sistema
    2. Archivo .env en la raíz del proyecto
    3. El valor default
    """

    # Distinguir ambiente
    APP_ENV: str = 'development'

    # Direccion a PostgreSQL
    DATABASE_URL: str

    # # Autentificacion
    # # Firma para generar y verificar tokens.
    # JWT_SECRET_KEY: str

    # # Algoritmo para firmar tokens
    # JWT_ALGORITHM: str

    # # Tiempo de vida del token
    # ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # # AWS
    # # AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY = identifican al usuario IAM
    # AWS_ACCESS_KEY_ID: str
    # AWS_SECRET_ACCESS_KEY: str

    # # AWS_REGION = region de aws
    # AWS_REGION: str

    # # AWS_S3_BUCKET_NAME = nombre del bucket
    # AWS_S3_BUCKET_NAME: str

    # # CloudFront
    # CLOUDFRONT_URL: AnyHttpUrl

    # # NVIDIA
    # # NVIDIA KEY
    # NVIDIA_API_KEY: str

    # # Endpoint
    # NIM_BASE_URL: str = "https://integrate.api.nvidia.com/v1"

    # Configuracion de pydantic-settings
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False
    )

# Instancia global
settings = Settings()