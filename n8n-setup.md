# n8n Setup Instructions for ConveyMotors Contract Calculator

This guide will help you set up n8n to receive data from the contract calculator and generate PDF contracts.

## Prerequisites

- n8n instance running (self-hosted or cloud)
- Access to n8n workflow editor
- PDF generation capability (e.g., PDF generation node or external service)

## Step 1: Create Webhook Node

1. Open your n8n instance
2. Create a new workflow
3. Add a **Webhook** node as the trigger
4. Configure the webhook:
   - **HTTP Method**: POST
   - **Path**: `/contract-generator` (or any path you prefer)
   - **Response Mode**: Respond to Webhook
   - **Options**: 
     - Enable "Respond with all defined headers"
     - Set "Response Code" to 200

5. Save the workflow and copy the webhook URL

## Step 2: Update Configuration

1. Open `config.js` in your contract calculator
2. Replace the webhook URL with your n8n webhook URL:

```javascript
const CONFIG = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/contract-generator',
    // ... rest of config
};
```

## Step 3: Data Structure

The webhook will receive the following JSON structure:

```json
{
  "full_name": "John Michael Smith",
  "buyer_dob": "1985-06-15",
  "buyer_gender": "Male",
  "buyer_eye": "Blue",
  "buyer_license": "DL123456789",
  "buyer_address": "123 Main Street",
  "buyer_city": "Los Angeles",
  "buyer_state": "CA",
  "buyer_zip": "90210",
  "buyer_cellphone": "555-123-4567",
  "buyer_residencephone": "555-987-6543",
  "car_year": "2023",
  "car_make": "Toyota",
  "car_model": "Camry",
  "car_body": "Sedan",
  "car_color": "Silver",
  "car_miles": 15000,
  "car_vin": "1HGBH41JXMN109186",
  "car_price": 35000,
  "tradein_year": "2018",
  "tradein_make": "Honda",
  "tradein_model": "Civic",
  "tradein_price": 12000,
  "deposit_price": 5000,
  "docfee_price": 299,
  "salestax_price": 2800,
  "gov_fee": 150,
  "dealerpreparation_fee": 395,
  "certification_bundle_fee": 199,
  "sellingaddons_price": 500,
  "total_acc": 750,
  "total_service": 200,
  "contract_template": "NY",
  "cobuyerfull_name": "Jane Elizabeth Smith",
  "sales_person": "Mike Johnson",
  "dealer_stock": "STK-2023-001",
  "date_value": "2024-01-15",
  "lien_name": "",
  "lien_address": "",
  "lien_city": "",
  "lien_state": "",
  "lien_zip": "",
  "carPrice": 35000,
  "tradeInValue": 12000,
  "depositAmount": 5000,
  "docFee": 299,
  "salesTax": 2800,
  "govFee": 150,
  "dealerPrepFee": 395,
  "certificationFee": 199,
  "sellingAddons": 500,
  "totalAccessories": 750,
  "totalService": 200,
  "tradeDifference": 23000,
  "subtotal": 29293,
  "totalWithTax": 32093,
  "amountDue": 27093,
  "monthlyPayment": 510.45,
  "calculated_at": "2024-01-15T10:30:00.000Z",
  "trade_diff": 23000,
  "duenow_price": 27093
}
```

## Step 4: Contract Template Selection

The form includes a **Contract Template** field that determines which template to use for PDF generation:

### Available Templates
- **NJ** - New Jersey contract template
- **NY** - New York contract template  
- **PA** - Pennsylvania contract template

### Template Selection Logic
In your n8n workflow, you can use the `contract_template` field to:
1. **Select the correct template file** based on the state
2. **Apply state-specific formatting** and requirements
3. **Use different PDF generation settings** per state
4. **Route to different processing nodes** based on template

