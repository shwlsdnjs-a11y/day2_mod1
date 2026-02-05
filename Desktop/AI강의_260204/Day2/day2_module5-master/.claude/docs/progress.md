# 프로젝트 진행 상황

## 프로젝트: 가상 암호화폐 트레이딩 시뮬레이터

**목표**: 실시간 암호화폐 시세 기반 가상 매매 플랫폼 구축

---

## [2026-02-05 16:30] CORS 미들웨어 순서 수정

### 변경된 파일
- `backend/app/main.py`: CORS 미들웨어를 로깅 미들웨어보다 먼저 등록
- `C:\Users\student\.claude\projects\C--Users-student\memory\MEMORY.md`: CORS 설정 주요 학습 내용 기록

### 작업 요약
- FastAPI 미들웨어 실행 순서 이슈 해결
- CORS preflight 요청(OPTIONS)이 로깅 전에 처리되도록 순서 변경
- "Failed to fetch" 에러 해결 (프론트엔드 → 백엔드 API 통신 정상화)

### 배운 점
- FastAPI 미들웨어는 역순 실행 (마지막 등록 = 먼저 실행)
- CORS는 반드시 다른 미들웨어보다 먼저 등록해야 함
- Preflight 요청 실패 시 백엔드 로그가 전혀 남지 않음

---

## [2026-02-05 14:00] Week 2 완료: 포트폴리오 & 거래 시스템

### 구현된 기능
- **Backend**:
  - Portfolio 모델: 보유 코인, 평균 매수가, 수량
  - Transaction 모델: 거래 내역 (BUY/SELL)
  - 매수 API: 잔액 검증, 수수료 계산(0.2%), 평균가 업데이트
  - 매도 API: 수량 검증, 수수료 차감, 잔액 증가
  - 포트폴리오 조회 API: 현재가 기준 평가액, 수익률 계산
  - 거래 내역 조회 API: 페이지네이션, 필터링(buy/sell)

- **Frontend**:
  - 포트폴리오 대시보드 (메인 페이지)
  - 보유 코인 목록: 평가액, 수익/손실, 수익률
  - 총 자산 현황: 잔액, 평가액, 총 수익률

### 변경된 파일
- `backend/app/models/portfolio.py`: Portfolio 모델
- `backend/app/models/transaction.py`: Transaction 모델
- `backend/app/routers/trading.py`: 매수/매도 API
- `backend/app/routers/portfolio.py`: 포트폴리오 조회 API
- `backend/app/schemas/trading.py`: 거래 요청/응답 스키마
- `frontend/src/app/page.tsx`: 포트폴리오 대시보드
- `frontend/src/lib/api.ts`: getPortfolio, getTransactions 함수

### 보류된 작업
- Task #9: 코인 상세 페이지 + 차트 (Recharts)
- Task #10: 매수/매도 모달 컴포넌트

---

## [2026-02-05 12:00] bcrypt/Python 3.14 호환성 이슈 해결

### 문제
- `ValueError: password cannot be longer than 72 bytes` 에러 발생
- passlib의 bcrypt 백엔드가 Python 3.14와 호환되지 않음
- venv에서 Python 3.12 사용 중이지만 시스템 Python 3.14가 실행됨

### 해결 방법
- passlib.context.CryptContext 제거
- bcrypt 직접 사용으로 변경:
  ```python
  import bcrypt

  def hash_password(password: str) -> str:
      salt = bcrypt.gensalt()
      hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
      return hashed.decode('utf-8')

  def verify_password(plain_password: str, hashed_password: str) -> bool:
      return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
  ```

### 변경된 파일
- `backend/app/routers/auth.py`: hash_password, verify_password 함수 수정

---

## [2026-02-05 11:00] 로깅 시스템 구축

### 구현 내용
- 날짜별 로그 파일 생성 (`logs/backend/backend_YYYYMMDD.log`)
- 요청/응답 상세 로깅:
  - HTTP 메서드, URL, 클라이언트 IP
  - 요청 헤더, 본문 (POST/PUT/PATCH)
  - 응답 상태 코드, 처리 시간
  - 에러 발생 시 전체 traceback

### 변경된 파일
- `backend/app/logger.py`: 로거 설정
- `backend/app/main.py`: 로깅 미들웨어 추가
- `backend/app/routers/auth.py`: 회원가입 프로세스에 상세 로그 추가

---

## [2026-02-05 10:00] Week 1 완료: 인증 & 시세 조회

### 구현된 기능
- **Backend**:
  - User 모델: username, email, password (bcrypt 해싱)
  - Account 모델: 초기 잔액 100,000,000원
  - Coin 모델: CoinGecko API 연동 (BTC, ETH, BNB, XRP, ADA, SOL, DOGE, DOT, MATIC, TRX)
  - JWT 인증: 회원가입, 로그인, 토큰 검증
  - 암호화폐 시세 API: 30초마다 자동 업데이트

- **Frontend**:
  - 회원가입 페이지 (`/signup`)
  - 로그인 페이지 (`/login`)
  - 시장 시세 페이지 (`/market`)
  - JWT 토큰 localStorage 저장
  - 실시간 시세 폴링 (30초)

### 변경된 파일
- `backend/app/models/user.py`: User, Account 모델
- `backend/app/models/coin.py`: Coin 모델
- `backend/app/routers/auth.py`: 인증 API
- `backend/app/routers/market.py`: 시세 조회 API
- `frontend/src/app/signup/page.tsx`: 회원가입 페이지
- `frontend/src/app/login/page.tsx`: 로그인 페이지
- `frontend/src/app/market/page.tsx`: 시장 시세 페이지
- `frontend/src/lib/api.ts`: signup, login, getCoins API 함수

---

## [2026-02-05 09:00] 프로젝트 초기 설정

### 작업 요약
- 가상 트레이딩 시뮬레이터 기획 완료
- 기술 스택 선정: FastAPI + Next.js + SQLite
- 4주 개발 일정 수립 (`.claude/docs/virtual-trading-spec.md`)
- 백엔드/프론트엔드 초기 구조 생성

### 변경된 파일
- `.claude/docs/virtual-trading-spec.md`: 프로젝트 상세 스펙
- `backend/requirements.txt`: FastAPI, SQLAlchemy, bcrypt 등
- `frontend/package.json`: Next.js 14, TypeScript, Tailwind CSS

---

## 다음 스텝

### 우선순위 높음
- [ ] CORS 설정 테스트 (서버 재시작 후)
- [ ] Task #9: 코인 상세 페이지 + 차트 (Recharts)
- [ ] Task #10: 매수/매도 모달 컴포넌트

### 중간 우선순위
- [ ] 거래 내역 페이지 구현
- [ ] 차트 라이브러리 추가 (Recharts)
- [ ] 반응형 디자인 개선

### 낮은 우선순위
- [ ] 테스트 코드 작성 (pytest)
- [ ] CI/CD 파이프라인 (GitHub Actions)
- [ ] Docker 컨테이너화

---

## 주요 기술적 결정

1. **API 통신 방식**: Next.js rewrites 대신 직접 호출 (CORS 설정)
2. **비밀번호 해싱**: passlib 대신 bcrypt 직접 사용
3. **금액 타입**: Decimal (float 사용 금지)
4. **인증 방식**: JWT Bearer 토큰
5. **데이터베이스**: SQLite (추후 PostgreSQL 고려)
6. **미들웨어 순서**: CORS → 로깅 → 라우팅
