# 환경변수 보안 체크리스트

## ✅ 필수 확인 사항

### 1. .gitignore 설정
```bash
# .gitignore에 반드시 포함
.env
.env.local
.env*.local
.env.development.local
.env.production.local

# SQLite DB도 제외
*.db
*.sqlite
*.sqlite3
```

### 2. .env.example 관리
```bash
# ✅ 커밋해야 할 것
.env.example
.env.local.example

# ❌ 절대 커밋하면 안 되는 것
.env
.env.local
.env.production
```

### 3. SECRET_KEY 생성

#### Python (FastAPI)
```bash
# 안전한 랜덤 키 생성
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 또는
openssl rand -hex 32
```

#### Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. NEXT_PUBLIC_ 접두사 주의

```bash
# ❌ 위험: 민감 정보 노출
NEXT_PUBLIC_DATABASE_URL=postgresql://...
NEXT_PUBLIC_SECRET_KEY=abc123

# ✅ 안전: 공개 가능한 정보만
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=MyApp
```

## 🔒 환경별 보안 수준

### 개발 환경
```bash
# 로컬 개발용 - 보안 수준 낮음
DATABASE_URL=sqlite:///./app_dev.db
DEBUG=True
SECRET_KEY=dev-key-not-for-production
CORS_ORIGINS=http://localhost:3000
```

### 스테이징 환경
```bash
# 테스트 서버 - 보안 수준 중간
DATABASE_URL=postgresql://staging_user:STRONG_PASS@host/staging_db
DEBUG=False
SECRET_KEY=<32자-이상-랜덤-키>
CORS_ORIGINS=https://staging.example.com
```

### 프로덕션 환경
```bash
# 실제 서비스 - 보안 수준 최상
DATABASE_URL=postgresql://prod_user:VERY_STRONG_PASS@host/prod_db
DEBUG=False
SECRET_KEY=<64자-이상-랜덤-키>
CORS_ORIGINS=https://example.com
ALLOWED_HOSTS=example.com,www.example.com
```

## 🚫 절대 하지 말아야 할 것

### 1. 하드코딩
```python
# ❌ 나쁜 예
DATABASE_URL = "postgresql://user:password@localhost/db"
SECRET_KEY = "my-secret-key-123"

# ✅ 좋은 예
import os
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
```

### 2. Git에 커밋
```bash
# 커밋 전 확인
git status | grep .env

# 실수로 커밋한 경우
git rm --cached .env
git commit -m "Remove .env from Git"

# 이미 푸시한 경우 - 즉시 키 재생성!
# 1. .env의 모든 SECRET_KEY 재생성
# 2. git history에서 완전히 제거 (git filter-branch)
```

### 3. 로그에 출력
```python
# ❌ 위험
print(f"Database URL: {DATABASE_URL}")
logger.info(f"Secret: {SECRET_KEY}")

# ✅ 안전
logger.info("Database connection established")
logger.debug("Using configuration from .env")
```

## 📋 배포 전 체크리스트

### Backend (FastAPI)
- [ ] SECRET_KEY가 32자 이상 랜덤 값인가?
- [ ] DEBUG=False로 설정했는가?
- [ ] CORS_ORIGINS에 프로덕션 도메인만 포함되는가?
- [ ] .env 파일이 .gitignore에 포함되는가?
- [ ] .env.example에는 실제 값이 없는가?

### Frontend (Next.js)
- [ ] NEXT_PUBLIC_ 변수에 민감 정보가 없는가?
- [ ] API_URL이 프로덕션 서버를 가리키는가?
- [ ] .env.local이 Git에서 제외되는가?
- [ ] 빌드 전 환경변수를 재확인했는가?

### 공통
- [ ] 개발용 키를 프로덕션에 사용하지 않는가?
- [ ] 모든 팀원이 .env.example을 최신 상태로 유지하는가?
- [ ] 환경변수 변경 시 문서를 업데이트하는가?

## 🔐 암호화된 환경변수 관리 (고급)

### git-crypt 사용
```bash
# 민감한 env를 암호화하여 Git에 저장
git-crypt init
echo ".env.production filter=git-crypt diff=git-crypt" >> .gitattributes
git add .env.production .gitattributes
git commit -m "Add encrypted env"
```

### Doppler / Vault
```bash
# 외부 시크릿 관리 도구 사용
doppler secrets download --no-file --format env > .env
```

## 🆘 침해 발생 시 대응

### 1. SECRET_KEY 유출
```bash
# 즉시 새 키 생성
python -c "import secrets; print(secrets.token_urlsafe(64))"

# 모든 세션 무효화
# 사용자에게 재로그인 요청
```

### 2. DATABASE_URL 유출
```sql
-- 즉시 DB 비밀번호 변경
ALTER USER myuser WITH PASSWORD 'new_strong_password';

-- 의심스러운 접속 로그 확인
SELECT * FROM pg_stat_activity;
```

### 3. API Key 유출
```bash
# 해당 서비스에서 키 즉시 폐기
# 새 키 발급
# 모든 배포 환경 업데이트
```

## 📚 참고 자료

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
