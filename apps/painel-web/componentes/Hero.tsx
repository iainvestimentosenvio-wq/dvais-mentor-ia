'use client'

import Link from 'next/link'
import Icon from './Icon'
import AIProcessor from './AIProcessor'
import RocketIcon from './RocketIcon'

export default function Hero() {

  return (
    <section id="hero-content" className="relative pb-32 pt-24 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8 text-center lg:text-left">
            {/* AI Status Indicator */}
            <div className="flex justify-center lg:justify-start mb-6">
              <AIProcessor autoInitialize={false} showPerformanceInfo={true} />
            </div>
            
            {/* Subtitle */}
            <div className="text-sm lg:text-base text-blue-300 font-semibold uppercase tracking-wider">
              Seu guia de investimentos
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Invista com <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient-shift">confiança</span>.<br />
              Deixe <span className="text-gradient-dvais">DVAi$</span> guiar você.
            </h1>
            
            {/* Description */}
            <p className="text-base lg:text-lg text-gray-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Nossa plataforma usa um assistente de IA em tempo real para te guiar passo a passo nas principais corretoras de investimento, transformando complexidade em segurança.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/cadastro"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-base shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-cyan-300/40 to-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <RocketIcon className="relative z-10 w-6 h-6 transform group-hover:translate-y-[-4px] transition-all duration-500 flex-shrink-0" />
                <span className="relative z-10">Começar Agora</span>
              </Link>
              <button
                className="group px-8 py-4 border-2 border-blue-400/50 text-blue-300 rounded-xl font-semibold hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"></span>
                
                {/* Ícone pequeno - desaparece no hover */}
                <Icon name="fas fa-play" className="relative z-10 transform group-hover:scale-0 group-hover:opacity-0 transition-all duration-300 flex-shrink-0 w-4 h-4" />
                
                {/* Texto "Ver Vídeo" - desaparece no hover */}
                <span className="relative z-10 group-hover:opacity-0 group-hover:scale-0 transition-all duration-300">Ver Vídeo</span>
                
                {/* Botão de player grande - aparece no hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 z-20">
                  <div className="relative">
                    {/* Círculo de fundo com brilho */}
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:animate-pulse"></div>
                    {/* Ícone de play grande */}
                    <div className="relative bg-blue-500/30 backdrop-blur-sm rounded-full p-2.5 border-2 border-blue-400/50 group-hover:border-blue-400 transition-all duration-300">
                      <Icon name="fas fa-play" className="text-xl text-blue-300 transform translate-x-0.5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex justify-center lg:justify-end">
            {/* Avatar Container */}
            <div className="relative group w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative glass-intense border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-400/5 to-blue-500/10 rounded-2xl animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}></div>
                
                {/* Container Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-blue-400/40 shadow-2xl shadow-blue-500/30"></div>
                
                {/* Avatar Placeholder */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative w-48 h-48 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-full border-2 border-blue-400/50 flex items-center justify-center animate-float shadow-2xl shadow-blue-500/20">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-40 animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="fas fa-brain" className="text-5xl text-blue-300/50" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Wireframe Elements */}
                  <div className="flex space-x-3">
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                    <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full animate-pulse shadow-lg shadow-cyan-300/50" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-gray-300 text-sm font-medium">
                      Avatar 3D Interativo
                    </p>
                    <p className="text-blue-400 text-xs">
                      <Icon name="fas fa-bolt" className="mr-1" />
                      Assistente de IA em tempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

