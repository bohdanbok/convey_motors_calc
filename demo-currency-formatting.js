// Demo script to show currency formatting changes
console.log('💰 Currency Formatting Demo');
console.log('========================');

// Load calculator
const script = document.createElement('script');
script.src = 'js/calculator.js';
document.head.appendChild(script);

script.onload = function() {
    // Wait for calculator to initialize
    setTimeout(() => {
        console.log('✅ Calculator loaded successfully');
        
        // Test the new formatting function
        console.log('\n🧪 Testing formatCurrencyForWebhook():');
        const testAmounts = [0, 100, 1000.50, 25000.99, 0.01, 999999.99];
        
        testAmounts.forEach(amount => {
            const formatted = calculator.formatCurrencyForWebhook(amount);
            console.log(`Amount: ${amount} → Webhook Format: ${formatted}`);
        });
        
        // Test with sample form data
        console.log('\n📝 Testing with sample form data:');
        calculator.updateFormData('car_price', '25000');
        calculator.updateFormData('tradein_price', '5000');
        calculator.updateFormData('deposit_price', '2000');
        calculator.updateFormData('docfee_amount', '499');
        calculator.updateFormData('accessories_amount_extra_1', '500');
        
        const webhookData = calculator.getFormDataForWebhook();
        
        console.log('\n💵 Monetary fields in webhook data:');
        const monetaryFields = [
            'car_price', 'tradein_price', 'deposit_price', 'docfee_amount',
            'accessories_amount_extra_1', 'trade_diff', 'duenow_price',
            'carPrice', 'tradeInValue', 'depositAmount', 'docFee',
            'totalAccessories', 'subtotal', 'amountDue'
        ];
        
        monetaryFields.forEach(field => {
            if (webhookData[field] !== undefined) {
                console.log(`${field}: ${webhookData[field]}`);
            }
        });
        
        console.log('\n✅ Demo completed! All monetary values now include $ symbol.');
        
    }, 100);
};

// Show instructions
console.log('\n📋 Instructions:');
console.log('1. Open browser console (F12)');
console.log('2. Navigate to http://localhost:8000/');
console.log('3. Fill out the form with some values');
console.log('4. Submit the form and check the webhook data');
console.log('5. All monetary values will now include $ symbol');
