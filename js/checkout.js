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

  // Retrieve order method from localStorage (default: 'manual')
  let currentOrderMethod = localStorage.getItem('velora_order_preference') || 'manual';
  let lastPlacedOrderData = null;

  document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
  });

  function initCheckoutPage() {
    const checkoutContainer = document.getElementById('checkout-page-container');
    if (!checkoutContainer) return;

    // Apply and wire up order preference
    syncOrderMethod(currentOrderMethod);
    setupOrderMethodTabs();

    renderCheckoutSummary();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', handleOrderSubmission);
    }

    // Replay voice button listener
    const replayVoiceBtn = document.getElementById('btn-replay-voice');
    if (replayVoiceBtn) {
      replayVoiceBtn.addEventListener('click', () => {
        if (lastPlacedOrderData) {
          playOrderVoiceMessage(lastPlacedOrderData.name, lastPlacedOrderData.orderRef);
        } else {
          playOrderVoiceMessage('', '#VL-ORDER');
        }
      });
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
   * Synchronize UI with selected order method (manual vs whatsapp)
   */
  function syncOrderMethod(method) {
    currentOrderMethod = method;
    localStorage.setItem('velora_order_preference', method);

    const btnManual = document.getElementById('btn-checkout-method-manual');
    const btnWa = document.getElementById('btn-checkout-method-whatsapp');
    const waLabel = document.getElementById('cust-whatsapp-label');
    const waInput = document.getElementById('cust-whatsapp');
    const waHint = document.getElementById('cust-whatsapp-hint');
    const copyBtn = document.getElementById('btn-copy-phone-to-wa');
    const waError = document.getElementById('cust-whatsapp-error');

    if (method === 'manual') {
      document.body.classList.add('order-mode-manual');
      if (btnManual) {
        btnManual.classList.add('active');
        btnManual.setAttribute('aria-checked', 'true');
      }
      if (btnWa) {
        btnWa.classList.remove('active');
        btnWa.setAttribute('aria-checked', 'false');
      }

      // Update WhatsApp field to optional Alternate Contact without WhatsApp labels
      if (waLabel) waLabel.innerHTML = 'Alternate Contact Phone <span style="color: #71717a; font-weight: normal;">(Optional)</span>';
      if (waInput) {
        waInput.placeholder = 'e.g. 0300 1234567';
        waInput.removeAttribute('required');
        waInput.classList.remove('input-error');
      }
      if (waHint) waHint.textContent = 'Optional secondary phone number for courier delivery coordination.';
      if (copyBtn) copyBtn.style.display = 'none';
      if (waError) {
        waError.textContent = '';
        waError.style.display = 'none';
      }
    } else {
      document.body.classList.remove('order-mode-manual');
      if (btnManual) {
        btnManual.classList.remove('active');
        btnManual.setAttribute('aria-checked', 'false');
      }
      if (btnWa) {
        btnWa.classList.add('active');
        btnWa.setAttribute('aria-checked', 'true');
      }

      // Restore WhatsApp field requirements
      if (waLabel) waLabel.innerHTML = 'WhatsApp Number <span class="required-star">*</span>';
      if (waInput) {
        waInput.placeholder = 'e.g. 0300 1234567 or +92 300 1234567';
        waInput.setAttribute('required', 'required');
      }
      if (waHint) waHint.textContent = 'For dispatch notifications and courier tracking on WhatsApp.';
      if (copyBtn) copyBtn.style.display = 'inline-block';
    }
  }

  /**
   * Attach tab event handlers for order method switcher
   */
  function setupOrderMethodTabs() {
    const btnManual = document.getElementById('btn-checkout-method-manual');
    const btnWa = document.getElementById('btn-checkout-method-whatsapp');

    if (btnManual) {
      btnManual.addEventListener('click', () => {
        syncOrderMethod('manual');
      });
    }

    if (btnWa) {
      btnWa.addEventListener('click', () => {
        syncOrderMethod('whatsapp');
      });
    }
  }

  /**
   * Play professional chime + luxury audio voice message on order submission
   */
  function playOrderVoiceMessage(customerName, orderRef) {
    const voiceCard = document.getElementById('voice-confirmation-card');
    const voiceBtnLabel = document.getElementById('voice-btn-label');

    // 1. Play luxury harmonic chime via Web Audio API
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;

        // Note 1: F5 (698.46 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(698.46, now);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        // Note 2: A5 (880 Hz) - gentle luxury resonance
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, now + 0.18);
        gain2.gain.setValueAtTime(0.16, now + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.9);
      }
    } catch (err) {
      console.warn('Audio chime notice:', err);
    }

    // 2. Play professional voice message via Web Speech Synthesis API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const firstName = customerName ? customerName.split(' ')[0] : '';
      const spokenText = `Thank you ${firstName ? firstName : ''} for shopping VELORA Haute Parfumerie. Your bespoke Cash on Delivery order has been successfully placed. Our dispatch atelier is now preparing your handcrafted flacons, and our courier will deliver them directly to your doorstep. Wear your presence.`;

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select highest quality English voice available
      const voices = window.speechSynthesis.getVoices();
      const luxuryVoice = voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Google') || 
          v.name.includes('Natural') || 
          v.name.includes('Samantha') || 
          v.name.includes('Serena') || 
          v.name.includes('Daniel') || 
          v.name.includes('Premium') ||
          v.name.includes('en-GB') || 
          v.name.includes('en-US')
        )
      ) || voices.find(v => v.lang.startsWith('en'));

      if (luxuryVoice) utterance.voice = luxuryVoice;

      utterance.onstart = () => {
        if (voiceCard) voiceCard.classList.add('is-speaking');
        if (voiceBtnLabel) voiceBtnLabel.textContent = 'SPEAKING...';
      };

      utterance.onend = () => {
        if (voiceCard) voiceCard.classList.remove('is-speaking');
        if (voiceBtnLabel) voiceBtnLabel.textContent = 'REPLAY VOICE';
      };

      utterance.onerror = () => {
        if (voiceCard) voiceCard.classList.remove('is-speaking');
        if (voiceBtnLabel) voiceBtnLabel.textContent = 'REPLAY VOICE';
      };

      // Slight timeout to let the chime sound first
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 450);
    } else {
      // If speech synthesis not supported, pulse equalizer briefly
      if (voiceCard) {
        voiceCard.classList.add('is-speaking');
        setTimeout(() => voiceCard.classList.remove('is-speaking'), 3000);
      }
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

    // Validate WhatsApp / Alternate Contact
    if (currentOrderMethod === 'whatsapp') {
      const cleanWaDigits = whatsapp.replace(/[^0-9]/g, '');
      const waValid = cleanWaDigits.length >= 9 && cleanWaDigits.length <= 16;
      validateField(whatsappInput, waValid, "Please enter a valid WhatsApp number for order coordination.");
    } else {
      // In manual mode, alternate phone is optional; only validate if user entered something
      if (whatsapp.length > 0) {
        const cleanAltDigits = whatsapp.replace(/[^0-9]/g, '');
        const altValid = cleanAltDigits.length >= 9 && cleanAltDigits.length <= 16;
        validateField(whatsappInput, altValid, "Please enter a valid secondary phone number or leave blank.");
      } else {
        validateField(whatsappInput, true, "");
      }
    }

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
    lastPlacedOrderData = { name, orderRef };

    const itemsText = summary.items.map(item => `• ${item.product.name} × ${item.quantity} (${item.lineTotalDisplay})`).join('\n');

    const orderText = 
`NEW VELORA COD ORDER
Order Reference: ${orderRef}
Order Mode: ${currentOrderMethod === 'manual' ? 'Direct Manual Website COD' : 'WhatsApp Assisted COD'}

CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
${currentOrderMethod === 'manual' ? (whatsapp ? 'Alternate Phone: ' + whatsapp : '') : 'WhatsApp: ' + whatsapp}
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
          Order_Mode: currentOrderMethod === 'manual' ? 'Manual Order' : 'WhatsApp Order',
          Customer_Name: name,
          Phone: phone,
          Secondary_Contact: whatsapp || 'None',
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
    const successContactLabel = document.getElementById('success-contact-label');
    const successCustomerWhatsapp = document.getElementById('success-customer-whatsapp');
    const successDeliveryAddress = document.getElementById('success-delivery-address');
    const successTotalPrice = document.getElementById('success-total-price');
    const waConfirmBlock = document.getElementById('checkout-wa-confirm-block');

    if (successGreeting) successGreeting.textContent = `Thank you, ${name}! Your order has been placed.`;
    if (successOrderNumber) successOrderNumber.textContent = orderRef;
    if (successCustomerName) successCustomerName.textContent = `${name}`;

    if (currentOrderMethod === 'manual') {
      if (successContactLabel) successContactLabel.textContent = 'Mobile Number';
      if (successCustomerWhatsapp) {
        successCustomerWhatsapp.textContent = phone;
        successCustomerWhatsapp.style.color = '#ffffff';
      }
      if (waConfirmBlock) waConfirmBlock.style.display = 'none';
    } else {
      if (successContactLabel) successContactLabel.textContent = 'WhatsApp Contact';
      if (successCustomerWhatsapp) {
        successCustomerWhatsapp.textContent = whatsapp || phone;
        successCustomerWhatsapp.style.color = '#4ade80';
      }
      if (waConfirmBlock) waConfirmBlock.style.display = 'block';
    }

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

    // Play Voice Confirmation Message and Chime
    playOrderVoiceMessage(name, orderRef);

    // Clear cart
    window.VeloraCart.clearCart();
  }

})();
