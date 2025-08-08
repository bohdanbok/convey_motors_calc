// Calculator functionality for contract calculations
class ContractCalculator {
    constructor() {
        this.formData = {};
        this.calculations = {};
    }

    // Update form data and recalculate
    updateFormData(fieldName, value) {
        this.formData[fieldName] = value;
        this.calculateTotals();
    }

    // Calculate all totals
    calculateTotals() {
        this.calculations = {
            carPrice: this.roundToCents(this.parseNumber(this.formData.car_price) || 0),
            tradeInValue: this.roundToCents(this.parseNumber(this.formData.tradein_price) || 0),
            downPayment: this.roundToCents(this.parseNumber(this.formData.down_payment) || 0),
            docFee: this.roundToCents(this.parseNumber(this.formData.docfee_amount) || 0),
            salesTaxRate: this.parseNumber(this.formData.salestax_price) || 0,
            loJackFee: this.roundToCents(this.parseNumber(this.formData.lo_jack_amount) || 0)
        };

        // Calculate dynamic accessories
        this.calculations.dynamicAccessories = this.roundToCents(this.calculateDynamicFields('accessories'));
        this.calculations.totalAccessories = this.calculations.dynamicAccessories;

        // Calculate dynamic services
        this.calculations.dynamicServices = this.roundToCents(this.calculateDynamicFields('services'));
        this.calculations.totalService = this.roundToCents(this.calculations.docFee + 
                                       this.calculations.loJackFee + 
                                       this.calculations.dynamicServices);

        // Calculate trade difference (Selling Price - Trade In)
        this.calculations.tradeDifference = this.roundToCents(this.calculations.carPrice - this.calculations.tradeInValue);

        // Calculate subtotal (Trade Difference + Total Accessories + Total Service Contract)
        this.calculations.subtotal = this.roundToCents(this.calculations.tradeDifference + 
                                   this.calculations.totalAccessories + 
                                   this.calculations.totalService);

        // Calculate sales tax for NJ, NY, and PA templates
        const selectedTemplate = this.formData.contract_template || '';
        if (['NJ', 'NY', 'PA'].includes(selectedTemplate)) {
            this.calculations.salesTax = this.roundToCents((this.calculations.subtotal * this.calculations.salesTaxRate) / 100);
        } else {
            this.calculations.salesTax = 0;
        }

        // Calculate total balance due (Subtotal - Down Payment + Total Taxes)
        this.calculations.amountDue = this.roundToCents(this.calculations.subtotal - this.calculations.downPayment + this.calculations.salesTax);

        // Calculate monthly payment estimate (simplified calculation)
        this.calculations.monthlyPayment = this.calculateMonthlyPayment();

        return this.calculations;
    }
    
    // Calculate dynamic fields total
    calculateDynamicFields(type) {
        let total = 0;
        Object.keys(this.formData).forEach(key => {
            if (key.startsWith(`${type}_amount_extra_`)) {
                total += this.parseNumber(this.formData[key]) || 0;
            }
        });
        return total;
    }

    // Calculate monthly payment (simplified)
    calculateMonthlyPayment() {
        const principal = this.calculations.amountDue;
        const rate = 0.049; // 4.9% annual rate (example)
        const years = 5; // 5 year term (example)
        const monthlyRate = rate / 12;
        const numberOfPayments = years * 12;

        if (principal <= 0 || monthlyRate <= 0) {
            return 0;
        }

        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        return this.roundToCents(monthlyPayment);
    }

