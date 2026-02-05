---
name: ENV-setup
description: 환경 설정 파일 자동 생성 및 관리. 백엔드/프론트엔드 환경변수 파일을 생성하고 개발/프로덕션 환경을 분리합니다.
context: fork
---

# ENV Setup - 환경 설정 자동화

## 개요
프로젝트의 환경 설정 파일(.env)을 자동으로 생성하고 관리합니다.

## 트리거 상황
- "환경변수 설정해줘"
- "env 파일 만들어줘"
- "개발/프로덕션 환경 분리"
- 새 프로젝트 초기 설정 시

## 작업 순서

### 1. 백엔드 환경 설정

#### 1.1 `.env.example` 생성
```bash
# 위치: backend/.env.example
```

필수 항목:
- DATABASE_URL
- SECRET_KEY
- CORS_ORIGINS
- DEBUG

[상세 가이드: references/backend-env.md](references/backend-env.md)

#### 1.2 `backend/.env` 생성
- .env.example을 복사하여 실제 값 입력
- .gitignore에 .env 추가 확인
- 민감 정보 절대 커밋 금지

### 2. 프론트엔드 환경 설정

#### 2.1 `.env.local.example` 생성
```bash
# 위치: frontend/.env.local.example
```

필수 항목:
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_APP_NAME

[상세 가이드: references/frontend-env.md](references/frontend-env.md)

#### 2.2 `frontend/.env.local` 생성
- .env.local.example을 복사하여 실제 값 입력
- Next.js는 .env.local을 자동으로 gitignore

### 3. 환경별 분리 (선택)

**개발 환경:**
- `backend/.env.development`
- `frontend/.env.development`

**프로덕션 환경:**
- `backend/.env.production`
- `frontend/.env.production`

### 4. 검증

다음 명령어로 환경변수 로드 확인:

**백엔드:**
```bash
cd backend
python -c "from dotenv import load_dotenv; load_dotenv(); import os; print(os.getenv('DATABASE_URL'))"
```

**프론트엔드:**
```bash
cd frontend
npm run dev
# 콘솔에서 process.env.NEXT_PUBLIC_API_URL 확인
```

## 주의사항

- ✅ .env 파일은 절대 Git에 커밋하지 않음
- ✅ .env.example은 반드시 커밋 (팀원 참고용)
- ✅ SECRET_KEY는 랜덤 생성 (최소 32자)
- ❌ 프로덕션 키를 개발 환경에 사용 금지
- ❌ 하드코딩된 URL/키는 모두 환경변수로 이동

## 파일 목록

완료 시 생성되는 파일:
```
project/
├── backend/
│   ├── .env.example          ✅ Git 커밋
│   ├── .env                   ❌ Git 제외
│   ├── .env.development       ❌ Git 제외 (선택)
│   └── .env.production        ❌ Git 제외 (선택)
└── frontend/
    ├── .env.local.example     ✅ Git 커밋
    ├── .env.local             ❌ Git 제외
    ├── .env.development       ❌ Git 제외 (선택)
    └── .env.production        ❌ Git 제외 (선택)
```

## 참고 문서
- [Backend 환경변수 가이드](references/backend-env.md)
- [Frontend 환경변수 가이드](references/frontend-env.md)
- [보안 체크리스트](references/security-checklist.md)
