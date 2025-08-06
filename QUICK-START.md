# Quick Start Guide - ConveyMotors Contract Calculator

## 🚀 Get Started in 5 Minutes

### 1. Open the Application
```bash
# If you have Python installed:
python3 -m http.server 8000

# Then open in browser:
http://localhost:8000
```

### 2. Test the Form
1. Click "Load Test Data" to fill the form with sample data
2. Watch the real-time preview update on the right
3. See all calculations happen automatically
4. Try editing values to see live updates

### 3. Configure Webhook (Optional)
1. Open `config.js`
2. Replace the webhook URL with your n8n webhook:
```javascript
webhookUrl: 'https://your-n8n-instance.com/webhook/contract-generator',
```

### 4. Test Webhook Integration
1. Fill out the form
2. Click "Generate Contract"
3. Check your n8n workflow for incoming data

## 📁 File Structure
```
ConveyMotors Contract/
├── index.html              # Main application
├── config.js               # Webhook configuration
├── test-data.js            # Sample data for testing
├── styles/                 # CSS files
│   ├── main.css           # Layout and global styles
│   ├── form.css           # Form styling
│   └── preview.css        # Preview column styling
├── js/                     # JavaScript files
│   ├── calculator.js      # Financial calculations
│   ├── preview.js         # Real-time preview
│   └── form-handler.js    # Form handling & webhook
├── README.md              # Full documentation
├── n8n-setup.md           # n8n integration guide
└── QUICK-START.md         # This file
```

## 🎯 Key Features

### ✅ What's Included
- **All Template Variables**: Every field from your contract template
- **Real-time Calculations**: Automatic financial calculations
- **Responsive Design**: Works on all devices
- **Form Validation**: Comprehensive error checking
- **Modern UI**: Beautiful gradient design
- **Test Data**: Sample data for immediate testing

### 📊 Template Variables Supported
All your template variables are included:
- Personal info: `{{full_name}}`, `{{buyer_dob}}`, etc.
- Vehicle info: `{{car_make}}`, `{{car_model}}`, etc.
- Financial info: `{{car_price}}`, `{{trade_diff}}`, etc.
- Calculated fields: `{{duenow_price}}`, monthly payments, etc.

## 🔧 Configuration

### Webhook Setup
1. **n8n**: Create webhook node with POST method
2. **Calculator**: Update `config.js` with your webhook URL
3. **Test**: Use "Generate Contract" button

### Customization
- **Colors**: Edit `styles/main.css` for theme colors
- **Fields**: Modify `index.html` for field changes
- **Calculations**: Update `js/calculator.js` for math logic

## 🧪 Testing

### Quick Test
1. Open `http://localhost:8000`
2. Click "Load Test Data"
3. Verify preview shows all data
4. Check calculations are correct

### Webhook Test
1. Set up n8n webhook
2. Update `config.js`
3. Fill form and submit
4. Check n8n logs for data

## 🐛 Troubleshooting

### Common Issues
- **Form not loading**: Check file paths and server
- **Calculations wrong**: Check `js/calculator.js`
- **Webhook fails**: Verify URL in `config.js`
- **Styling issues**: Clear browser cache

### Debug Mode
Open browser console (F12) to see:
- Form data updates
- Calculation results
- Webhook responses
- Error messages

## 📞 Support

- **Documentation**: See `README.md` for full guide
- **n8n Setup**: See `n8n-setup.md` for integration
- **Code**: All files are well-commented for easy modification

## 🎉 Ready to Use!

Your contract calculator is now ready for:
- ✅ Client form filling
- ✅ Real-time calculations
- ✅ n8n webhook integration
- ✅ PDF contract generation

**Next Steps**: Set up your n8n workflow and start generating contracts! 