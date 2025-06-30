# 🏦 Bank Slip Decoder (Decodificador de Boletos)

A modern, responsive web application for decoding Brazilian bank slips (boletos bancários) and GNRE collection documents. Extract detailed information from digitable lines quickly and accurately.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)

## ✨ Features

- **🔍 Universal Decoding**: Supports both bank slips (47 digits) and GNRE documents (48 digits)
- **🏛️ FEBRABAN Compliant**: Follows official Brazilian banking standards
- **✅ Real-time Validation**: Check digit verification with detailed error reporting  
- **📅 Smart Due Dates**: Handles the new 2025 due factor cycle change (FB-009/2023)
- **🏦 Bank Recognition**: Identifies major Brazilian banks automatically
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with gradient design
- **♿ Accessible**: Screen reader friendly with proper ARIA labels
- **🖨️ Print Ready**: Optimized styles for printing results

## 🚀 Quick Start

### Option 1: Direct Usage
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Paste a digitable line and click "Decodificar Documento"

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/bank-slip-decoder.git
cd bank-slip-decoder

# Serve locally (optional, any HTTP server works)
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000 in your browser
```

## 📋 Supported Document Types

### Bank Slips (Boletos Bancários) - 47 digits
- Extract bank information, due dates, and amounts
- Validate check digits using modulo 10 algorithm
- Support for all major Brazilian banks
- Handle due factor cycle changes (2025 transition)

### Collection Documents (GNRE) - 48 digits  
- Government tax collection documents
- Municipal, state, and federal payments
- Utility bills and service payments
- Traffic fines and other government fees

## 🏗️ Project Structure

```
bank-slip-decoder/
├── README.md                 # Project documentation
├── index.html               # Main application file
├── src/
│   ├── css/
│   │   └── styles.css       # All styling and responsive design
│   └── js/
│       ├── decoder.js       # Core decoding logic and bank data
│       ├── validators.js    # Input validation and check digits
│       └── ui.js           # DOM manipulation and user interface
├── docs/
│   └── FEBRABAN-specs.md   # Technical banking specifications
└── examples/
    └── sample-codes.md     # Example codes for testing
```

## 🔧 Technical Details

### Banking Standards Compliance
- **FEBRABAN** (Brazilian Federation of Banks) compliant
- **FB-009/2023** due factor specification support  
- Modulo 10 and Modulo 11 check digit algorithms
- Standard bank code recognition

### Browser Support
- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- ES6+ JavaScript features
- CSS Grid and Flexbox layouts
- Progressive Web App ready

### Performance
- Zero external dependencies
- Optimized for fast loading
- Minimal JavaScript execution
- Efficient DOM manipulation

## 📖 Usage Examples

### Valid Bank Slip (Boleto)
```
10499.00001 00000.000001 00000.000000 0 00000000000100
```

### Valid GNRE Document  
```
85660000001100000004772616203407775616000000001
```

See [examples/sample-codes.md](examples/sample-codes.md) for more test cases.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. **Code Style**: Follow existing patterns and formatting
2. **Testing**: Test with various bank slip formats before submitting
3. **Documentation**: Update README and code comments as needed
4. **Browser Support**: Ensure compatibility with target browsers

## 📚 Documentation

- [FEBRABAN Specifications](docs/FEBRABAN-specs.md) - Technical banking standards
- [Sample Test Codes](examples/sample-codes.md) - Valid codes for testing
- [Browser Compatibility](docs/browser-support.md) - Supported browsers and features

## 🐛 Issues and Support

If you encounter any issues or have questions:

1. Check the [sample codes](examples/sample-codes.md) for valid input formats
2. Review the [FEBRABAN specifications](docs/FEBRABAN-specs.md) for technical details
3. Open an issue on GitHub with:
   - Browser and version
   - Input that caused the problem
   - Expected vs actual behavior

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the Brazilian developer community
