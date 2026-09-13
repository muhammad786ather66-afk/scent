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

    // Modal Copy Button listener
    const copyBtn = document.getElementById('btn-copy-order-details');
    if (copyBtn) {
      copyBtn.addEventListener('click', handleCopyOrderDetails);
    }

    // Clear cart & return button in confirmation modal
    const clearReturnBtn = document.getElementById('btn-confirm-return');
    if (clearReturnBtn) {
      clearReturnBtn.addEventListener('click', () => {
        if (window.VeloraCart) {
          window.VeloraCart.clearCart();
        }
        window.location.href = 'collection.html';
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
   * Handle form submission and mailto trigger
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
    const cityInput = document.getElementById('cust-city');
    const addressInput = document.getElementById('cust-address');
    const noteInput = document.getElementById('cust-notes');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
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
    
    // Validate phone: minimum 9 characters, allowed digits, plus, hyphens, spaces
    const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
    const phoneValid = cleanPhoneDigits.length >= 9 && cleanPhoneDigits.length <= 16;
    validateField(phoneInput, phoneValid, "Please enter a valid mobile phone number (e.g. 0300 1234567).");

    validateField(cityInput, city.length >= 2, "Please provide your delivery city.");
    validateField(addressInput, address.length >= 8, "Please enter your complete physical street address for courier delivery.");

    if (hasError) return;

    // Generate Formatted Plain-Text Order Body
    const itemsText = summary.items.map(item => `• ${item.product.name} × ${item.quantity}`).join('\n');

    const orderText = 
`VELORA COD ORDER

Customer Information
Name: ${name}
Phone: ${phone}
City: ${city}
Delivery Address: ${address}
Order Note: ${note || 'None'}

Order Details
${itemsText}

Total Items: ${summary.totalCount}
Subtotal: ${summary.subtotalDisplay}
Delivery: Free Shipping
Payment: Cash on Delivery`;

    // Store current order text in memory for the Copy Details button
    window._currentOrderText = orderText;
    window._currentCustomerEmail = ORDER_EMAIL;

    // Email Subject
    const subject = `New VELORA COD Order - ${name}`;

    // Construct Mailto URL
    const mailtoURL = `mailto:${encodeURIComponent(ORDER_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderText)}`;

    // Populate Modal with Order Summary Details
    populateConfirmationModal({
      name,
      phone,
      city,
      address,
      note,
      summary,
      orderText,
      mailtoURL
    });

    // Attempt to open device email application
    try {
      window.location.href = mailtoURL;
    } catch (err) {
      console.warn('Mailto invocation error:', err);
    }

    // Display the honest order preparation confirmation modal
    showOrderPreparedModal();
  }

  /**
   * Populate modal with order summary
   */
  function populateConfirmationModal(data) {
    const custElem = document.getElementById('modal-summary-customer');
    const itemsElem = document.getElementById('modal-summary-items');
    const totalElem = document.getElementById('modal-summary-total');
    const emailElem = document.getElementById('modal-order-email-display');
    const orderPreviewBox = document.getElementById('modal-raw-order-text');

    if (custElem) {
      custElem.innerHTML = `
        <strong>${data.name}</strong> &bull; ${data.phone}<br>
        <span>${data.address}, ${data.city}</span>
        ${data.note ? `<br><em style="color: var(--color-gold); font-size: 0.85rem;">Note: ${data.note}</em>` : ''}
      `;
    }

    if (itemsElem) {
      itemsElem.innerHTML = data.summary.items.map(i => `
        <div class="confirm-item-row">
          <span>${i.product.name} &times; ${i.quantity}</span>
          <span>${i.lineTotalDisplay || i.product.price}</span>
        </div>
      `).join('');
    }

    if (totalElem) {
      totalElem.textContent = data.summary.totalDisplay;
    }

    if (emailElem) {
      emailElem.textContent = ORDER_EMAIL;
    }

    const openEmailBtn = document.getElementById('btn-modal-open-email');
    if (openEmailBtn && data.mailtoURL) {
      openEmailBtn.href = data.mailtoURL;
    }

    if (orderPreviewBox) {
      orderPreviewBox.value = data.orderText;
    }

    // Handle optional WhatsApp hook
    const whatsappSection = document.getElementById('modal-whatsapp-section');
    if (whatsappSection) {
      if (WHATSAPP_NUMBER && WHATSAPP_NUMBER.trim().length > 5) {
        whatsappSection.style.display = 'block';
        const waBtn = document.getElementById('btn-whatsapp-order');
        if (waBtn) {
          const waUrl = `https://wa.me/${encodeURIComponent(WHATSAPP_NUMBER.trim())}?text=${encodeURIComponent(data.orderText)}`;
          waBtn.href = waUrl;
        }
      } else {
        whatsappSection.style.display = 'none';
      }
    }
  }

  /**
   * Show Order Prepared Confirmation Modal
   */
  function showOrderPreparedModal() {
    const modal = document.getElementById('order-prepared-modal');
    if (!modal) return;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Copy Order Details to Clipboard
   */
  function handleCopyOrderDetails() {
    const copyBtn = document.getElementById('btn-copy-order-details');
    const orderText = window._currentOrderText;
    if (!orderText) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(orderText).then(() => {
        setCopySuccess(copyBtn);
      }).catch(() => {
        fallbackCopyText(orderText, copyBtn);
      });
    } else {
      fallbackCopyText(orderText, copyBtn);
    }
  }

  function fallbackCopyText(text, btn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(btn);
    } catch (e) {
      alert("Please manually copy the order details displayed in the box.");
    }
    document.body.removeChild(textArea);
  }

  function setCopySuccess(btn) {
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Order details copied!
    `;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('copied');
    }, 4000);
  }

})();
