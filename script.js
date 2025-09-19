// Variáveis globais
let stream = null;
let apiKey = null;
let currentAnalysis = null;
let currentAudio = null;
let selectedApi = 'openai'; // 'openai' ou 'groq'

// Elementos DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startCameraBtn = document.getElementById('startCamera');
const analyzeBtn = document.getElementById('analyzeBtn');
const playAudioBtn = document.getElementById('playAudioBtn');
const status = document.getElementById('status');
const audioStatus = document.getElementById('audioStatus');
const itemsList = document.getElementById('itemsList');
const descriptionArea = document.getElementById('descriptionArea');
const apiModal = document.getElementById('apiModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const closeModalBtn = document.getElementById('closeModal');
const apiProviderRadios = document.querySelectorAll('input[name="apiProvider"]');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Verificar se há chave da API salva
    selectedApi = localStorage.getItem('selected_api') || 'openai';
    apiKey = localStorage.getItem(`${selectedApi}_api_key`);
    
    if (!apiKey) {
        showApiModal();
    }
    
    // Event listeners
    startCameraBtn.addEventListener('click', startCamera);
    analyzeBtn.addEventListener('click', analyzeClothing);
    playAudioBtn.addEventListener('click', playAudioDescription);
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    closeModalBtn.addEventListener('click', hideApiModal);
    
    // Event listeners para seleção de API
    apiProviderRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedApi = this.value;
            updateApiKeyPlaceholder();
        });
    });
    
    // Fechar modal clicando fora
    apiModal.addEventListener('click', function(e) {
        if (e.target === apiModal) {
            hideApiModal();
        }
    });
}

// Gerenciamento do modal da API
function showApiModal() {
    // Selecionar a API salva
    const savedApi = localStorage.getItem('selected_api') || 'openai';
    document.querySelector(`input[name="apiProvider"][value="${savedApi}"]`).checked = true;
    selectedApi = savedApi;
    updateApiKeyPlaceholder();
    
    // Carregar chave salva se existir
    const savedKey = localStorage.getItem(`${selectedApi}_api_key`);
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
    
    apiModal.style.display = 'block';
}

function updateApiKeyPlaceholder() {
    if (selectedApi === 'openai') {
        apiKeyInput.placeholder = 'Insira sua chave da API OpenAI (sk-...)';
    } else if (selectedApi === 'groq') {
        apiKeyInput.placeholder = 'Insira sua chave da API GROQ (gsk_...)';
    }
}

function hideApiModal() {
    apiModal.style.display = 'none';
}

function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem(`${selectedApi}_api_key`, key);
        localStorage.setItem('selected_api', selectedApi);
        hideApiModal();
        showStatus(`Chave da API ${selectedApi.toUpperCase()} salva com sucesso!`, 'success');
    } else {
        showStatus('Por favor, insira uma chave válida.', 'error');
    }
}

// Gerenciamento da câmera
async function startCamera() {
    try {
        showStatus('Iniciando câmera...', 'loading');
        
        // Solicitar acesso à câmera
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Câmera traseira preferencialmente
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        
        video.srcObject = stream;
        video.play();
        
        // Habilitar botão de análise
        analyzeBtn.disabled = false;
        startCameraBtn.textContent = 'Câmera Ativa';
        startCameraBtn.disabled = true;
        
        showStatus('Câmera iniciada! Aponte para roupas e clique em "Analisar".', 'success');
        
    } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        showStatus('Erro ao acessar a câmera. Verifique as permissões.', 'error');
    }
}

// Captura de imagem da câmera
function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
}

// Verificar se a chave da API é válida
async function validateApiKey() {
    if (!apiKey) {
        return false;
    }
    
    try {
        let url, headers;
        
        if (selectedApi === 'openai') {
            url = 'https://api.openai.com/v1/models';
            headers = {
                'Authorization': `Bearer ${apiKey}`
            };
        } else if (selectedApi === 'groq') {
            url = 'https://api.groq.com/openai/v1/models';
            headers = {
                'Authorization': `Bearer ${apiKey}`
            };
        }
        
        const response = await fetch(url, { headers });
        return response.ok;
    } catch (error) {
        console.error('Erro ao validar chave da API:', error);
        return false;
    }
}

