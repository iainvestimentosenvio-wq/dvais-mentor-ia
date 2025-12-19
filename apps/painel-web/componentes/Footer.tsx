import Icon from './Icon'

/**
 * Footer Component
 * 
 * Rodapé da aplicação com informações e links
 * - Logo e descrição da marca
 * - Links sociais (preparado para integração)
 * - Links de navegação (Produto, Empresa, Legal)
 * - Copyright e créditos
 * 
 * Estrutura:
 * - 4 colunas em desktop (Brand, Produto, Empresa, Legal)
 * - 1 coluna em mobile (stack vertical)
 * - Links de navegação com smooth scroll (via CSS global)
 * - Links sociais preparados para integração
 * 
 * Performance:
 * - Server Component (compatível com App Router)
 * - Scroll suave via CSS (scroll-behavior: smooth no globals.css)
 * - Lazy loaded na página principal (app/page.tsx)
 * - Não crítico para FCP (abaixo da dobra)
 * 
 * @returns {JSX.Element} Rodapé completo com links e informações
 */
export default function Footer() {

  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Icon name="fas fa-brain" className="text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                DVAi$ - Mentor IA
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma de IA que guia você passo a passo nas principais corretoras de investimento.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/10 transition-all duration-300">
                <Icon name="fab fa-twitter" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/10 transition-all duration-300">
                <Icon name="fab fa-linkedin" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/10 transition-all duration-300">
                <Icon name="fab fa-github" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Funcionalidades</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Preços</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Sobre</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Privacidade</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Termos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 DVAi$ - Mentor IA. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span className="flex items-center">
              <Icon name="fas fa-heart" className="text-red-400 mr-2 animate-pulse" />
              Feito com paixão
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

