# 📱 Como Acessar a Página de Outro Dispositivo na Mesma Rede

## 🎯 Objetivo

Permitir que você visualize a página Next.js em outro dispositivo (celular, tablet, outro computador) que está na mesma rede Wi-Fi.

---

## ✅ Passo 1: Configurar o Servidor para Aceitar Conexões Externas

O servidor Next.js já está configurado para aceitar conexões de outros dispositivos!

**Script configurado:**
```json
"dev": "next dev -H 0.0.0.0"
```

Isso permite que o servidor aceite conexões de qualquer dispositivo na rede.

---

## ✅ Passo 2: Encontrar o IP Local do Seu Computador

### No Windows (PowerShell):

1. **Abrir PowerShell:**
   - Pressione `Win + X`
   - Clique em "Windows PowerShell" ou "Terminal"

2. **Executar comando:**
   ```powershell
   ipconfig
   ```

3. **Procurar por:**
   - **"Adaptador Ethernet"** ou **"Adaptador de LAN sem fio Wi-Fi"**
   - Procure por **"IPv4"** ou **"Endereço IPv4"**
   - O IP será algo como: `192.168.1.100` ou `192.168.0.50`

### Exemplo de saída:
```
Adaptador de LAN sem fio Wi-Fi:

   Endereço IPv4. . . . . . . . . . . . . . . . . . . . : 192.168.1.100
   Máscara de Sub-rede . . . . . . . . . . . . . . . . . : 255.255.255.0
```

**Seu IP local é:** `192.168.1.100` (use o seu!)

---

## ✅ Passo 3: Iniciar o Servidor

1. **Abrir terminal no Cursor:**
   - Pressione `Ctrl + '`

2. **Ir para a pasta do projeto:**
   ```bash
   cd apps/painel-web
   ```

3. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

4. **Aguardar inicialização:**
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000
   ✓ Ready in 2.5s
   ```

**IMPORTANTE:** 
- ✅ **NÃO FECHE O TERMINAL!**
- ✅ O servidor precisa continuar rodando
- ✅ Anote o IP que aparece em "Network"

---

## ✅ Passo 4: Acessar de Outro Dispositivo

### No Celular/Tablet/Outro Computador:

1. **Conectar na mesma rede Wi-Fi:**
   - Certifique-se de que o dispositivo está na mesma rede Wi-Fi do computador

2. **Abrir navegador:**
   - Chrome, Safari, Firefox, etc.

3. **Digitar o endereço:**
   ```
   http://192.168.1.100:3000
   ```
   **Substitua `192.168.1.100` pelo IP do seu computador!**

4. **Acessar:**
   - Pressione Enter
   - A página deve carregar!

---

## 🔍 Como Descobrir o IP Automaticamente

### Opção 1: Ver no Terminal do Next.js

Quando você executa `npm run dev`, o Next.js mostra automaticamente:

```
- Network:      http://192.168.1.100:3000
```

**Use esse IP!**

### Opção 2: Comando Rápido (PowerShell)

```powershell
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*"}).IPAddress
```

Isso mostra o IP diretamente.

---

## ⚠️ Problemas Comuns

### Problema 1: "Não consegue conectar"

**Soluções:**
- ✅ Verifique se ambos os dispositivos estão na mesma rede Wi-Fi
- ✅ Verifique se o firewall do Windows não está bloqueando
- ✅ Certifique-se de que o servidor está rodando (`npm run dev`)
- ✅ Verifique se o IP está correto

### Problema 2: Firewall bloqueando

**Solução:**
1. Abra "Firewall do Windows Defender"
2. Clique em "Permitir um aplicativo pelo firewall"
3. Procure por "Node.js" e marque "Privado"
4. Ou desative temporariamente o firewall para testar

### Problema 3: IP muda toda vez

**Solução:**
- Configure um IP estático no roteador
- Ou use um serviço como `ngrok` para criar um link permanente

---

## 🚀 Comando Rápido para Descobrir IP

Crie um arquivo `descobrir-ip.ps1` na pasta `Painel_Web`:

```powershell
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*"}).IPAddress
Write-Host "Seu IP local é: $ip"
Write-Host "Acesse de outro dispositivo: http://$ip:3000"
```

Execute:
```bash
powershell -ExecutionPolicy Bypass -File descobrir-ip.ps1
```

---

## 📋 Checklist Rápido

Antes de acessar de outro dispositivo:

- [ ] Servidor rodando (`npm run dev`)
- [ ] IP local descoberto (`ipconfig` ou ver no terminal)
- [ ] Ambos os dispositivos na mesma rede Wi-Fi
- [ ] Firewall permitindo conexões (se necessário)
- [ ] URL correta: `http://SEU_IP:3000`

---

## 🎉 Pronto!

Agora você pode:
- ✅ Ver a página no celular
- ✅ Testar responsividade em tempo real
- ✅ Mostrar para outras pessoas na mesma rede
- ✅ Hot reload funciona em todos os dispositivos!

**Dica:** Salve o IP em um lugar fácil de acessar para não precisar descobrir toda vez!












