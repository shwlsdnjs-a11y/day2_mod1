# Frontend 환경변수 가이드

## Next.js 환경변수 관리

### `.env.local.example` 템플릿

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# App Metadata
NEXT_PUBLIC_APP_NAME=Module5 App
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags (optional)
# NEXT_PUBLIC_ENABLE_ANALYTICS=false
# NEXT_PUBLIC_ENABLE_DEBUG=true

# Private Keys (서버사이드 전용, NEXT_PUBLIC_ 없음)
# API_SECRET_KEY=your-secret-key
```

### 실제 `.env.local` 파일 생성

```bash
# 1. .env.local.example 복사
cp .env.local.example .env.local

# 2. 필요한 값 수정
# Next.js는 자동으로 .env.local을 .gitignore에 포함
```

### 코드에서 사용하기

#### 클라이언트 컴포넌트
```typescript
// src/app/page.tsx
'use client'

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  console.log('API URL:', apiUrl)  // ✅ 브라우저에서 접근 가능

  return <div>API: {apiUrl}</div>
}
```

#### 서버 컴포넌트
```typescript
// src/app/api/data/route.ts
export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const secretKey = process.env.API_SECRET_KEY  // ✅ 서버에서만 접근

  const response = await fetch(apiUrl + '/items')
  return Response.json(await response.json())
}
```

#### API 호출 유틸리티
```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
```

## 환경별 설정

Next.js는 자동으로 다음 우선순위로 env 파일을 로드:

### 개발 환경
```bash
# .env.development.local (우선순위 높음)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENABLE_DEBUG=true

# .env.development
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 프로덕션 환경
```bash
# .env.production.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENABLE_DEBUG=false

# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 로드 우선순위
1. `.env.{mode}.local` (highest)
2. `.env.local` (Git에서 제외)
3. `.env.{mode}`
4. `.env`

## 환경변수 명명 규칙

### NEXT_PUBLIC_ 접두사
```bash
# ✅ 브라우저에 노출됨 (클라이언트에서 접근 가능)
NEXT_PUBLIC_API_URL=http://localhost:8000

# ❌ 브라우저에 노출되지 않음 (서버사이드만 접근)
API_SECRET_KEY=secret123
DATABASE_URL=postgresql://...
```

### 예제
```typescript
// ✅ 클라이언트/서버 모두 사용 가능
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// ❌ 서버사이드에서만 사용 가능 (API Routes, Server Components)
const dbUrl = process.env.DATABASE_URL
```

## TypeScript 타입 정의

```typescript
// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_APP_VERSION: string
    API_SECRET_KEY?: string
  }
}
```

## Vercel 배포 시 설정

```bash
# Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=Production App
```

또는 CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL production
# 값 입력: https://api.yourdomain.com
```

## 보안 주의사항

1. **절대 노출 금지**
   - API secret keys
   - Database credentials
   - Private tokens

2. **NEXT_PUBLIC_ 주의**
   - 브라우저에 완전히 노출됨
   - 민감 정보는 절대 사용 금지
   - 빌드 시 번들에 포함됨

3. **.gitignore 확인**
   ```
   .env*.local
   .env.local
   ```

## 검증

```bash
# 개발 서버 실행 후 브라우저 콘솔
npm run dev
# 콘솔: console.log(process.env.NEXT_PUBLIC_API_URL)

# 빌드된 환경변수 확인
npm run build
# .next/static/chunks 파일에서 NEXT_PUBLIC_ 변수 검색 가능
```

## 문제 해결

### 환경변수가 undefined
```bash
# 1. 서버 재시작 (필수!)
npm run dev

# 2. .env 파일명 확인
# .env.local (O)
# env.local (X)

# 3. NEXT_PUBLIC_ 접두사 확인
```

### 빌드 후 값이 변경되지 않음
```bash
# 환경변수는 빌드 타임에 고정됨
# 값 변경 시 재빌드 필수
npm run build
```
