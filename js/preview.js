// Preview functionality for real-time form data display
class ContractPreview {
    constructor() {
        this.previewContainer = document.getElementById('contractPreview');
        this.init();
    }

    init() {
        this.showPlaceholder();
    }

    // Show placeholder when no data is entered
    showPlaceholder() {
        this.previewContainer.innerHTML = `
            <div class="preview-placeholder">
                <p>Fill out the form to see the preview</p>
            </div>
        `;
    }

    // Update preview with form data
    updatePreview(formData, calculations) {
        if (!formData || Object.keys(formData).length === 0) {
            this.showPlaceholder();
            return;
        }

        const formattedCalc = calculator.getFormattedCalculations();
        
        this.previewContainer.innerHTML = `
            ${this.renderPersonalContactInfo(formData)}
            ${this.renderVehicleInfo(formData)}
            ${formData.tradein_toggle ? this.renderTradeInInfo(formData) : ''}
            ${this.renderFinancialSummary(formData, formattedCalc)}
            ${formData.cobuyer_toggle ? this.renderCoBuyerInfo(formData) : ''}
            ${this.renderAdditionalInfo(formData)}
            ${formData.lien_toggle ? this.renderLienInfo(formData) : ''}
        `;
    }

    // Render personal and contact information section
    renderPersonalContactInfo(data) {
        return `
            <div class="preview-section">
                <h3>Personal & Contact Information</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <div class="preview-label">Full Name</div>
                        <div class="preview-value ${!data.full_name ? 'empty' : ''}">${data.full_name || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Date of Birth</div>
                        <div class="preview-value ${!data.buyer_dob ? 'empty' : ''}">${this.formatDate(data.buyer_dob) || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Gender</div>
                        <div class="preview-value ${!data.buyer_gender ? 'empty' : ''}">${data.buyer_gender || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Eye Color</div>
                        <div class="preview-value ${!data.buyer_eye ? 'empty' : ''}">${data.buyer_eye || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Driver License</div>
                        <div class="preview-value ${!data.buyer_license ? 'empty' : ''}">${data.buyer_license || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Address</div>
                        <div class="preview-value ${!data.buyer_address ? 'empty' : ''}">${data.buyer_address || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">City</div>
                        <div class="preview-value ${!data.buyer_city ? 'empty' : ''}">${data.buyer_city || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">State</div>
                        <div class="preview-value ${!data.buyer_state ? 'empty' : ''}">${data.buyer_state || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">ZIP Code</div>
                        <div class="preview-value ${!data.buyer_zip ? 'empty' : ''}">${data.buyer_zip || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Cell Phone</div>
                        <div class="preview-value ${!data.buyer_cellphone ? 'empty' : ''}">${this.formatPhone(data.buyer_cellphone) || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Residence Phone</div>
                        <div class="preview-value ${!data.buyer_residencephone ? 'empty' : ''}">${this.formatPhone(data.buyer_residencephone) || 'Not provided'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render vehicle information section
    renderVehicleInfo(data) {
        return `
            <div class="preview-section">
                <h3>Vehicle Information</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <div class="preview-label">Year</div>
                        <div class="preview-value ${!data.car_year ? 'empty' : ''}">${data.car_year || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Make</div>
                        <div class="preview-value ${!data.car_make ? 'empty' : ''}">${data.car_make || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Model</div>
                        <div class="preview-value ${!data.car_model ? 'empty' : ''}">${data.car_model || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Body Style</div>
                        <div class="preview-value ${!data.car_body ? 'empty' : ''}">${data.car_body || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Color</div>
                        <div class="preview-value ${!data.car_color ? 'empty' : ''}">${data.car_color || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Mileage</div>
                        <div class="preview-value ${!data.car_miles ? 'empty' : ''}">${data.car_miles ? `${data.car_miles.toLocaleString()} miles` : 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">VIN</div>
                        <div class="preview-value ${!data.car_vin ? 'empty' : ''}">${data.car_vin || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Car Price</div>
                        <div class="preview-value ${!data.car_price ? 'empty' : ''}">${data.car_price ? calculator.formatCurrency(data.car_price) : 'Not provided'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render trade-in information section
    renderTradeInInfo(data) {
        return `
            <div class="preview-section">
                <h3>Trade-in Information</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <div class="preview-label">Trade-in Year</div>
                        <div class="preview-value ${!data.tradein_year ? 'empty' : ''}">${data.tradein_year || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Trade-in Make</div>
                        <div class="preview-value ${!data.tradein_make ? 'empty' : ''}">${data.tradein_make || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Trade-in Model</div>
                        <div class="preview-value ${!data.tradein_model ? 'empty' : ''}">${data.tradein_model || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Trade-in Value</div>
                        <div class="preview-value ${!data.tradein_price ? 'empty' : ''}">${data.tradein_price ? calculator.formatCurrency(data.tradein_price) : 'Not provided'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render financial summary section
    renderFinancialSummary(data, formattedCalc) {
        const dynamicAccessories = this.renderDynamicFields(data, 'accessories');
        const dynamicServices = this.renderDynamicFields(data, 'services');
        
        return `
            <div class="preview-section financial-summary">
                <h3>Financial Summary</h3>
                <div class="financial-item">
                    <span class="financial-label">Selling Price</span>
                    <span class="financial-value">${formattedCalc.carPrice}</span>
                </div>
                <div class="financial-item">
                    <span class="financial-label">Trade-In Value</span>
                    <span class="financial-value">${formattedCalc.tradeInValue}</span>
                </div>
                <div class="financial-item calculated-item">
                    <span class="financial-label">Trade Difference</span>
                    <span class="financial-value">${formattedCalc.tradeDifference}</span>
                </div>
                ${dynamicAccessories}
                <div class="financial-item total-item">
                    <span class="financial-label">Total Accessories</span>
                    <span class="financial-value">${formattedCalc.totalAccessories}</span>
                </div>
                <div class="financial-item">
                    <span class="financial-label">Doc Fees</span>
                    <span class="financial-value">${formattedCalc.docFee}</span>
                </div>
                <div class="financial-item">
                    <span class="financial-label">LoJack</span>
                    <span class="financial-value">${formattedCalc.loJackFee}</span>
                </div>
                ${dynamicServices}
                <div class="financial-item total-item">
                    <span class="financial-label">Total Service Contract</span>
                    <span class="financial-value">${formattedCalc.totalService}</span>
                </div>
                <div class="financial-item calculated-item">
                    <span class="financial-label">Subtotal (Selling Price + Addons)</span>
                    <span class="financial-value">${formattedCalc.subtotal}</span>
                </div>
                <div class="financial-item">
                    <span class="financial-label">Down Payment</span>
                    <span class="financial-value">${formattedCalc.downPayment}</span>
                </div>
                ${data.contract_template === 'NJ' ? `
                <div class="financial-item">
                    <span class="financial-label">Total Taxes</span>
                    <span class="financial-value">${formattedCalc.salesTax}</span>
                </div>
                ` : ''}
                <div class="financial-item">
                    <span class="financial-label">Total Balance Due</span>
                    <span class="financial-value">${formattedCalc.amountDue}</span>
                </div>
            </div>
        `;
    }
    
    // Render dynamic fields for preview
    renderDynamicFields(data, type) {
        let html = '';
        const fields = [];
        
        // Collect all dynamic fields of this type
        Object.keys(data).forEach(key => {
            if (key.startsWith(`${type}_name_`)) {
                const timestamp = key.replace(`${type}_name_`, '');
                const nameValue = data[key];
                const amountKey = `${type}_amount_${timestamp}`;
                const amountValue = data[amountKey];
                
                if (nameValue && amountValue) {
                    fields.push({
                        name: nameValue,
                        amount: parseFloat(amountValue) || 0
                    });
                }
            }
        });
        
        // Render each dynamic field
        fields.forEach(field => {
            html += `
                <div class="financial-item dynamic-item">
                    <span class="financial-label">${field.name}</span>
                    <span class="financial-value">${calculator.formatCurrency(field.amount)}</span>
                </div>
            `;
        });
        
        return html;
    }

    // Render co-buyer information section
    renderCoBuyerInfo(data) {
        return `
            <div class="preview-section">
                <h3>Co-Buyer Information</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer Name</div>
                        <div class="preview-value ${!data.cobuyerfull_name ? 'empty' : ''}">${data.cobuyerfull_name || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer Date of Birth</div>
                        <div class="preview-value ${!data.cobuyer_dob ? 'empty' : ''}">${this.formatDate(data.cobuyer_dob) || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer Gender</div>
                        <div class="preview-value ${!data.cobuyer_gender ? 'empty' : ''}">${data.cobuyer_gender || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer License</div>
                        <div class="preview-value ${!data.cobuyer_license ? 'empty' : ''}">${data.cobuyer_license || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer Address</div>
                        <div class="preview-value ${!data.cobuyer_address ? 'empty' : ''}">${data.cobuyer_address || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer City</div>
                        <div class="preview-value ${!data.cobuyer_city ? 'empty' : ''}">${data.cobuyer_city || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer State</div>
                        <div class="preview-value ${!data.cobuyer_state ? 'empty' : ''}">${data.cobuyer_state || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer ZIP</div>
                        <div class="preview-value ${!data.cobuyer_zip ? 'empty' : ''}">${data.cobuyer_zip || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer Cell Phone</div>
                        <div class="preview-value ${!data.cobuyer_cellphone ? 'empty' : ''}">${this.formatPhone(data.cobuyer_cellphone) || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Co-buyer Residence Phone</div>
                        <div class="preview-value ${!data.cobuyer_residencephone ? 'empty' : ''}">${this.formatPhone(data.cobuyer_residencephone) || 'Not provided'}</div>
                    </div>
                </div>
            </div>
        `;
    }



    // Render additional information section
    renderAdditionalInfo(data) {
        return `
            <div class="preview-section">
                <h3>Additional Information</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <div class="preview-label">Contract Template</div>
                        <div class="preview-value ${!data.contract_template ? 'empty' : ''}">${data.contract_template || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Sales Person</div>
                        <div class="preview-value ${!data.sales_person ? 'empty' : ''}">${data.sales_person || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Dealer Stock</div>
                        <div class="preview-value ${!data.dealer_stock ? 'empty' : ''}">${data.dealer_stock || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Contract Date</div>
                        <div class="preview-value ${!data.date_value ? 'empty' : ''}">${this.formatDate(data.date_value) || 'Not provided'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render lien information section
    renderLienInfo(data) {
        return `
            <div class="preview-section">
                <h3>Lien Information</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <div class="preview-label">Lien Holder Name</div>
                        <div class="preview-value ${!data.lien_name ? 'empty' : ''}">${data.lien_name || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Lien Holder Address</div>
                        <div class="preview-value ${!data.lien_address ? 'empty' : ''}">${data.lien_address || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Lien Holder City</div>
                        <div class="preview-value ${!data.lien_city ? 'empty' : ''}">${data.lien_city || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Lien Holder State</div>
                        <div class="preview-value ${!data.lien_state ? 'empty' : ''}">${data.lien_state || 'Not provided'}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">Lien Holder ZIP</div>
                        <div class="preview-value ${!data.lien_zip ? 'empty' : ''}">${data.lien_zip || 'Not provided'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    // Format phone number for display
    formatPhone(phone) {
        if (!phone) return '';
        // Remove all non-digits
        const cleaned = phone.replace(/\D/g, '');
        // Format as (XXX) XXX-XXXX
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    }
}

// Initialize preview
const preview = new ContractPreview();

// Export for use in other modules
window.ContractPreview = ContractPreview;
window.preview = preview; 