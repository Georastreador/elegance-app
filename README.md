# Elegance APP - Analisador de Vestuário

Uma aplicação web que utiliza inteligência artificial para analisar e descrever itens de vestuário através da câmera do dispositivo.

## 🚀 Funcionalidades

- **Análise de Imagens**: Captura e analisa roupas usando a câmera do dispositivo
- **IA Vision**: Integração com APIs de visão computacional (OpenAI GPT-4 Vision / GROQ)
- **Classificação**: Categoriza roupas como masculinas, femininas ou unissex
- **Descrições Detalhadas**: Fornece informações sobre estilo, ocasiões de uso e materiais
- **Síntese de Voz**: Reproduz descrições em áudio
- **Interface Responsiva**: Design moderno para mobile e desktop

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python Flask (opcional)
- **APIs**: OpenAI GPT-4 Vision / GROQ LLaVA
- **Recursos**: Web Speech API, Camera API, Canvas

## 📋 Pré-requisitos

- Python 3.8+
- Navegador moderno com suporte a câmera
- Chave da API OpenAI ou GROQ
- Conexão com a internet

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd Elegance_APP
```

### 2. Crie o ambiente virtual
```bash
python3 -m venv venv
```

### 3. Ative o ambiente virtual
```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 4. Instale as dependências
```bash
pip install -r requirements.txt
```

### 5. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env_example.txt .env

# Edite o arquivo .env com suas chaves de API
```

## 🚀 Como Usar

### Modo Web (Frontend apenas)
1. Abra `index.html` em um navegador moderno
2. Insira sua chave da API quando solicitado
3. Clique em "Iniciar Câmera"
4. Aponte para roupas e clique em "Analisar Vestuário"

### Modo Backend (com Flask)
```bash
# Ative o ambiente virtual
source venv/bin/activate

# Execute o servidor Flask
python app.py
```

## 🔑 Configuração de APIs

### OpenAI GPT-4 Vision
1. Obtenha uma chave da API em [OpenAI Platform](https://platform.openai.com/api-keys)
2. Insira a chave na interface da aplicação quando solicitado

### GROQ API
1. Obtenha uma chave da API em [GROQ Console](https://console.groq.com/keys)
2. Insira a chave na interface da aplicação quando solicitado

### ⚠️ Importante sobre Segurança
- **NUNCA** compartilhe suas chaves da API
- As chaves são armazenadas **localmente** no seu navegador
- Cada usuário deve usar **sua própria chave**
- As chaves **não são enviadas** para servidores externos

## 📁 Estrutura do Projeto

```
Elegance_APP/
├── index.html          # Interface principal
├── style.css           # Estilos CSS
├── script.js           # Lógica JavaScript
├── app.py              # Servidor Flask (opcional)
├── requirements.txt    # Dependências Python
├── env_example.txt     # Exemplo de configuração
├── README.md           # Documentação
├── instrucoes.txt      # Instruções de uso
└── venv/               # Ambiente virtual Python
```

## 🔒 Segurança

- A chave da API é armazenada localmente no navegador
- A aplicação funciona apenas com HTTPS ou localhost
- Não compartilhe suas chaves de API

## 🐛 Solução de Problemas

### Câmera não funciona
- Verifique as permissões do navegador
- Use HTTPS ou localhost
- Teste em diferentes navegadores

### Erro de API
- Verifique se a chave está correta
- Confirme se há créditos disponíveis
- Verifique a conexão com a internet

## 📝 Licença

Este projeto é uma demonstração educacional. Use com responsabilidade.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
