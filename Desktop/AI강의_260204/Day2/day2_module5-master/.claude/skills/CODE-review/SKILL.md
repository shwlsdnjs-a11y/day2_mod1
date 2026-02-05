---
name: CODE-review
description: 코드 품질 자동 검사 및 리뷰. Python(ruff/black/mypy/bandit)과 TypeScript(ESLint/Prettier) 린터를 실행하고 보안 취약점을 스캔합니다.
context: fork
agent: general-purpose
---

# CODE Review - 자동 코드 리뷰

## 개요
코드 품질을 자동으로 검사하고 개선 사항을 제안합니다.

## 트리거 상황
- "코드 리뷰해줘"
- "코드 품질 검사"
- "린터 실행"
- "보안 스캔"
- PR 생성 전

## 검사 항목

### 1. Python (Backend)
- **Ruff**: 빠른 린팅 (Flake8 + 기타 도구 통합)
- **Black**: 코드 포매팅
- **mypy**: 타입 체크
- **bandit**: 보안 취약점 스캔

[상세 가이드: references/python-review.md](references/python-review.md)

### 2. TypeScript (Frontend)
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포매팅
- **TypeScript Compiler**: 타입 체크

[상세 가이드: references/typescript-review.md](references/typescript-review.md)

### 3. 보안 검사
- SQL Injection
- XSS 취약점
- 하드코딩된 시크릿
- 안전하지 않은 의존성

[상세 가이드: references/security-scan.md](references/security-scan.md)

## 실행 순서

### Step 1: 환경 준비

#### Backend 도구 설치
```bash
cd backend
pip install ruff black mypy bandit
```

#### Frontend 도구 설치
```bash
cd frontend
npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Step 2: 설정 파일 생성

자동으로 생성되는 파일:
- `backend/pyproject.toml` - Python 도구 설정
- `frontend/.eslintrc.json` - ESLint 설정
- `frontend/.prettierrc` - Prettier 설정

### Step 3: 코드 리뷰 실행

#### 전체 검사 (권장)
```bash
# Backend
cd backend
ruff check app/
black --check app/
mypy app/
bandit -r app/

# Frontend
cd frontend
npm run lint
npm run type-check
```

#### 자동 수정
```bash
# Backend
ruff check --fix app/
black app/

# Frontend
npm run lint:fix
npm run format
```

### Step 4: 리포트 생성

검사 결과를 `.claude/reports/code-review-YYYYMMDD.md`에 저장:
- 발견된 이슈 목록
- 심각도 분류 (Critical/High/Medium/Low)
- 수정 제안
- 통계 (총 파일 수, 이슈 수)

## 리뷰 기준

### Python
- ✅ PEP 8 준수
- ✅ 타입 힌트 사용
- ✅ Docstring 작성
- ✅ 함수 길이 < 50줄
- ❌ `print()` 디버깅 금지
- ❌ 미사용 import 금지

### TypeScript
- ✅ ESLint 규칙 준수
- ✅ 타입 명시 (any 금지)
- ✅ 컴포넌트 분리
- ✅ Props 타입 정의
- ❌ console.log 프로덕션 금지
- ❌ 미사용 변수 금지

### 보안
- ✅ 환경변수 사용
- ✅ SQL 파라미터화
- ✅ XSS 방어
- ❌ eval() 사용 금지
- ❌ 하드코딩된 비밀번호 금지

[전체 체크리스트: references/review-checklist.md](references/review-checklist.md)

## 출력 형식

```markdown
# 코드 리뷰 리포트 - 2026-02-05

## 요약
- 총 파일: 25개
- 발견된 이슈: 12개
  - Critical: 1
  - High: 3
  - Medium: 5
  - Low: 3

## Critical Issues
1. [backend/app/routers/auth.py:45] SQL Injection 취약점
   - 수정: 파라미터화된 쿼리 사용

## High Issues
1. [frontend/src/app/api/user.ts:12] 타입 안전성 부족 (any 사용)
   - 수정: 명시적 타입 정의

## 자동 수정 가능 항목
- Black 포매팅: 5개 파일
- ESLint 자동 수정: 3개 파일
```

## 통합 워크플로우

### PR 생성 전 필수 체크
```bash
# 1. 코드 리뷰 실행
/CODE-review

# 2. 자동 수정 적용
# (리포트 확인 후)

# 3. 재검사
/CODE-review

# 4. 통과 시 커밋
/git_commit
```

### CI/CD 통합 (선택)
```yaml
# .github/workflows/code-review.yml
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Backend Review
        run: |
          pip install ruff black mypy bandit
          ruff check backend/app/
      - name: Frontend Review
        run: |
          cd frontend
          npm install
          npm run lint
```

## 주의사항

- ⚠️ 자동 수정은 신중하게 검토 후 적용
- ⚠️ Critical/High 이슈는 반드시 수정
- ⚠️ 보안 취약점은 즉시 대응
- ✅ 린터 통과가 PR 머지 조건

## 참고 문서
- [Python 리뷰 가이드](references/python-review.md)
- [TypeScript 리뷰 가이드](references/typescript-review.md)
- [보안 스캔 가이드](references/security-scan.md)
- [리뷰 체크리스트](references/review-checklist.md)
