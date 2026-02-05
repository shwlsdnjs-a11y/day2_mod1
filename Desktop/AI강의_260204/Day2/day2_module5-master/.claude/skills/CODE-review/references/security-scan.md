# 보안 스캔 가이드

## 개요
코드에서 보안 취약점을 자동으로 탐지하고 수정합니다.

## Python 보안 검사 (Bandit)

### 설치 및 실행
```bash
pip install bandit

# 기본 스캔
bandit -r backend/app/

# 심각도 필터 (Low 이상)
bandit -r backend/app/ -ll

# JSON 리포트
bandit -r backend/app/ -f json -o security-report.json
```

### 주요 검사 항목

#### 1. SQL Injection
```python
# ❌ 위험: SQL Injection 취약점
user_id = request.query_params.get("id")
query = f"SELECT * FROM users WHERE id = {user_id}"
db.execute(query)

# ✅ 안전: 파라미터화된 쿼리
user_id = request.query_params.get("id")
query = "SELECT * FROM users WHERE id = :id"
db.execute(query, {"id": user_id})

# ✅ ORM 사용 (가장 안전)
user = db.query(User).filter(User.id == user_id).first()
```

#### 2. 하드코딩된 비밀번호
```python
# ❌ 위험
API_KEY = "sk-1234567890abcdef"
PASSWORD = "admin123"

# ✅ 안전: 환경변수 사용
import os
API_KEY = os.getenv("API_KEY")
PASSWORD = os.getenv("PASSWORD")
```

#### 3. eval() 사용
```python
# ❌ 위험: 코드 인젝션
user_input = request.query_params.get("code")
result = eval(user_input)

# ✅ 안전: ast.literal_eval 사용 (리터럴만)
import ast
user_input = request.query_params.get("data")
result = ast.literal_eval(user_input)  # "[1, 2, 3]" 같은 리터럴만
```

#### 4. 안전하지 않은 랜덤
```python
# ❌ 위험: 예측 가능
import random
token = random.randint(1000, 9999)

# ✅ 안전: 암호학적으로 안전한 난수
import secrets
token = secrets.token_urlsafe(32)
```

#### 5. Pickle 사용
```python
# ❌ 위험: 임의 코드 실행 가능
import pickle
data = pickle.loads(untrusted_data)

# ✅ 안전: JSON 사용
import json
data = json.loads(untrusted_data)
```

### Bandit 설정

#### pyproject.toml
```toml
[tool.bandit]
exclude_dirs = [
    ".venv",
    "tests",
    "migrations"
]

# 테스트에서 assert 사용 허용
skips = ["B101"]

# 높은 심각도만 체크
severity = "medium"
```

## TypeScript 보안 검사

### 1. XSS (Cross-Site Scripting)
```typescript
// ❌ 위험: XSS 취약점
function UserProfile({ bio }: { bio: string }) {
  return <div dangerouslySetInnerHTML={{ __html: bio }} />
}

// ✅ 안전: 자동 이스케이프
function UserProfile({ bio }: { bio: string }) {
  return <div>{bio}</div>
}

// ⚠️ 필요 시 sanitize
import DOMPurify from 'dompurify'

function UserProfile({ bio }: { bio: string }) {
  const cleanBio = DOMPurify.sanitize(bio)
  return <div dangerouslySetInnerHTML={{ __html: cleanBio }} />
}
```

### 2. 환경변수 노출
```typescript
// ❌ 위험: 민감 정보 브라우저 노출
const apiKey = process.env.API_SECRET_KEY

// ✅ 안전: 서버사이드만
// app/api/route.ts (서버 컴포넌트)
const apiKey = process.env.API_SECRET_KEY  // 브라우저에 노출 안 됨

// ✅ 안전: NEXT_PUBLIC_ 접두사 (공개 가능한 것만)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### 3. CSRF 방지
```typescript
// ✅ Next.js API Route에서 CSRF 토큰 검증
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  // Same-Origin 확인
  if (origin && !origin.includes(host!)) {
    return new Response('Forbidden', { status: 403 })
  }

  // 처리...
}
```

### 4. Open Redirect
```typescript
// ❌ 위험: Open Redirect
const returnUrl = searchParams.get('returnUrl')
router.push(returnUrl)  // 임의 URL로 리다이렉트 가능

// ✅ 안전: 화이트리스트 검증
const returnUrl = searchParams.get('returnUrl')
const allowedUrls = ['/dashboard', '/profile', '/settings']

