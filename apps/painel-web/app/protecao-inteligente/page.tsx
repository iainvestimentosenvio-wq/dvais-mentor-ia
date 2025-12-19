import { redirect } from 'next/navigation'

/**
 * Rota alternativa (legado/marketing)
 * Canonical: /seguranca
 */
export default function ProtecaoInteligenteRedirectPage() {
  redirect('/seguranca')
}



