/**
 * VELORA - Zero-Cost Cash on Delivery (COD) Checkout & Order Architecture
 * 
 * Strict Zero-Cost & Serverless Design:
 * - No backend, no database, no external APIs, no paid services.
 * - Uses browser native mailto: generation to deliver complete orders.
 * - Honors honesty: informs customer that their email client must press Send.
 * - Device limitation fallback: provides one-click "Copy Order Details" to clipboard.
 * - Free of WhatsApp requirements (optional configuration hook provided).
 */

// =========================================================================
// 1. CONFIGURATION (Easy to customize from this single location)
// =========================================================================
const ORDER_EMAIL = "quickinformations01@gmail.com";

// Optional: Dedicated WhatsApp Business number with country code (e.g., "923001234567").
// Leave empty ("") to keep WhatsApp completely disabled.
const WHATSAPP_NUMBER = ""; 

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
  });

  function initCheckoutPage() {
    const checkoutContainer = document.getElementById('checkout-page-container');
    if (!checkoutContainer) return;

    renderCheckoutSummary();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', handleOrderSubmission);
    }

    // "Same as mobile number" helper button
    const copyWaBtn = document.getElementById('btn-copy-phone-to-wa');
    const phoneInput = document.getElementById('cust-phone');
    const whatsappInput = document.getElementById('cust-whatsapp');
    if (copyWaBtn && phoneInput && whatsappInput) {
      copyWaBtn.addEventListener('click', () => {
        whatsappInput.value = phoneInput.value;
        whatsappInput.classList.remove('input-error');
        const err = document.getElementById('cust-whatsapp-error');
        if (err) {
          err.textContent = '';
          err.style.display = 'none';
        }
      });
    }
  }

  /**
   * Render dynamic cart items in checkout side summary
   */
  function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-items-list');
    const totalCountElem = document.getElementById('checkout-total-count');
    const subtotalElem = document.getElementById('checkout-subtotal');
    const grandTotalElem = document.getElementById('checkout-grand-total');
    const emptyNotice = document.getElementById('checkout-empty-notice');
    const formSection = document.getElementById('checkout-form-section');

    if (!window.VeloraCart) return;

    const summary = window.VeloraCart.getCartSummary();

    if (summary.items.length === 0) {
      if (emptyNotice) emptyNotice.style.display = 'block';
      if (formSection) formSection.style.display = 'none';
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';
    if (formSection) formSection.style.display = 'block';

    const productsGrid = document.getElementById('checkout-products-grid');
    if (productsGrid) {
      if (summary.items.length === 1) {
        productsGrid.classList.add('is-single');
      } else {
        productsGrid.classList.remove('is-single');
      }

      productsGrid.innerHTML = summary.items.map(item => `
        <article class="checkout-product-card" data-product-id="${item.id}">
          <div class="checkout-product-visual">
            <img src="${item.product.image}" 
                 alt="${item.product.name}" 
                 class="checkout-product-img"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${item.product.fallbackImage || 'assets/images/midnight.webp'}';" />
            <span class="checkout-product-badge">${item.quantity > 1 ? item.quantity + ' ×' : 'Qty: 1'}</span>
          </div>
          <div class="checkout-product-meta">
            <span class="checkout-product-specs">${item.product.type || 'EAU DE PARFUM'} &bull; ${item.product.size || '50 ML'}</span>
            <h3 class="checkout-product-title">${item.product.name}</h3>
            <div class="checkout-product-price-row">
              <span class="checkout-product-price">${item.lineTotalDisplay || item.product.price}</span>
              ${item.quantity > 1 ? `<span class="checkout-product-qty-tag">(${item.product.price} each)</span>` : `<span class="checkout-product-qty-tag">50 ML</span>`}
            </div>
          </div>
        </article>
      `).join('');
    }

    if (summaryList) {
      summaryList.innerHTML = summary.items.map(item => `
        <li class="checkout-item">
          <div class="checkout-item-visual">
            <img src="${item.product.image}" 
                 alt="${item.product.name}" 
                 class="checkout-item-img"
                 onerror="this.onerror=null; this.src='${item.product.fallbackImage || 'assets/images/midnight.webp'}';" />
            <span class="checkout-item-badge">${item.quantity}</span>
          </div>
          <div class="checkout-item-info">
            <h4 class="checkout-item-title">${item.product.name}</h4>
            <span class="checkout-item-meta">${item.product.type || 'EAU DE PARFUM'} &bull; ${item.product.size || '50 ML'}</span>
            <span class="checkout-item-qty">Qty: ${item.quantity}</span>
          </div>
          <div class="checkout-item-price">
            ${item.lineTotalDisplay || item.product.price || 'PKR 0,000'}
          </div>
        </li>
      `).join('');
    }

    if (totalCountElem) totalCountElem.textContent = `${summary.totalCount} ${summary.totalCount === 1 ? 'bottle' : 'bottles'}`;
    if (subtotalElem) subtotalElem.textContent = summary.subtotalDisplay;
    if (grandTotalElem) grandTotalElem.textContent = summary.totalDisplay;
  }

  /**
   * Handle form submission, silent order notification, and clean confirmation
   */
  function handleOrderSubmission(e) {
    e.preventDefault();

    if (!window.VeloraCart) return;
    const summary = window.VeloraCart.getCartSummary();

    if (summary.items.length === 0) {
      alert("Your shopping bag is empty. Please add a fragrance before placing an order.");
      window.location.href = 'collection.html';
      return;
    }

    // Extract customer information
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const whatsappInput = document.getElementById('cust-whatsapp');
    const cityInput = document.getElementById('cust-city');
    const addressInput = document.getElementById('cust-address');
    const noteInput = document.getElementById('cust-notes');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
    const city = cityInput ? cityInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';
    const note = noteInput ? noteInput.value.trim() : '';

    // Field Validations
    let hasError = false;

    function validateField(input, isValid, message) {
      if (!input) return;
      const errorElem = document.getElementById(`${input.id}-error`);
      if (!isValid) {
        input.classList.add('input-error');
        if (errorElem) {
          errorElem.textContent = message;
          errorElem.style.display = 'block';
        }
        if (!hasError) input.focus();
        hasError = true;
      } else {
        input.classList.remove('input-error');
        if (errorElem) {
          errorElem.textContent = '';
          errorElem.style.display = 'none';
        }
      }
    }

    validateField(nameInput, name.length >= 2, "Please enter your full name.");
    
    // Validate phone: minimum 9 characters
    const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
    const phoneValid = cleanPhoneDigits.length >= 9 && cleanPhoneDigits.length <= 16;
    validateField(phoneInput, phoneValid, "Please enter a valid mobile phone number (e.g. 0300 1234567).");

    // Validate WhatsApp: minimum 9 characters
    const cleanWaDigits = whatsapp.replace(/[^0-9]/g, '');
    const waValid = cleanWaDigits.length >= 9 && cleanWaDigits.length <= 16;
    validateField(whatsappInput, waValid, "Please enter a valid WhatsApp number for order coordination.");

    validateField(cityInput, city.length >= 2, "Please provide your delivery city.");
    validateField(addressInput, address.length >= 8, "Please enter your complete physical street address for courier delivery.");

    if (hasError) return;

    // Visual button feedback during submission
    const submitBtn = document.getElementById('btn-submit-order');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.8';
      submitBtn.style.pointerEvents = 'none';
      const titleSpan = submitBtn.querySelector('.btn-order-title');
      if (titleSpan) titleSpan.textContent = 'CONFIRMING ORDER...';
    }

    // Generate Unique Order Reference
    const orderRef = '#VL-' + Math.floor(100000 + Math.random() * 900000);
    const itemsText = summary.items.map(item => `• ${item.product.name} × ${item.quantity} (${item.lineTotalDisplay})`).join('\n');

    const orderText = 
