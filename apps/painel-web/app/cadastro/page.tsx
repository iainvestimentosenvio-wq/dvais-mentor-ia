import RegisterForm from '@/componentes/auth/RegisterForm'
import Icon from '@/componentes/Icon'

/**
 * Register Page (Cadastro)
 * 
 * Página de cadastro da plataforma DVAi$ - Mentor IA
 * 
 * Estrutura:
 * - FixedLogo: Logo fixo no topo
 * - Header: Título e descrição
 * - RegisterForm: Formulário de cadastro com validação completa
 * - OAuth: Botões de cadastro social (Google, Facebook, etc.)
 * 
 * Funcionalidades:
 * - Validação client-side completa (CPF, CNPJ, telefone, senha)
 * - Validação server-side (segurança)
 * - OAuth integration (preparado)
 * - Link para login
 * - Máscaras de input (CPF, CNPJ, telefone)
 * 
 * Design:
 * - Glassmorphism (backdrop-blur)
 * - Gradientes animados
 * - Layout centralizado
 * - Responsivo
 * 
 * Performance:
 * - Server Component (não usa 'use client')
 * - Formulário lazy loaded (RegisterForm é Client Component)
 * 
 * @returns {JSX.Element} Página de cadastro completa
 */
export default function RegisterPage() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Crie sua conta
            </h1>
            <p className="text-lg text-gray-400">
              Comece a investir com inteligência artificial
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
            <RegisterForm />
          </div>

          {/* Informações de segurança */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Icon name="fas fa-lock" aria-hidden="true" />
              <span>Seus dados estão protegidos com HTTPS/TLS</span>
            </p>
            <p className="text-xs text-gray-600">
              Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