### Example n8n Logic
```javascript
// In a Code node or Switch node
const template = $input.first().json.contract_template;

switch(template) {
  case 'NJ':
    // Use New Jersey template
    return { template: 'nj-contract.html', state: 'NJ' };
  case 'NY':
    // Use New York template
    return { template: 'ny-contract.html', state: 'NY' };
  case 'PA':
    // Use Pennsylvania template
    return { template: 'pa-contract.html', state: 'PA' };
  default:
    throw new Error('Invalid contract template');
}
```

## Step 5: PDF Generation Workflow

Here's a sample workflow structure for PDF generation:

### Option 1: Using n8n PDF Node

1. **Webhook Node** (Trigger)
2. **Set Node** (Prepare template data)
3. **PDF Node** (Generate PDF)
4. **Email Node** (Send PDF)

### Option 2: Using External PDF Service

1. **Webhook Node** (Trigger)
2. **HTTP Request Node** (Call external PDF service)
3. **Email Node** (Send PDF)

### Option 3: Using Template Engine

1. **Webhook Node** (Trigger)
2. **Code Node** (Process template variables)
3. **HTTP Request Node** (Generate PDF via API)
4. **Email Node** (Send result)

## Step 5: Template Variable Mapping

Map the webhook data to your PDF template variables:

| Template Variable | Webhook Field | Description |
|------------------|---------------|-------------|
| `{{full_name}}` | `full_name` | Buyer's full name |
| `{{buyer_dob}}` | `buyer_dob` | Date of birth |
| `{{buyer_gender}}` | `buyer_gender` | Gender |
| `{{buyer_eye}}` | `buyer_eye` | Eye color |
| `{{buyer_license}}` | `buyer_license` | Driver license |
| `{{buyer_address}}` | `buyer_address` | Address |
| `{{buyer_city}}` | `buyer_city` | City |
| `{{buyer_state}}` | `buyer_state` | State |
| `{{buyer_zip}}` | `buyer_zip` | ZIP code |
| `{{buyer_cellphone}}` | `buyer_cellphone` | Cell phone |
| `{{buyer_residencephone}}` | `buyer_residencephone` | Residence phone |
| `{{car_year}}` | `car_year` | Vehicle year |
| `{{car_make}}` | `car_make` | Vehicle make |
| `{{car_model}}` | `car_model` | Vehicle model |
| `{{car_body}}` | `car_body` | Body style |
| `{{car_color}}` | `car_color` | Color |
| `{{car_miles}}` | `car_miles` | Mileage |
| `{{car_vin}}` | `car_vin` | VIN |
| `{{car_price}}` | `car_price` | Car price |
| `{{tradein_year}}` | `tradein_year` | Trade-in year |
| `{{tradein_make}}` | `tradein_make` | Trade-in make |
| `{{tradein_model}}` | `tradein_model` | Trade-in model |
| `{{tradein_price}}` | `tradein_price` | Trade-in value |
| `{{trade_diff}}` | `trade_diff` | Trade difference |
| `{{deposit_price}}` | `deposit_price` | Deposit amount |
| `{{docfee_price}}` | `docfee_price` | Documentation fee |
| `{{salestax_price}}` | `salestax_price` | Sales tax |
| `{{gov_fee}}` | `gov_fee` | Government fee |
| `{{dealerpreparation_fee}}` | `dealerpreparation_fee` | Dealer prep fee |
| `{{certification_bundle_fee}}` | `certification_bundle_fee` | Certification fee |
| `{{sellingaddons_price}}` | `sellingaddons_price` | Selling add-ons |
| `{{total_acc}}` | `total_acc` | Total accessories |
| `{{total_service}}` | `total_service` | Total service |
| `{{duenow_price}}` | `duenow_price` | Amount due |
| `{{contract_template}}` | `contract_template` | Contract template (NJ/NY/PA) |
| `{{cobuyerfull_name}}` | `cobuyerfull_name` | Co-buyer name |
| `{{sales_person}}` | `sales_person` | Sales person |
| `{{dealer_stock}}` | `dealer_stock` | Dealer stock |
| `{{date_value}}` | `date_value` | Contract date |
| `{{lien_name}}` | `lien_name` | Lien holder name |
| `{{lien_address}}` | `lien_address` | Lien holder address |
| `{{lien_city}}` | `lien_city` | Lien holder city |
| `{{lien_state}}` | `lien_state` | Lien holder state |
| `{{lien_zip}}` | `lien_zip` | Lien holder ZIP |

