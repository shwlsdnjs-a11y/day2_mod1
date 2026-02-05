# Backend (FastAPI)

## 기술 스택

- **Framework**: FastAPI 0.109.2
- **Language**: Python 3.12+
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 앱 진입점
│   ├── database.py          # DB 연결 및 세션
│   ├── models/              # SQLAlchemy 모델
│   │   ├── example.py
│   │   └── user.py
│   ├── schemas/             # Pydantic 스키마
│   │   ├── auth.py
│   │   ├── example.py
│   │   └── user.py
│   ├── routers/             # API 엔드포인트
│   │   ├── auth.py          # 인증 (회원가입, 로그인)
│   │   ├── examples.py
│   │   └── market.py        # 암호화폐 시세 조회
│   └── services/            # 비즈니스 로직
│       └── market_api.py    # CoinGecko API 연동
├── scripts/
│   ├── lint.sh              # 코드 품질 검사
│   └── fix.sh               # 자동 수정
├── .env                     # 환경변수 (Git 제외)
├── .env.example             # 환경변수 템플릿
├── requirements.txt         # 프로덕션 의존성
├── requirements-dev.txt     # 개발 의존성
└── pyproject.toml           # 린터 설정

```

## 설치 및 실행

### 1. 가상 환경 생성 (선택)

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 2. 의존성 설치

```bash
# 프로덕션 의존성
pip install -r requirements.txt

# 개발 의존성 (린터, 테스트 등)
pip install -r requirements-dev.txt
```

### 3. 환경변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env

# SECRET_KEY 생성 및 설정
python -c "import secrets; print(secrets.token_urlsafe(32))"
# 출력된 키를 .env의 SECRET_KEY에 붙여넣기
```

### 4. 서버 실행

```bash
# 개발 모드 (자동 재시작)
uvicorn app.main:app --reload

# 프로덕션 모드
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

서버 실행 후: http://localhost:8000

## API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 주요 엔드포인트

### 인증 (Auth)
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인 (JWT 토큰 발급)
- `GET /auth/me` - 현재 사용자 정보 (인증 필요)

### 시장 (Market)
- `GET /market/coins` - 지원 암호화폐 목록 조회
- `GET /market/prices` - 실시간 시세 조회 (CoinGecko API)

### 예제
- `GET /api/examples` - 예제 목록 조회
- `POST /api/examples` - 예제 생성
- `GET /api/examples/{id}` - 예제 상세 조회
- `PUT /api/examples/{id}` - 예제 수정
- `DELETE /api/examples/{id}` - 예제 삭제

### 헬스 체크
- `GET /api/health` - 서버 상태 확인

## 개발 가이드

### 코드 품질 검사

```bash
# 전체 검사
./scripts/lint.sh

# 자동 수정
./scripts/fix.sh
```

### 데이터베이스

- SQLite 파일: `app.db` (자동 생성)
- 테이블은 서버 첫 실행 시 자동 생성됨
- 초기 데이터: 회원가입 시 Account 자동 생성 (초기 잔액: 100,000,000원)

### 환경변수

`.env` 파일에서 관리:

```bash
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=<랜덤-생성-키>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DEBUG=True
```

## 의존성 설명

### 프로덕션 (`requirements.txt`)

- **fastapi**: 고성능 웹 프레임워크
- **uvicorn**: ASGI 서버
- **sqlalchemy**: ORM (데이터베이스)
- **pydantic**: 데이터 검증 및 직렬화
- **python-jose**: JWT 토큰 생성/검증
- **passlib**: 비밀번호 해싱 (bcrypt)
- **requests**: HTTP 클라이언트 (외부 API 호출)
- **python-multipart**: 파일 업로드 지원
- **python-dotenv**: 환경변수 로드

### 개발 (`requirements-dev.txt`)

- **ruff**: 빠른 린터
- **black**: 코드 포매터
- **mypy**: 타입 체커
- **bandit**: 보안 스캔
- **pytest**: 테스트 프레임워크
- **httpx**: 비동기 HTTP 클라이언트 (테스트용)

## 보안

- 비밀번호는 bcrypt로 해싱
- JWT 토큰으로 인증 (Bearer 토큰)
- SECRET_KEY는 환경변수로 관리 (Git에 커밋 금지)
- CORS는 localhost:3000만 허용 (개발 환경)

## 외부 API

### CoinGecko API
- URL: https://api.coingecko.com/api/v3
- 사용: 암호화폐 실시간 시세 조회
- 인증: 불필요 (Public API)
- 지원 코인: BTC, ETH, XRP, ADA, SOL

## 문제 해결

### "No module named 'app'"
```bash
# backend 폴더에서 실행하는지 확인
cd backend
uvicorn app.main:app --reload
```

### 포트 이미 사용 중
```bash
# 다른 포트 사용
uvicorn app.main:app --reload --port 8001
```

### SQLite 데이터베이스 초기화
```bash
# app.db 파일 삭제 후 재실행
rm app.db
uvicorn app.main:app --reload
```

## 라이선스

이 프로젝트는 교육 목적으로 만들어졌습니다.
