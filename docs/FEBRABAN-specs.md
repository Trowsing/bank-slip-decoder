# FEBRABAN Technical Specifications

This document outlines the technical specifications for Brazilian bank slip (boleto) and collection document (GNRE) decoding, based on FEBRABAN standards.

## 📋 Table of Contents

- [Bank Slip Structure (47 digits)](#bank-slip-structure-47-digits)
- [Collection Document Structure (48 digits)](#collection-document-structure-48-digits)
- [Due Factor Calculation](#due-factor-calculation)
- [Check Digit Validation](#check-digit-validation)
- [Bank Codes](#bank-codes)
- [Value Formatting](#value-formatting)

## 🏦 Bank Slip Structure (47 digits)

Bank slips (boletos bancários) follow the FEBRABAN standard with 47 digits divided into specific fields:

### Field Layout

| Position | Field | Description | Validation |
|----------|-------|-------------|------------|
| 1-3      | Bank Code | 3-digit bank identifier | Fixed values |
| 4        | Currency Code | Currency identifier (9=Real) | Usually 9 |
| 5-9      | Free Field 1 | First 5 positions of bank-specific field | Varies |
| 10       | Check Digit 1 | Modulo 10 of positions 1-9 | Calculated |
| 11-20    | Free Field 2 | Positions 6-15 of bank-specific field | Varies |
| 21       | Check Digit 2 | Modulo 10 of positions 11-20 | Calculated |
| 22-31    | Free Field 3 | Positions 16-25 of bank-specific field | Varies |
| 32       | Check Digit 3 | Modulo 10 of positions 22-31 | Calculated |
| 33       | General Check Digit | Overall validation digit | Calculated |
| 34-37    | Due Factor | Days since base date | Special calc |
| 38-47    | Value | Amount in cents (10 digits) | Numeric |

### Example Breakdown
```
10499000010000000000100000000000000000000000100
│││││││││││││││││││││││││││││││││││││││││││││││││││
│││└─────────────┘ │ └─────────────┘ │ └─────────────┘ └────┘ └────────────┘
│││  Free Field 1   │   Free Field 2   │   Free Field 3  │  DV │    Value
│││                 │                  │                 │     └─ R$ 1,00
│││                 │                  │                 └─ General DV
│││                 │                  └─ Check Digit 3
│││                 └─ Check Digit 2
││└─ Check Digit 1
│└─ Currency (9=Real)
└─ Bank Code (104=CEF)
```

## 📄 Collection Document Structure (48 digits)

Collection documents (GNRE, utilities, government payments) use a different 48-digit structure:

### Field Layout

| Position | Field | Description | Values |
|----------|-------|-------------|--------|
| 1        | Product ID | Document type identifier | Usually 8 |
| 2        | Segment ID | Payment category | 1-9 (see table) |
| 3        | Value Type | Value calculation method | 6-9 (see table) |
| 4        | General Check Digit | Overall validation | Calculated |
| 5-15     | Value | Amount in cents (11 digits) | Numeric |
| 16-19    | Company/Organ ID | Institution identifier | Numeric |
| 20-48    | Free Field | Institution-specific data | Varies |

### Segment IDs

| ID | Description |
|----|-------------|
| 1  | Prefeituras (Municipalities) |
| 2  | Saneamento (Sanitation) |
| 3  | Energia Elétrica e Gás (Electricity & Gas) |
| 4  | Telecomunicações (Telecommunications) |
| 5  | Órgãos Governamentais (Government Agencies) |
| 6  | Carnes e Assemelhados (Installments & Similar) |
| 7  | Multas de trânsito (Traffic Fines) |
| 9  | Uso exclusivo do banco (Bank Exclusive Use) |

### Value Types

| ID | Description |
|----|-------------|
| 6  | Valor efetivo em reais (módulo 10) |
| 7  | Quantidade de moeda ou valor de referência (módulo 10) |
| 8  | Valor efetivo em reais (módulo 11) |
| 9  | Quantidade de moeda ou valor de referência (módulo 11) |

## 📅 Due Factor Calculation

The due factor represents the number of days since a base date. FEBRABAN updated this system in 2025.

### Historical System (Until February 21, 2025)
- **Base Date**: October 7, 1997
- **Formula**: Due Date = Base Date + Factor Days
- **Range**: 1000-9999 (recycling every ~27 years)

### New System (From February 22, 2025)
- **Base Date**: February 22, 2025  
- **Formula**: Due Date = New Base Date + (Factor - 1000) Days
- **Range**: 1000-9999 (new cycle)

### Implementation Logic
```javascript
if (factor >= 1000 && factor <= 9999) {
    const originalDate = new Date('1997-10-07').addDays(factor);
    const newCycleDate = new Date('2025-02-22').addDays(factor - 1000);
    
    // Use new cycle if original date > Feb 21, 2025
    // OR if currently past transition and factor in new range
    const useNewCycle = originalDate > new Date('2025-02-21') ||
                       (new Date() >= new Date('2025-02-22') && factor <= 2000);
                       
    return useNewCycle ? newCycleDate : originalDate;
}
```

### Special Values
- **0000**: No due date (à vista / cash payment)
- **0001-0999**: Legacy values (rare, calculated from original base)

## ✅ Check Digit Validation

### Modulo 10 Algorithm
Used for bank slip check digits (positions 10, 21, 32):

1. Starting from right, multiply each digit alternately by 2 and 1
2. If result > 9, sum the digits (e.g., 14 → 1+4=5)
3. Sum all results
4. Check digit = (10 - (sum % 10)) % 10

```javascript
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
```

### Modulo 11 Algorithm
Used for collection documents and some bank-specific validations:

1. Starting from right, multiply each digit by weights 2,3,4,5,6,7,2,3...
2. Sum all products
3. Calculate remainder: sum % 11
4. Check digit = 11 - remainder (with special rules for 0, 1, 10, 11)

## 🏛️ Bank Codes

Major Brazilian bank codes supported:

| Code | Bank Name |
|------|-----------|
| 001  | Banco do Brasil S.A. |
| 033  | Banco Santander (Brasil) S.A. |
| 104  | Caixa Econômica Federal |
| 237  | Banco Bradesco S.A. |
| 341  | Itaú Unibanco S.A. |
| 077  | Banco Inter S.A. |
| 260  | Nu Pagamentos S.A. (Nubank) |
| 290  | PagSeguro (PagBank) |
| 336  | Banco C6 S.A |
| 422  | Banco Safra S.A. |

*Complete list available in [decoder.js](../src/js/decoder.js)*

## 💰 Value Formatting

Values are stored as integers representing cents:

### Bank Slips (10 digits)
- **Format**: XXXXXXXXXX (10 digits)
- **Example**: 0000000100 = R$ 1,00
- **Range**: R$ 0,00 to R$ 99.999.999,99

### Collection Documents (11 digits)  
- **Format**: XXXXXXXXXXX (11 digits)
- **Example**: 00000000100 = R$ 1,00
- **Range**: R$ 0,00 to R$ 999.999.999,99

### Conversion Formula
```javascript
const realValue = parseInt(storedValue) / 100;
const formattedValue = realValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});
```

## 📚 References

- **FEBRABAN**: [www.febraban.org.br](https://www.febraban.org.br)
- **FB-009/2023**: Due Factor Specification Update
- **Central Bank of Brazil**: [www.bcb.gov.br](https://www.bcb.gov.br)
- **CNAB Standards**: Electronic Payment Standards

## ⚠️ Important Notes

1. **Validation**: Always validate check digits before processing
2. **Date Handling**: Consider timezone effects for due date calculations  
3. **Currency**: This specification covers BRL (Brazilian Real) only
4. **Updates**: FEBRABAN periodically updates specifications
5. **Testing**: Use official test cases when available

---

*This documentation is maintained for educational purposes. Always refer to official FEBRABAN documentation for production implementations.*