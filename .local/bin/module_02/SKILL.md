# SKILL.md - 커밋 자동화 가이드

이 문서는 커밋 시 자동으로 수행되어야 할 체크리스트와 규칙을 정의합니다.

## 커밋 전 체크리스트

### 1. 코드 품질 검증

#### JavaScript 검증
```bash
# 문법 오류 체크 (선택사항: ESLint 설치 시)
npx eslint script.js
```

#### HTML/CSS 검증
- HTML 구조 유효성 확인
- CSS 문법 오류 확인
- 한글 텍스트 깨짐 여부 확인 (UTF-8 인코딩)

### 2. 게임 테스트

브라우저에서 다음 항목 테스트:
```bash
# 로컬 서버 실행
python -m http.server 8000
# 또는
start index.html
```

#### 필수 테스트 항목
- [ ] 게임 시작 화면 정상 로드
- [ ] 플레이어(슬라임) 이동 (방향키/WASD)
- [ ] 영웅 스폰 및 AI 동작
- [ ] 전투 시스템 (공격, 피해, HP 감소)
- [ ] 흡수 메커니즘 및 능력 획득
- [ ] 레벨업 및 경험치 시스템
- [ ] 웨이브 진행
- [ ] 승리/패배 화면
- [ ] 콘솔 에러 없음 (F12 개발자 도구)

### 3. 파일 체크

#### 금지 파일 확인
```bash
# .gitignore에 정의된 파일이 커밋되지 않는지 확인
git status
```

다음 파일들은 커밋하지 말 것:
- `Thumbs.db`, `desktop.ini` (Windows 시스템 파일)
- `.DS_Store` (macOS 시스템 파일)
- `node_modules/` (의존성 디렉토리)
- 개인 설정 파일
- 대용량 바이너리 파일

#### 파일 크기 체크
```bash
# 100KB 이상 파일 확인
git ls-files -z | xargs -0 du -h | awk '$1 ~ /[0-9]+K|[0-9]+M/ {print $0}' | sort -h
```

### 4. 커밋 메시지 규칙

#### 형식
```
<타입>: <제목>

<본문 (선택사항)>
```

#### 타입 종류
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: CSS/UI 스타일 변경
- `docs`: 문서 수정
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 관련

#### 예시
```
feat: 도적 영웅 타입 추가

- 도적 클래스 능력 구현
- 크리티컬 데미지 시스템 추가
- 도적 스프라이트 CSS 스타일 추가
```

### 5. 문서 업데이트

다음 변경 시 관련 문서 업데이트:
- 새로운 기능 추가 → `CLAUDE.md` 또는 `docs/개발계획.md` 업데이트
- 게임 메커니즘 변경 → 관련 문서에 반영
- 한글 UI 텍스트 변경 → 변경 내역 기록

### 6. 자동화 스크립트 (선택사항)

#### Git Pre-commit Hook 설정

`.git/hooks/pre-commit` 파일 생성:
```bash
#!/bin/bash

echo "🔍 커밋 전 검증 시작..."

# 1. 금지 파일 체크
if git diff --cached --name-only | grep -E "(Thumbs.db|desktop.ini|.DS_Store)"; then
    echo "❌ 시스템 파일이 포함되어 있습니다."
    exit 1
fi

# 2. JavaScript 문법 체크 (Node.js 설치 시)
if command -v node &> /dev/null; then
    for file in $(git diff --cached --name-only | grep -E "\.js$"); do
        node -c "$file" || exit 1
    done
fi

# 3. HTML UTF-8 인코딩 체크
for file in $(git diff --cached --name-only | grep -E "\.html$"); do
    if ! grep -q "charset.*utf-8" "$file"; then
        echo "⚠️  $file 에 UTF-8 charset이 없습니다."
    fi
done

echo "✅ 모든 검증 통과!"
```

실행 권한 부여:
```bash
chmod +x .git/hooks/pre-commit
```

#### Git Post-commit Hook 설정 (자동 Push)

`.git/hooks/post-commit` 파일 생성:
```bash
#!/bin/bash

echo "📤 커밋 완료! 원격 저장소에 Push 중..."

# 현재 브랜치 확인
current_branch=$(git branch --show-current)

# Push 실행
if git push origin "$current_branch"; then
    echo "✅ Push 성공: $current_branch"
else
    echo "❌ Push 실패! 수동으로 push해주세요."
    echo "   명령어: git push origin $current_branch"
    exit 1
fi
```

실행 권한 부여:
```bash
chmod +x .git/hooks/post-commit
```

**주의사항:**
- 원격 저장소(origin)가 설정되어 있어야 함
- Push 권한이 있는지 확인 필요
- 네트워크 연결 필요
- main/master 브랜치는 force push 금지

## Claude Code 커밋 시 지침

Claude가 자동으로 커밋할 때는 다음 규칙을 따릅니다:

1. **커밋 전 필수 확인**
   - 변경된 파일 목록 확인 (`git status`)
   - 변경 내용 검토 (`git diff`)
   - 최근 커밋 메시지 스타일 확인 (`git log --oneline -5`)

2. **커밋 메시지 작성**
   - 한글로 작성 (프로젝트가 한글 기반)
   - 변경의 "무엇"보다 "왜"에 집중
   - 명확하고 간결하게 (1-2문장)

3. **선별적 스테이징**
   - 필요한 파일만 추가 (`git add <파일명>`)
   - `git add .` 또는 `git add -A` 지양

4. **커밋 후 확인**
   - `git status`로 커밋 성공 확인
   - 남은 unstaged 파일 확인

5. **자동 Push**
   - 커밋 후 즉시 원격 저장소에 push
   - 명령어: `git push` (또는 `git push origin <브랜치명>`)
   - Push 실패 시 에러 메시지 확인하고 사용자에게 알림

## 브랜치 전략

- `master`: 안정 버전
- `develop`: 개발 버전 (선택사항)
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

## 자동 Push 워크플로우

커밋과 동시에 push하는 완전 자동화 워크플로우:

```bash
# 1. 파일 스테이징
git add <파일명>

# 2. 커밋 (pre-commit hook이 자동 검증)
git commit -m "feat: 기능 추가"

# 3. Push (post-commit hook이 자동 실행)
# 별도 명령 불필요 - hook이 자동으로 push
```

### 수동 Push가 필요한 경우
- Hook이 설치되지 않은 경우
- 네트워크 오류로 자동 push 실패 시
- 여러 커밋을 모아서 한 번에 push하려는 경우

```bash
git push origin master
```

## 참고사항

- 게임은 브라우저에서 직접 실행되므로 빌드 과정이 없음
- 모든 변경사항은 브라우저에서 테스트 필수
- 한글 인코딩 문제 주의 (UTF-8 without BOM)
- 자동 push 사용 시 커밋 전 신중히 검토 (push 후 되돌리기 어려움)
