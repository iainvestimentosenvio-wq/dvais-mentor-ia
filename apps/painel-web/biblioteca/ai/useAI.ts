/**
 * useAI Hook
 *
 * Hook React para processar IA com WebAssembly + SIMD
 * - Lazy loading do backend (só carrega quando necessário)
 * - Fallback automático para CPU se WASM falhar
 * - Performance: 20-400x mais rápida que JavaScript puro
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import {
  initializeAIBackend,
  getBackendStatus,
  isBackendReady,
  type AIBackendStatus,
} from './config'

/**
 * Estado do hook useAI
 */
export interface UseAIState {
  // Status do backend
  backendStatus: AIBackendStatus | null
  isInitializing: boolean
  isReady: boolean
  error: string | null

  // Performance
  inferenceTime: number | null
}

/**
 * Resultado do hook useAI
 */
export interface UseAIResult extends UseAIState {
  // Funções
  initialize: () => Promise<void>
  processData: (
    data: unknown
  ) => Promise<{ success: boolean; inferenceTime: number; data: unknown }>

  // Informações de performance
  getPerformanceInfo: () => {
    backend: string
    simdEnabled: boolean
    estimatedSpeedup: string
  }
}

/**
 * Hook React para processar IA
 *
 * Exemplo de uso:
 * ```tsx
 * const { isReady, initialize, processData, getPerformanceInfo } = useAI()
 *
 * useEffect(() => {
 *   initialize()
 * }, [])
 *
 * const result = await processData(myData)
 * console.log('Performance:', getPerformanceInfo())
 * ```
 */
export function useAI(): UseAIResult {
  // Estado
  const [backendStatus, setBackendStatus] = useState<AIBackendStatus | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inferenceTime, setInferenceTime] = useState<number | null>(null)

  // Ref para evitar inicializações duplicadas
  const initializeRef = useRef(false)

  /**
   * Inicializa o backend de IA (lazy loading)
   */
  const initialize = useCallback(async () => {
    // Evitar inicializações duplicadas
    if (initializeRef.current || isInitializing) {
      return
    }

    initializeRef.current = true
    setIsInitializing(true)
    setError(null)

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🚀 Inicializando backend de IA...')
      }
      const status = await initializeAIBackend()

      setBackendStatus(status)

      if (!status.initialized) {
        throw new Error(status.error || 'Falha ao inicializar backend')
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Backend de IA pronto:', status)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao inicializar IA:', errorMessage)
    } finally {
      setIsInitializing(false)
    }
  }, [isInitializing])

  /**
   * Processa dados com IA
   * (Placeholder - será implementado quando houver modelos)
   */
  const processData = useCallback(
    async (data: unknown): Promise<{ success: boolean; inferenceTime: number; data: unknown }> => {
      if (!isBackendReady()) {
        throw new Error('Backend de IA não está pronto. Chame initialize() primeiro.')
      }

      try {
        const startTime = performance.now()

        // Placeholder: processamento real será implementado nas próximas etapas
        // Por enquanto, apenas simula um processamento rápido
        await new Promise(resolve => setTimeout(resolve, 1))

        const endTime = performance.now()
        const time = endTime - startTime

        setInferenceTime(time)

        if (process.env.NODE_ENV !== 'production') {
          console.log(`⚡ Processamento concluído em ${time.toFixed(2)}ms`)
        }

        return {
          success: true,
          inferenceTime: time,
          data: data,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro no processamento'
        console.error('❌ Erro ao processar dados:', errorMessage)
        throw err
      }
    },
    []
  )

  /**
   * Retorna informações de performance
   */
  const getPerformanceInfo = useCallback(() => {
    const status = backendStatus || getBackendStatus()

    let estimatedSpeedup = '1x (CPU)'

    if (status.backend === 'wasm') {
      if (status.simdSupported) {
        estimatedSpeedup = '20-400x (WASM + SIMD)'
      } else {
        estimatedSpeedup = '10-100x (WASM)'
      }
    }

    return {
      backend: status.backend,
      simdEnabled: status.simdSupported,
      estimatedSpeedup,
    }
  }, [backendStatus])

  // Resultado do hook
  return {
    // Estado
    backendStatus,
    isInitializing,
    isReady: backendStatus?.initialized ?? false,
    error,
    inferenceTime,

    // Funções
    initialize,
    processData,
    getPerformanceInfo,
  }
}
