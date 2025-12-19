'use client'

import { useEffect, useRef } from 'react'

type Comet = {
  element: HTMLDivElement
  originalX: number
  originalY: number
  currentX: number
  currentY: number
  size: number
  speed: number
  isActive: boolean
  respawnTimeout: number | null
}

type PerformanceProfile = 'low' | 'medium' | 'high'

export default function Comets() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const cometsRef = useRef<Comet[]>([])
  const isPausedRef = useRef(false)

  // Detectar perfil de performance baseado em hardware
  const getPerformanceProfile = (): PerformanceProfile => {
    if (typeof window === 'undefined') return 'medium'
    
    const isMobile = window.innerWidth < 768
    if (isMobile) return 'low'
    
    // Usar hardwareConcurrency e deviceMemory quando disponível
    const cores = (navigator as any).hardwareConcurrency || 4
    const memory = (navigator as any).deviceMemory || 4
    
    if (cores >= 8 && memory >= 8) return 'high'
    if (cores >= 4 && memory >= 4) return 'medium'
    return 'low'
  }

  // Determinar quantidade de cometas baseado no perfil
  const getCometCount = (profile: PerformanceProfile, isMobile: boolean): number => {
    if (isMobile) return Math.floor(Math.random() * 3) // 0-2 cometas em mobile
    if (profile === 'low') return 0
    if (profile === 'medium') return Math.floor(Math.random() * 6) + 5 // 5-10
    return Math.floor(Math.random() * 11) + 10 // 10-20
  }

  // Verificar se deve pausar animação
  const shouldPause = (): boolean => {
    if (typeof document === 'undefined') return true
    if (document.visibilityState === 'hidden') return true
    
    // Verificar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return true
    
    return false
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const container = containerRef.current
    if (!container) return

    // Inicializar posição do mouse no centro
    mousePosRef.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2
    }

    // Rastrear posição do mouse
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 768
    const profile = getPerformanceProfile()
    const cometCount = getCometCount(profile, isMobile)

    // Se não há cometas, não criar nada
    if (cometCount === 0) {
      return
    }

    const comets: Comet[] = []
    const width = window.innerWidth
    const height = window.innerHeight

    // Criar cometas em posições iniciais fixas (evitar alocação no loop)
    for (let i = 0; i < cometCount; i++) {
      const comet = document.createElement('div')
      comet.className = 'comet-trail'
      
      // Tamanho bem pequeno
      const size = Math.random() * 2 + 1 // 1-3px
      comet.style.width = `${size}px`
      comet.style.height = `${size}px`
      
      // Posição inicial aleatória nas bordas
      const side = Math.floor(Math.random() * 4) // 0=top, 1=right, 2=bottom, 3=left
      let originalX = 0
      let originalY = 0
      
      if (side === 0) { // Top
        originalX = Math.random() * width
        originalY = 0
      } else if (side === 1) { // Right
        originalX = width
        originalY = Math.random() * height
      } else if (side === 2) { // Bottom
        originalX = Math.random() * width
        originalY = height
      } else { // Left
        originalX = 0
        originalY = Math.random() * height
      }
      
      // Usar transform em vez de left/top (GPU accelerated, evita reflow)
      comet.style.transform = `translate3d(${originalX}px, ${originalY}px, 0)`
      comet.style.opacity = '0.7'
      comet.style.position = 'absolute'
      comet.style.zIndex = '1'
      comet.style.pointerEvents = 'none'
      comet.style.willChange = 'transform, opacity' // Otimização para GPU
      
      container.appendChild(comet)
      
      const speed = Math.random() * 0.5 + 0.3 // Velocidade variável
      
      comets.push({
        element: comet,
        originalX,
        originalY,
        currentX: originalX,
        currentY: originalY,
        size,
        speed,
        isActive: true,
        respawnTimeout: null
      })
    }

    cometsRef.current = comets

    // Variáveis reutilizáveis (evitar alocação no loop)
    let mouseX = 0
    let mouseY = 0
    let dx = 0
    let dy = 0
    let distance = 0
    let angle = 0

    // ÚNICO loop de animação para todos os cometas
    const animate = () => {
      // Verificar se deve pausar
      const shouldPauseAnimation = shouldPause()
      if (shouldPauseAnimation !== isPausedRef.current) {
        isPausedRef.current = shouldPauseAnimation
        if (shouldPauseAnimation) {
          // Pausar: não continuar o loop
          return
        }
      }

      if (isPausedRef.current) {
        // Se pausado, não animar mas continuar verificando
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Atualizar posição do mouse uma vez por frame
      mouseX = mousePosRef.current.x
      mouseY = mousePosRef.current.y

      // Animar todos os cometas no mesmo frame
      for (let i = 0; i < comets.length; i++) {
        const comet = comets[i]
        
        // Verificações de segurança
        if (!comet.isActive || !comet.element || !comet.element.parentNode) {
          continue
        }

        // Calcular direção (reutilizar variáveis, evitar alocação)
        dx = mouseX - comet.currentX
        dy = mouseY - comet.currentY
        distance = Math.sqrt(dx * dx + dy * dy)

        // Se chegou perto do mouse (dentro de 20px), desaparecer e renascer
        if (distance < 20) {
          comet.isActive = false
          comet.element.style.opacity = '0'
          comet.element.style.transition = 'opacity 0.3s ease-out'
          
          // Limpar timeout anterior se existir
          if (comet.respawnTimeout !== null) {
            clearTimeout(comet.respawnTimeout)
          }
          
          // Renascer na posição original após um delay
          comet.respawnTimeout = window.setTimeout(() => {
            if (!comet.element || !comet.element.parentNode) return
            comet.currentX = comet.originalX
            comet.currentY = comet.originalY
            comet.element.style.transform = `translate3d(${comet.originalX}px, ${comet.originalY}px, 0)`
            comet.element.style.opacity = '0.7'
            comet.element.style.transition = 'opacity 0.3s ease-in'
            comet.isActive = true
            comet.respawnTimeout = null
          }, 300)
          continue
        }

        // Mover em direção ao mouse (reutilizar variáveis)
        angle = Math.atan2(dy, dx)
        comet.currentX += Math.cos(angle) * comet.speed
        comet.currentY += Math.sin(angle) * comet.speed

        // Usar transform em vez de left/top (GPU accelerated)
        comet.element.style.transform = `translate3d(${comet.currentX}px, ${comet.currentY}px, 0)`
      }

      // Continuar loop único
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Listener para visibility change
    const handleVisibilityChange = () => {
      isPausedRef.current = shouldPause()
    }

    // Listener para prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleReducedMotionChange = () => {
      isPausedRef.current = shouldPause()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    // Iniciar animação única
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup perfeito
    return () => {
      // Cancelar RAF único
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Remover event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)

      // Limpar cometas e timeouts
      comets.forEach(comet => {
        if (comet.respawnTimeout !== null) {
          clearTimeout(comet.respawnTimeout)
        }
        if (comet.element.parentNode) {
          comet.element.parentNode.removeChild(comet.element)
        }
      })

      cometsRef.current = []
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: 'screen', zIndex: 0 }}
    />
  )
}

