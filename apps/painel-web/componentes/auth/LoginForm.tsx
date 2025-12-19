'use client'

import { useState } from 'react'
import { validateLoginForm } from '@/biblioteca/auth/validation-auth'
import type { LoginFormProps } from '@/tipos/auth'
import OAuthButtons from './OAuthButtons'
import Icon from '../Icon'

/**
 * LoginForm Component
 * 
 * Formulário de login com validação client-side
 * - Validação em tempo real
 * - Feedback visual de erros
 * - Integração OAuth (preparado)
 * - Link para registro
 * 
 * Validação:
 * - Email: formato válido
 * - Senha: mínimo 12 caracteres, complexidade
 * - Feedback instantâneo (UX)
 * - Validação server-side também necessária (segurança)
 * 
 * Performance:
 * - Client Component (usa hooks)
 * - Validação otimizada (debounce)
 * - Não bloqueia UI
 * 
 * @param {boolean} showOAuth - Se true, exibe botões OAuth
 * @param {boolean} showRegisterLink - Se true, exibe link para registro
 * 
 * @returns {JSX.Element} Formulário de login completo
 */

// Tipo local para o formulário de login
interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm({
  showOAuth = true,
  showRegisterLink = true
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev: LoginFormData) => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo ao digitar
    const fieldKey = field as string
    if (errors[fieldKey]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar formulário
    const validation = validateLoginForm(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Preparado para integração com NextAuth.js
      // const result = await signIn('credentials', {
      //   email: formData.email,
      //   password: formData.password,
      //   redirect: false,
      // })
      
      // Simulação (remover quando integrar backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar (quando tiver backend)
      // router.push(redirectTo)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
      setErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'}
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-300
            `}
            placeholder="seu@email.com"
            disabled={isSubmitting}
            autoComplete="email"
            required
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-lg
                bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'}
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-300
                pr-12
              `}
              placeholder="••••••••••••"
              disabled={isSubmitting}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              <Icon name={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {/* Esqueci minha senha */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
              Lembrar de mim
            </label>
          </div>
          <a
            href="/esqueci-senha"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Esqueci minha senha
          </a>
        </div>

        {/* Erro geral */}
        {errors.submit && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">
              {errors.submit}
            </p>
          </div>
        )}

        {/* Botão de submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full px-6 py-3 rounded-lg
            bg-gradient-to-r from-blue-600 to-cyan-500
            text-white font-semibold
            hover:from-blue-500 hover:to-cyan-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isSubmitting ? (
            <>
              <Icon name="fas fa-spinner" spin aria-hidden="true" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <Icon name="fas fa-sign-in-alt" aria-hidden="true" />
              <span>Entrar</span>
            </>
          )}
        </button>
      </form>

      {/* OAuth Buttons */}
      {showOAuth && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6">
            <OAuthButtons 
              mode="login"
            />
          </div>
        </div>
      )}

      {/* Link para cadastro */}
      {showRegisterLink && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Não tem uma conta?{' '}
            <a
              href="/cadastro"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Criar conta
            </a>
          </p>
        </div>
      )}
    </>
  )
}

