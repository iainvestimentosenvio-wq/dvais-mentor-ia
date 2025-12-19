import Icon from '@/componentes/Icon'

/**
 * GuiaFinanceiro (Segurança do Orçamento)
 *
 * Módulo opcional (add-on) que ajuda o usuário a investir com mais segurança
 * conforme a realidade atual: receitas/despesas/lucros/prejuízos/objetivos.
 *
 * Nesta etapa: apenas apresentação (copy + cards). Sem coleta de dados.
 */
export default function GuiaFinanceiro() {
  const exemplos = [
    {
      title: 'Mês com gasto alto + prejuízo recente',
      description:
        'Ex.: despesas de saúde aumentaram e houve prejuízo recente. Sugestão: reduzir exposição, priorizar segurança/caixa e revisar limites antes de novas entradas.',
      icon: 'fas fa-shield-alt',
    },
    {
      title: 'Herança + morar de aluguel',
      description:
        'Ex.: entrada de capital relevante e moradia de aluguel. Orientação: considerar objetivos (reserva, moradia, estabilidade) antes de concentrar tudo em cripto.',
      icon: 'fas fa-lightbulb',
    },
  ]

  return (
    <section className="py-20 px-4 lg:px-8" aria-labelledby="guia-financeiro">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-sm text-cyan-300 font-medium backdrop-blur-sm mb-6">
            <Icon name="fas fa-star" className="text-cyan-300" aria-hidden="true" />
            Add-on opcional
          </div>
          <h2 id="guia-financeiro" className="text-3xl lg:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Guia Financeiro (Segurança do Orçamento)
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Um módulo opcional que ajuda você a investir com mais segurança conforme sua realidade atual
            (receitas, despesas, lucros, prejuízos e objetivos). Ele pode gerar um relatório mensal e sugerir limites de
            exposição e risco com base no que você informar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {exemplos.map((e) => (
            <div
              key={e.title}
              className="group relative glass-intense border border-cyan-400/20 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/40 hover:shadow-cyan-500/20 card-glow-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 space-y-5">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-all duration-300">
                  <Icon name={e.icon} className="text-white text-xl" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{e.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{e.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini-bloco de transparência/disclaimer */}
        <div className="mt-10">
          <div className="glass-intense border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <Icon name="fas fa-shield-alt" className="text-cyan-300 mt-1" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="text-white font-semibold">Transparência:</span> análise automatizada e educacional baseada em dados fornecidos pelo usuário.
                  A decisão final é sempre do usuário. Não há promessas de retorno. Não é consultoria financeira regulada.
                </p>
                <p className="text-xs text-gray-400">
                  Nesta página pública, nada é coletado/armazenado: é apenas uma apresentação do módulo (em breve).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA (apresentação) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/login"
            className="group px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-xl font-semibold shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
            aria-label="Saiba mais e ativar (em breve)"
          >
            <Icon name="fas fa-arrow-right" className="text-white" aria-hidden="true" />
            Saiba mais / Ativar (em breve)
          </a>
          <a
            href="#funcionamento"
            className="group px-8 py-4 border-2 border-cyan-400/40 text-cyan-200 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto backdrop-blur-sm"
            aria-label="Ver funcionamento do módulo"
          >
            <Icon name="fas fa-play" className="text-cyan-300" aria-hidden="true" />
            Ver funcionamento
          </a>
        </div>
      </div>
    </section>
  )
}


