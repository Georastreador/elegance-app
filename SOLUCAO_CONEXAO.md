# 🔧 Solução para Problema de Conexão GitHub

## ❌ Erro Encontrado:
```
fatal: unable to access 'https://github.com/Georastreador/elegance-app.git/': Recv failure: Socket is not connected
```

## 🛠️ Soluções Alternativas:

### **Solução 1: Criar Repositório Manualmente no GitHub**

1. **Acesse o GitHub:**
   - Vá para: https://github.com/Georastreador
   - Clique em "New repository" (botão verde)

2. **Configure o Repositório:**
   - Nome: `elegance-app`
   - Descrição: `Analisador de Vestuário com IA - OpenAI GPT-4o e GROQ LLaVA`
   - Marque como **Público**
   - **NÃO** marque "Add a README file"
   - **NÃO** marque "Add .gitignore"
   - **NÃO** marque "Choose a license"
   - Clique em "Create repository"

3. **Após criar, execute:**
   ```bash
   git push -u origin main
   ```

### **Solução 2: Usar SSH (Recomendado)**

1. **Configurar SSH:**
   ```bash
   git remote set-url origin git@github.com:Georastreador/elegance-app.git
   ```

2. **Fazer push:**
   ```bash
   git push -u origin main
   ```

### **Solução 3: Usar GitHub CLI**

1. **Instalar GitHub CLI:**
   ```bash
   brew install gh
   ```

2. **Fazer login:**
   ```bash
   gh auth login
   ```

3. **Criar repositório:**
   ```bash
   gh repo create Georastreador/elegance-app --public --source=. --remote=origin --push
   ```

### **Solução 4: Upload Manual via Interface Web**

1. **Criar repositório vazio no GitHub**
2. **Fazer upload dos arquivos via interface web:**
   - Vá para o repositório criado
   - Clique em "uploading an existing file"
   - Arraste todos os arquivos (exceto .git)
   - Commit: "Initial commit: Elegance APP"

## 📁 Arquivos para Upload:

```
✅ index.html
✅ script.js
✅ style.css
✅ test_api.html
✅ README.md
✅ LICENSE
✅ .gitignore
✅ requirements.txt
✅ instrucoes.txt
✅ env_example.txt
✅ Observações.txt
✅ SETUP_GITHUB.md
```

## 🔍 Verificações de Rede:

### **Teste de Conectividade:**
```bash
# Testar GitHub
curl -I https://github.com

# Testar DNS
nslookup github.com

# Verificar proxy
echo $http_proxy
echo $https_proxy
```

### **Configurações de Rede:**
```bash
# Limpar configurações de proxy
git config --global --unset http.proxy
git config --global --unset https.proxy

# Configurar timeout maior
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
```

## 🚀 Após Resolver a Conexão:

### **Configurar GitHub Pages:**
1. Vá em **Settings** > **Pages**
2. Source: "Deploy from a branch"
3. Branch: "main"
4. **URL:** https://georastreador.github.io/elegance-app/

### **Testar a Aplicação:**
1. Acesse a URL do GitHub Pages
2. Insira sua chave da API
3. Teste com uma foto de roupa

## 📞 Se Nada Funcionar:

1. **Verifique sua conexão com a internet**
2. **Tente usar uma rede diferente**
3. **Verifique se há firewall bloqueando**
4. **Use o upload manual via interface web**

---

**Repositório:** https://github.com/Georastreador/elegance-app
**GitHub Pages:** https://georastreador.github.io/elegance-app/
