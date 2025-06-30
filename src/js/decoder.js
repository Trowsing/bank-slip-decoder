/**
 * Bank Slip Decoder - Core Decoding Module
 * Handles the main decoding logic for bank slips and collection documents
 */

/**
 * Bank codes mapping for major Brazilian banks
 */
const bankCodes = {
    '001': 'Banco do Brasil S.A.',
    '033': 'Banco Santander (Brasil) S.A.',
    '104': 'Caixa Econômica Federal',
    '237': 'Banco Bradesco S.A.',
    '341': 'Itaú Unibanco S.A.',
    '077': 'Banco Inter S.A.',
    '260': 'Nu Pagamentos S.A. – Nubank',
    '290': 'Pagseguro Internet S.A. – PagBank',
    '336': 'Banco C6 S.A – C6 Bank',
    '380': 'PicPay',
    '422': 'Banco Safra S.A.',
    '623': 'Banco PAN S.A.',
    '208': 'Banco BTG Pactual S.A.',
    '212': 'Banco Original S.A.',
    '040': 'Banco Cargill S.A.',
    '041': 'Banco do Estado do Rio Grande do Sul S.A.',
    '070': 'BRB – Banco de Brasília S.A.',
    '318': 'Banco BMG S.A.',
    '389': 'Banco Mercantil do Brasil S.A.',
    '748': 'Banco Cooperativo Sicredi S.A.',
    '756': 'Banco Cooperativo do Brasil S.A. – BANCOOB'
};

/**
 * Collection document segments mapping
 */
const collectionSegments = {
    '1': 'Prefeituras',
    '2': 'Saneamento',
    '3': 'Energia Elétrica e Gás',
    '4': 'Telecomunicações',
    '5': 'Órgãos Governamentais',
    '6': 'Carnes e Assemelhados ou demais Empresas/Órgãos (CNPJ)',
    '7': 'Multas de trânsito',
    '9': 'Uso exclusivo do banco'
};

/**
 * Value types for collection documents
 */
const valueTypes = {
    '6': 'Valor efetivo em reais (módulo 10)',
    '7': 'Quantidade de moeda ou valor de referência (módulo 10)', 
    '8': 'Valor efetivo em reais (módulo 11)',
    '9': 'Quantidade de moeda ou valor de referência (módulo 11)'
};

/**
 * Calculates due date based on due factor according to FEBRABAN FB-009/2023
 * @param {string} dueFactor - The 4-digit due factor
 * @returns {string} Formatted due date or special message
 */
function calculateDueDate(dueFactor) {
    // Base dates for calculation according to FEBRABAN FB-009/2023
    const originalBaseDate = new Date('1997-10-07');
    const transitionDate = new Date('2025-02-21');
    const newCycleStartDate = new Date('2025-02-22');
    
    if (dueFactor === '0000') {
        return 'Sem vencimento (à vista)';
    }
    
    const factor = parseInt(dueFactor);
    
    if (factor === 0) {
        return 'Sem vencimento';
    }
    
    let calculatedDate;
    
    // FEBRABAN FB-009/2023: Factor cycle change on Feb 22, 2025
    if (factor >= 1000 && factor <= 9999) {
        const originalCycleDate = new Date(originalBaseDate);
        originalCycleDate.setDate(originalCycleDate.getDate() + factor);
        
        const newCycleDate = new Date('2025-02-22T12:00:00');
        const daysToAdd = factor - 1000;
        const newCycleDateResult = new Date(newCycleDate);
        newCycleDateResult.setUTCDate(newCycleDateResult.getUTCDate() + daysToAdd);
        
        // Decision logic: if original cycle date is after Feb 21, 2025, use new cycle
        // OR if we're currently past the transition date and factor is in reasonable new cycle range
        const today = new Date();
        const shouldUseNewCycle = originalCycleDate > transitionDate || 
                                (today >= newCycleStartDate && factor >= 1000 && factor <= 2000);
        
        if (shouldUseNewCycle) {
            calculatedDate = newCycleDateResult;
        } else {
            calculatedDate = originalCycleDate;
        }
    } else {
        calculatedDate = new Date(originalBaseDate);
        calculatedDate.setDate(calculatedDate.getDate() + factor);
    }
    
    return calculatedDate.toLocaleDateString('pt-BR');
}

