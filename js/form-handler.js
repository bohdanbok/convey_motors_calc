// Form handler for real-time updates and webhook submission
class FormHandler {
    constructor() {
        this.form = document.getElementById('contractForm');
        this.webhookUrl = ''; // Will be set from config
        
        // Try to get webhook URL from config if available
        if (window.CONFIG && window.CONFIG.webhookUrl) {
            this.webhookUrl = window.CONFIG.webhookUrl;
        }
        
        if (this.form) {
            this.init();
        } else {
            console.error('❌ Form not found! Cannot initialize FormHandler');
        }
    }

    init() {
        this.setupEventListeners();
        this.setupTemplateButtons();
        this.setupLockedFields();
        this.setupDynamicFields();
        this.setDefaultDate();
        this.initializeDefaultValues();
    }

    // Setup event listeners for form inputs
    setupEventListeners() {
        // Listen for input changes on all form fields
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
            input.addEventListener('change', (e) => this.handleInputChange(e));
        });

        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });
        
        // Also add submit listener at document level to catch any missed events
        document.addEventListener('submit', (e) => {
            if (e.target === this.form) {
                e.preventDefault();
                e.stopPropagation();
                this.handleFormSubmit(e);
            }
        });
        
        // Also add click listener to submit button for debugging
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                // Prevent any default behavior
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Manually trigger form submission
                try {
                    this.handleFormSubmit(e);
                } catch (error) {
                    console.error('Error in handleFormSubmit:', error);
                }
            });
        }

        // Setup number input formatting
        this.setupNumberFormatting();
        
        // Setup co-buyer toggle
        this.setupCoBuyerToggle();
        

        
        // Setup tradein toggle
        this.setupTradeinToggle();
        
        // Setup lien type selection
        this.setupLienTypeSelection();
    }

    // Handle input changes
    handleInputChange(event) {
        const field = event.target;
        const fieldName = field.name;
        let value = field.value;

        // Validate year fields
        if (fieldName.includes('year') && field.type === 'text') {
            // Only allow 4-digit numbers starting with 19 or 20
            const yearPattern = /^(19|20)\d{2}$/;
            if (value && !yearPattern.test(value)) {
                // If invalid, don't update the calculator
                return;
            }
        }

        // Validate currency fields
        if ((fieldName.includes('price') || fieldName === 'down_payment') && field.type === 'text') {
            // Allow numbers with up to 2 decimal places
            const currencyPattern = /^\d+(\.\d{1,2})?$/;
            if (value && !currencyPattern.test(value)) {
                // If invalid, don't update the calculator
                return;
            }
        }

        // Update calculator with new value
        calculator.updateFormData(fieldName, value);

        // Update preview
        preview.updatePreview(calculator.formData, calculator.calculations);
        
        // If this is a locked field that was unlocked, update the default value
        if (field.closest('.locked-field') && field.closest('.locked-field').classList.contains('unlocked')) {
            const lockButton = field.closest('.locked-field').querySelector('.lock-btn');
            if (lockButton) {
                lockButton.dataset.default = value;
            }
        }
    }

    // Handle locked field changes
    handleLockedFieldChange(fieldName, value) {
        calculator.updateFormData(fieldName, value);
        preview.updatePreview(calculator.formData, calculator.calculations);
    }
    
    // Show confirmation modal
    showConfirmationModal(fieldName, defaultValue, input, lockedField, button, lockIcon) {
        const modal = document.getElementById('confirmationModal');
        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');
        
        // Show modal
        modal.style.display = 'block';
        
        // Handle confirm button
        const handleConfirm = () => {
            // Unlock the field
            lockedField.classList.add('unlocked');
            button.classList.add('unlocked');
            input.readOnly = false;
            lockIcon.textContent = '🔓';
            
            // Focus on the input
            input.focus();
            
            // Hide modal
            modal.style.display = 'none';
            
            // Remove event listeners
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleModalClick);
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Handle cancel button
        const handleCancel = () => {
            modal.style.display = 'none';
            
            // Remove event listeners
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleModalClick);
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Handle modal background click
        const handleModalClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        // Add event listeners
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleModalClick);
        document.addEventListener('keydown', handleEscape);
    }



    // Setup template selection buttons
    setupTemplateButtons() {
        const templateButtons = document.querySelectorAll('.template-btn');
        const hiddenInput = document.getElementById('contract_template');
        
        templateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                
                // Remove selected class from all buttons
                templateButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Add selected class to clicked button
                e.currentTarget.classList.add('selected');
                
                // Update hidden input
                if (hiddenInput) {
                    hiddenInput.value = template;
                }
                
                // Show/hide tax section based on template
                this.toggleTaxSection(template);
                
                // Update calculator
                calculator.updateFormData('contract_template', template);
                
                // Update preview
                preview.updatePreview(calculator.formData, calculator.calculations);
                
                // Mark as touched for validation
                if (hiddenInput) {
                    hiddenInput.setAttribute('data-touched', 'true');
                }
            });
        });
    }

    // Toggle tax section visibility
    toggleTaxSection(template) {
        const taxSection = document.getElementById('tax_info_section');
        if (taxSection) {
            if (template === 'NJ') {
                taxSection.style.display = 'block';
            } else {
                taxSection.style.display = 'none';
            }
        }
    }

    // Setup locked fields functionality
    setupLockedFields() {
        const lockButtons = document.querySelectorAll('.lock-btn');
        
        lockButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const fieldName = e.currentTarget.dataset.field;
                const defaultValue = e.currentTarget.dataset.default;
                const input = document.getElementById(fieldName);
                const lockedField = e.currentTarget.closest('.locked-field');
                const lockIcon = e.currentTarget.querySelector('.lock-icon');
                
                if (lockedField.classList.contains('unlocked')) {
                    // Get current user value
                    const currentValue = input.value;
                    
                    // Lock the field
                    lockedField.classList.remove('unlocked');
                    e.currentTarget.classList.remove('unlocked');
                    input.readOnly = true;
                    
                    // Save user value as new default
                    input.value = currentValue;
                    e.currentTarget.dataset.default = currentValue;
                    lockIcon.textContent = '🔒';
                    
                    // Update calculator with current value
                    this.handleLockedFieldChange(fieldName, currentValue);
                } else {
                    // Show confirmation modal before unlocking
                    this.showConfirmationModal(fieldName, defaultValue, input, lockedField, e.currentTarget, lockIcon);
                }
            });
        });
    }

    // Add visual feedback for filled fields


    // Setup number formatting for currency inputs
    setupNumberFormatting() {
        const numberInputs = this.form.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            // Skip year fields and other non-currency fields
            if (input.name.includes('year') || input.name.includes('miles')) {
                return;
            }
            input.addEventListener('blur', (e) => this.formatNumberInput(e.target));
            input.addEventListener('focus', (e) => this.unformatNumberInput(e.target));
        });
        
        // Also handle text fields that should be formatted as currency
        const currencyTextInputs = this.form.querySelectorAll('input[type="text"][name*="price"], input[type="text"][name="down_payment"]');
        currencyTextInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.formatCurrencyInput(e.target));
            input.addEventListener('focus', (e) => this.unformatCurrencyInput(e.target));
        });
    }

    // Format number input for display
    formatNumberInput(input) {
        // Don't format locked fields
        if (input.readOnly || input.closest('.locked-field')) {
            return;
        }
        
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            // Store original value and format for display
            input.setAttribute('data-formatted', input.value);
            const formattedValue = calculator.formatCurrency(value);
            input.value = formattedValue;
        }
    }

    // Unformat number input for editing
    unformatNumberInput(input) {
        // Don't unformat locked fields
        if (input.readOnly || input.closest('.locked-field')) {
            return;
        }
        
        // Restore original value when focusing
        const formattedValue = input.getAttribute('data-formatted');
        if (formattedValue) {
            input.value = formattedValue;
        }
    }

    // Format currency input for display
    formatCurrencyInput(input) {
        // Don't format locked fields
        if (input.readOnly || input.closest('.locked-field')) {
            return;
        }
        
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            // Store original value and format for display
            input.setAttribute('data-formatted', input.value);
            const formattedValue = calculator.formatCurrency(value);
            input.value = formattedValue;
        }
    }

    // Unformat currency input for editing
    unformatCurrencyInput(input) {
        // Don't unformat locked fields
        if (input.readOnly || input.closest('.locked-field')) {
            return;
        }
        
        // Restore original value when focusing
        const formattedValue = input.getAttribute('data-formatted');
        if (formattedValue) {
            input.value = formattedValue;
        }
    }

    // Set default date to today
    setDefaultDate() {
        const dateInput = document.getElementById('date_value');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
            calculator.updateFormData('date_value', today);
        }
    }

    // Initialize default values for locked fields
    initializeDefaultValues() {
        // Initialize DocFee
        const docFeeInput = document.getElementById('docfee_amount');
        if (docFeeInput) {
            calculator.updateFormData('docfee_amount', docFeeInput.value);
        }

        // Initialize LoJack Fee
        const loJackInput = document.getElementById('lo_jack_amount');
        if (loJackInput) {
            calculator.updateFormData('lo_jack_amount', loJackInput.value);
        }

        // Initialize Sales Tax
        const salesTaxInput = document.getElementById('salestax_price');
        if (salesTaxInput) {
            calculator.updateFormData('salestax_price', salesTaxInput.value);
        }

        // Update preview with initial values
        preview.updatePreview(calculator.formData, calculator.calculations);
    }

    // Setup co-buyer toggle functionality
    setupCoBuyerToggle() {
        const toggle = document.getElementById('cobuyer_toggle');
        const cobuyerSection = document.getElementById('cobuyer_section');
        
        if (toggle && cobuyerSection) {
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    cobuyerSection.style.display = 'block';
                    // Make co-buyer fields required when toggle is on
                    this.setCoBuyerFieldsRequired(true);
                } else {
                    cobuyerSection.style.display = 'none';
                    // Clear and unrequire co-buyer fields when toggle is off
                    this.setCoBuyerFieldsRequired(false);
                    this.clearCoBuyerFields();
                }
                
                // Update calculator with toggle state
                calculator.updateFormData('cobuyer_toggle', e.target.checked);
                
                // Update preview
                preview.updatePreview(calculator.formData, calculator.calculations);
            });
        }
    }

    // Set co-buyer fields as required or not
    setCoBuyerFieldsRequired(required) {
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
        
        cobuyerFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.required = required;
                if (!required) {
                    field.setAttribute('data-touched', 'false');
                }
            }
        });
    }

    // Clear co-buyer fields
    clearCoBuyerFields() {
        const cobuyerFields = [
            'cobuyerfull_name',
            'cobuyer_dob',
            'cobuyer_gender',
            'cobuyer_license',
            'cobuyer_address',
            'cobuyer_city',
            'cobuyer_state',
            'cobuyer_zip',
            'cobuyer_cellphone',
            'cobuyer_residencephone'
        ];
        
        cobuyerFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.value = '';
                field.classList.remove('filled');
                field.setAttribute('data-touched', 'false');
                calculator.updateFormData(fieldName, '');
            }
        });
    }



    // Setup tradein toggle functionality
    setupTradeinToggle() {
        const toggle = document.getElementById('tradein_toggle');
        const tradeinSection = document.getElementById('tradein_section');
        
        if (toggle && tradeinSection) {
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    tradeinSection.style.display = 'block';
                    // Make tradein fields required when toggle is on
                    this.setTradeinFieldsRequired(true);
                } else {
                    tradeinSection.style.display = 'none';
                    // Clear and unrequire tradein fields when toggle is off
                    this.setTradeinFieldsRequired(false);
                    this.clearTradeinFields();
                }
                
                // Update calculator with toggle state
                calculator.updateFormData('tradein_toggle', e.target.checked);
                
                // Update preview
                preview.updatePreview(calculator.formData, calculator.calculations);
            });
        }
    }

    // Setup lien type selection
    setupLienTypeSelection() {
        const lienTypeSelect = document.getElementById('lien_type');
        const lienFields = document.getElementById('lien_fields');
        
        if (lienTypeSelect && lienFields) {
            lienTypeSelect.addEventListener('change', (e) => {
                const selectedValue = e.target.value;
                
                if (selectedValue === 'cash') {
                    // Hide lien fields for cash
                    lienFields.style.display = 'none';
                    this.clearLienFields();
                    this.setLienFieldsRequired(false);
                } else {
                    // Show lien fields and auto-fill based on selection
                    lienFields.style.display = 'block';
                    this.setLienFieldsRequired(true);
                    this.fillLienFields(selectedValue);
                }
                
                // Update calculator
                calculator.updateFormData('lien_type', selectedValue);
                
                // Update preview
                preview.updatePreview(calculator.formData, calculator.calculations);
            });
        }
    }

    // Fill lien fields based on selection
    fillLienFields(lienType) {
        const lienData = {
            credit_acceptance: {
                name: 'Credit Acceptance Corp.',
                address: '25505 West 12 Mile Rd.',
                city: 'Southfield',
                state: 'MI',
                zip: '48034'
            },
            westlake: {
                name: 'Westlake Financial Services',
                address: 'P.O. Box 997592',
                city: 'Sacramento',
                state: 'CA',
                zip: '95899'
            },
            western_funding: {
                name: 'Western Funding',
                address: '3915 E. Patrick Lane',
                city: 'Las Vegas',
                state: 'NV',
                zip: '89120'
            }
        };
        
        const data = lienData[lienType];
        if (data) {
            document.getElementById('lien_name').value = data.name;
            document.getElementById('lien_address').value = data.address;
            document.getElementById('lien_city').value = data.city;
            document.getElementById('lien_state').value = data.state;
            document.getElementById('lien_zip').value = data.zip;
            
            // Update calculator with lien data
            calculator.updateFormData('lien_name', data.name);
            calculator.updateFormData('lien_address', data.address);
            calculator.updateFormData('lien_city', data.city);
            calculator.updateFormData('lien_state', data.state);
            calculator.updateFormData('lien_zip', data.zip);
        }
    }

    // Clear lien fields
    clearLienFields() {
        const lienFields = ['lien_name', 'lien_address', 'lien_city', 'lien_state', 'lien_zip'];
        lienFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.value = '';
                calculator.updateFormData(fieldName, '');
            }
        });
    }

    // Set lien fields as required or not
    setLienFieldsRequired(required) {
        const lienFields = ['lien_name', 'lien_address', 'lien_city', 'lien_state', 'lien_zip'];
        lienFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.required = required;
            }
        });
    }

    // Set tradein fields as required or not
    setTradeinFieldsRequired(required) {
        const tradeinFields = [
            'tradein_year',
            'tradein_make',
            'tradein_model',
            'tradein_price'
        ];
        
        tradeinFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.required = required;
                if (!required) {
                    field.setAttribute('data-touched', 'false');
                }
            }
        });
    }

    // Clear tradein fields
    clearTradeinFields() {
        const tradeinFields = [
            'tradein_year',
            'tradein_make',
            'tradein_model',
            'tradein_price'
        ];
        
        tradeinFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.value = '';
                field.classList.remove('filled');
                field.setAttribute('data-touched', 'false');
                calculator.updateFormData(fieldName, '');
            }
        });
    }

    // Handle form submission
    async handleFormSubmit(event) {
        // Prevent default form submission
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // Validate form
        const validation = calculator.validateForm();
        
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        // Show loading state
        this.showLoadingState();

        try {
            // Get form data for webhook
            const formData = calculator.getFormDataForWebhook();
            
            // Send to webhook
            const response = await this.sendToWebhook(formData);
            
            if (response.success) {
                this.showSuccessMessage();
            } else {
                this.showErrorMessage(response.message || 'Failed to generate contract');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('An error occurred while generating the contract');
        } finally {
            this.hideLoadingState();
        }
    }

    // Send data to webhook
    async sendToWebhook(data) {
        // If no webhook URL is set, show configuration message
        if (!this.webhookUrl) {
            return {
                success: false,
                message: 'Webhook URL not configured. Please set the webhook URL in the configuration.'
            };
        }

        // Debug: Log the data being sent
        console.log('Webhook data being sent:', data);
        console.log('Lien type:', data.lien_type);
        console.log('Lien fields:', {
            lien_name: data.lien_name,
            lien_address: data.lien_address,
            lien_city: data.lien_city,
            lien_state: data.lien_state,
            lien_zip: data.lien_zip
        });

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                return {
                    success: true,
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: `HTTP ${response.status}: ${response.statusText}`
                };
            }
        } catch (error) {
            throw new Error(`Webhook request failed: ${error.message}`);
        }
    }

    // Show validation errors
    showValidationErrors(errors) {
        // Clear previous errors
        this.clearValidationErrors();

        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'validation-errors';
        errorMessage.innerHTML = `
            <h4>Please fix the following errors:</h4>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        // Insert error message before form
        this.form.parentNode.insertBefore(errorMessage, this.form);

        // Add red borders to invalid fields
        this.highlightInvalidFields(errors);

        // Scroll to errors
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Clear validation errors
    clearValidationErrors() {
        const existingErrors = document.querySelector('.validation-errors');
        if (existingErrors) {
            existingErrors.remove();
        }
        
        // Remove error styling from all fields
        this.clearFieldErrors();
    }

    // Highlight invalid fields with red borders
    highlightInvalidFields(errors) {
        // Clear previous error styling
        this.clearFieldErrors();
        
        // Map error messages to field names
        const fieldErrorMap = {
            'Contract template is required': 'contract_template',
            'Full name is required': 'full_name',
            'Buyer dob is required': 'buyer_dob',
            'Buyer gender is required': 'buyer_gender',
            'Buyer license is required': 'buyer_license',
            'Buyer address is required': 'buyer_address',
            'Buyer city is required': 'buyer_city',
            'Buyer state is required': 'buyer_state',
            'Buyer zip is required': 'buyer_zip',
            'Buyer cellphone is required': 'buyer_cellphone',
            'Car year is required': 'car_year',
            'Car make is required': 'car_make',
            'Car model is required': 'car_model',
            'Car vin is required': 'car_vin',
            'Car price is required': 'car_price',
            // Co-buyer fields
            'Co-buyerfull name is required': 'cobuyerfull_name',
            'Co-buyer dob is required': 'cobuyer_dob',
            'Co-buyer license is required': 'cobuyer_license',
            'Co-buyer address is required': 'cobuyer_address',
            'Co-buyer city is required': 'cobuyer_city',
            'Co-buyer state is required': 'cobuyer_state',
            'Co-buyer zip is required': 'cobuyer_zip',
            'Co-buyer cellphone is required': 'cobuyer_cellphone',
            // Lien fields
            'Lien holder name is required': 'lien_name',
            'Lien holder address is required': 'lien_address',
            'Lien holder city is required': 'lien_city',
            'Lien holder state is required': 'lien_state',
            'Lien holder zip is required': 'lien_zip',
            // Trade-in fields
            'Trade-in year is required': 'tradein_year',
            'Trade-in make is required': 'tradein_make',
            'Trade-in model is required': 'tradein_model',
            'Trade-in price is required': 'tradein_price'
        };
        
        // Add error class to invalid fields
        errors.forEach(error => {
            const fieldName = fieldErrorMap[error];
            
            if (fieldName) {
                const field = document.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.classList.add('error');
                    
                    // Scroll to the first error field
                    if (!document.querySelector('.error')) {
                        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        field.focus();
                    }
                }
            }
        });
    }

    // Clear error styling from all fields
    clearFieldErrors() {
        const errorFields = this.form.querySelectorAll('input.error, select.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }

    // Show loading modal
    showLoadingModal() {
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) {
            loadingModal.style.display = 'block';
        }
    }

    // Hide loading modal
    hideLoadingModal() {
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) {
            loadingModal.style.display = 'none';
        }
    }

    // Show success modal
    showSuccessModal() {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.style.display = 'block';
            
            // Setup success modal event listeners
            const successOkBtn = document.getElementById('successOk');
            if (successOkBtn) {
                const handleSuccessOk = () => {
                    successModal.style.display = 'none';
                    successOkBtn.removeEventListener('click', handleSuccessOk);
                };
                successOkBtn.addEventListener('click', handleSuccessOk);
            }
        }
    }

    // Clear form after successful submission
    clearForm() {
        // Reset form
        this.form.reset();
        
        // Clear dynamic fields
        this.clearDynamicFields();
        
        // Reset template selection
        const templateButtons = document.querySelectorAll('.template-btn');
        templateButtons.forEach(btn => btn.classList.remove('selected'));
        document.getElementById('contract_template').value = '';
        
        // Reset toggles
        document.getElementById('tradein_toggle').checked = false;
        document.getElementById('cobuyer_toggle').checked = false;
        document.getElementById('lien_type').value = 'cash';
        
        // Hide sections
        document.getElementById('tradein_section').style.display = 'none';
        document.getElementById('cobuyer_section').style.display = 'none';
        document.getElementById('lien_fields').style.display = 'none';
        document.getElementById('tax_info_section').style.display = 'none';
        
        // Reset locked fields to defaults
        const lockButtons = document.querySelectorAll('.lock-btn');
        lockButtons.forEach(button => {
            const fieldName = button.dataset.field;
            const defaultValue = button.dataset.default;
            const input = document.getElementById(fieldName);
            if (input) {
                input.value = defaultValue;
                input.readOnly = true;
            }
            const lockedField = button.closest('.locked-field');
            if (lockedField) {
                lockedField.classList.remove('unlocked');
                button.classList.remove('unlocked');
            }
            const lockIcon = button.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.textContent = '🔒';
            }
        });
        
        // Clear validation errors
        this.clearValidationErrors();
        
        // Reset calculator
        calculator.reset();
        
        // Update preview
        preview.updatePreview(calculator.formData, calculator.calculations);
        
        // Set default date
        this.setDefaultDate();
    }

    // Show loading state (for backward compatibility)
    showLoadingState() {
        this.showLoadingModal();
    }

    // Hide loading state (for backward compatibility)
    hideLoadingState() {
        this.hideLoadingModal();
    }

    // Show success message
    showSuccessMessage() {
        this.hideLoadingModal();
        this.showSuccessModal();
        this.clearForm();
    }

    // Show error message
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    // Show message
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(messageElement);

        // Auto-remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    // Set webhook URL
    setWebhookUrl(url) {
        this.webhookUrl = url;
    }

    // Get current form data
    getFormData() {
        return calculator.formData;
    }

    // Get current calculations
    getCalculations() {
        return calculator.calculations;
    }
    


    // Reset form
    // Setup dynamic fields functionality
    setupDynamicFields() {
        const addButtons = document.querySelectorAll('.add-field-btn');
        
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const containerType = e.currentTarget.dataset.container;
                const maxFields = parseInt(e.currentTarget.dataset.max);
                this.addDynamicField(containerType, maxFields);
            });
        });
    }
    
    // Add a new dynamic field
    addDynamicField(containerType, maxFields) {
        const container = document.getElementById(`${containerType}-container`);
        const allFieldGroups = container.querySelectorAll('.dynamic-field-group');
        
        if (allFieldGroups.length >= maxFields) {
            this.showMessage(`Maximum ${maxFields} fields allowed for ${containerType}`, 'error');
            return;
        }
        
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'dynamic-field-group';
        
        // Find the next available slot (1-4 for accessories, 1-4 for services)
        const existingDynamicFields = container.querySelectorAll('.dynamic-field-group:not(.locked-service-group)');
        let fieldNumber = 1;
        
        // Find the first available slot
        while (fieldNumber <= maxFields) {
            const existingField = container.querySelector(`[name="${containerType}_name_extra_${fieldNumber}"]`);
            if (!existingField) {
                break; // Found available slot
            }
            fieldNumber++;
        }
        
        // Create fixed field names based on slot position
        const fieldId = `${containerType}_extra_${fieldNumber}`;
        const fieldName = `${containerType}_name_extra_${fieldNumber}`;
        const fieldAmount = `${containerType}_amount_extra_${fieldNumber}`;
        
        fieldGroup.innerHTML = `
            <div class="form-group field-name">
                <input type="text" id="${fieldName}" name="${fieldName}" placeholder="Enter ${containerType} name">
            </div>
            <div class="form-group field-amount">
                <input type="number" id="${fieldAmount}" name="${fieldAmount}" min="0" step="0.01" placeholder="0.00">
                <button type="button" class="remove-field-btn" data-field-id="${fieldId}">×</button>
            </div>
        `;
        
        container.appendChild(fieldGroup);
        
        // Add event listeners to new fields
        const newInputs = fieldGroup.querySelectorAll('input');
        newInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
            input.addEventListener('change', (e) => this.handleInputChange(e));
        });
        
        // Add remove button event listener
        const removeBtn = fieldGroup.querySelector('.remove-field-btn');
        removeBtn.addEventListener('click', (e) => {
            this.removeDynamicField(e.currentTarget.dataset.fieldId);
        });
        
        // Update calculator with new field
        calculator.updateFormData(fieldName, '');
        calculator.updateFormData(fieldAmount, '0');
        
        // Update preview
        preview.updatePreview(calculator.formData, calculator.calculations);
        
        // Check if we've reached the maximum
        this.updateAddButtonState(containerType, maxFields);
    }
    
    // Remove a dynamic field
    removeDynamicField(fieldId) {
        const removeButton = document.querySelector(`[data-field-id="${fieldId}"]`);
        const fieldGroup = removeButton.closest('.dynamic-field-group');
        const container = fieldGroup.parentElement;
        const containerType = container.id.replace('-container', '');
        
        // Get field names before removing
        const nameField = fieldGroup.querySelector('.field-name input');
        const amountField = fieldGroup.querySelector('.field-amount input');
        
        // Remove from calculator
        if (nameField) {
            calculator.updateFormData(nameField.name, '');
        }
        if (amountField) {
            calculator.updateFormData(amountField.name, '0');
        }
        
        // Remove from DOM
        fieldGroup.remove();
        
        // Update preview
        preview.updatePreview(calculator.formData, calculator.calculations);
        
        // Update add button state
        const maxFields = parseInt(document.querySelector(`[data-container="${containerType}"]`).dataset.max);
        this.updateAddButtonState(containerType, maxFields);
    }
    


    // Update add button state based on field count
    updateAddButtonState(containerType, maxFields) {
        const container = document.getElementById(`${containerType}-container`);
        const addButton = document.querySelector(`[data-container="${containerType}"]`);
        
        // Count all field groups (both locked and dynamic)
        const allFieldGroups = container.querySelectorAll('.dynamic-field-group');
        
        if (allFieldGroups.length >= maxFields) {
            addButton.disabled = true;
            addButton.querySelector('.add-text').textContent = `Max ${maxFields} reached`;
        } else {
            addButton.disabled = false;
            addButton.querySelector('.add-text').textContent = `Add ${containerType.charAt(0).toUpperCase() + containerType.slice(1).slice(0, -1)}`;
        }
    }
    
    // Clear all dynamic fields
    clearDynamicFields() {
        const dynamicGroups = document.querySelectorAll('.dynamic-field-group:not(.locked-service-group)');
        dynamicGroups.forEach(group => {
            group.remove();
        });
        
        // Reset add buttons
        const addButtons = document.querySelectorAll('.add-field-btn');
        addButtons.forEach(button => {
            const containerType = button.dataset.container;
            const maxFields = parseInt(button.dataset.max);
            this.updateAddButtonState(containerType, maxFields);
        });
        
        // Clear form data for dynamic fields with fixed names
        Object.keys(calculator.formData).forEach(key => {
            if (key.includes('_name_extra_') || key.includes('_amount_extra_')) {
                delete calculator.formData[key];
            }
        });
        
        // Update calculator and preview
        calculator.calculateTotals();
        preview.updatePreview(calculator.formData, calculator.calculations);
    }
    

}

// Initialize form handler
const formHandler = new FormHandler();



// Add message styles to head
const messageStyles = `
    <style>
        .message {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        }
        
        .message-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .message-success {
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
        }
        
        .message-error {
            background: linear-gradient(135deg, #f56565, #e53e3e);
            color: white;
        }
        
        .message-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .message-close:hover {
            opacity: 1;
        }
        
        .validation-errors {
            background: rgba(245, 101, 101, 0.1);
            border: 2px solid #f56565;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            color: #e53e3e;
        }
        
        .validation-errors h4 {
            margin-bottom: 1rem;
            color: #e53e3e;
        }
        
        .validation-errors ul {
            list-style: none;
            padding: 0;
        }
        
        .validation-errors li {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(229, 62, 62, 0.2);
        }
        
        .validation-errors li:last-child {
            border-bottom: none;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .form-group input.filled,
        .form-group select.filled {
            border-color: #48bb78;
            background: rgba(72, 187, 120, 0.05);
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', messageStyles);

// Export for use in other modules
window.FormHandler = FormHandler;
window.formHandler = formHandler; 