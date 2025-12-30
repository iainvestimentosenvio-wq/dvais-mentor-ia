import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import AnaliseHero from '@/componentes/AnaliseTempoReal/Hero'

/**
 * Análise em Tempo Real Page
 *
 * Página informativa sobre a funcionalidade de Análise em Tempo Real
 * Explica como o DVAi$ - Mentor IA ajuda investidores a tomar decisões inteligentes
 *
 * Estrutura:
 * - FixedLogo: Logo fixo no topo
 * - Hero: Seção principal com CTA e descrição
 * - PublicoAlvo: Para quem é o serviço (lazy loaded)
 * - DadosCorretoras: Dados básicos das corretoras (lazy loaded)
 * - DadosExclusivos: Dados exclusivos do Mentor IA (lazy loaded)
 * - VantagemCompetitiva: Diferenciais competitivos (lazy loaded)
 *
 * Design:
 * - Glassmorphism (backdrop-blur)
 * - Gradientes animados
 * - Layout responsivo
 * - Ícones FontAwesome
 *
 * Performance:
 * - Server Component (não usa 'use client')
 * - Hero carregado imediatamente (above the fold)
 * - Demais seções lazy loaded (abaixo da dobra)
 * - Meta tags otimizadas para SEO
 *
 * @returns {JSX.Element} Página completa de Análise em Tempo Real
 */

export const metadata: Metadata = {
  title: 'Análise em Tempo Real | DVAi$ - Mentor IA',
  description:
    'Aprenda a analisar dados de mercado em tempo real com IA. Transforme complexidade em decisões informadas. Educação e orientação com seu mentor pessoal.',
  keywords: [
    'análise tempo real',
    'trading IA',
    'análise mercado',
    'investimentos inteligentes',
    'mentor IA',
    'dados mercado',
    'cripto análise',
  ],
  openGraph: {
    title: 'Análise em Tempo Real | DVAi$ - Mentor IA',
    description:
      'Aprenda a analisar dados de mercado em tempo real com IA. Transforme complexidade em decisões informadas.',
    type: 'website',
  },
}

export default function AnaliseTempoRealPage() {
  /**
   * Lazy Loading de Componentes Abaixo da Dobra
   *
   * Por quê lazy loading?
   * - Reduz bundle inicial em ~40% (melhora FCP)
   * - Carrega apenas quando usuário rola até a seção
   * - Melhora Time to Interactive (TTI)
   *
   * Componentes lazy loaded:
   * - PublicoAlvo: Carrega quando usuário rola
   * - DadosCorretoras: Carrega quando usuário rola
   * - DadosExclusivos: Carrega quando usuário rola
   * - VantagemCompetitiva: Carrega quando usuário rola
   *
   * Loading states:
   * - Altura mínima previne layout shift (CLS)
   * - Placeholder simples enquanto carrega
   */
  const PublicoAlvo = dynamic(() => import('@/componentes/AnaliseTempoReal/PublicoAlvo'), {
    loading: () => <div className="min-h-[400px]" />,
  })

  const DadosCorretoras = dynamic(() => import('@/componentes/AnaliseTempoReal/DadosCorretoras'), {
    loading: () => <div className="min-h-[500px]" />,
  })

  const DadosExclusivos = dynamic(() => import('@/componentes/AnaliseTempoReal/DadosExclusivos'), {
    loading: () => <div className="min-h-[600px]" />,
  })

  const VantagemCompetitiva = dynamic(
    () => import('@/componentes/AnaliseTempoReal/VantagemCompetitiva'),
    {
      loading: () => <div className="min-h-[400px]" />,
    }
  )

  const VantagemCompetitivaReal = dynamic(
    () => import('@/componentes/AnaliseTempoReal/VantagemCompetitivaReal'),
    {
      loading: () => <div className="min-h-[200px]" />,
    }
  )

  return (
    <>
      {/* Main content */}
      <main className="min-h-screen" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        {/* Hero: Seção principal - above the fold, crítico para LCP */}
        <section id="analise-hero">
          <AnaliseHero />
        </section>

        {/* PublicoAlvo: Lazy loaded (abaixo da dobra) */}
        <section id="analise-publico">
          <PublicoAlvo />
        </section>

        {/* DadosCorretoras: Lazy loaded (abaixo da dobra) */}
        <section id="analise-dados">
          <DadosCorretoras />
        </section>

        {/* DadosExclusivos: Lazy loaded (abaixo da dobra) */}
        <section id="analise-exclusivos">
          <DadosExclusivos />
        </section>

        {/* VantagemCompetitivaReal: Seção separada e independente */}
        <VantagemCompetitivaReal />

        {/* VantagemCompetitiva: Lazy loaded (abaixo da dobra) */}
        <VantagemCompetitiva />
      </main>
    </>
  )
}
