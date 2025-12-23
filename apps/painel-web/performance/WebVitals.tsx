'use client'

import { useEffect } from 'react'

export default function WebVitals() {
  useEffect(() => {
    // Web Vitals tracking (opcional - apenas em produção)
    // Comentado até web-vitals ser instalado
    // if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    //   import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    //     onCLS(console.log)
    //     onFID(console.log)
    //     onFCP(console.log)
    //     onLCP(console.log)
    //     onTTFB(console.log)
    //   }).catch(() => {
    //     // web-vitals não instalado - ignorar
    //   })
    // }
  }, [])

  return null
}

