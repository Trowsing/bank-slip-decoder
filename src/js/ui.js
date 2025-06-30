/**
 * Bank Slip Decoder - UI Module
 * Handles DOM manipulation, user interactions, and result display
 */

/**
 * Initializes the application
 */
function initializeApp() {
    const digitableLineInput = document.getElementById('digitableLine');
    const decodeButton = document.querySelector('.decode-button');
    
    digitableLineInput.addEventListener('input', function() {
        formatInput(this);
    });
    
    digitableLineInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleDecode();
        }
    });
    
    decodeButton.addEventListener('click', handleDecode);
}

/**
 * Handles the decode button click
 */
function handleDecode() {
    const input = document.getElementById('digitableLine');
    const inputValue = input.value.trim();
    
    const result = decodeDocument(inputValue);
    
    if (!result.success) {
        showError(result.error);
        return;
    }
    
    if (result.type === 'collection') {
        showCollectionResults(result.data);
    } else {
        showBoletoResults(result.data);
    }
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const results = document.getElementById('results');
    results.innerHTML = `
        <div class="result-card error">
            <h3>❌ Erro</h3>
            <p>${message}</p>
        </div>
    `;
    results.style.display = 'block';
}

/**
 * Shows collection document results
 * @param {Object} data - Decoded collection document data
 */
function showCollectionResults(data) {
    const results = document.getElementById('results');
    
    results.innerHTML = `
        <div class="result-card" style="border-left-color: var(--success-color);">
            <h3>📄 ${data.documentType}</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Produto</div>
                    <div class="value">Arrecadação/Recebimento (${data.productId})</div>
                </div>
                <div class="info-item">
                    <div class="label">Segmento</div>
                    <div class="value">${data.segmentDesc}</div>
                </div>
                <div class="info-item">
                    <div class="label">Tipo de Valor</div>
                    <div class="value">${data.valueTypeDesc}</div>
                </div>
                <div class="info-item">
                    <div class="label">Valor do Documento</div>
                    <div class="value">${data.formattedValue}</div>
                </div>
                <div class="info-item">
                    <div class="label">Código da Empresa/Órgão</div>
                    <div class="value">${data.companyId}</div>
                </div>
                <div class="info-item">
                    <div class="label">Dígito Verificador Geral</div>
                    <div class="value">${data.generalDV}</div>
                </div>
            </div>
        </div>
        
        <div class="result-card">
            <h3>🔧 Detalhes Técnicos</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Identificação do Produto</div>
                    <div class="value">${data.productId}</div>
                </div>
                <div class="info-item">
                    <div class="label">Identificação do Segmento</div>
                    <div class="value">${data.segmentId}</div>
                </div>
                <div class="info-item">
                    <div class="label">Identificação do Valor</div>
                    <div class="value">${data.valueTypeId}</div>
                </div>
                <div class="info-item">
                    <div class="label">Valor Bruto</div>
                    <div class="value">${data.value}</div>
                </div>
                <div class="info-item">
                    <div class="label">Campo Livre</div>
                    <div class="value" style="font-family: var(--font-mono)">${data.freeField}</div>
                </div>
            </div>
        </div>
        
        ${generateCollectionStructureBreakdown(data)}
    `;
    
    results.style.display = 'block';
}

/**
 * Shows bank boleto results
 * @param {Object} data - Decoded bank boleto data
 */
