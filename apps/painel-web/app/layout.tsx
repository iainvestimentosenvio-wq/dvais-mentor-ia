import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import FixedLogo from '@/componentes/FixedLogo'
import CometsLayer from '@/componentes/CometsLayer'
import AssistenteWidget from '@/componentes/Assistente/AssistenteWidget'
// Configuração do FontAwesome (deve ser importado antes de qualquer uso)
import '@/biblioteca/fontawesome/config'
// CSS do FontAwesome (global)
import '@fortawesome/fontawesome-svg-core/styles.css'
import WebVitals from './components/WebVitals'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: {
    default: 'DVAi$ - Mentor IA | IA para Investimentos',
    template: '%s | DVAi$ - Mentor IA',
  },
  description:
    'Plataforma de IA que guia você passo a passo nas principais corretoras de investimento',
  keywords: [
    'IA',
    'Inteligência Artificial',
    'Investimentos',
    'Corretoras',
    'Finanças',
    'Mentor IA',
  ],
  authors: [{ name: 'DVAi$ - Mentor IA' }],
  creator: 'DVAi$ - Mentor IA',
  publisher: 'DVAi$ - Mentor IA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'DVAi$ - Mentor IA | IA para Investimentos',
    description:
      'Plataforma de IA que guia você passo a passo nas principais corretoras de investimento',
    siteName: 'DVAi$ - Mentor IA',
    images: [
      {
        url: '/og-image.png', // Criar imagem OG
        width: 1200,
        height: 630,
        alt: 'DVAi$ - Mentor IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DVAi$ - Mentor IA | IA para Investimentos',
    description:
      'Plataforma de IA que guia você passo a passo nas principais corretoras de investimento',
    images: ['/og-image.png'], // Criar imagem OG
    creator: '@dvais_mentor_ia', // Atualizar com Twitter real
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'google-site-verification-code', // Adicionar quando tiver
    // yandex: 'yandex-verification-code', // Adicionar quando tiver
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* CSS Crítico Inline - Above the Fold (melhora FCP) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            *{margin:0;padding:0;box-sizing:border-box}
            html{width:100%;height:100%;scroll-behavior:smooth}
            body{margin:0;padding:0;width:100%;min-width:320px;min-height:100vh;overflow-x:hidden;overflow-y:auto;font-family:var(--font-inter),sans-serif;color:#fff;background:#000514}
            header{position:fixed;top:0;left:0;right:0;z-index:50}
            main{margin:0;padding:0}
          `,
          }}
        />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DVAi$ - Mentor IA" />
        {/* Font Awesome agora é self-hosted (otimizado) */}
      </head>
      <body className="chameleon-bg">
        {/* Sentinel para IntersectionObserver (substitui scroll listener) */}
        <div
          id="top-sentinel"
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, height: 1, width: 1 }}
        />

        {/* Aurora background */}
        <div className="aurora-bg"></div>

        {/* Light beams */}
        <div className="light-beam-1"></div>
        <div className="light-beam-2"></div>
        <div className="light-beam-3"></div>
        <div className="light-beam-4"></div>
        <div className="light-beam-5"></div>

        {/* Comets (highlight + background) */}
        <CometsLayer />

        {/* Logo fixo - não se move durante scroll */}
        <FixedLogo />

        <div className="content-wrapper">{children}</div>

        {/* Widget flutuante do assistente (paginas publicas) */}
        <AssistenteWidget />

        {/* Web Vitals Tracking */}
        <WebVitals />
      </body>
    </html>
  )
}
