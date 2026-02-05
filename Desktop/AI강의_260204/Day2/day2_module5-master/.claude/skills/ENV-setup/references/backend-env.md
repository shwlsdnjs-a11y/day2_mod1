# Backend 환경변수 가이드

## FastAPI + SQLAlchemy 환경변수

### `.env.example` 템플릿

```bash
# Database
DATABASE_URL=sqlite:///./app.db

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# App Settings
DEBUG=True
APP_NAME=Module5 API
API_VERSION=1.0.0

# Optional: External Services
# REDIS_URL=redis://localhost:6379
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
```

### 실제 `.env` 파일 생성

```bash
# 1. .env.example 복사
cp .env.example .env

# 2. SECRET_KEY 생성
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 3. 생성된 키를 .env의 SECRET_KEY에 붙여넣기
```

### 코드에서 사용하기

```python
# backend/app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: str
    DEBUG: bool = True
    APP_NAME: str = "FastAPI App"
    API_VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
```

### main.py에서 활용

```python
from app.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

# CORS
origins = settings.CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 환경별 설정

### 개발 환경 (`.env.development`)
```bash
DATABASE_URL=sqlite:///./app_dev.db
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

### 프로덕션 환경 (`.env.production`)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DEBUG=False
CORS_ORIGINS=https://yourdomain.com
SECRET_KEY=<강력한-랜덤-키>
```

## 환경별 실행

```bash
# 개발
cp .env.development .env
uvicorn app.main:app --reload

# 프로덕션
cp .env.production .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 보안 주의사항

1. **SECRET_KEY**
   - 최소 32자 이상
   - 랜덤 생성 필수
   - 절대 공개 저장소에 커밋 금지

2. **DATABASE_URL**
   - 프로덕션에서는 PostgreSQL/MySQL 사용 권장
   - 비밀번호 포함 시 각별히 주의

3. **.gitignore 확인**
   ```
   .env
   .env.local
   .env.*.local
   *.db
   ```

## 검증

```bash
# 환경변수 로드 테스트
cd backend
python -c "from app.config import settings; print(f'App: {settings.APP_NAME}, Debug: {settings.DEBUG}')"
```