if (returnUrl && allowedUrls.includes(returnUrl)) {
  router.push(returnUrl)
} else {
  router.push('/dashboard')
}
```

## 의존성 보안 검사

### npm audit (Node.js)
```bash
# 취약점 스캔
npm audit

# 자동 수정 (가능한 것만)
npm audit fix

# 강제 수정 (주의: breaking changes 가능)
npm audit fix --force
```

### pip-audit (Python)
```bash
# 설치
pip install pip-audit

# 스캔
pip-audit

# requirements.txt 기반
pip-audit -r requirements.txt
```

### 안전한 버전 관리
```json
// package.json
{
  "dependencies": {
    "react": "^18.2.0",      // ✅ 마이너 업데이트 허용
    "next": "~14.0.4",       // ⚠️ 패치만 허용
    "lodash": "4.17.21"      // ❌ 고정 (업데이트 안 됨)
  }
}
```

## 환경변수 보안

### .env 파일 검사
```bash
# .env 파일에서 하드코딩된 시크릿 찾기
grep -r "sk-" .env
grep -r "password=" .env
grep -r "secret=" .env
```

### Git에 커밋된 시크릿 검사
```bash
# git-secrets 설치
brew install git-secrets  # macOS
# 또는
apt-get install git-secrets  # Ubuntu

# 설치
git secrets --install

# 스캔
git secrets --scan

# 전체 히스토리 스캔
git secrets --scan-history
```

## OWASP Top 10 체크리스트

### 1. Broken Access Control
```python
# ❌ 위험: 권한 체크 없음
@app.get("/api/users/{user_id}")
def get_user(user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# ✅ 안전: 권한 검증
@app.get("/api/users/{user_id}")
def get_user(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    return db.query(User).filter(User.id == user_id).first()
```

### 2. Cryptographic Failures
```python
# ❌ 위험: 평문 저장
user.password = password

# ✅ 안전: 해싱
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

user.password = pwd_context.hash(password)
```

### 3. Injection
- SQL Injection (위 참조)
- Command Injection
```python
# ❌ 위험
import os
filename = request.query_params.get("file")
os.system(f"cat {filename}")  # 임의 명령 실행 가능

# ✅ 안전
import subprocess
subprocess.run(["cat", filename], check=True)  # 인자 분리
```

### 4. Insecure Design
```python
# ❌ 위험: 무제한 요청
@app.post("/api/send-email")
def send_email(email: str):
    send_email_to(email)

# ✅ 안전: Rate Limiting
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/send-email")
@limiter.limit("5/minute")
def send_email(email: str):
    send_email_to(email)
```

### 5. Security Misconfiguration
```python
# ❌ 위험: DEBUG 모드 프로덕션
DEBUG = True
ALLOWED_HOSTS = ["*"]

# ✅ 안전
DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")
```

## 자동화된 보안 스캔

### 통합 스크립트
```bash
#!/bin/bash
# scripts/security-scan.sh

echo "🔒 Security Scan Started"

# Python
echo "🐍 Python Security..."
cd backend
bandit -r app/ -ll
pip-audit

# Node.js
echo "📦 Node.js Security..."
cd ../frontend
npm audit

# Git Secrets
echo "🔐 Git Secrets..."
cd ..
git secrets --scan

echo "✅ Security Scan Complete"
```

### CI/CD 통합
```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Python Security
        run: |
          pip install bandit pip-audit
          bandit -r backend/app/ -ll
          pip-audit -r backend/requirements.txt

      - name: Node.js Security
        run: |
          cd frontend
          npm audit --audit-level=high

      - name: Git Secrets
        uses: zricethezav/gitleaks-action@master
```

## 보안 리포트 형식

```markdown
# 보안 스캔 리포트 - 2026-02-05

## 요약
- Critical: 0
- High: 2
- Medium: 5
- Low: 8

## Critical Issues
(없음)

## High Issues

### 1. SQL Injection in auth.py:45
**파일**: backend/app/routers/auth.py
**라인**: 45
**설명**: 사용자 입력이 SQL 쿼리에 직접 삽입됨
**수정**:
```python
# Before
query = f"SELECT * FROM users WHERE email = '{email}'"

# After
query = "SELECT * FROM users WHERE email = :email"
db.execute(query, {"email": email})
```

### 2. Hard-coded API Key
**파일**: backend/app/config.py
**라인**: 12
**설명**: API 키가 코드에 하드코딩됨
**수정**: 환경변수로 이동

## 권장 사항
1. 모든 High 이슈 즉시 수정
2. 정기적인 의존성 업데이트
3. 코드 리뷰 시 보안 체크리스트 사용
```