`NEW VELORA COD ORDER
Order Reference: ${orderRef}

CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
WhatsApp: ${whatsapp}
City: ${city}
Address: ${address}
Order Note: ${note || 'None'}

ITEMS ORDERED:
${itemsText}

Total Items: ${summary.totalCount}
Total Payable (COD): ${summary.totalDisplay}
Shipping: Free Nationwide Delivery`;

    // Send email in background without displaying email address on page
    const recipient = ORDER_EMAIL;
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New VELORA COD Order ${orderRef} - ${name}`,
          OrderID: orderRef,
          Customer_Name: name,
          Phone: phone,
          WhatsApp: whatsapp,
          City: city,
          Delivery_Address: address,
          Order_Note: note || 'None',
          Items: summary.items.map(i => `${i.product.name} x${i.quantity}`).join(', '),
          Total_Amount: summary.totalDisplay,
          Payment: 'Cash on Delivery',
          Full_Summary: orderText
        })
      }).catch(() => {
        // Fallback or silent catch
      });
    } catch (err) {}

    // Populate Success Confirmation View
    const successGreeting = document.getElementById('success-customer-greeting');
    const successOrderNumber = document.getElementById('success-order-number');
    const successCustomerName = document.getElementById('success-customer-name');
    const successCustomerWhatsapp = document.getElementById('success-customer-whatsapp');
    const successDeliveryAddress = document.getElementById('success-delivery-address');
    const successTotalPrice = document.getElementById('success-total-price');

    if (successGreeting) successGreeting.textContent = `Thank you, ${name}! Your order has been placed.`;
    if (successOrderNumber) successOrderNumber.textContent = orderRef;
    if (successCustomerName) successCustomerName.textContent = `${name} • ${phone}`;
    if (successCustomerWhatsapp) successCustomerWhatsapp.textContent = whatsapp;
    if (successDeliveryAddress) successDeliveryAddress.textContent = `${address}, ${city}`;
    if (successTotalPrice) successTotalPrice.textContent = summary.totalDisplay;

    // Transition smoothly to success view
    const formSection = document.getElementById('checkout-form-section');
    const successView = document.getElementById('checkout-success-view');

    if (formSection) formSection.style.display = 'none';
    if (successView) {
      successView.style.display = 'block';
      successView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Clear cart
    window.VeloraCart.clearCart();
  }

})();