function showBoletoResults(data) {
    const results = document.getElementById('results');
    
    const warningsHtml = generateWarningsHtml(data.checkDigitErrors);
    const factorExplanationHtml = generateFactorExplanationHtml(data.dueFactor);
    
    results.innerHTML = `
        ${warningsHtml}
        ${factorExplanationHtml}
        
        <div class="result-card">
            <h3>💰 Informações do Boleto</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Banco Emissor</div>
                    <div class="value">${data.bankName}</div>
                </div>
                <div class="info-item">
                    <div class="label">Código do Banco</div>
                    <div class="value">${data.bankCode}</div>
                </div>
                <div class="info-item">
                    <div class="label">Moeda</div>
                    <div class="value">${data.currencyDesc}</div>
                </div>
                <div class="info-item">
                    <div class="label">Data de Vencimento</div>
                    <div class="value">${data.dueDate}</div>
                </div>
                <div class="info-item">
                    <div class="label">Valor do Documento</div>
                    <div class="value">${data.formattedValue}</div>
                </div>
                <div class="info-item">
                    <div class="label">Dígito Verificador Geral</div>
                    <div class="value">${data.generalDV}</div>
                </div>
            </div>
        </div>
        
        <div class="result-card">
            <h3>🔧 Detalhes Técnicos</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Fator de Vencimento</div>
                    <div class="value">${data.dueFactor}</div>
                </div>
                <div class="info-item">
                    <div class="label">Valor Bruto (centavos)</div>
                    <div class="value">${data.value}</div>
                </div>
                <div class="info-item">
                    <div class="label">Campo Livre</div>
                    <div class="value" style="font-family: var(--font-mono)">${data.freeField}</div>
                </div>
            </div>
        </div>
        
        ${generateBoletoStructureBreakdown(data)}
    `;
    
    results.style.display = 'block';
}

/**
 * Generates warnings HTML for check digit errors
 * @param {Array} checkDigitErrors - Array of check digit error messages
 * @returns {string} HTML string for warnings
 */
function generateWarningsHtml(checkDigitErrors) {
    if (checkDigitErrors.length === 0) return '';
    
    return `
        <div class="result-card warning">
            <h3>⚠️ Avisos de Validação</h3>
            <ul>
                ${checkDigitErrors.map(error => `<li>${error}</li>`).join('')}
            </ul>
            <p><small>Os dígitos verificadores não conferem. Verifique se a linha digitável foi digitada corretamente.</small></p>
        </div>
    `;
}

/**
 * Generates factor explanation HTML
 * @param {string} dueFactor - The due factor
 * @returns {string} HTML string for factor explanation
 */
function generateFactorExplanationHtml(dueFactor) {
    const factor = parseInt(dueFactor);
    
    if (factor < 1000 || factor > 9999) return '';
    
    const newCycleStartDate = new Date('2025-02-22');
    const today = new Date();
    
    if (today >= newCycleStartDate && factor >= 1000 && factor <= 1999) {
        return `
            <div class="result-card" style="border-left-color: var(--info-color);">
                <h3>ℹ️ Informação sobre Fator de Vencimento</h3>
                <p><strong>Nova regra FEBRABAN (FB-009/2023):</strong> A partir de 22/02/2025, o fator de vencimento foi reiniciado para 1000. Este boleto utiliza o novo ciclo de contagem.</p>
                <p><small>Fator ${factor} = ${factor - 1000} dias após 22/02/2025</small></p>
            </div>
        `;
    } else if (factor === 9999) {
        return `
            <div class="result-card" style="border-left-color: var(--warning-color);">
                <h3>⚠️ Fator de Vencimento Máximo</h3>
                <p>Este boleto possui o fator de vencimento máximo (9999) do ciclo original, correspondendo a 21/02/2025.</p>
                <p><small>A partir de 22/02/2025, novos boletos usam fator reiniciado em 1000.</small></p>
            </div>
        `;
    }
    
    return '';
}

/**
 * Generates structure breakdown HTML for collection documents
 * @param {Object} data - Collection document data
 * @returns {string} HTML string for structure breakdown
 */
