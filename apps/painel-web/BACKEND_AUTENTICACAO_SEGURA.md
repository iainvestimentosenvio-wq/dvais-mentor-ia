# 🔐 Backend de Autenticação Ultra-Seguro - Guia Técnico Completo

## 📋 ÍNDICE

1. [Stack Tecnológico Recomendado](#stack-tecnológico-recomendado)
2. [Arquitetura de Segurança](#arquitetura-de-segurança)
3. [Implementação de Autenticação](#implementação-de-autenticação)
4. [Schema do Banco de Dados](#schema-do-banco-de-dados)
5. [API Routes](#api-routes)
6. [Proteções Obrigatórias](#proteções-obrigatórias)
7. [Gerenciamento de Sessões](#gerenciamento-de-sessões)
8. [Hash de Senhas](#hash-de-senhas)
9. [OAuth 2.0 e Provedores](#oauth-20-e-provedores)
10. [Variáveis de Ambiente](#variáveis-de-ambiente)
11. [Checklist de Implementação](#checklist-de-implementação)

---

## 🎯 OBJETIVO

Este documento fornece um guia técnico completo para implementar um backend de autenticação **ultra-seguro** para o Painel Web DVAi$ - Mentor IA, seguindo as melhores práticas de segurança da indústria (OWASP, NIST, ISO 27001).

**IMPORTANTE**: Este é um guia para implementação futura. O frontend já está preparado para integração.

---

## 📚 STACK TECNOLÓGICO RECOMENDADO

### Framework e Bibliotecas Core

```json
{
  "runtime": "Node.js 20+ LTS",
  "framework": "Next.js 14+ com App Router",
  "database": "PostgreSQL 15+",
  "orm": "Prisma 5+",
  "auth": "NextAuth.js v5 (Auth.js)",
  "cache": "Redis 7+ (Upstash ou local)",
  "validation": "Zod 3+",
  "password": "@node-rs/argon2 (Argon2id)",
  "rate-limit": "@upstash/ratelimit ou express-rate-limit"
}
```

### Justificativas Técnicas

**PostgreSQL 15+**:
- Row-Level Security (RLS) nativo
- JSON/JSONB para dados flexíveis
- Full-text search integrado
- Replicação e backup robustos
- Amplamente usado em produção

**Prisma ORM**:
- Type-safety completo
- Migrations automáticas
- Query optimization
- Prevenção de SQL injection nativa
- Excelente DX (Developer Experience)

**NextAuth.js v5**:
- Integração nativa com Next.js 14+
- OAuth 2.0 pré-configurado
- JWT e Session-based
- CSRF protection incluída
- Suporta múltiplos provedores

**Argon2id**:
- Vencedor do Password Hashing Competition (2015)
- Resistente a GPU cracking
- Resistente a side-channel attacks
- Mais seguro que bcrypt e scrypt
- Recomendado por OWASP 2024

**Redis**:
- Rate limiting distribuído
- Session store de alta performance
- Cache de queries frequentes
- Pub/Sub para notificações em tempo real

---

## 🏗️ ARQUITETURA DE SEGURANÇA

### Camadas de Proteção (Defense in Depth)

```
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 1: EDGE (Cloudflare/Vercel)                         │
│ - DDoS Protection                                            │
│ - Bot detection                                              │
│ - Geographic filtering                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 2: APLICAÇÃO (Next.js)                              │
│ - Rate Limiting (por IP, por usuário)                       │
│ - Security Headers (CSP, HSTS, etc.)                        │
│ - CORS configurado                                           │
│ - CSRF Protection                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 3: AUTENTICAÇÃO (NextAuth.js)                       │
│ - OAuth 2.0 / OpenID Connect                                │
│ - JWT validation                                             │
│ - Session management                                         │
│ - MFA (2FA/TOTP)                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 4: VALIDAÇÃO (Zod + Sanitização)                    │
│ - Input validation                                           │
│ - Output sanitization                                        │
│ - Type checking                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CAMADA 5: BANCO DE DADOS (PostgreSQL + Prisma)             │
│ - Row-Level Security (RLS)                                   │
│ - Prepared statements                                        │
│ - Encrypted at rest                                          │
│ - Audit logging                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 IMPLEMENTAÇÃO DE AUTENTICAÇÃO

### 1. NextAuth.js v5 Configuration

**Arquivo**: `Painel_Web/auth.config.ts`

```typescript
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { verifyPassword } from '@/lib/auth/password'
import { getUserByEmail } from '@/lib/auth/user'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/cadastro',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Adicionar informações extras ao token
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    
    async session({ session, token }) {
      // Adicionar informações do token à session
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirecionar para /login
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    }
  },
  
  providers: [
    // OAuth Providers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    
    // Credentials Provider (email + senha)
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        // Validação com Zod
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(12)
          })
          .safeParse(credentials)
        
        if (!parsedCredentials.success) return null
        
        const { email, password } = parsedCredentials.data
        
        // Buscar usuário no banco
        const user = await getUserByEmail(email)
        if (!user) return null
        
        // Verificar senha com Argon2id
        const isValid = await verifyPassword(password, user.password)
        if (!isValid) return null
        
        // Retornar usuário (sem senha)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt', // ou 'database' para session-based
    maxAge: 24 * 60 * 60, // 24 horas
  },
  
  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas
  },
  
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' // HTTPS only em produção
      }
    }
  },
  
  // Security
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
}
```

---

## 🗄️ SCHEMA DO BANCO DE DADOS

### Prisma Schema

**Arquivo**: `Painel_Web/prisma/schema.prisma`

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelo de Usuário
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?   // Hash Argon2id (null se OAuth)
  image         String?
  role          UserRole  @default(USER)
  
  // Campos adicionais profissionais
  cpf           String?   @unique
  cnpj          String?   @unique
  phone         String?
  phoneVerified Boolean   @default(false)
  
  // Auditoria
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  lastLoginIp   String?
  
  // MFA (Two-Factor Authentication)
  mfaEnabled    Boolean   @default(false)
  mfaSecret     String?   // TOTP secret
  
  // Status da conta
  isActive      Boolean   @default(true)
  isLocked      Boolean   @default(false)
  lockReason    String?
  lockedUntil   DateTime?
  
  // Relações
  accounts      Account[]
  sessions      Session[]
  loginAttempts LoginAttempt[]
  
  @@index([email])
  @@index([cpf])
  @@index([cnpj])
}

enum UserRole {
  USER
  ADMIN
  MODERATOR
}

// OAuth Accounts
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

// Sessões
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  // Auditoria de sessão
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// Tentativas de Login (Rate Limiting + Auditoria)
model LoginAttempt {
  id        String   @id @default(cuid())
  userId    String?
  email     String
  ipAddress String
  userAgent String?
  success   Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([email, ipAddress, createdAt])
  @@index([ipAddress, createdAt])
}

// Tokens de Reset de Senha
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  used      Boolean  @default(false)
  usedAt    DateTime?
  createdAt DateTime @default(now())
  
  @@index([email])
  @@index([token])
}

// Tokens de Verificação de Email
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

// Audit Log (LGPD Compliance)
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // LOGIN, LOGOUT, PASSWORD_CHANGE, DATA_EXPORT, etc.
  ipAddress String
  userAgent String?
  metadata  Json?    // Dados adicionais
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([action, createdAt])
}
```

---

## 🔐 HASH DE SENHAS - ARGON2ID

### Por que Argon2id?

**Argon2id é o algoritmo recomendado pela OWASP em 2024**:
- ✅ Vencedor do Password Hashing Competition (2015)
- ✅ Resistente a ataques GPU/ASIC
- ✅ Resistente a side-channel attacks
- ✅ Resistente a time-memory trade-off attacks
- ✅ Mais seguro que bcrypt, scrypt e PBKDF2

### Implementação com @node-rs/argon2

**Instalação**:
```bash
npm install @node-rs/argon2
```

**Arquivo**: `Painel_Web/lib/auth/password.ts`

```typescript
import { hash, verify } from '@node-rs/argon2'

// Configurações OWASP recomendadas para Argon2id
const ARGON2_OPTIONS = {
  memoryCost: 65536,  // 64 MB
  timeCost: 3,        // 3 iterações
  parallelism: 4,     // 4 threads
  type: 2,            // Argon2id (híbrido)
}

/**
 * Hash de senha com Argon2id
 * @param password Senha em texto plano
 * @returns Hash Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  // Validar senha
  if (password.length < 12) {
    throw new Error('Senha deve ter no mínimo 12 caracteres')
  }
  
  // Adicionar pepper (salt global do .env)
  const pepper = process.env.PEPPER_SECRET || ''
  const passwordWithPepper = password + pepper
  
  // Hash com Argon2id
  return await hash(passwordWithPepper, ARGON2_OPTIONS)
}

/**
 * Verificar senha com Argon2id
 * @param password Senha em texto plano
 * @param hash Hash Argon2id armazenado
 * @returns true se válido, false se inválido
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    // Adicionar pepper
    const pepper = process.env.PEPPER_SECRET || ''
    const passwordWithPepper = password + pepper
    
    // Verificar com Argon2id
    return await verify(hash, passwordWithPepper, ARGON2_OPTIONS)
  } catch (error) {
    console.error('Erro ao verificar senha:', error)
    return false
  }
}

/**
 * Calcular força da senha (entropia)
 * @param password Senha em texto plano
 * @returns Pontuação de 0 a 100
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0
  
  // Comprimento (máximo 40 pontos)
  score += Math.min(password.length * 2, 40)
  
  // Complexidade
  if (/[a-z]/.test(password)) score += 10 // Minúsculas
  if (/[A-Z]/.test(password)) score += 15 // Maiúsculas
  if (/[0-9]/.test(password)) score += 15 // Números
  if (/[^a-zA-Z0-9]/.test(password)) score += 20 // Especiais
  
  // Penalidades
  if (/(.)\1{2,}/.test(password)) score -= 10 // Repetição
  if (/^[0-9]+$/.test(password)) score -= 20 // Apenas números
  if (/^[a-zA-Z]+$/.test(password)) score -= 10 // Apenas letras
  
  return Math.max(0, Math.min(100, score))
}
```

---

## 🛡️ PROTEÇÕES OBRIGATÓRIAS

### 1. Rate Limiting (Anti Brute-Force)

**Arquivo**: `Painel_Web/lib/auth/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Configurar Redis (Upstash ou local)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiter para login
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 tentativas por minuto
  analytics: true,
  prefix: 'ratelimit:login',
})

// Rate limiter para registro
export const registerRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 registros por hora
  analytics: true,
  prefix: 'ratelimit:register',
})

// Rate limiter para reset de senha
export const passwordResetRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 resets por hora
  analytics: true,
  prefix: 'ratelimit:password-reset',
})

/**
 * Verificar rate limit
 * @param identifier IP ou user ID
 * @param limiter Instância do rate limiter
 * @returns { success: boolean, limit: number, remaining: number, reset: number }
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
) {
  const { success, limit, remaining, reset } = await limiter.limit(identifier)
  
  if (!success) {
    const resetDate = new Date(reset)
    throw new Error(
      `Muitas tentativas. Tente novamente em ${Math.ceil((reset - Date.now()) / 1000)}s`
    )
  }
  
  return { success, limit, remaining, reset }
}
```

### 2. Account Lockout

**Arquivo**: `Painel_Web/lib/auth/account-lockout.ts`

```typescript
import { prisma } from '@/lib/prisma'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutos

/**
 * Registrar tentativa de login
 */
export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  userId?: string
) {
  await prisma.loginAttempt.create({
    data: {
      email,
      ipAddress,
      userAgent,
      success,
      userId,
    }
  })
}

/**
 * Verificar se conta está bloqueada
 */
export async function isAccountLocked(email: string): Promise<{
  locked: boolean
  reason?: string
  lockedUntil?: Date
}> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { isLocked: true, lockReason: true, lockedUntil: true }
  })
  
  if (!user) return { locked: false }
  
  // Verificar se ainda está bloqueado
  if (user.isLocked && user.lockedUntil) {
    if (new Date() > user.lockedUntil) {
      // Desbloquear automaticamente
      await prisma.user.update({
        where: { email },
        data: { isLocked: false, lockReason: null, lockedUntil: null }
      })
      return { locked: false }
    }
  }
  
  return {
    locked: user.isLocked,
    reason: user.lockReason || undefined,
    lockedUntil: user.lockedUntil || undefined
  }
}

/**
 * Verificar tentativas falhadas e bloquear se necessário
 */
export async function checkAndLockAccount(email: string) {
  // Contar falhas nos últimos 15 minutos
  const fifteenMinutesAgo = new Date(Date.now() - LOCKOUT_DURATION_MS)
  
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      email,
      success: false,
      createdAt: { gte: fifteenMinutesAgo }
    }
  })
  
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    // Bloquear conta
    const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
    
    await prisma.user.update({
      where: { email },
      data: {
        isLocked: true,
        lockReason: `${MAX_FAILED_ATTEMPTS} tentativas falhadas`,
        lockedUntil: lockUntil
      }
    })
    
    return {
      locked: true,
      lockedUntil: lockUntil,
      attempts: failedAttempts
    }
  }
  
  return { locked: false, attempts: failedAttempts }
}
```

### 3. CSRF Protection

NextAuth.js já inclui proteção CSRF automática, mas para API routes customizados:

**Arquivo**: `Painel_Web/lib/auth/csrf.ts`

```typescript
import { NextRequest } from 'next/server'

/**
 * Verificar token CSRF
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  const csrfToken = request.headers.get('x-csrf-token')
  const csrfCookie = request.cookies.get('csrf-token')?.value
  
  if (!csrfToken || !csrfCookie) return false
  
  return csrfToken === csrfCookie
}

/**
 * Gerar token CSRF
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID()
}
```

---

## 🌐 API ROUTES

### POST /api/auth/register

**Arquivo**: `Painel_Web/app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { checkRateLimit, registerRateLimit } from '@/lib/auth/rate-limit'
import { registerSchema } from '@/lib/auth/validation'

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    await checkRateLimit(ip, registerRateLimit)
    
    // 2. Parse e validação
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    // 3. Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }
    
    // 4. Hash de senha com Argon2id
    const hashedPassword = await hashPassword(validatedData.password)
    
    // 5. Criar usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        cpf: validatedData.cpf,
        phone: validatedData.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })
    
    // 6. Enviar email de verificação (implementar)
    // await sendVerificationEmail(user.email)
    
    // 7. Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    )
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
```

### POST /api/auth/login (com NextAuth.js)

NextAuth.js já fornece as rotas de login, mas para customização:

**Arquivo**: `Painel_Web/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, loginRateLimit } from '@/lib/auth/rate-limit'
import { isAccountLocked, recordLoginAttempt } from '@/lib/auth/account-lockout'

const handler = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Atualizar último login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: '...', // Obter do request
        }
      })
      
      // Log de auditoria
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          ipAddress: '...', // Obter do request
          metadata: { provider: account?.provider }
        }
      })
    },
    
    async signOut({ session, token }) {
      // Log de auditoria
      if (token?.sub) {
        await prisma.auditLog.create({
          data: {
            userId: token.sub,
            action: 'USER_LOGOUT',
            ipAddress: '...',
          }
        })
      }
    }
  },
  
  // Middleware customizado
  async authorize(credentials, req) {
    const ip = req.headers?.['x-forwarded-for'] || req.ip
    
    // 1. Rate limiting
    try {
      await checkRateLimit(ip, loginRateLimit)
    } catch (error) {
      throw new Error('Muitas tentativas. Aguarde.')
    }
    
    // 2. Verificar se conta está bloqueada
    const lockStatus = await isAccountLocked(credentials.email)
    if (lockStatus.locked) {
      throw new Error(`Conta bloqueada. ${lockStatus.reason}`)
    }
    
    // 3. Continuar com authorize padrão...
  }
})

export { handler as GET, handler as POST }
```

---

## 🔒 SECURITY HEADERS

### Configuração em next.config.js

**Arquivo**: `Painel_Web/next.config.js`

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN' // Previne clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff' // Previne MIME sniffing
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block' // XSS protection (legacy)
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://accounts.google.com;
      frame-src https://accounts.google.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  // ... resto da config
}
```

---

## 🔐 OAUTH 2.0 E PROVEDORES

### Configuração de Provedores

#### Google OAuth

1. **Criar projeto no Google Cloud Console**
2. **Ativar Google+ API**
3. **Criar credenciais OAuth 2.0**
4. **Configurar URIs autorizados**:
   - Authorized JavaScript origins: `http://localhost:3000`, `https://seu-dominio.com`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

**Variáveis de ambiente**:
```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

#### Microsoft OAuth (Azure AD)

1. **Registrar app no Azure Portal**
2. **Configurar redirect URI**: `http://localhost:3000/api/auth/callback/azure-ad`
3. **Obter Client ID e Secret**

```bash
AZURE_AD_CLIENT_ID=xxxxx
AZURE_AD_CLIENT_SECRET=xxxxx
AZURE_AD_TENANT_ID=xxxxx
```

#### Facebook OAuth

1. **Criar app no Facebook Developers**
2. **Configurar redirect URI**: `http://localhost:3000/api/auth/callback/facebook`
3. **Obter App ID e App Secret**

```bash
FACEBOOK_CLIENT_ID=xxxxx
FACEBOOK_CLIENT_SECRET=xxxxx
```

#### Apple OAuth (Sign in with Apple)

1. **Criar Service ID no Apple Developer**
2. **Configurar redirect URI**: `http://localhost:3000/api/auth/callback/apple`
3. **Obter Client ID, Team ID e Key ID**

```bash
APPLE_CLIENT_ID=xxxxx
APPLE_TEAM_ID=xxxxx
APPLE_KEY_ID=xxxxx
APPLE_PRIVATE_KEY=xxxxx
```

---

## 📧 EMAIL DE VERIFICAÇÃO

### Implementação com Resend ou Nodemailer

**Arquivo**: `Painel_Web/lib/auth/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Enviar email de verificação
 */
export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verificar-email?token=${token}`
  
  await resend.emails.send({
    from: 'DVAi$ - Mentor IA <noreply@dvais.com>',
    to: email,
    subject: 'Verifique seu email - DVAi$ Mentor IA',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Bem-vindo ao DVAi$ - Mentor IA!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Verificar Email
        </a>
        <p>Ou copie e cole este link no navegador:</p>
        <p>${verificationUrl}</p>
        <p>Este link expira em 24 horas.</p>
      </div>
    `
  })
}

/**
 * Enviar email de reset de senha
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/resetar-senha?token=${token}`
  
  await resend.emails.send({
    from: 'DVAi$ - Mentor IA <noreply@dvais.com>',
    to: email,
    subject: 'Resetar senha - DVAi$ Mentor IA',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Resetar sua senha</h1>
        <p>Você solicitou a redefinição de senha. Clique no link abaixo:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
          Resetar Senha
        </a>
        <p>Se você não solicitou isso, ignore este email.</p>
        <p>Este link expira em 1 hora.</p>
      </div>
    `
  })
}
```

---

## 🔐 MFA (TWO-FACTOR AUTHENTICATION)

### Implementação com TOTP

**Biblioteca**: `@levminer/speakeasy` + `qrcode`

```typescript
import * as speakeasy from '@levminer/speakeasy'
import QRCode from 'qrcode'

/**
 * Gerar secret para TOTP
 */
export async function generateMFASecret(userEmail: string) {
  const secret = speakeasy.generateSecret({
    name: `DVAi$ Mentor IA (${userEmail})`,
    issuer: 'DVAi$ Mentor IA',
    length: 32,
  })
  
  // Gerar QR Code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)
  
  return {
    secret: secret.base32,
    qrCode: qrCodeUrl,
    otpauthUrl: secret.otpauth_url
  }
}

/**
 * Verificar código TOTP
 */
export function verifyMFAToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Aceita tokens de 2 períodos antes/depois
  })
}
```

---

## 🌍 VARIÁVEIS DE AMBIENTE

### Arquivo .env (NUNCA COMMITAR)

```bash
# ========================================
# DATABASE
# ========================================
DATABASE_URL="postgresql://user:password@localhost:5432/dvais_db?schema=public"

# ========================================
# NEXTAUTH
# ========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"

# ========================================
# OAUTH PROVIDERS
# ========================================
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxxx"

GITHUB_ID="xxxxx"
GITHUB_SECRET="xxxxx"

AZURE_AD_CLIENT_ID="xxxxx"
AZURE_AD_CLIENT_SECRET="xxxxx"
AZURE_AD_TENANT_ID="xxxxx"

# ========================================
# SECURITY
# ========================================
PEPPER_SECRET="gere-com-openssl-rand-base64-32"

# ========================================
# REDIS (Rate Limiting + Sessions)
# ========================================
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"

# ========================================
# EMAIL (Resend, SendGrid, ou Nodemailer)
# ========================================
RESEND_API_KEY="re_xxxxx"

# ========================================
# RECAPTCHA (Opcional, recomendado)
# ========================================
RECAPTCHA_SECRET_KEY="xxxxx"
RECAPTCHA_SITE_KEY="xxxxx"
```

### Gerar Secrets Seguros

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# PEPPER_SECRET
openssl rand -base64 32
```

---

## 📊 MONITORAMENTO E AUDITORIA

### Logs Essenciais

**O que logar**:
- ✅ Todas tentativas de login (sucesso e falha)
- ✅ Criação de contas
- ✅ Mudanças de senha
- ✅ Acessos a dados sensíveis
- ✅ Falhas de validação
- ✅ Rate limit violations
- ✅ Lockouts de conta

**O que NÃO logar**:
- ❌ Senhas (em texto plano ou hash)
- ❌ Tokens de sessão
- ❌ Dados pessoais sensíveis (CPF completo, etc.)

### Estrutura de Log

```typescript
interface AuditLog {
  userId?: string
  action: string
  ipAddress: string
  userAgent: string
  success: boolean
  metadata?: Record<string, any>
  createdAt: Date
}
```

---

## 🚨 DETECÇÃO DE ANOMALIAS

### Alertas Automáticos

**Cenários que devem gerar alertas**:

1. **Login de novo dispositivo**
   - Enviar email de notificação
   - Exigir verificação adicional

2. **Login de localização incomum**
   - Detectar mudança de país/região
   - Exigir MFA

3. **Múltiplas falhas de login**
   - Alertar usuário por email
   - Sugerir reset de senha

4. **Mudança de email/senha**
   - Enviar notificação para email antigo
   - Exigir confirmação em 2 emails

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Segurança Básica (Obrigatório)

- [ ] HTTPS obrigatório em produção
- [ ] Security headers configurados
- [ ] CSRF protection ativo
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Account lockout implementado
- [ ] Senhas com hash Argon2id
- [ ] Validação server-side com Zod
- [ ] Sanitização de inputs
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (sanitização + CSP)

### Segurança Avançada (Altamente Recomendado)

- [ ] MFA (2FA) com TOTP
- [ ] Email verification
- [ ] Password reset seguro
- [ ] Session management com Redis
- [ ] Audit logging completo
- [ ] Detecção de anomalias
- [ ] Geolocalização de login
- [ ] Device fingerprinting
- [ ] Breach password detection
- [ ] Backup e recovery plan

### Performance

- [ ] Indexes no banco de dados
- [ ] Cache de queries com Redis
- [ ] Connection pooling
- [ ] Query optimization
- [ ] Lazy loading de dados

### Compliance (LGPD)

- [ ] Consentimento explícito
- [ ] Direito ao esquecimento
- [ ] Exportação de dados
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Cookie consent

---

## 🔍 TESTES DE SEGURANÇA

### Testes Obrigatórios Antes de Deploy

1. **Penetration Testing**:
   - OWASP ZAP
   - Burp Suite
   - sqlmap (SQL injection)

2. **Dependency Scanning**:
   - npm audit
   - Snyk
   - Dependabot

3. **Code Analysis**:
   - ESLint com plugins de segurança
   - SonarQube
   - CodeQL

4. **Manual Testing**:
   - Tentar SQL injection
   - Tentar XSS
   - Tentar CSRF
   - Tentar brute force
   - Verificar rate limiting

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS

```bash
# Core
npm install next-auth@beta @auth/prisma-adapter
npm install @prisma/client
npm install @node-rs/argon2

# Validation
npm install zod

# Rate Limiting
npm install @upstash/redis @upstash/ratelimit

# Email
npm install resend

# MFA
npm install @levminer/speakeasy qrcode
npm install -D @types/qrcode

# Utilities
npm install libphonenumber-js  # Validação de telefone
npm install cpf-cnpj-validator  # Validação CPF/CNPJ

# Dev
npm install -D prisma
```

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO

### Fase 1: Setup Básico (1-2 dias)

1. Configurar PostgreSQL
2. Instalar dependências
3. Configurar Prisma
4. Criar schema do banco
5. Executar migrations
6. Configurar variáveis de ambiente

### Fase 2: Autenticação Core (2-3 dias)

1. Configurar NextAuth.js
2. Implementar hash de senhas
3. Criar API de registro
4. Implementar login com credenciais
5. Configurar OAuth (Google)

### Fase 3: Proteções (2-3 dias)

1. Implementar rate limiting
2. Implementar account lockout
3. Configurar security headers
4. Adicionar CSRF protection
5. Implementar audit logging

### Fase 4: Features Avançadas (3-4 dias)

1. Email verification
2. Password reset
3. MFA (2FA)
4. Detecção de anomalias
5. Admin dashboard

### Fase 5: Testes e Hardening (2-3 dias)

1. Testes de segurança
2. Penetration testing
3. Code review
4. Load testing
5. Ajustes finais

**Total estimado: 10-15 dias de desenvolvimento**

---

## 🎓 RECURSOS E REFERÊNCIAS

### Documentação Oficial

- [NextAuth.js v5 Docs](https://authjs.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Argon2 Specification](https://github.com/P-H-C/phc-winner-argon2)

### Guias de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)

### Ferramentas de Segurança

- [OWASP ZAP](https://www.zaproxy.org/)
- [Burp Suite](https://portswigger.net/burp)
- [Have I Been Pwned API](https://haveibeenpwned.com/API)
- [Snyk](https://snyk.io/)

---

## ⚠️ AVISOS CRÍTICOS

### NUNCA FAÇA ISSO:

❌ Armazenar senhas em texto plano  
❌ Usar MD5 ou SHA-1 para senhas  
❌ Expor tokens de sessão em URLs  
❌ Desabilitar HTTPS em produção  
❌ Usar `eval()` ou `new Function()` com dados de usuário  
❌ Confiar apenas em validação client-side  
❌ Logar senhas ou tokens  
❌ Usar secrets hardcoded no código  
❌ Permitir SQL direto (use Prisma)  
❌ Desabilitar CORS sem motivo  

### SEMPRE FAÇA ISSO:

✅ Validar TODOS os inputs (client + server)  
✅ Usar prepared statements (Prisma faz automaticamente)  
✅ Sanitizar outputs (previne XSS)  
✅ Implementar rate limiting  
✅ Usar HTTPS em produção  
✅ Rotacionar secrets regularmente  
✅ Manter dependências atualizadas  
✅ Fazer backups regulares do banco  
✅ Testar antes de deploy  
✅ Monitorar logs de segurança  

---

## 📞 SUPORTE E MANUTENÇÃO

### Atualizações de Segurança

**Frequência recomendada**:
- Dependências: Semanal (npm audit)
- Security headers: Trimestral
- Penetration tests: Semestral
- Code review: A cada PR
- Backup do banco: Diário

### Incidentes de Segurança

**Procedimento em caso de breach**:

1. **Contenção Imediata**:
   - Invalidar todas as sessões
   - Bloquear contas comprometidas
   - Investigar logs

2. **Notificação**:
   - Notificar usuários afetados
   - Reportar às autoridades (se necessário)
   - Comunicar time interno

3. **Correção**:
   - Identificar vulnerabilidade
   - Aplicar patch
   - Testar correção
   - Deploy emergency

4. **Pós-Incidente**:
   - Análise de causa raiz
   - Atualizar documentação
   - Melhorar processos
   - Treinar equipe

---

## 🎯 CONCLUSÃO

Este guia fornece uma base sólida para implementar autenticação ultra-segura. **IMPORTANTE**:

- Segurança é um processo contínuo, não um produto
- Sempre teste antes de deploy
- Mantenha tudo atualizado
- Monitore constantemente
- Siga o princípio do menor privilégio
- Quando em dúvida, escolha segurança sobre conveniência

**Para dúvidas sobre implementação**, consulte:
- [SEGURANCA_AVANCADA_AUTH.md](./SEGURANCA_AVANCADA_AUTH.md) - Proteção contra ataques
- [AUTH_README.md](./AUTH_README.md) - Guia de integração

---

**Criado em**: 2025-11-13  
**Versão**: 1.0.0  
**Status**: 📝 Documentação Técnica - Implementação Futura  
**Autor**: DVAi$ - Mentor IA Team

