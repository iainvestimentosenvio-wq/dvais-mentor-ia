import Icon from '@/componentes/Icon'

/**
 * Funcionamento
 *
 * Placeholder para “ver funcionamento” (sem modal e sem libs pesadas).
 * Preparado para incluir vídeo nativo no futuro (sem preload pesado).
 */
export default function Funcionamento() {
  const passos = [
    'Você define suas preferências e objetivos (com consentimento).',
    'O sistema sugere checklists e alertas para reduzir risco operacional.',
    'No Guia Financeiro (opcional), você informa dados e recebe relatório mensal e limites sugeridos.',
  ]

  return (
    <section id="funcionamento" className="py-20 px-4 lg:px-8 scroll-mt-24" aria-labelledby="funcionamento-title">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="funcionamento-title" className="text-3xl lg:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Ver funcionamento
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explicação leve e direta — sem bibliotecas pesadas de vídeo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Placeholder de vídeo */}
          <div className="group relative glass-intense border border-white/10 rounded-2xl p-8 shadow-2xl card-glow-hover overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-60" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-sm text-blue-300 mb-6">
                  <Icon name="fas fa-play" className="text-blue-300" aria-hidden="true" />
                  Vídeo (em breve)
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Demonstração do fluxo</h3>
                <p className="text-gray-300 leading-relaxed">
                  Nesta etapa, deixamos a seção preparada para um vídeo nativo e leve. Quando entrar, usaremos <span className="text-cyan-200 font-semibold">HTML5 &lt;video&gt;</span> com
                  <span className="text-cyan-200 font-semibold"> preload=&quot;metadata&quot;</span> (sem baixar o vídeo inteiro).
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Icon name="fas fa-play" className="text-white text-xl" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-400">
                  Placeholder pronto para inserir mídia depois, sem impactar LCP agora.
                </p>
              </div>
            </div>
          </div>

          {/* Passos / checklist */}
          <div className="glass-intense border border-blue-400/15 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Como a proteção se encaixa no dia a dia</h3>
            <ul className="space-y-4">
              {passos.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Icon name="fas fa-check-circle" className="text-cyan-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-300 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 rounded-xl border border-white/10 bg-blue-500/5">
              <div className="flex items-start gap-3">
                <Icon name="fas fa-shield-alt" className="text-cyan-300 mt-1" aria-hidden="true" />
                <p className="text-sm text-gray-300">
                  Sem promessas de retorno. A ferramenta apoia com estrutura e transparência — a decisão final é sempre sua.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/login"
                className="group px-7 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                aria-label="Começar agora (ir para login)"
              >
                <Icon name="fas fa-rocket" className="text-white" aria-hidden="true" />
                Começar Agora
              </a>
              <a
                href="#guia-financeiro"
                className="group px-7 py-4 border-2 border-cyan-400/40 text-cyan-200 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
                aria-label="Ir para Guia Financeiro"
              >
                <Icon name="fas fa-arrow-right" className="text-cyan-300" aria-hidden="true" />
                Ver Guia Financeiro
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