/**
 * Formats value to Brazilian currency format
 * @param {string} value - The value string to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    if (!value || value === '0000000000' || value === '00000000000') {
        return 'R$ 0,00';
    }
    
    const numValue = parseInt(value) / 100;
    return numValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Decodes a collection document (GNRE, etc.)
 * @param {string} cleanLine - The clean digitable line
 * @returns {Object} Decoded collection document data
 */
function decodeCollectionDocument(cleanLine) {
    const productId = cleanLine.substring(0, 1);
    const segmentId = cleanLine.substring(1, 2);
    const valueTypeId = cleanLine.substring(2, 3);
    const generalDV = cleanLine.substring(3, 4);
    const value = cleanLine.substring(4, 15);
    const companyId = cleanLine.substring(15, 19);
    const freeField = cleanLine.substring(19);
    
    const segmentDesc = collectionSegments[segmentId] || `Segmento ${segmentId} (não identificado)`;
    const valueTypeDesc = valueTypes[valueTypeId] || `Tipo ${valueTypeId} (não identificado)`;
    
    const formattedValue = formatCurrency(value.padStart(10, '0'));
    
    return {
        productId,
        segmentId,
        segmentDesc,
        valueTypeId,
        valueTypeDesc,
        generalDV,
        value,
        formattedValue,
        companyId,
        freeField,
        cleanLine,
        documentType: 'GNRE/Arrecadação'
    };
}

/**
 * Decodes a bank boleto
 * @param {string} cleanLine - The clean digitable line
 * @returns {Object} Decoded bank boleto data
 */
function decodeBankBoleto(cleanLine) {
    const checkDigitErrors = validateCheckDigits(cleanLine);
    
    const bankCode = cleanLine.substring(0, 3);
    const currencyCode = cleanLine.substring(3, 4);
    const generalDV = cleanLine.substring(32, 33);
    const dueFactor = cleanLine.substring(33, 37);
    const value = cleanLine.substring(37, 47);
    
    const freeField = cleanLine.substring(4, 9) + cleanLine.substring(10, 20) + cleanLine.substring(21, 31);
    
    const bankName = bankCodes[bankCode] || `Banco não identificado (${bankCode})`;
    const dueDate = calculateDueDate(dueFactor);
    const formattedValue = formatCurrency(value);
    const currencyDesc = currencyCode === '9' ? 'Real (R$)' : `Outras moedas (${currencyCode})`;
    
    return {
        bankCode,
        bankName,
        currencyCode,
        currencyDesc,
        generalDV,
        dueFactor,
        dueDate,
        value,
        formattedValue,
        freeField,
        cleanLine,
        checkDigitErrors,
        documentType: 'Boleto Bancário'
    };
}

/**
 * Main decode function that determines document type and routes to appropriate decoder
 * @param {string} inputValue - The raw input value
 * @returns {Object} Decode result with success/error information
 */
function decodeDocument(inputValue) {
    if (!inputValue) {
        return {
            success: false,
            error: 'Por favor, insira uma linha digitável.'
        };
    }
    
    const validation = validateDigitableLineStructure(inputValue);
    if (!validation.valid) {
        return {
            success: false,
            error: validation.error
        };
    }
    
    const cleanLine = validation.cleanLine;
    
    const isCollection = cleanLine.length === 48 || cleanLine.substring(0, 1) === '8';
    
    if (isCollection) {
        return {
            success: true,
            data: decodeCollectionDocument(cleanLine),
            type: 'collection'
        };
    } else {
        return {
            success: true,
            data: decodeBankBoleto(cleanLine),
            type: 'boleto'
        };
    }
}

