/**
 * AIProcessor Component
 * 
 * Componente de demonstração do processamento de IA
 * - Indicador visual discreto de status da IA
 * - Performance em tempo real
 * - Design minimalista e moderno
 * 
 * Funcionalidades:
 * - LED indicador com estados visuais (Ativa/Standby/Offline/Inicializando)
 * - Auto-inicialização do backend WASM + SIMD
 * - Exibição de informações de performance (20-400x mais rápido)
 * - Feedback visual em tempo real
 * 
 * Estados do LED:
 * - 🔵 Azul pulsante: IA Ativa (WASM + SIMD funcionando)
 * - 🟡 Amarelo: Inicializando IA...
 * - ⚫ Cinza: IA Standby (não inicializada)
 * - 🔴 Vermelho: IA Offline (erro)
 * 
 * Performance:
 * - Client Component (usa hooks)
 * - Auto-inicializa backend quando monta (se autoInitialize = true)
 * - Não bloqueia renderização (lazy loading do backend)
 * 
 * @param {boolean} autoInitialize - Se true, inicializa backend automaticamente ao montar
 * @param {boolean} showPerformanceInfo - Se true, exibe informações de performance
 * 
 * @returns {JSX.Element} Indicador visual de status da IA
 */

'use client'

import { useEffect } from 'react'
import { useAI } from '@/biblioteca/ai/useAI'

/**
 * Props do componente AIProcessor
 */
export interface AIProcessorProps {
  /** Se true, inicializa backend automaticamente ao montar componente */
  autoInitialize?: boolean
  /** Se true, exibe informações de performance (WASM + SIMD) */
  showPerformanceInfo?: boolean
}

export default function AIProcessor({ 
  autoInitialize = true,
  showPerformanceInfo = true 
}: AIProcessorProps) {
  const { isReady, isInitializing, error, initialize, getPerformanceInfo } = useAI()

  /**
   * Auto-inicialização do backend de IA
   * 
   * Comportamento:
   * - Inicializa backend WASM + SIMD automaticamente ao montar
   * - Só inicializa se autoInitialize = true
   * - Evita inicializações duplicadas (verifica isReady e isInitializing)
   * 
   * Performance:
   * - Lazy loading: backend só carrega quando necessário
   * - Não bloqueia renderização inicial
   */
  useEffect(() => {
    if (autoInitialize && !isReady && !isInitializing) {
      initialize()
    }
  }, [autoInitialize, isReady, isInitializing, initialize])

  /**
   * Informações de performance do backend
   * 
   * Contém:
   * - Backend ativo (wasm/cpu)
   * - SIMD habilitado (true/false)
   * - Ganho de performance estimado (20-400x)
   */
  const perfInfo = isReady ? getPerformanceInfo() : null

  return (
    <div className="ai-processor-container">
      {/* Indicador de Status */}
      <div className="flex items-center gap-3">
        {/* LED Indicator */}
        <div className="relative flex items-center">
          {/* Pulso de brilho */}
          {isReady && (
            <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          )}
          
          {/* LED principal */}
          <div className={`
            relative w-3 h-3 rounded-full border-2 transition-all duration-300
            ${isReady ? 'bg-blue-400 border-blue-300 shadow-lg shadow-blue-400/50' : ''}
            ${isInitializing ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50 animate-pulse' : ''}
            ${error ? 'bg-red-400 border-red-300' : ''}
            ${!isReady && !isInitializing && !error ? 'bg-gray-600 border-gray-500' : ''}
          `}></div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col">
          <span className={`
            text-sm font-semibold transition-colors duration-300
            ${isReady ? 'text-blue-300' : ''}
            ${isInitializing ? 'text-yellow-300' : ''}
            ${error ? 'text-red-300' : ''}
            ${!isReady && !isInitializing && !error ? 'text-gray-400' : ''}
          `}>
            {isReady && 'IA Ativa'}
            {isInitializing && 'Inicializando IA...'}
            {error && 'IA Offline'}
            {!isReady && !isInitializing && !error && 'IA Standby'}
          </span>

          {/* Performance Info */}
          {showPerformanceInfo && isReady && perfInfo && (
            <span className="text-xs text-gray-400">
              {perfInfo.estimatedSpeedup}
              {perfInfo.simdEnabled && ' · SIMD'}
            </span>
          )}
        </div>
      </div>

      {/* Error Message (if any) */}
      {error && (
        <div className="mt-2 text-xs text-red-300/80">
          {error}
        </div>
      )}
    </div>
  )
}

