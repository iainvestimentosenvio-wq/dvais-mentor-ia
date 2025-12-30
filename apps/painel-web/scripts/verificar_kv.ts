/**
 * Script para Verificar Status do Vercel KV
 * 
 * Verifica se KV está configurado e funcionando
 * Execute: npx ts-node scripts/verificar_kv.ts
 */

import { checkKVHealth } from '../biblioteca/cache/kvCache'

async function verificarKV() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('🔍 VERIFICAÇÃO DO VERCEL KV')
  console.log('═══════════════════════════════════════════════════════')
  console.log('')

  // Verificar variáveis de ambiente
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN

  console.log('📋 Variáveis de Ambiente:')
  console.log(`  KV_REST_API_URL: ${kvUrl ? '✅ Configurado' : '❌ Não configurado'}`)
  console.log(`  KV_REST_API_TOKEN: ${kvToken ? '✅ Configurado' : '❌ Não configurado'}`)
  console.log('')

  // Verificar saúde do KV
  console.log('🏥 Saúde do KV:')
  const health = await checkKVHealth()
  
  if (!health.configured) {
    console.log('  ⚠️  KV não está configurado')
    console.log('  ✅ Sistema funcionando com fallback em memória')
    console.log('  📝 Para habilitar KV compartilhado:')
    console.log('     1. Criar KV no Vercel Dashboard')
    console.log('     2. Configurar variáveis de ambiente')
    console.log('     3. Fazer deploy')
  } else if (!health.available) {
    console.log('  ⚠️  KV configurado mas não disponível')
    console.log('  ✅ Sistema funcionando com fallback em memória')
    console.log('  📝 Verificar conexão com Vercel KV')
  } else {
    console.log('  ✅ KV configurado e funcionando')
    console.log(`  ⚡ Latência: ${health.latency}ms`)
    console.log('  ✅ Sistema usando KV compartilhado')
  }

  console.log('')
  console.log('═══════════════════════════════════════════════════════')
  console.log('📊 RESUMO:')
  console.log('═══════════════════════════════════════════════════════')
  console.log('')
  
  if (!health.configured) {
    console.log('✅ Sistema FUNCIONANDO (fallback em memória)')
    console.log('⚠️  Rate limiting e Circuit Breaker NÃO compartilhados')
    console.log('📝 Configure KV para habilitar compartilhamento')
  } else if (!health.available) {
    console.log('✅ Sistema FUNCIONANDO (fallback em memória)')
    console.log('⚠️  KV não disponível - verificar configuração')
  } else {
    console.log('✅ Sistema FUNCIONANDO com KV compartilhado')
    console.log('✅ Rate limiting compartilhado entre instâncias')
    console.log('✅ Circuit breaker compartilhado entre instâncias')
  }
  
  console.log('')
  console.log('═══════════════════════════════════════════════════════')
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  verificarKV().catch(console.error)
}

export { verificarKV }