// Análise de vestuário
async function analyzeClothing() {
    if (!apiKey) {
        showApiModal();
        return;
    }
    
    try {
        showStatus('Verificando chave da API...', 'loading');
        
        // Validar chave da API
        const isValidKey = await validateApiKey();
        if (!isValidKey) {
            showStatus('Chave da API inválida. Verifique sua chave da OpenAI.', 'error');
            showApiModal();
            return;
        }
        
        showStatus('Analisando vestuário...', 'loading');
        analyzeBtn.disabled = true;
        
        // Capturar imagem
        const imageData = captureImage();
        
        if (!imageData) {
            throw new Error('Erro ao capturar imagem da câmera');
        }
        
        console.log('Imagem capturada com sucesso, tamanho:', imageData.length);
        
        // Chamar API de visão (OpenAI ou GROQ)
        const analysis = await callVisionAPI(imageData);
        
        if (analysis) {
            currentAnalysis = analysis;
            displayClothingItems(analysis.items);
            
            // Gerar e reproduzir descrição em áudio
            await generateAndPlayAudio(analysis.summary);
            
            showStatus('Análise concluída!', 'success');
        }
        
    } catch (error) {
        console.error('Erro na análise:', error);
        
        let errorMessage = 'Erro na análise. Tente novamente.';
        
        if (error.message.includes('Chave da API')) {
            errorMessage = error.message;
        } else if (error.message.includes('Limite de requisições')) {
            errorMessage = error.message;
        } else if (error.message.includes('Acesso negado')) {
            errorMessage = error.message;
        } else if (error.message.includes('Requisição inválida')) {
            errorMessage = error.message;
        }
        
        showStatus(errorMessage, 'error');
    } finally {
        analyzeBtn.disabled = false;
    }
}

// Chamada para a API Vision (OpenAI ou GROQ)
async function callVisionAPI(imageData) {
    const prompt = `Analise esta imagem e identifique todos os itens de vestuário visíveis. Para cada item, determine se é tipicamente masculino, feminino ou unissex.

IMPORTANTE: Retorne APENAS um objeto JSON válido, sem formatação markdown, sem blocos de código, sem texto adicional. Apenas o JSON puro.

Estrutura obrigatória:
{
    "summary": "Descrição geral dos itens encontrados em linguagem natural",
    "items": [
        {
            "name": "Nome do item (ex: Camiseta)",
            "category": "masculine|feminine|unisex",
            "description": "Descrição detalhada incluindo estilo, ocasiões de uso e materiais típicos"
        }
    ]
}

Se não houver roupas visíveis, retorne uma lista vazia de items e uma summary explicando isso.`;

    try {
        console.log(`Iniciando chamada para API ${selectedApi.toUpperCase()}...`);
        
        let url, model, requestBody;
        
        if (selectedApi === 'openai') {
            url = 'https://api.openai.com/v1/chat/completions';
            model = 'gpt-4o';
            console.log('Modelo:', model);
            console.log('Tamanho da imagem:', imageData.length, 'caracteres');
            
            requestBody = {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageData,
                                    detail: 'low'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            };
        } else if (selectedApi === 'groq') {
            url = 'https://api.groq.com/openai/v1/chat/completions';
            model = 'llama-3.2-11b-vision-preview';
            console.log('Modelo:', model);
            console.log('Tamanho da imagem:', imageData.length, 'caracteres');
            
            requestBody = {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageData,
                                    detail: 'low'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            };
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro detalhado da API:', errorText);
            
            let errorMessage = `Erro na API: ${response.status}`;
            
            switch (response.status) {
                case 401:
                    errorMessage = 'Chave da API inválida ou expirada. Verifique sua chave da OpenAI.';
                    break;
                case 429:
                    errorMessage = 'Limite de requisições excedido. Tente novamente em alguns minutos.';
                    break;
                case 400:
                    errorMessage = 'Requisição inválida. Verifique o formato da imagem.';
                    break;
                case 403:
                    errorMessage = 'Acesso negado. Verifique se sua conta tem acesso ao modelo GPT-4o.';
                    break;
                default:
                    errorMessage = `Erro na API: ${response.status} - ${errorText}`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Resposta da API recebida:', data);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Resposta inválida da API');
        }
        
        const content = data.choices[0].message.content;
        console.log('Conteúdo da resposta:', content);
        
        // Tentar fazer parse do JSON
        try {
            // Limpar o conteúdo removendo blocos de código markdown
            let cleanContent = content.trim();
            
            // Remover ```json e ``` se existirem
            if (cleanContent.startsWith('```json')) {
                cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanContent.startsWith('```')) {
                cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            console.log('Conteúdo limpo para parsing:', cleanContent);
            
            const parsedContent = JSON.parse(cleanContent);
            console.log('JSON parseado com sucesso:', parsedContent);
            return parsedContent;
        } catch (parseError) {
            console.warn('Erro ao fazer parse do JSON:', parseError);
            console.log('Conteúdo original:', content);
            
            // Tentar extrair JSON usando regex se o parsing direto falhar
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const extractedJson = jsonMatch[0];
                    console.log('JSON extraído com regex:', extractedJson);
                    const parsedContent = JSON.parse(extractedJson);
                    console.log('JSON parseado com regex:', parsedContent);
                    return parsedContent;
                }
            } catch (regexParseError) {
                console.warn('Erro ao fazer parse com regex:', regexParseError);
            }
            
            // Se não conseguir fazer parse, criar estrutura manual
            return {
                summary: content,
                items: []
            };
        }
        
    } catch (error) {
        console.error('Erro na chamada da API Vision:', error);
        throw error;
    }
}

