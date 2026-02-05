# TypeScript 코드 리뷰 가이드

## 도구 소개

### 1. ESLint - 린터
코드 품질 및 일관성 검사.

```bash
# 설치
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 검사
npm run lint

# 자동 수정
npm run lint:fix
```

### 2. Prettier - 포매터
코드 스타일 자동 정리.

```bash
# 설치
npm install --save-dev prettier

# 검사
npm run format:check

# 자동 포매팅
npm run format
```

### 3. TypeScript Compiler - 타입 체커
타입 안전성 검증.

```bash
# 검사
npm run type-check

# 또는
tsc --noEmit
```

## 설정 파일

### .eslintrc.json
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": ["warn", {
      "allow": ["warn", "error"]
    }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### .prettierrc
```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .prettierignore
```
.next
node_modules
out
*.md
```

### tsconfig.json (엄격 모드)
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "review": "npm run lint && npm run format:check && npm run type-check"
  }
}
```

## 리뷰 체크리스트

### 타입 안전성
```typescript
// ❌ any 사용 금지
const data: any = fetchData()

// ✅ 명시적 타입
interface UserData {
  id: number
  name: string
  email: string
}

const data: UserData = fetchData()
```

### 컴포넌트 타입
```typescript
// ❌ Props 타입 없음
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

// ✅ Props 타입 정의
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### useState 타입
```typescript
// ❌ 타입 추론 실패 가능
const [user, setUser] = useState(null)

// ✅ 명시적 타입
const [user, setUser] = useState<User | null>(null)
```

### API 응답 타입
```typescript
// ❌ 타입 없음
async function fetchUser(id: number) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

// ✅ 응답 타입 정의
interface ApiResponse<T> {
  data: T
  error?: string
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

### 이벤트 핸들러
```typescript
// ❌ any 타입
const handleChange = (e: any) => {
  console.log(e.target.value)
}

// ✅ 구체적 타입
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}
```

## 자주 발견되는 이슈

### 1. 미사용 변수
```typescript
// ❌
import { useState, useEffect } from 'react' // useEffect 미사용

// ✅
import { useState } from 'react'
```

### 2. console.log
```typescript
// ❌ 프로덕션에 남음
console.log('Debug:', data)

// ✅ 개발 환경에서만
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data)
}

// 또는 제거
```

### 3. Non-null assertion 남용
```typescript
// ❌ 위험한 !
const user = users.find(u => u.id === id)!
console.log(user.name)  // user가 undefined면 에러

// ✅ 안전한 체크
const user = users.find(u => u.id === id)
if (user) {
  console.log(user.name)
}
```

### 4. 옵셔널 체이닝 미사용
```typescript
// ❌ 장황함
const name = user && user.profile && user.profile.name

// ✅ 간결함
const name = user?.profile?.name
```

### 5. 컴포넌트 default export vs named export
```typescript
// ❌ default export (자동완성 불리)
export default function MyComponent() {}

// ✅ named export (권장)
export function MyComponent() {}

// 단, Next.js 페이지는 default export 필수
// app/page.tsx
export default function Page() {}
```

## Next.js 특화 검사

### 1. 클라이언트/서버 컴포넌트 분리
```typescript
// ❌ 서버 컴포넌트에서 useState
export default function Page() {
  const [count, setCount] = useState(0)  // 에러!
}

// ✅ 클라이언트 컴포넌트로 명시
'use client'

export default function Page() {
  const [count, setCount] = useState(0)
}
```

### 2. 메타데이터
```typescript
// ✅ 타입 안전한 메타데이터
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
}
```

### 3. API Route 타입
```typescript
// ❌ 타입 없음
export async function GET(request) {
  return Response.json({ data: 'test' })
}

// ✅ 타입 정의
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'test' })
}
```

## 자동 수정 워크플로우

### 1단계: 검사
```bash
npm run lint
npm run format:check
npm run type-check
```

### 2단계: 자동 수정
```bash
npm run lint:fix
npm run format
```

### 3단계: 수동 수정
```bash
# 타입 에러는 수동 수정 필요
npm run type-check
```

### 4단계: 재검사
```bash
npm run review
```

## VS Code 통합

### .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### .vscode/extensions.json
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## CI/CD 예제

### GitHub Actions
```yaml
name: TypeScript Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      - name: Run ESLint
        working-directory: frontend
        run: npm run lint
      - name: Run Prettier
        working-directory: frontend
        run: npm run format:check
      - name: Type check
        working-directory: frontend
        run: npm run type-check
```

## 성능 체크

### Next.js Bundle 분석
```bash
# 번들 크기 분석
npm run build

# 결과 확인
# ✅ First Load JS < 100kB
# ⚠️ First Load JS > 200kB
```

### 이미지 최적화
```typescript
// ❌ <img> 태그
<img src="/logo.png" alt="Logo" />

// ✅ Next.js Image
import Image from 'next/image'

<Image src="/logo.png" alt="Logo" width={200} height={50} />
```
