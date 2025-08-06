# 🚗 ConveyMotors Contract Calculator

A modern, responsive web application for generating vehicle purchase contracts with real-time calculations and professional form handling.

## ✨ Features

### 📋 **Smart Form Management**
- **Two-column layout** - Form on the left, real-time preview on the right
- **Responsive design** - Works perfectly on all devices
- **Template selection** - NJ, NY, PA state templates with automatic tax calculations
- **Conditional sections** - Trade-in, Co-buyer, and Lien information with toggle switches

### 🔒 **Advanced Field Controls**
- **Locked fields** - DocFee, LoJack, and Sales Tax with unlockable protection
- **Dynamic accessories/services** - Add up to 4 custom items with automatic calculations
- **Fixed field naming** - Stable field names for reliable webhook integration
- **Real-time validation** - Instant feedback with professional error handling

### 💰 **Financial Calculations**
- **Automatic calculations** - Trade difference, taxes, totals, and monthly payments
- **Currency formatting** - Professional display with proper rounding to cents
- **Tax handling** - NJ state tax (6.625%) with automatic calculation
- **Payment estimates** - Monthly payment calculations with 4.9% APR

### 🎯 **Professional UX**
- **Loading modals** - Beautiful progress indicators during contract generation
- **Success feedback** - Confirmation modals with automatic form reset
- **Form validation** - Comprehensive validation with clear error messages
- **Auto-save functionality** - Form data persists during session

## 🚀 Quick Start

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/bohdanbok/convey_motors_calc.git
cd convey_motors_calc

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### **Production Deployment**
1. Upload all files to your web server
2. Configure webhook URL in `config.js`
3. Set up n8n workflow (see `n8n-setup.md`)
4. Test with sample data

## 📁 Project Structure

```
convey_motors_calc/
├── index.html              # Main application file
├── config.js               # Configuration settings
├── logo.png                # Company logo
├── js/
│   ├── calculator.js       # Financial calculations engine
│   ├── form-handler.js     # Form management and validation
│   └── preview.js          # Real-time preview generation
├── styles/
│   ├── main.css           # Core styling and layout
│   ├── form.css           # Form-specific styles
│   └── preview.css        # Preview panel styles
└── docs/
    ├── README.md          # This file
    ├── QUICK-START.md     # Quick setup guide
    └── n8n-setup.md       # n8n integration guide
```

## 🔧 Configuration

### **Webhook Setup**
Edit `config.js` to set your webhook URL:
```javascript
const config = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/contract-generator'
};
```

### **Template Configuration**
- **NJ Template** - Includes 6.625% sales tax calculation
- **NY Template** - No sales tax calculation
- **PA Template** - No sales tax calculation

## 📊 Data Fields

### **Core Fields (Always Sent)**
- Personal & Contact Information (name, address, phone, etc.)
- Vehicle Information (year, make, model, VIN, price)
- Financial Information (fees, down payment, taxes)
- Contract Template Selection

### **Conditional Fields**
- **Trade-in Information** - When trade-in toggle is enabled
- **Co-buyer Information** - When co-buyer toggle is enabled
- **Lien Information** - When lien type is not 'cash'

### **Dynamic Fields**
- **Accessories** - Up to 4 custom accessories (name + amount)
- **Services** - Up to 4 custom services (name + amount)

### **Calculated Fields**
- Trade difference, subtotal, taxes, total due, monthly payment
- All amounts rounded to 2 decimal places (cents)

## 🎨 Customization

### **Styling**
- Modular CSS structure for easy customization
- CSS variables for consistent theming
- Responsive design patterns

### **Functionality**
- Extensible JavaScript architecture
- Plugin-style calculator system
- Configurable validation rules

## 🔗 Integration

### **n8n Workflow**
See `n8n-setup.md` for complete integration guide:
- Webhook endpoint configuration
- PDF generation setup
- Email delivery automation
- Data processing workflows

### **Webhook Data Format**
```json
{
  "contract_template": "NJ",
  "full_name": "John Doe",
  "car_price": "25000",
  "accessories_name_extra_1": "GPS Navigation",
  "accessories_amount_extra_1": "500",
  "amountDue": 17704.23,
  "calculated_at": "2024-01-15T10:30:00.000Z"
}
```

## 🛠️ Technical Details

### **Browser Support**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### **Dependencies**
- No external dependencies
- Pure HTML, CSS, and JavaScript
- Modern ES6+ features

### **Performance**
- Optimized calculations
- Efficient DOM updates
- Minimal memory usage
- Fast form validation

## 📝 License

This project is proprietary software developed for ConveyMotors.

## 🤝 Support

For technical support or feature requests, please contact the development team.

---

**Built with ❤️ for ConveyMotors** 