## Step 6: Sample n8n Workflow

Here's a complete sample workflow:

### Node 1: Webhook (Trigger)
```json
{
  "name": "Contract Webhook",
  "type": "n8n-nodes-base.webhook",
  "position": [240, 300],
  "parameters": {
    "httpMethod": "POST",
    "path": "contract-generator",
    "responseMode": "responseNode",
    "options": {
      "responseHeaders": {
        "parameters": [
          {
            "name": "Content-Type",
            "value": "application/json"
          }
        ]
      }
    }
  }
}
```

### Node 2: Set (Prepare Data)
```json
{
  "name": "Prepare Template Data",
  "type": "n8n-nodes-base.set",
  "position": [460, 300],
  "parameters": {
    "values": {
      "string": [
        {
          "name": "template_data",
          "value": "={{ $json }}"
        }
      ]
    }
  }
}
```

### Node 3: HTTP Request (PDF Generation)
```json
{
  "name": "Generate PDF",
  "type": "n8n-nodes-base.httpRequest",
  "position": [680, 300],
  "parameters": {
    "url": "https://your-pdf-service.com/generate",
    "method": "POST",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Authorization",
          "value": "Bearer your-api-key"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "template",
          "value": "contract-template"
        },
        {
          "name": "data",
          "value": "={{ $json.template_data }}"
        }
      ]
    }
  }
}
```

### Node 4: Email (Send PDF)
```json
{
  "name": "Send Contract",
  "type": "n8n-nodes-base.emailSend",
  "position": [900, 300],
  "parameters": {
    "fromEmail": "contracts@conveymotors.com",
    "toEmail": "={{ $json.template_data.buyer_email || 'customer@example.com' }}",
    "subject": "Your ConveyMotors Contract",
    "text": "Please find your contract attached.",
    "attachments": {
      "parameters": [
        {
          "name": "contract.pdf",
          "value": "={{ $json.pdf_data }}"
        }
      ]
    }
  }
}
```

## Step 7: Testing

1. **Test Webhook**: Use the "Test" button in the webhook node
2. **Test with Calculator**: Fill out the form and submit
3. **Check Logs**: Monitor n8n execution logs
4. **Verify PDF**: Check that PDF is generated correctly

## Step 8: Error Handling

Add error handling nodes:

1. **Error Trigger Node**: Catch any errors
2. **Email Node**: Send error notifications
3. **Log Node**: Log errors for debugging

## Step 9: Production Deployment

1. **Activate Workflow**: Enable the workflow in n8n
2. **Set Webhook URL**: Update the calculator configuration
3. **Monitor**: Set up monitoring and alerts
4. **Backup**: Regular workflow backups

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Data**
   - Check webhook URL in calculator config
   - Verify n8n workflow is active
   - Check CORS settings if needed

2. **PDF Generation Fails**
   - Verify PDF service credentials
   - Check template variable mapping
   - Review error logs

3. **Email Not Sending**
   - Check email service configuration
   - Verify recipient email addresses
   - Check attachment size limits

### Debug Tips

1. Use n8n's built-in debug mode
2. Add "Debug" nodes to inspect data
3. Check browser console for errors
4. Monitor network requests

## Security Considerations

1. **HTTPS**: Always use HTTPS for webhooks
2. **Authentication**: Add webhook authentication if needed
3. **Validation**: Validate incoming data
4. **Rate Limiting**: Implement rate limiting
5. **Logging**: Log all webhook requests

## Support

For n8n-specific issues, refer to the [n8n documentation](https://docs.n8n.io/). 