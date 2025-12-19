import LoginForm from '@/componentes/auth/LoginForm'
import Icon from '@/componentes/Icon'

/**
 * Login Page
 * 
 * Página de login da plataforma DVAi$ - Mentor IA
 * 
 * Estrutura:
 * - FixedLogo: Logo fixo no topo
 * - Header: Título e descrição
 * - LoginForm: Formulário de login com validação
 * - OAuth: Botões de login social (Google, Facebook, etc.)
 * 
 * Funcionalidades:
 * - Validação client-side (feedback rápido)
 * - Validação server-side (segurança)
 * - OAuth integration (preparado)
 * - Link para registro
 * 
 * Design:
 * - Glassmorphism (backdrop-blur)
 * - Gradientes animados
 * - Layout centralizado
 * - Responsivo
 * 
 * Performance:
 * - Server Component (não usa 'use client')
 * - Formulário lazy loaded (LoginForm é Client Component)
 * 
 * @returns {JSX.Element} Página de login completa
 */
export default function LoginPage() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ paddingTop: '140px' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Bem-vindo de volta
            </h1>
            <p className="text-lg text-gray-400">
              Entre para acessar sua conta
            </p>
          </div>

          {/* Card do formulário */}
          <div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <LoginForm />
          </div>

          {/* Informações de segurança */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Icon name="fas fa-lock" aria-hidden="true" />
              <span>Conexão segura HTTPS/TLS</span>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

