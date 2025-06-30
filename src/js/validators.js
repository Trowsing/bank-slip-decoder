/**
 * Bank Slip Decoder - Validation Module
 * Handles input validation and check digit calculations
 */

/**
 * Validates the structure of a digitable line
 * @param {string} line - The input line to validate
 * @returns {Object} Validation result with valid boolean and cleanLine or error
 */
function validateDigitableLineStructure(line) {
    const cleanLine = line.replace(/\D/g, '');
    
    if (cleanLine.length !== 47 && cleanLine.length !== 48) {
        return {
            valid: false,
            error: `Linha digitável deve conter 47 dígitos (boleto bancário) ou 48 dígitos (arrecadação/GNRE). Encontrados: ${cleanLine.length} dígitos.`
        };
    }
    
    return { valid: true, cleanLine };
}

/**
 * Calculates modulo 10 check digit
 * @param {string} sequence - The sequence to calculate check digit for
 * @returns {number} The calculated check digit
 */
function calculateModulo10(sequence) {
    let sum = 0;
    let multiplier = 2;
    
    for (let i = sequence.length - 1; i >= 0; i--) {
        let result = parseInt(sequence[i]) * multiplier;
        if (result > 9) {
            result = Math.floor(result / 10) + (result % 10);
        }
        sum += result;
        multiplier = multiplier === 2 ? 1 : 2;
    }
    
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates check digits for bank boleto
 * @param {string} cleanLine - The clean digitable line
 * @returns {Array} Array of validation errors
 */
function validateCheckDigits(cleanLine) {
    const errors = [];
    
    const field1 = cleanLine.substring(0, 9);
    const dv1 = parseInt(cleanLine.substring(9, 10));
    const calculatedDv1 = calculateModulo10(field1);
    
    if (dv1 !== calculatedDv1) {
        errors.push(`Campo 1 - DV inválido: esperado ${calculatedDv1}, encontrado ${dv1}`);
    }
    
    const field2 = cleanLine.substring(10, 20);
    const dv2 = parseInt(cleanLine.substring(20, 21));
    const calculatedDv2 = calculateModulo10(field2);
    
    if (dv2 !== calculatedDv2) {
        errors.push(`Campo 2 - DV inválido: esperado ${calculatedDv2}, encontrado ${dv2}`);
    }
    
    const field3 = cleanLine.substring(21, 31);
    const dv3 = parseInt(cleanLine.substring(31, 32));
    const calculatedDv3 = calculateModulo10(field3);
    
    if (dv3 !== calculatedDv3) {
        errors.push(`Campo 3 - DV inválido: esperado ${calculatedDv3}, encontrado ${dv3}`);
    }
    
    return errors;
}

/**
 * Formats input with proper spacing for better readability
 * @param {HTMLInputElement} input - The input element to format
 */
function formatInput(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 48) {
        value = value.substring(0, 48);
    }
    
    if (value.length > 0) {
        let formatted = '';
        if (value.length >= 5) formatted += value.substring(0, 5) + '.';
        if (value.length >= 10) formatted += value.substring(5, 10) + ' ';
        if (value.length >= 15) formatted += value.substring(10, 15) + '.';
        if (value.length >= 21) formatted += value.substring(15, 21) + ' ';
        if (value.length >= 26) formatted += value.substring(21, 26) + '.';
        if (value.length >= 32) formatted += value.substring(26, 32) + ' ';
        if (value.length >= 33) formatted += value.substring(32, 33) + ' ';
        if (value.length >= 47) formatted += value.substring(33, 47);
        else formatted += value.substring(33);
        
        if (value.length === 48) formatted += value.substring(47, 48);
        
        input.value = formatted;
    }
}

