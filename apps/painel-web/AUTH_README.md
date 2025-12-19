# 🔐 Sistema de Autenticação - Guia de Integração

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Componentes Frontend](#componentes-frontend)
3. [Fluxo de Autenticação](#fluxo-de-autenticação)
4. [Configuração](#configuração)
5. [Uso dos Componentes](#uso-dos-componentes)
6. [Integração com Backend](#integração-com-backend)
7. [Testes](#testes)

---

## 🎯 VISÃO GERAL

O sistema de autenticação foi desenvolvido seguindo as melhores práticas de segurança da indústria (OWASP, NIST) e está preparado para integração futura com backend ultra-seguro.

### Características

- Login com email/senha
- Cadastro completo profissional
- OAuth (Google, Facebook, Apple)
- Indicador de força de senha em tempo real
- Validação client-side robusta
- UI/UX de nível empresarial
- Totalmente responsivo
- Acessível (ARIA labels)
- Performance otimizada

---

## 📦 COMPONENTES FRONTEND

### Páginas

#### `/login` - Página de Login
**Arquivo**: `app/login/page.tsx`

- Formulário de login (email + senha)
- Botões OAuth (Google, Facebook, Apple)
- Link "Esqueci minha senha"
- Link para cadastro
- Server Component com lazy loading

#### `/cadastro` - Página de Cadastro
**Arquivo**: `app/cadastro/page.tsx`

- Formulário completo de registro
- Validação em tempo real
- Indicador de força de senha
- Campos: nome, email, senha, CPF (opcional), telefone (opcional)
- Checkbox de termos de uso
- Botões OAuth
- Link para login
- Server Component com lazy loading

### Componentes Reutilizáveis

#### `LoginForm` - Formulário de Login
**Arquivo**: `components/auth/LoginForm.tsx`  
**Tipo**: Client Component

```tsx
import LoginForm from '@/components/auth/LoginForm'

<LoginForm 
  showOAuth={true}
  showRegisterLink={true}
  redirectTo="/dashboard"
  onSuccess={(user) => console.log('Logado:', user)}
  onError={(error) => console.error('Erro:', error)}
/>
```

**Props**:
- `onSuccess?: (user: SessionUser) => void` - Callback de sucesso
- `onError?: (error: string) => void` - Callback de erro
- `redirectTo?: string` - URL para redirecionar após login
- `showOAuth?: boolean` - Mostrar botões OAuth
- `showRegisterLink?: boolean` - Mostrar link para cadastro

#### `RegisterForm` - Formulário de Cadastro
**Arquivo**: `components/auth/RegisterForm.tsx`  
**Tipo**: Client Component

```tsx
import RegisterForm from '@/components/auth/RegisterForm'

<RegisterForm 
  showOAuth={true}
  showLoginLink={true}
  redirectTo="/verificar-email"
  requireCPF={false}
  requirePhone={false}
  onSuccess={(user) => console.log('Registrado:', user)}
  onError={(error) => console.error('Erro:', error)}
/>
```

**Props**:
- `onSuccess?: (user: PublicUser) => void` - Callback de sucesso
- `onError?: (error: string) => void` - Callback de erro
- `redirectTo?: string` - URL para redirecionar após registro
- `showOAuth?: boolean` - Mostrar botões OAuth
- `showLoginLink?: boolean` - Mostrar link para login
- `requireCPF?: boolean` - Tornar CPF obrigatório
- `requirePhone?: boolean` - Tornar telefone obrigatório

#### `OAuthButtons` - Botões OAuth
**Arquivo**: `components/auth/OAuthButtons.tsx`  
**Tipo**: Server Component

```tsx
import OAuthButtons from '@/components/auth/OAuthButtons'

<OAuthButtons 
  providers={['google', 'facebook', 'apple']}
  mode="login"
  onSuccess={() => console.log('OAuth sucesso')}
  onError={(error) => console.error('OAuth erro:', error)}
/>
```

**Props**:
- `providers?: OAuthProvider[]` - Provedores a mostrar
- `mode?: 'login' | 'register'` - Texto dos botões
- `onSuccess?: () => void` - Callback de sucesso
- `onError?: (error: string) => void` - Callback de erro

#### `PasswordStrength` - Indicador de Força de Senha
**Arquivo**: `components/auth/PasswordStrength.tsx`  
**Tipo**: Client Component

```tsx
import PasswordStrength from '@/components/auth/PasswordStrength'

<PasswordStrength 
  password={password}
  showFeedback={true}
  showScore={true}
  minScore={60}
/>
```

**Props**:
- `password: string` - Senha a avaliar
- `showFeedback?: boolean` - Mostrar dicas de melhoria
- `showScore?: boolean` - Mostrar pontuação numérica
- `minScore?: number` - Score mínimo aceitável

---

## 🔄 FLUXO DE AUTENTICAÇÃO

### Login com Email/Senha

```
1. Usuário acessa /login
2. Preenche email e senha
3. Frontend valida inputs (client-side)
4. Envia para API /api/auth/login
5. Backend:
   - Valida inputs (server-side)
   - Verifica rate limiting
   - Verifica se conta está bloqueada
   - Verifica credenciais
   - Cria sessão
   - Retorna token
6. Frontend:
   - Armazena token em cookie seguro
   - Redireciona para /dashboard
```

### Login com OAuth (Google)

```
1. Usuário clica em "Entrar com Google"
2. Redireciona para Google OAuth
3. Usuário autoriza
4. Google redireciona para /api/auth/callback/google
5. Backend:
   - Valida token do Google
   - Cria ou atualiza usuário
   - Cria sessão
6. Frontend:
   - Redireciona para /dashboard
```

### Cadastro

```
1. Usuário acessa /cadastro
2. Preenche formulário
3. Frontend:
   - Valida em tempo real
   - Mostra força da senha
   - Aplica máscaras (CPF, telefone)
4. Envia para API /api/auth/register
5. Backend:
   - Valida inputs
   - Verifica se email existe
   - Hash senha com Argon2id
   - Cria usuário no banco
   - Envia email de verificação
6. Frontend:
   - Redireciona para /verificar-email
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Instalar Dependências

```bash
cd Painel_Web

# Dependências principais
npm install zod

# Opcional (para usar as máscaras avançadas)
npm install libphonenumber-js cpf-cnpj-validator
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e configure:

```bash
# Mínimo necessário para testar frontend
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-um-secret-seguro

# Para OAuth (opcional)
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

### 3. Gerar Secrets Seguros

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# PEPPER_SECRET
openssl rand -base64 32
```

---

## 💻 USO DOS COMPONENTES

### Exemplo: Página de Login Customizada

```tsx
import LoginForm from '@/components/auth/LoginForm'

export default function CustomLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1>Faça Login</h1>
        
        <LoginForm 
          onSuccess={(user) => {
            // Fazer algo após login
            console.log('Usuário logado:', user)
            // router.push('/dashboard')
          }}
          onError={(error) => {
            // Mostrar notificação de erro
            toast.error(error)
          }}
        />
      </div>
    </div>
  )
}
```

### Exemplo: Validação Manual

```typescript
import { validateEmail, validatePassword } from '@/lib/auth/validation'

// Validar email
const emailResult = validateEmail('user@example.com')
if (!emailResult.isValid) {
  console.error(emailResult.error)
}

// Validar senha
const passwordResult = validatePassword('MyP@ssw0rd123!')
console.log('Força:', passwordResult.strength.level)
console.log('Score:', passwordResult.strength.score)
console.log('Feedback:', passwordResult.strength.feedback)

if (!passwordResult.isValid) {
  console.error('Erros:', passwordResult.errors)
}
```

### Exemplo: Aplicar Máscaras

```typescript
import { maskCPF, maskPhone } from '@/lib/auth/validation'

// Máscara de CPF
const cpfFormatado = maskCPF('12345678900')
// Resultado: "123.456.789-00"

// Máscara de telefone
const phoneFormatado = maskPhone('11987654321')
// Resultado: "(11) 98765-4321"
```

---

## 🔌 INTEGRAÇÃO COM BACKEND

### Quando o Backend Estiver Pronto

#### 1. Configurar NextAuth.js

Criar `auth.config.ts` conforme documentado em [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md).

#### 2. Descomentar Chamadas de API

Nos componentes `LoginForm` e `RegisterForm`, descomentar as linhas:

```typescript
// LoginForm.tsx
const result = await signIn('credentials', {
  email: formData.email,
  password: formData.password,
  redirect: false,
})

// RegisterForm.tsx
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validation.data)
})
```

#### 3. Criar API Routes

Seguir estrutura documentada em [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md):

- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/register/route.ts`
- Etc.

---

## 🧪 TESTES

### Testar Validações

```bash
# Testar no browser console
import { validatePassword } from '@/lib/auth/validation'

// Senha fraca
validatePassword('123456')
// { isValid: false, errors: [...] }

// Senha forte
validatePassword('MyS3cur3P@ssw0rd!')
// { isValid: true, strength: { score: 85, level: 'very-strong' } }
```

### Testar Componentes

1. Acesse http://localhost:3000/login
2. Teste validações:
   - Email inválido
   - Senha muito curta
   - Senha sem maiúsculas
   - Etc.

3. Acesse http://localhost:3000/cadastro
4. Teste:
   - Indicador de força de senha
   - Máscaras de CPF/telefone
   - Validação de termos de uso

---

## 🔒 SEGURANÇA

### O que já está implementado (Frontend)

- Validação client-side robusta com Zod
- Sanitização de inputs
- Indicador de força de senha
- Máscaras para dados sensíveis
- HTTPS obrigatório em produção
- CSP headers configurados

### O que precisa ser implementado (Backend)

Ver [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md) e [SEGURANCA_AVANCADA_AUTH.md](./SEGURANCA_AVANCADA_AUTH.md).

---

## 🎨 ESTILOS

### Classes CSS Disponíveis

Definidas em `app/globals.css`:

- `.auth-input` - Input padrão
- `.auth-label` - Label padrão
- `.auth-error` - Mensagem de erro
- `.auth-success` - Mensagem de sucesso
- `.auth-button-primary` - Botão primário
- `.auth-button-secondary` - Botão secundário
- `.auth-card` - Card de formulário
- `.auth-divider` - Separador
- `.auth-checkbox` - Checkbox customizado
- `.auth-link` - Link
- `.auth-badge-success` - Badge verde
- `.auth-badge-warning` - Badge amarelo
- `.auth-badge-error` - Badge vermelho
- `.auth-loading` - Spinner de loading
- `.auth-fade-in` - Animação de entrada

### Customização

Para customizar cores, edite as classes em `globals.css` ou use Tailwind classes direto nos componentes.

---

## 📱 RESPONSIVIDADE

Todos os componentes são totalmente responsivos:

- **Mobile**: Design otimizado para telas pequenas
- **Tablet**: Layout adaptado
- **Desktop**: Experiência completa

Testado em:
- iPhone (375px)
- iPad (768px)
- Desktop (1920px)

---

## ♿ ACESSIBILIDADE

Implementações de acessibilidade:

- ARIA labels em todos os inputs
- Navegação por teclado funcional
- Foco visível
- Contraste adequado (WCAG AA)
- Textos alternativos
- Mensagens de erro descritivas

---

## 🚀 PRÓXIMOS PASSOS

### Para Implementar Backend

1. Ler [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md)
2. Ler [SEGURANCA_AVANCADA_AUTH.md](./SEGURANCA_AVANCADA_AUTH.md)
3. Configurar PostgreSQL
4. Instalar dependências do backend
5. Criar schema Prisma
6. Configurar NextAuth.js
7. Implementar API routes
8. Testar integração
9. Deploy

### Features Futuras (Opcional)

- [ ] MFA (2FA) com TOTP
- [ ] Verificação de email
- [ ] Reset de senha
- [ ] Login com biometria (WebAuthn)
- [ ] Login sem senha (Magic Links)
- [ ] Social login (Twitter, LinkedIn)
- [ ] Dashboard de segurança do usuário
- [ ] Histórico de logins
- [ ] Dispositivos confiáveis
- [ ] Notificações de segurança

---

## 🆘 TROUBLESHOOTING

### Erro: "Zod is not defined"

```bash
npm install zod
```

### Erro: Validação não funciona

Verificar se `lib/auth/validation.ts` foi criado corretamente.

### Erro: Estilos não aparecem

Verificar se `globals.css` foi atualizado com os estilos auth.

### OAuth não funciona

Normal - OAuth precisa do backend configurado. Ver [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md).

---

## 📞 SUPORTE

### Documentação Relacionada

- [BACKEND_AUTENTICACAO_SEGURA.md](./BACKEND_AUTENTICACAO_SEGURA.md) - Guia técnico de backend
- [SEGURANCA_AVANCADA_AUTH.md](./SEGURANCA_AVANCADA_AUTH.md) - Proteção contra ataques
- [PADRAO_DESENVOLVIMENTO.md](./PADRAO_DESENVOLVIMENTO.md) - Padrões do projeto
- [GUIA_BOAS_PRATICAS.md](./GUIA_BOAS_PRATICAS.md) - Boas práticas gerais

---

**Criado em**: 2025-11-13  
**Versão**: 1.0.0  
**Status**: ✅ Frontend Completo - Aguardando Backend

