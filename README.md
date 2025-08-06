# ConveyMotors Contract Calculator

A modern, responsive web application for generating vehicle purchase contracts with real-time calculations and n8n webhook integration.

## Features

- **Two-Column Layout**: Form input on the left, real-time preview on the right
- **Real-time Calculations**: Automatic financial calculations as you type
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive validation with error messages
- **n8n Integration**: Sends data via webhook to n8n for PDF generation
- **Modern UI**: Beautiful gradient design with smooth animations
- **Auto-save**: Form data persistence (optional)
- **All Required Fields**: Includes all template variables from your contract

## Template Variables Supported

The form includes all the template variables from your contract:

### Personal Information
- `{{full_name}}` - Buyer's full name
- `{{buyer_dob}}` - Date of birth
- `{{buyer_gender}}` - Gender
- `{{buyer_eye}}` - Eye color
- `{{buyer_license}}` - Driver license number

### Contact Information
- `{{buyer_address}}` - Address
- `{{buyer_city}}` - City
- `{{buyer_state}}` - State
- `{{buyer_zip}}` - ZIP code
- `{{buyer_cellphone}}` - Cell phone
- `{{buyer_residencephone}}` - Residence phone

### Vehicle Information
- `{{car_year}}` - Vehicle year
- `{{car_make}}` - Vehicle make
- `{{car_model}}` - Vehicle model
- `{{car_body}}` - Body style
- `{{car_color}}` - Color
- `{{car_miles}}` - Mileage
- `{{car_vin}}` - VIN number
- `{{car_price}}` - Car price

### Trade-in Information
- `{{tradein_year}}` - Trade-in year
- `{{tradein_make}}` - Trade-in make
- `{{tradein_model}}` - Trade-in model
- `{{tradein_price}}` - Trade-in value
- `{{trade_diff}}` - Trade difference (calculated)

### Financial Information
- `{{deposit_price}}` - Deposit amount
- `{{docfee_price}}` - Documentation fee
- `{{salestax_price}}` - Sales tax
- `{{gov_fee}}` - Government fee
- `{{dealerpreparation_fee}}` - Dealer preparation fee
- `{{certification_bundle_fee}}` - Certification bundle fee
- `{{sellingaddons_price}}` - Selling add-ons
- `{{total_acc}}` - Total accessories
- `{{total_service}}` - Total service
- `{{duenow_price}}` - Amount due (calculated)

### Additional Information
- `{{contract_template}}` - Contract template (NJ, NY, PA)
- `{{cobuyerfull_name}}` - Co-buyer name
- `{{sales_person}}` - Sales person
- `{{dealer_stock}}` - Dealer stock
- `{{date_value}}` - Contract date

### Lien Information
- `{{lien_name}}` - Lien holder name
- `{{lien_address}}` - Lien holder address
- `{{lien_city}}` - Lien holder city
- `{{lien_state}}` - Lien holder state
- `{{lien_zip}}` - Lien holder ZIP

## Setup Instructions

### 1. Download and Extract
Download the project files and extract them to your web server directory.

### 2. Configure Webhook URL
Edit the `config.js` file and update the webhook URL:

```javascript
const CONFIG = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/contract-generator',
    // ... other settings
};
```

### 3. n8n Webhook Setup
In your n8n workflow:

1. Add a **Webhook** node
2. Set the HTTP method to `POST`
3. Copy the webhook URL from n8n
4. Update the `config.js` file with this URL
5. Connect the webhook to your PDF generation workflow

### 4. Deploy to Web Server
Upload all files to your web server. The application works with any static file hosting service.

## File Structure

```
ConveyMotors Contract/
├── index.html              # Main HTML file
├── config.js               # Configuration settings
├── styles/
│   ├── main.css           # Global styles and layout
│   ├── form.css           # Form-specific styles
│   └── preview.css        # Preview column styles
├── js/
│   ├── calculator.js      # Financial calculations
│   ├── preview.js         # Real-time preview
│   └── form-handler.js    # Form handling and webhook
└── README.md              # This file
```

## Usage

### For Clients
1. Open the application in a web browser
2. Fill out the form on the left side
3. See real-time preview on the right side
4. Review all calculations and information
5. Click "Generate Contract" to submit

### For Administrators
1. Configure the webhook URL in `config.js`
2. Set up n8n workflow to receive webhook data
3. Configure PDF generation in n8n
4. Test the complete workflow

## Configuration Options

### Webhook Settings
- `webhookUrl`: Your n8n webhook URL
- `webhookHeaders`: Additional headers if needed

### Validation Settings
- `minCarPrice`: Minimum car price validation
- `maxCarPrice`: Maximum car price validation
- `requiredFields`: Array of required field names

### Financial Settings
- `defaultInterestRate`: Default interest rate for calculations
- `defaultLoanTerm`: Default loan term in years
- `defaultSalesTaxRate`: Default sales tax rate

### UI Settings
- `autoSave`: Enable/disable form auto-save
- `showAnimations`: Enable/disable animations
- Theme colors for customization

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Considerations

- The application runs entirely in the browser
- No sensitive data is stored on the server
- Webhook data is sent via HTTPS
- Form validation prevents invalid submissions

## Customization

### Styling
All styles are modular and can be easily customized:
- `styles/main.css` - Global layout and colors
- `styles/form.css` - Form appearance
- `styles/preview.css` - Preview column styling

### Functionality
- `js/calculator.js` - Financial calculation logic
- `js/preview.js` - Preview rendering
- `js/form-handler.js` - Form handling and webhook

## Troubleshooting

### Webhook Not Working
1. Check the webhook URL in `config.js`
2. Verify n8n webhook is active
3. Check browser console for errors
4. Test webhook with a tool like Postman

### Form Not Calculating
1. Check browser console for JavaScript errors
2. Verify all required fields are filled
3. Check number input formatting

### Styling Issues
1. Clear browser cache
2. Check CSS file paths
3. Verify all style files are loaded

## Support

For technical support or customization requests, please contact your development team.

## License

This project is proprietary software for ConveyMotors use only. 