    // Parse number safely
    parseNumber(value) {
        if (!value || value === '') return 0;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    // Round to cents (2 decimal places)
    roundToCents(amount) {
        return Math.round(amount * 100) / 100;
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Format currency for webhook (with $ symbol)
    formatCurrencyForWebhook(amount) {
        if (amount === 0 || amount === null || amount === undefined) {
            return '$0.00';
        }
        const roundedAmount = this.roundToCents(amount);
        return `$${roundedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Get all calculations
    getCalculations() {
        return this.calculations;
    }

    // Get formatted calculations for display
    getFormattedCalculations() {
        const calc = this.calculations;
        return {
            carPrice: this.formatCurrency(calc.carPrice),
            tradeInValue: this.formatCurrency(calc.tradeInValue),
            tradeDifference: this.formatCurrency(calc.tradeDifference),
            downPayment: this.formatCurrency(calc.downPayment),
            docFee: this.formatCurrency(calc.docFee),
            salesTax: this.formatCurrency(calc.salesTax),
            totalAccessories: this.formatCurrency(calc.totalAccessories),
            totalService: this.formatCurrency(calc.totalService),
            loJackFee: this.formatCurrency(calc.loJackFee),
            subtotal: this.formatCurrency(calc.subtotal),
            amountDue: this.formatCurrency(calc.amountDue),
            monthlyPayment: this.formatCurrency(calc.monthlyPayment)
        };
    }

    // Validate required fields
    validateForm() {
        const requiredFields = [
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
            'car_miles',
            'car_vin',
            'dealer_stock',
            'car_price',
            'contract_template',
            'warranty_type'
        ];

        // Add co-buyer fields if toggle is enabled
        if (this.formData.cobuyer_toggle) {
            const cobuyerFields = [
                'cobuyerfull_name',
                'cobuyer_dob',
                'cobuyer_license',
                'cobuyer_address',
                'cobuyer_city',
                'cobuyer_state',
                'cobuyer_zip',
                'cobuyer_cellphone'
            ];
            requiredFields.push(...cobuyerFields);
        }

        // Add lien fields if lien_type is not 'cash'
        if (this.formData.lien_type && this.formData.lien_type !== 'cash') {
            const lienFields = [
                'lien_name',
                'lien_address',
                'lien_city',
                'lien_state',
                'lien_zip'
            ];
            requiredFields.push(...lienFields);
        }

        // Add tradein fields if toggle is enabled
        if (this.formData.tradein_toggle) {
            const tradeinFields = [
                'tradein_year',
                'tradein_make',
                'tradein_model',
                'tradein_price'
            ];
            requiredFields.push(...tradeinFields);
        }

        const errors = [];
        
        requiredFields.forEach(field => {
            const value = this.formData[field];
            
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                const fieldName = field.replace(/_/g, ' ').replace('cobuyer', 'Co-buyer').replace('lien', 'Lien Holder').replace('tradein', 'Trade-in');
                const errorMsg = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                errors.push(errorMsg);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Get all form data for webhook
    getFormDataForWebhook() {
        // Create base data object
        const webhookData = {
            ...this.formData,
            calculated_at: new Date().toISOString()
        };

        // Format all monetary values with $ symbol
        const monetaryFields = [
            'car_price', 'tradein_price', 'down_payment',
            'docfee_amount', 'lo_jack_amount', 'salestax_price'
        ];

        // Format monetary form fields
        monetaryFields.forEach(field => {
            if (webhookData[field] !== undefined && webhookData[field] !== '') {
                const amount = this.parseNumber(webhookData[field]);
                webhookData[field] = this.formatCurrencyForWebhook(amount);
            } else if (webhookData[field] !== undefined) {
                // If field exists but is empty, format as $ 0.00
                webhookData[field] = this.formatCurrencyForWebhook(0);
            }
        });

        // Format dynamic accessories and services
        Object.keys(webhookData).forEach(key => {
            if (key.includes('_amount_extra_')) {
                const amount = this.parseNumber(webhookData[key]);
                webhookData[key] = this.formatCurrencyForWebhook(amount);
            }
        });

        // Format calculated values with $ symbol
        webhookData.trade_diff = this.formatCurrencyForWebhook(this.calculations.tradeDifference);
        webhookData.duenow_price = this.formatCurrencyForWebhook(this.calculations.amountDue);
        webhookData.carPrice = this.formatCurrencyForWebhook(this.calculations.carPrice);
        webhookData.tradeInValue = this.formatCurrencyForWebhook(this.calculations.tradeInValue);
        webhookData.downPayment = this.formatCurrencyForWebhook(this.calculations.downPayment);
        webhookData.docFee = this.formatCurrencyForWebhook(this.calculations.docFee);
        webhookData.salesTax = this.formatCurrencyForWebhook(this.calculations.salesTax);
        webhookData.totalAccessories = this.formatCurrencyForWebhook(this.calculations.totalAccessories);
        webhookData.totalService = this.formatCurrencyForWebhook(this.calculations.totalService);
        webhookData.loJackFee = this.formatCurrencyForWebhook(this.calculations.loJackFee);
        webhookData.subtotal = this.formatCurrencyForWebhook(this.calculations.subtotal);
        webhookData.amountDue = this.formatCurrencyForWebhook(this.calculations.amountDue);
        webhookData.monthlyPayment = this.formatCurrencyForWebhook(this.calculations.monthlyPayment);
        webhookData.dynamicAccessories = this.formatCurrencyForWebhook(this.calculations.dynamicAccessories);
        webhookData.dynamicServices = this.formatCurrencyForWebhook(this.calculations.dynamicServices);
        webhookData.tradeDifference = this.formatCurrencyForWebhook(this.calculations.tradeDifference);

        // Warranty checkboxes for template mapping (mutually exclusive X marks)
        webhookData.as_is_no_warranty_mark = this.formData.warranty_type === 'AS_IS' ? 'X' : '';
        webhookData.warranty_mark = this.formData.warranty_type === 'WARRANTY' ? 'X' : '';

        return webhookData;
    }

    // Reset calculator
    reset() {
        this.formData = {};
        this.calculations = {};
    }
}

// Initialize calculator
const calculator = new ContractCalculator();

// Export for use in other modules
window.ContractCalculator = ContractCalculator;
window.calculator = calculator; 