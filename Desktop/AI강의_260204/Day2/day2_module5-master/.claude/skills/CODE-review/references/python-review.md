# Python 코드 리뷰 가이드

## 도구 소개

### 1. Ruff - 초고속 린터
Python 린팅/포매팅의 올인원 도구. Flake8, isort, pyupgrade 등을 통합.

```bash
# 설치
pip install ruff

# 기본 검사
ruff check app/

# 자동 수정
ruff check --fix app/

# 특정 파일만
ruff check app/main.py
```

### 2. Black - 코드 포매터
타협 없는 포매터. 논쟁 종료.

```bash
# 설치
pip install black

# 검사만 (변경 없음)
black --check app/

# 자동 포매팅
black app/

# 특정 줄 길이
black --line-length 100 app/
```

### 3. mypy - 정적 타입 체커
타입 힌트 검증.

```bash
# 설치
pip install mypy

# 검사
mypy app/

# 엄격 모드
mypy --strict app/
```

### 4. bandit - 보안 스캐너
보안 취약점 탐지.

```bash
# 설치
pip install bandit

# 검사
bandit -r app/

# 심각도 필터
bandit -r app/ -ll  # Low 이상만

# 리포트 저장
bandit -r app/ -f json -o report.json
```

## 설정 파일

### pyproject.toml
```toml
[tool.ruff]
# 줄 길이
line-length = 88

# 대상 Python 버전
target-version = "py312"

# 제외할 디렉토리
exclude = [
    ".venv",
    "__pycache__",
    "*.egg-info",
]

# 활성화할 규칙
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade
]

# 무시할 규칙
ignore = [
    "E501",  # line too long (black이 처리)
]

[tool.ruff.per-file-ignores]
"__init__.py" = ["F401"]  # 미사용 import 허용

[tool.black]
line-length = 88
target-version = ['py312']
include = '\.pyi?$'
exclude = '''
/(
    \.git
  | \.venv
  | __pycache__
)/
'''

[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
no_implicit_optional = true

[[tool.mypy.overrides]]
module = "fastapi.*"
ignore_missing_imports = true

[tool.bandit]
exclude_dirs = [".venv", "tests"]
skips = ["B101"]  # assert 사용 허용 (테스트용)
```

## 리뷰 체크리스트

### 코드 스타일
- [ ] PEP 8 준수 (ruff로 확인)
- [ ] 일관된 네이밍 (snake_case)
- [ ] 줄 길이 88자 이하
- [ ] import 순서 정리 (stdlib > third-party > local)

### 타입 힌트
```python
# ❌ 나쁜 예
def get_user(id):
    return db.query(User).filter(User.id == id).first()

# ✅ 좋은 예
def get_user(id: int) -> User | None:
    return db.query(User).filter(User.id == id).first()
```

### Docstring
```python
# ✅ 좋은 예
def create_user(name: str, email: str) -> User:
    """
    새로운 사용자를 생성합니다.

    Args:
        name: 사용자 이름
        email: 이메일 주소

    Returns:
        생성된 User 객체

    Raises:
        ValueError: 이메일 형식이 잘못된 경우
    """
    if "@" not in email:
        raise ValueError("Invalid email")
    return User(name=name, email=email)
```

### 함수 길이
```python
# ❌ 너무 긴 함수 (50줄 초과)
def process_data():
    # 100줄...
    pass

# ✅ 분리된 함수
def validate_data(data: dict) -> bool:
    # 검증 로직
    pass

def transform_data(data: dict) -> dict:
    # 변환 로직
    pass

def process_data(data: dict) -> dict:
    if not validate_data(data):
        raise ValueError("Invalid data")
    return transform_data(data)
```

### 에러 처리
```python
# ❌ 너무 광범위
try:
    result = complex_operation()
except Exception:
    pass

# ✅ 구체적인 예외
try:
    result = complex_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise
except DatabaseError as e:
    logger.error(f"DB error: {e}")
    return None
```

## 자주 발견되는 이슈

### 1. 미사용 import
```python
# ❌
import os
from typing import List, Dict, Optional  # Dict 미사용

# ✅
import os
from typing import List, Optional
```

### 2. Mutable 기본 인자
```python
# ❌ 위험!
def add_item(item, items=[]):
    items.append(item)
    return items

# ✅ 안전
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### 3. 문자열 포매팅
```python
# ❌ 구식
name = "Alice"
msg = "Hello, %s" % name

# ✅ 최신
msg = f"Hello, {name}"
```

### 4. 리스트 컴프리헨션 남용
```python
# ❌ 읽기 어려움
result = [x.upper() for x in [y.strip() for y in lines if y] if len(x) > 5]

# ✅ 명확함
cleaned = [line.strip() for line in lines if line]
result = [line.upper() for line in cleaned if len(line) > 5]
```

## 자동 수정 워크플로우

### 1단계: 검사
```bash
# 모든 도구 실행
ruff check app/
black --check app/
mypy app/
bandit -r app/
```

### 2단계: 자동 수정
```bash
# ruff 자동 수정
ruff check --fix app/

# black 포매팅
black app/
```

### 3단계: 수동 수정
```bash
# mypy 에러 확인 (자동 수정 불가)
mypy app/

# bandit 경고 확인 (자동 수정 불가)
bandit -r app/
```

### 4단계: 재검사
```bash
# 모든 도구 재실행
ruff check app/ && black --check app/ && mypy app/ && bandit -r app/
```

## 통합 스크립트

### backend/scripts/lint.sh
```bash
#!/bin/bash
set -e

echo "🔍 Running Ruff..."
ruff check app/

echo "🎨 Running Black..."
black --check app/

echo "🔎 Running mypy..."
mypy app/

echo "🔒 Running Bandit..."
bandit -r app/ -ll

echo "✅ All checks passed!"
```

### backend/scripts/fix.sh
```bash
#!/bin/bash
set -e

echo "🔧 Auto-fixing with Ruff..."
ruff check --fix app/

echo "🎨 Formatting with Black..."
black app/

echo "✅ Auto-fix complete! Please review changes."
```

## VS Code 통합

### .vscode/settings.json
```json
{
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "black",
  "python.linting.mypyEnabled": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## CI/CD 예제

### GitHub Actions
```yaml
name: Python Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install ruff black mypy bandit
      - name: Run Ruff
        run: ruff check backend/app/
      - name: Run Black
        run: black --check backend/app/
      - name: Run mypy
        run: mypy backend/app/
      - name: Run Bandit
        run: bandit -r backend/app/ -ll
```
