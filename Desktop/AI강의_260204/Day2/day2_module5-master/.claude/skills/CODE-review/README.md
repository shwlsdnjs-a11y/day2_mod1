# CODE-review Skill 사용 가이드

## 빠른 시작

### 1. 도구 설치

#### Backend (Python)
```bash
cd backend
pip install -r requirements-dev.txt
```

#### Frontend (TypeScript)
```bash
cd frontend
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

### 2. 코드 리뷰 실행

#### Backend
```bash
# 검사만 (변경 없음)
cd backend
./scripts/lint.sh

# 자동 수정
./scripts/fix.sh
```

#### Frontend
```bash
cd frontend

# 검사
npm run lint
npm run type-check

# 자동 수정
npm run lint:fix
npx prettier --write "**/*.{ts,tsx,json}"
```

## package.json scripts 추가

frontend/package.json에 다음 스크립트를 추가하세요:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "review": "npm run lint && npm run format:check && npm run type-check"
  }
}
```

## Skill 호출

```
/CODE-review
```

또는:
- "코드 리뷰해줘"
- "코드 품질 검사"
- "린터 실행"

## 생성된 파일

### Backend
- `backend/pyproject.toml` - Ruff, Black, mypy, Bandit 설정
- `backend/scripts/lint.sh` - 전체 검사 스크립트
- `backend/scripts/fix.sh` - 자동 수정 스크립트
- `backend/requirements-dev.txt` - 개발 의존성

### Frontend
- `frontend/.eslintrc.json` - ESLint 설정
- `frontend/.prettierrc` - Prettier 설정
- `frontend/.prettierignore` - Prettier 제외 파일

## 검사 항목

### Python
✅ PEP 8 스타일 (Ruff)
✅ 코드 포매팅 (Black)
✅ 타입 체크 (mypy)
✅ 보안 스캔 (Bandit)

### TypeScript
✅ 코드 품질 (ESLint)
✅ 코드 포매팅 (Prettier)
✅ 타입 체크 (TypeScript Compiler)

## PR 전 체크리스트

- [ ] `./backend/scripts/lint.sh` 통과
- [ ] `cd frontend && npm run review` 통과
- [ ] 모든 테스트 통과
- [ ] 보안 이슈 없음

## 문제 해결

### "ruff: command not found"
```bash
cd backend
pip install -r requirements-dev.txt
```

### "eslint: command not found"
```bash
cd frontend
npm install
```

### mypy import 에러
pyproject.toml에서 해당 모듈을 ignore_missing_imports에 추가:
```toml
[[tool.mypy.overrides]]
module = "모듈명.*"
ignore_missing_imports = true
```

## 상세 문서

- [Python 리뷰 가이드](references/python-review.md)
- [TypeScript 리뷰 가이드](references/typescript-review.md)
- [보안 스캔 가이드](references/security-scan.md)
- [리뷰 체크리스트](references/review-checklist.md)
