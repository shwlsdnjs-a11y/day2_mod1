# Requirements.txt 분석 리포트

## 분석 일자
2026-02-05

## 분석 방법
- 모든 Python 파일의 import 문 스캔
- 실제 사용되는 외부 패키지만 추출
- 표준 라이브러리 제외

## 실제 사용 중인 패키지 (7개)

### 1. fastapi (0.109.2)
**사용 위치:**
- `app/main.py` - FastAPI 앱 생성, CORS 미들웨어
- `app/routers/auth.py` - APIRouter, HTTPException, Depends
- `app/routers/examples.py` - APIRouter, Depends
- `app/routers/market.py` - APIRouter, HTTPException

**주요 기능:**
- 웹 프레임워크
- 라우팅
- 의존성 주입
- CORS 설정

### 2. uvicorn[standard] (0.27.1)
**사용 위치:**
- 실행 명령: `uvicorn app.main:app --reload`

**주요 기능:**
- ASGI 서버
- FastAPI 앱 실행

**참고:** 코드에 직접 import하지 않지만 실행에 필수

### 3. sqlalchemy (2.0.25)
**사용 위치:**
- `app/database.py` - create_engine, sessionmaker, declarative_base
- `app/models/example.py` - Column, Integer, String, DateTime
- `app/models/user.py` - Column, Numeric, ForeignKey, relationship
- `app/routers/*.py` - Session (Depends)

**주요 기능:**
- ORM (Object-Relational Mapping)
- SQLite 데이터베이스 연결
- 모델 정의 및 쿼리

### 4. pydantic (2.5.3)
**사용 위치:**
- `app/schemas/auth.py` - BaseModel, EmailStr, Field
- `app/schemas/example.py` - BaseModel
- `app/schemas/market.py` - BaseModel, Field
- `app/schemas/user.py` - BaseModel, EmailStr

**주요 기능:**
- 데이터 검증
- 요청/응답 스키마 정의
- 타입 검증

### 5. python-jose[cryptography] (3.3.0)
**사용 위치:**
- `app/routers/auth.py` - jwt.encode(), jwt.decode(), JWTError

**주요 기능:**
- JWT 토큰 생성
- JWT 토큰 검증
- 인증 시스템

**사용 API:**
- `/auth/login` - 토큰 생성
- `/auth/me` - 토큰 검증

### 6. passlib[bcrypt] (1.7.4)
**사용 위치:**
- `app/routers/auth.py` - CryptContext, hash(), verify()

**주요 기능:**
- 비밀번호 해싱 (bcrypt)
- 비밀번호 검증

**사용 API:**
- `/auth/signup` - 비밀번호 해싱
- `/auth/login` - 비밀번호 검증

### 7. requests (2.31.0)
**사용 위치:**
- `app/services/market_api.py` - requests.get()

**주요 기능:**
- HTTP 클라이언트
- 외부 API 호출 (CoinGecko)

**사용 API:**
- `/market/prices` - 암호화폐 시세 조회

## 제거된 패키지

### python-dotenv
**이유:** 환경변수 로드 코드 없음
- `load_dotenv()` 호출 없음
- `os.getenv()` 사용 없음
- SECRET_KEY가 하드코딩됨

**권장:**
- 프로덕션 환경에서는 환경변수 사용 권장
- 필요 시 추가 가능

### python-multipart
**이유:** 파일 업로드 기능 없음
- `UploadFile` 사용 없음
- `File()` 사용 없음
- `Form()` 사용 없음

**권장:**
- 파일 업로드 기능 추가 시 설치

### pydantic[email]
**이유:** pydantic에 포함됨
- EmailStr은 pydantic 기본 패키지에 포함
- 별도 설치 불필요

## 의존성 트리

```
fastapi (0.109.2)
├── pydantic (자동 설치)
├── starlette (자동 설치)
└── typing-extensions (자동 설치)

uvicorn[standard] (0.27.1)
├── uvloop (자동 설치)
├── httptools (자동 설치)
└── websockets (자동 설치)

sqlalchemy (2.0.25)
├── typing-extensions (자동 설치)
└── greenlet (자동 설치)

python-jose[cryptography] (3.3.0)
├── cryptography (자동 설치)
├── ecdsa (자동 설치)
└── pyasn1 (자동 설치)

passlib[bcrypt] (1.7.4)
└── bcrypt (자동 설치)

requests (2.31.0)
├── urllib3 (자동 설치)
├── certifi (자동 설치)
└── charset-normalizer (자동 설치)
```

## 설치 명령어

```bash
# 가상환경 활성화
cd backend
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# 의존성 설치
pip install -r requirements.txt

# 설치 확인
pip list
```

## 예상 설치 패키지 수
- 직접 지정: 7개
- 의존성 포함: 약 30-40개

## 디스크 사용량
- 약 50-80MB (의존성 포함)

## 호환성
- Python 3.10+
- Windows, macOS, Linux 모두 지원
