import Icon from '@/componentes/Icon'

/**
 * Hero Component - Análise em Tempo Real
 * 
 * Seção principal da página de Análise em Tempo Real
 * - Título impactante com gradiente
 * - Descrição persuasiva
 * - Dois botões CTA: "Começar Agora" e "Ver Vídeo" (placeholder)
 * - Ícone de análise em tempo real
 * 
 * Design:
 * - Glassmorphism (backdrop-blur)
 * - Gradientes animados azul-cyan
 * - Layout responsivo
 * - Animações hover nos botões (CSS puro)
 * 
 * Performance:
 * - Server Component (compatível com App Router)
 * - Não lazy loaded (above the fold, crítico para LCP)
 * - Animações via CSS (sem JavaScript)
 * 
 * @returns {JSX.Element} Hero da página de Análise em Tempo Real
 */
export default function AnaliseHero() {
  return (
    <section className="py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          {/* Ícone principal */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-pulse-slow">
              <Icon name="fas fa-chart-line" className="text-white text-4xl" />
            </div>
          </div>

          {/* Título principal com gradiente */}
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Decisões Inteligentes em Tempo Real
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transforme dados complexos em ações Inteligentes com IA.
            <br />
            <span className="text-blue-400 font-semibold">A Informação Instantânea é o Segredo do Sucesso.</span>
          </p>

          {/* Descrição principal - sem card de fundo */}
          <div className="space-y-6 max-w-5xl mx-auto mt-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center">
              Seu Mentor Financeiro Pessoal
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              O <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DVAi$ - Mentor IA</span> foi desenvolvido para investidores <span className="text-cyan-400 font-semibold">iniciantes e experientes</span> que desejam se destacar no mercado de investimentos financeiros. Ensinamos você a analisar todos os dados fornecidos pelas principais corretoras, e muito mais.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              <span className="text-xl lg:text-2xl font-bold text-white">Não apenas isso:</span> fornecemos análises e cálculos exclusivos para a sua realidade e momento atual do mercado, além de ajudar com dados já fornecidos pela sua plataforma podemos te entregar e ajudar em análise técnica em tempo real, coletando e calculando dados que a maioria das corretoras não te entrega, adicionamos um UP na sua vantagem competitiva, pensamos em seu investimento com respeito onde cada nanosegundo vale dinheiro.
            </p>

              {/* Botões CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              {/* Botão Começar Agora */}
              <a
                href="/login"
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-cyan-300/40 to-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"></div>
                <svg className="relative z-10 w-10 h-10 transform group-hover:translate-y-[-4px] transition-all duration-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="rocketBody" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="rocketNose" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="platform" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4b5563" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#1f2937" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Plataforma de lançamento - estilo SpaceX */}
                  <rect x="4" y="20" width="16" height="2" rx="0.5" fill="url(#platform)"/>
                  <rect x="6" y="21" width="12" height="1" fill="#374151" opacity="0.8"/>
                  <line x1="8" y1="20" x2="8" y2="22" stroke="#6b7280" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="12" y1="20" x2="12" y2="22" stroke="#6b7280" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="16" y1="20" x2="16" y2="22" stroke="#6b7280" strokeWidth="0.5" opacity="0.6"/>
                  
                  {/* Fogo e fumaça - animação no hover - MAIS INTENSO */}
                  <g className="group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                    {/* Fumaça - MUITO MAIS fumaça subindo */}
                    <ellipse cx="8" cy="20" rx="3" ry="2.5" fill="#9ca3af" opacity="0.8" className="group-hover:animate-smoke-rise"/>
                    <ellipse cx="10" cy="20" rx="2.5" ry="2" fill="#6b7280" opacity="0.7" className="group-hover:animate-smoke-rise smoke-delay-1"/>
                    <ellipse cx="12" cy="20" rx="4" ry="3" fill="#4b5563" opacity="0.7" className="group-hover:animate-smoke-rise smoke-delay-2"/>
                    <ellipse cx="14" cy="20" rx="2.5" ry="2" fill="#6b7280" opacity="0.7" className="group-hover:animate-smoke-rise smoke-delay-3"/>
                    <ellipse cx="16" cy="20" rx="3" ry="2.5" fill="#9ca3af" opacity="0.8" className="group-hover:animate-smoke-rise smoke-delay-4"/>
                    <ellipse cx="9" cy="19" rx="2.5" ry="2" fill="#d1d5db" opacity="0.6" className="group-hover:animate-smoke-rise smoke-delay-5"/>
                    <ellipse cx="11" cy="19" rx="3" ry="2" fill="#e5e7eb" opacity="0.6" className="group-hover:animate-smoke-rise smoke-delay-6"/>
                    <ellipse cx="13" cy="19" rx="3" ry="2" fill="#e5e7eb" opacity="0.6" className="group-hover:animate-smoke-rise smoke-delay-7"/>
                    <ellipse cx="15" cy="19" rx="2.5" ry="2" fill="#d1d5db" opacity="0.6" className="group-hover:animate-smoke-rise smoke-delay-8"/>
                    <ellipse cx="10.5" cy="18" rx="2" ry="1.5" fill="#f3f4f6" opacity="0.5" className="group-hover:animate-smoke-rise smoke-delay-9"/>
                    <ellipse cx="13.5" cy="18" rx="2" ry="1.5" fill="#f3f4f6" opacity="0.5" className="group-hover:animate-smoke-rise smoke-delay-10"/>
                    
                    {/* Chama intensa - MAIS fogo */}
                    <path d="M8 20 Q9 16 10 20 Q11 14 12 20 Q13 14 14 20 Q15 16 16 20 Q12 13 12 20" fill="#fbbf24" opacity="1" filter="url(#glow)" className="group-hover:animate-fire-flicker"/>
                    <path d="M9 20 Q10 17 11 20 Q12 15 13 20 Q14 17 15 20 Q12 14 12 20" fill="#f59e0b" opacity="0.95" className="group-hover:animate-fire-flicker fire-delay-1"/>
                    <path d="M9.5 20 Q10.5 18 11.5 20 Q12 16 12.5 20 Q13.5 18 14.5 20 Q12 15 12 20" fill="#dc2626" opacity="0.9" className="group-hover:animate-fire-flicker fire-delay-2"/>
                    <path d="M10 20 Q11 19 12 20 Q12 17 12 20" fill="#ef4444" opacity="0.85" className="group-hover:animate-fire-flicker fire-delay-3"/>
                    <path d="M11 20 Q12 19.5 13 20 Q12 17.5 12 20" fill="#991b1b" opacity="0.8" className="group-hover:animate-fire-flicker fire-delay-4"/>
                  </g>
                  
                  {/* Corpo principal do foguete - estilo Falcon 9 */}
                  <rect x="10" y="6" width="4" height="14" rx="0.5" fill="currentColor" opacity="0.95"/>
                  <rect x="10" y="6" width="4" height="14" rx="0.5" fill="url(#rocketBody)"/>
                  
                  {/* Ponta cônica do foguete */}
                  <path d="M12 2 L10 6 L14 6 Z" fill="currentColor" opacity="0.98"/>
                  <path d="M12 2 L10 6 L12 5.5 Z" fill="url(#rocketNose)"/>
                  
                  {/* Aletas laterais - estilo Falcon 9 */}
                  <path d="M10 18 L8 22 L10 22 L10.5 20 Z" fill="currentColor" opacity="0.9"/>
                  <path d="M14 18 L16 22 L14 22 L13.5 20 Z" fill="currentColor" opacity="0.9"/>
                  
                  {/* Linhas horizontais - detalhes do foguete */}
                  <line x1="10" y1="8" x2="14" y2="8" stroke="#ffffff" strokeWidth="0.3" opacity="0.4"/>
                  <line x1="10" y1="12" x2="14" y2="12" stroke="#ffffff" strokeWidth="0.3" opacity="0.4"/>
                  <line x1="10" y1="16" x2="14" y2="16" stroke="#ffffff" strokeWidth="0.3" opacity="0.4"/>
                  
                  {/* Logo/Janela circular */}
                  <circle cx="12" cy="10" r="1.2" fill="#60a5fa" opacity="0.9"/>
                  <circle cx="12" cy="10" r="0.8" fill="#93c5fd" opacity="0.7"/>
                </svg>
                <span className="relative z-10">Começar Agora</span>
              </a>

              {/* Botão Ver Vídeo (placeholder) */}
              <button
                className="group px-10 py-5 border-2 border-blue-400/50 text-blue-300 rounded-xl font-semibold hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm relative overflow-hidden w-full sm:w-auto"
                aria-label="Ver vídeo explicativo (em breve)"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"></span>
                
                {/* Ícone pequeno - desaparece no hover */}
                <Icon name="fas fa-play" className="relative z-10 transform group-hover:scale-0 group-hover:opacity-0 transition-all duration-300 flex-shrink-0 w-4 h-4" />
                
                {/* Texto "Entenda como Funciona" - desaparece no hover */}
                <span className="relative z-10 group-hover:opacity-0 group-hover:scale-0 transition-all duration-300">Entenda como Funciona</span>
                
                {/* Botão de player grande - aparece no hover (sem alterar tamanho do botão) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 z-20 pointer-events-none">
                  <div className="relative">
                    {/* Círculo de fundo com brilho */}
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:animate-pulse"></div>
                    {/* Ícone de play grande */}
                    <div className="relative bg-blue-500/30 backdrop-blur-sm rounded-full p-4 border-2 border-blue-400/50 group-hover:border-blue-400 transition-all duration-300">
                      <Icon name="fas fa-play" className="text-3xl text-blue-300 transform translate-x-0.5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Badge de destaque - centralizado verticalmente entre botões e próxima seção */}
      <div className="flex items-center justify-center gap-2 mt-16 mb-12">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full">
          <Icon name="fas fa-bolt" className="text-blue-400" />
          <span className="text-sm text-gray-300">
            Análise em Tempo Real • Suporte 24/7 • Sempre Atualizado
          </span>
        </div>
      </div>
    </section>
  )
}
