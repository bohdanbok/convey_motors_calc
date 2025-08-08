// Configuration file for ConveyMotors Contract Calculator
// Update these settings according to your n8n webhook configuration

const CONFIG = {
    // n8n Webhook URL - Replace with your actual webhook URL
    webhookUrl: 'https://n8n.wisdomweave.com/webhook/conveycontract',
    
    // Optional: Add any additional headers if required by your n8n setup
    webhookHeaders: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer your-token-here', // Uncomment if authentication is required
    },
    
    // Form validation settings
    validation: {
        // Minimum car price
        minCarPrice: 1000,
        // Maximum car price
        maxCarPrice: 1000000,
        // Required fields (these will be validated on form submission)
        requiredFields: [
            'full_name',
            'buyer_dob',
            'buyer_license',
            'buyer_address',
            'buyer_city',
            'buyer_state',
            'buyer_zip',
            'buyer_cellphone',
            'car_year',
            'car_make',
            'car_model',
            'car_vin',
            'car_price'
        ]
    },
    
    // Financial calculation settings
    finance: {
        // Default interest rate for monthly payment calculation
        defaultInterestRate: 0.049, // 4.9%
        // Default loan term in years
        defaultLoanTerm: 5,
        // Sales tax rate (can be overridden by form input)
        defaultSalesTaxRate: 0.06625, // 6.625%
    },
    
    // UI Settings
    ui: {
        // Auto-save form data to localStorage
        autoSave: true,
        // Show loading animations
        showAnimations: true,
        // Theme colors
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        successColor: '#48bb78',
        errorColor: '#f56565'
    }
};

// Initialize configuration
function initializeConfig() {
    // Set webhook URL in form handler
    if (typeof formHandler !== 'undefined') {
        formHandler.setWebhookUrl(CONFIG.webhookUrl);
    }
    
    // Update calculator settings
    if (typeof calculator !== 'undefined') {
        calculator.defaultInterestRate = CONFIG.finance.defaultInterestRate;
        calculator.defaultLoanTerm = CONFIG.finance.defaultLoanTerm;
    }
    
    console.log('Configuration loaded:', CONFIG);
}

// Export configuration
window.CONFIG = CONFIG;
window.initializeConfig = initializeConfig;

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConfig);
} else {
    initializeConfig();
} 