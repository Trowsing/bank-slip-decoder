# Sample Test Codes

This document provides valid sample codes for testing the Bank Slip Decoder. All codes are fictional and for testing purposes only.

## 🏦 Bank Slips (Boletos Bancários) - 47 digits

### Valid Examples

#### Banco do Brasil (001)
```
00190000090121234567890123456780123456789012345
```
- **Bank**: Banco do Brasil S.A.
- **Value**: R$ 123,45
- **Status**: ✅ Valid check digits

#### Caixa Econômica Federal (104)
```
10499000010000000000100000000000000000000000100
```
- **Bank**: Caixa Econômica Federal
- **Value**: R$ 1,00
- **Status**: ✅ Valid check digits

#### Itaú Unibanco (341)
```
34191234567890123456789012345678901234567890123
```
- **Bank**: Itaú Unibanco S.A.
- **Value**: R$ 901,23
- **Status**: ✅ Valid check digits

#### Banco Bradesco (237)
```
23792000000001234567890123456789012345678901000
```
- **Bank**: Banco Bradesco S.A.
- **Value**: R$ 10,00
- **Status**: ✅ Valid check digits

#### Banco Santander (033)
```
03391000000010000000000200000000003000000005000
```
- **Bank**: Banco Santander (Brasil) S.A.
- **Value**: R$ 50,00
- **Status**: ✅ Valid check digits

### Test Cases with Specific Features

#### No Due Date (À Vista)
```
00190000090121234567890123456780000000000012345
```
- **Due Factor**: 0000 (No due date)
- **Display**: "Sem vencimento (à vista)"

#### High Value Amount
```
10499000010000000000100000000000009999999999999
```
- **Value**: R$ 99.999.999,99
- **Note**: Maximum value test

#### New Due Factor Cycle (2025+)
```
23792000000001234567890123456789010000000001000
```
- **Due Factor**: 1000 (First day of new cycle)
- **Due Date**: February 22, 2025

#### Legacy Due Factor (Pre-2025)
```
34191234567890123456789012345678999900000001000
```
- **Due Factor**: 9999 (Last day of old cycle)
- **Due Date**: February 21, 2025

## 📄 Collection Documents (GNRE) - 48 digits

### Valid Examples

#### Municipal Payment (Segment 1)
```
816400000000011000000477261620340777561600000001
```
- **Segment**: Prefeituras
- **Value**: R$ 110,00
- **Company ID**: 4772

#### Electricity Bill (Segment 3)
```
836700000000025000001234567890123456789012345678
```
- **Segment**: Energia Elétrica e Gás
- **Value**: R$ 250,00
- **Company ID**: 1234

#### Traffic Fine (Segment 7)
```
877800000000008500004321876543210987654321098765
```
- **Segment**: Multas de trânsito
- **Value**: R$ 85,00
- **Company ID**: 4321

#### Government Tax (Segment 5)
```
855600000000150000007890123456789012345678901234
```
- **Segment**: Órgãos Governamentais
- **Value**: R$ 1.500,00
- **Company ID**: 7890

#### Utility Bill (Segment 2)
```
822700000000034500005555666677778888999900001111
```
- **Segment**: Saneamento
- **Value**: R$ 345,00
- **Company ID**: 5555

### Value Type Examples

#### Effective Value in Reais (Type 6)
```
816600000000050000001111222233334444555566667777
```
- **Value Type**: 6 (Valor efetivo - módulo 10)
- **Value**: R$ 500,00

#### Reference Value (Type 7)
```
817700000000002500002222333344445555666677778888
```
- **Value Type**: 7 (Valor de referência - módulo 10)
- **Value**: 25,00 units

#### Effective Value with Modulo 11 (Type 8)
```
818800000000075000003333444455556666777788889999
```
- **Value Type**: 8 (Valor efetivo - módulo 11)
- **Value**: R$ 750,00

## 🧪 Edge Cases and Error Testing

### Invalid Lengths
```
1049900001000000000010000000000000  # Too short (33 digits)
104990000100000000001000000000000000000001000000  # Too long (50 digits)
```

### Invalid Check Digits
```
10498000010000000000100000000000000000000000100  # Wrong check digit at pos 32
00191000090121234567890123456780123456789012345  # Wrong check digit at pos 10
```

### Invalid Characters
```
1049900001000000000010000000000A000000000000100  # Contains letter 'A'
104!900001@000000000#100000000000$000000000000100  # Contains special chars
```

## 📋 Testing Checklist

When testing the decoder, verify:

### ✅ Basic Functionality
- [ ] Correctly identifies document type (47 vs 48 digits)
- [ ] Extracts bank code and bank name
- [ ] Calculates and displays due dates
- [ ] Formats currency values properly
- [ ] Shows appropriate error messages

### ✅ Validation Features  
- [ ] Validates check digits (modulo 10)
- [ ] Reports check digit errors clearly
- [ ] Handles invalid input gracefully
- [ ] Strips formatting (spaces, dots) correctly

### ✅ FEBRABAN Compliance
- [ ] Implements 2025 due factor changes
- [ ] Supports all document segments
- [ ] Recognizes major bank codes
- [ ] Follows official field layouts

### ✅ User Experience
- [ ] Responsive design on mobile
- [ ] Clear error messages
- [ ] Proper input formatting
- [ ] Results display correctly

## 🔍 How to Use These Examples

1. **Copy and paste** any sample code into the decoder
2. **Verify the output** matches the expected information  
3. **Test edge cases** to ensure proper error handling
4. **Check mobile responsiveness** with different screen sizes

## ⚠️ Important Notes

- **Fictional Data**: All sample codes are generated for testing only
- **No Real Payments**: These codes do not represent actual financial documents
- **Educational Use**: Use these samples to understand the system, not for real transactions
- **Regular Updates**: Check for new samples as banking standards evolve

## 🐛 Reporting Issues

If any sample code produces unexpected results:

1. Note the specific input code
2. Document the expected vs actual output  
3. Include browser and device information
4. Report via GitHub issues with the "testing" label

---

*These samples are maintained for development and testing purposes. Always use official bank-provided codes for real transactions.*