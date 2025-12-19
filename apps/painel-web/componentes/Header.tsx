'use client'

import Icon from './Icon'

import { useEffect, useState } from 'react'

/**
 * Header Component
 * 
 * Cabeçalho fixo da aplicação com navegação
 * - Logo DVAi$ - Mentor IA
 * - Links de navegação (Funcionalidades, Login)
 * - Menu mobile responsivo
 * - Efeito de scroll (muda aparência ao rolar)
 * 
 * Comportamento:
 * - Fixo no topo (position: fixed)
 * - Muda estilo quando scroll > 20px (backdrop-blur mais forte)
 * - Smooth scroll para âncoras (#features, etc.)
 * - Menu mobile com animação
 * 
 * Performance:
 * - Client Component (usa hooks: useState, useEffect)
 * - Event listener de scroll com cleanup adequado
 * - Não lazy loaded (sempre visível, crítico para FCP)
 * 
 * @returns {JSX.Element} Cabeçalho fixo com navegação
 */
export default function Header() {
  // Estado para controlar aparência do header ao rolar
  // Quando scrolled = true, header fica com backdrop-blur mais forte
  const [scrolled, setScrolled] = useState(false)

  // IntersectionObserver para detectar scroll (mais eficiente que scroll listener)
  // Observa o sentinel no topo: quando não está visível = scrollou, quando visível = no topo
  useEffect(() => {
    // Verificar se está no cliente (SSR safety)
    if (typeof window === 'undefined') return

    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel) return

    // Criar observer com threshold de 0 (dispara quando qualquer parte entra/sai da viewport)
    const observer = new IntersectionObserver(
      (entries) => {
        // Se o sentinel não está visível (intersecting = false), significa que scrollou
        // Se está visível (intersecting = true), está no topo
        const entry = entries[0]
        setScrolled(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    )

    observer.observe(sentinel)

    // Cleanup: desconectar observer ao desmontar
    return () => {
      observer.disconnect()
    }
  }, [])

  /**
   * Função para smooth scroll em links âncora
   * 
   * Comportamento:
   * - Intercepta cliques em links que começam com '#'
   * - Previne comportamento padrão (não recarrega página)
   * - Faz scroll suave até o elemento alvo
   * 
   * @param {React.MouseEvent<HTMLAnchorElement>} e - Evento de clique
   */
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={scrolled ? {
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        borderBottom: 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease'
      } : {
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        borderBottom: 'none',
        boxShadow: 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <nav className="w-full py-5">
        <div className="flex items-center justify-end relative pr-4 md:pr-8">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 relative z-10">
            <a 
              href="#features" 
              onClick={handleSmoothScroll}
              className="btn-login-modern group relative text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Ver funcionalidades"
            >
              <span className="btn-text">Ver funcionalidades</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
            </a>
            <a 
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 inline-block"
              aria-label="Fazer login"
            >
              Fazer login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
            aria-label="Abrir menu"
            aria-expanded="false"
          >
            <Icon name="fas fa-bars" className="text-xl" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  )
}