// Exibir itens de vestuário detectados
function displayClothingItems(items) {
    if (!items || items.length === 0) {
        itemsList.innerHTML = '<p class="no-items">Nenhum item de vestuário detectado na imagem.</p>';
        return;
    }
    
    itemsList.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'clothing-item';
        itemElement.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-category category-${item.category}">
                ${getCategoryLabel(item.category)}
            </div>
        `;
        
        itemElement.addEventListener('click', () => {
            selectItem(itemElement, item, index);
        });
        
        itemsList.appendChild(itemElement);
    });
}

// Selecionar item para ver descrição
function selectItem(element, item, index) {
    // Remover seleção anterior
    document.querySelectorAll('.clothing-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Selecionar novo item
    element.classList.add('selected');
    
    // Exibir descrição
    displayItemDescription(item);
}

// Exibir descrição detalhada do item
function displayItemDescription(item) {
    descriptionArea.innerHTML = `
        <h3>${item.name}</h3>
        <div class="description-section">
            <p><strong>Categoria:</strong> ${getCategoryLabel(item.category)}</p>
            <p>${item.description}</p>
        </div>
    `;
}

// Obter label da categoria
function getCategoryLabel(category) {
    const labels = {
        'masculine': 'Masculino',
        'feminine': 'Feminino',
        'unisex': 'Unissex'
    };
    return labels[category] || 'Não classificado';
}

// Gerar e reproduzir áudio
async function generateAndPlayAudio(text) {
    try {
        audioStatus.innerHTML = 'Gerando áudio...';
        playAudioBtn.disabled = true;
        
        // Usar Web Speech API para síntese de voz
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            utterance.onstart = () => {
                audioStatus.innerHTML = 'Reproduzindo descrição...';
            };
            
            utterance.onend = () => {
                audioStatus.innerHTML = '';
                playAudioBtn.disabled = false;
            };
            
            utterance.onerror = (error) => {
                console.error('Erro na síntese de voz:', error);
                audioStatus.innerHTML = 'Erro ao reproduzir áudio';
                playAudioBtn.disabled = false;
            };
            
            speechSynthesis.speak(utterance);
            playAudioBtn.disabled = false;
        } else {
            audioStatus.innerHTML = 'Síntese de voz não suportada neste navegador';
            playAudioBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Erro ao gerar áudio:', error);
        audioStatus.innerHTML = 'Erro ao gerar áudio';
        playAudioBtn.disabled = false;
    }
}

// Reproduzir descrição em áudio
function playAudioDescription() {
    if (currentAnalysis && currentAnalysis.summary) {
        generateAndPlayAudio(currentAnalysis.summary);
    }
}

// Exibir mensagens de status
function showStatus(message, type = '') {
    status.innerHTML = type === 'loading' ? 
        `<span class="loading-spinner"></span>${message}` : 
        message;
    
    status.className = `status-message ${type}`;
    
    // Limpar status após alguns segundos (exceto loading)
    if (type !== 'loading') {
        setTimeout(() => {
            status.innerHTML = '';
            status.className = 'status-message';
        }, 5000);
    }
}

// Limpeza ao sair da página
window.addEventListener('beforeunload', function() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
});

// Tratamento de erros globais
window.addEventListener('error', function(e) {
    console.error('Erro global:', e.error);
    showStatus('Ocorreu um erro inesperado.', 'error');
});

// Verificar suporte a recursos necessários
function checkBrowserSupport() {
    const features = {
        camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        canvas: 'getContext' in document.createElement('canvas'),
        speech: 'speechSynthesis' in window,
        fetch: 'fetch' in window
    };
    
    const unsupported = Object.entries(features)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (unsupported.length > 0) {
        showStatus(`Recursos não suportados: ${unsupported.join(', ')}`, 'error');
    }
    
    return unsupported.length === 0;
}

// Verificar suporte ao carregar
document.addEventListener('DOMContentLoaded', checkBrowserSupport);