function generateCollectionStructureBreakdown(data) {
    return `
        <div class="result-card">
            <h3>📋 Estrutura da Linha Digitável (${data.cleanLine.length} dígitos)</h3>
            <div class="structure-breakdown">
                <div style="font-weight: bold; margin-bottom: 15px;">Padrão FEBRABAN de Arrecadação/Recebimento:</div>
                <div style="word-break: break-all; font-size: 1.1em; margin-bottom: 20px;">
                    <span class="color-bank">${data.cleanLine.substring(0, 1)}</span><span class="color-currency">${data.cleanLine.substring(1, 2)}</span><span class="color-field1">${data.cleanLine.substring(2, 3)}</span><span class="color-dv1">${data.cleanLine.substring(3, 4)}</span><span class="color-field2">${data.cleanLine.substring(4, 15)}</span><span class="color-dv2">${data.cleanLine.substring(15, 19)}</span><span class="color-field3">${data.cleanLine.substring(19)}</span>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 1:</div>
                    <div class="field-content color-bank">${data.cleanLine.substring(0, 1)} = Identificação do Produto (8=Arrecadação)</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 2:</div>
                    <div class="field-content color-currency">${data.cleanLine.substring(1, 2)} = Identificação do Segmento</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 3:</div>
                    <div class="field-content color-field1">${data.cleanLine.substring(2, 3)} = Identificação de Valor Real ou Referência</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 4:</div>
                    <div class="field-content color-dv1">${data.cleanLine.substring(3, 4)} = Dígito verificador geral</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 5-15:</div>
                    <div class="field-content color-field2">${data.cleanLine.substring(4, 15)} = Valor (11 dígitos)</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 16-19:</div>
                    <div class="field-content color-dv2">${data.cleanLine.substring(15, 19)} = Identificação da Empresa/Órgão</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 20-${data.cleanLine.length}:</div>
                    <div class="field-content color-field3">${data.cleanLine.substring(19)} = Campo livre de utilização da Empresa/Órgão</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates structure breakdown HTML for bank boletos
 * @param {Object} data - Bank boleto data
 * @returns {string} HTML string for structure breakdown
 */
function generateBoletoStructureBreakdown(data) {
    return `
        <div class="result-card">
            <h3>📋 Estrutura da Linha Digitável</h3>
            <div class="structure-breakdown">
                <div style="font-weight: bold; margin-bottom: 15px;">Linha Digitável (47 dígitos):</div>
                <div style="word-break: break-all; font-size: 1.1em; margin-bottom: 20px;">
                    <span class="color-bank">${data.cleanLine.substring(0, 3)}</span><span class="color-currency">${data.cleanLine.substring(3, 4)}</span><span class="color-field1">${data.cleanLine.substring(4, 9)}</span><span class="color-dv1">${data.cleanLine.substring(9, 10)}</span><span class="color-field2">${data.cleanLine.substring(10, 20)}</span><span class="color-dv2">${data.cleanLine.substring(20, 21)}</span><span class="color-field3">${data.cleanLine.substring(21, 31)}</span><span class="color-dv3">${data.cleanLine.substring(31, 32)}</span><span class="color-general-dv">${data.cleanLine.substring(32, 33)}</span><span class="color-due-factor">${data.cleanLine.substring(33, 37)}</span><span class="color-value">${data.cleanLine.substring(37, 47)}</span>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 1-3:</div>
                    <div class="field-content color-bank">${data.cleanLine.substring(0, 3)} = Código do Banco</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 4:</div>
                    <div class="field-content color-currency">${data.cleanLine.substring(3, 4)} = Código da Moeda (9=Real)</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 5-9:</div>
                    <div class="field-content color-field1">${data.cleanLine.substring(4, 9)} = Primeiras 5 posições do campo livre</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 10:</div>
                    <div class="field-content color-dv1">${data.cleanLine.substring(9, 10)} = Dígito verificador do 1º campo</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 11-20:</div>
                    <div class="field-content color-field2">${data.cleanLine.substring(10, 20)} = 6ª a 15ª posições do campo livre</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 21:</div>
                    <div class="field-content color-dv2">${data.cleanLine.substring(20, 21)} = Dígito verificador do 2º campo</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 22-31:</div>
                    <div class="field-content color-field3">${data.cleanLine.substring(21, 31)} = 16ª a 25ª posições do campo livre</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 32:</div>
                    <div class="field-content color-dv3">${data.cleanLine.substring(31, 32)} = Dígito verificador do 3º campo</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posição 33:</div>
                    <div class="field-content color-general-dv">${data.cleanLine.substring(32, 33)} = Dígito verificador geral</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 34-37:</div>
                    <div class="field-content color-due-factor">${data.cleanLine.substring(33, 37)} = Fator de vencimento</div>
                </div>
                
                <div class="field-explanation">
                    <div class="field-label">Posições 38-47:</div>
                    <div class="field-content color-value">${data.cleanLine.substring(37, 47)} = Valor do título (em centavos)</div>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initializeApp);

function decodeBoleto() {
    handleDecode();
}