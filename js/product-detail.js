/**
 * VELORA - Dynamic Product Detail View Controller
 * Handles query parameter parsing (?product=slug), DOM hydration,
 * quantity adjustments, real-time "Add to Cart", and instantaneous "Buy Now" flow.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderProductDetail();
});

function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('product') || 'midnight';

  if (!window.getVeloraProductBySlug) {
    console.error('Products data not loaded.');
    return;
  }

  const product = window.getVeloraProductBySlug(slug);
  if (!product) return;

  // Update Page Title and Meta
  document.title = `VELORA | ${product.name} Eau de Parfum 50 ML`;

  // Hydrate DOM elements
  const breadcrumbElem = document.getElementById('detail-breadcrumb-name');
  const nameElem = document.getElementById('detail-product-name');
  const typeElem = document.getElementById('detail-product-type');
  const sizeElem = document.getElementById('detail-product-size');
  const priceElem = document.getElementById('detail-product-price');
  const descElem = document.getElementById('detail-product-desc');
  const imgElem = document.getElementById('detail-product-img');
  const characterElem = document.getElementById('detail-character');
  const moodElem = document.getElementById('detail-mood');
  const occasionElem = document.getElementById('detail-occasion');
  const specsContainer = document.getElementById('detail-specs-list');

  if (breadcrumbElem) breadcrumbElem.textContent = product.name;
  if (nameElem) nameElem.textContent = product.name;
  if (typeElem) typeElem.textContent = product.type;
  if (sizeElem) sizeElem.textContent = product.size;
  if (priceElem) priceElem.textContent = product.price;
  if (descElem) descElem.textContent = product.description;

  if (characterElem) characterElem.textContent = product.character || 'Contemporary Luxury';
  if (moodElem) moodElem.textContent = product.mood || 'Unforgettable Presence';
  if (occasionElem) occasionElem.textContent = product.occasion || 'Signature Fragrance';

  if (imgElem) {
    imgElem.src = product.image;
    imgElem.alt = `Official bottle of ${product.fullName} 50 ML`;
    imgElem.onerror = function() {
      this.onerror = null;
      this.src = product.fallbackImage;
    };
  }

  if (specsContainer && product.features) {
    specsContainer.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');
  }

  // Quantity Stepper Logic
  let currentQty = 1;
  const qtyInput = document.getElementById('product-qty-input');
  const qtyMinus = document.getElementById('btn-qty-minus');
  const qtyPlus = document.getElementById('btn-qty-plus');

  const updateWhatsAppLink = () => {
    const waProductBtn = document.getElementById('btn-whatsapp-product');
    const waImageBtn = document.getElementById('btn-image-detail-whatsapp');
    const waStageBadge = document.getElementById('detail-stage-whatsapp-badge');
    
    const unitPrice = product.price || 'PKR 3,000';
    const numPrice = product.numericPrice || (parseInt(unitPrice.replace(/[^0-9]/g, ''), 10) || 3000);
    const totalDue = 'PKR ' + (numPrice * currentQty).toLocaleString();
    const type = product.type || 'Extrait de Parfum';
    const size = product.size || '50 ML';

    const msg = 
`*VELORA HAUTE PARFUMERIE — OFFICIAL ORDER*
────────────────────────
*ORDER DETAILS:*
• Fragrance: *${product.name}*
• Concentration: ${type}
• Volume: ${size} (1.7 FL. OZ.)
• Unit Price: ${unitPrice}
• Quantity: ${currentQty} flacon(s)
• Delivery: FREE Nationwide Express Delivery
• Payment: Cash on Delivery (COD)
• *TOTAL AMOUNT DUE:* *${totalDue}*
────────────────────────
*CUSTOMER DELIVERY INFORMATION:*
• Full Name: 
• Mobile / WhatsApp Number: 
• City: 
• Complete Street Delivery Address: 
• Nearest Landmark / Notes: 

Please confirm my order and arrange doorstep dispatch. Thank you!`;

    const waUrl = `https://wa.me/923036440752?text=${encodeURIComponent(msg)}`;
    if (waProductBtn) {
      waProductBtn.href = waUrl;
    }
    if (waImageBtn) {
      waImageBtn.href = waUrl;
    }
    if (waStageBadge) {
      waStageBadge.href = waUrl;
    }
  };

  const updateQtyDisplay = (val) => {
    currentQty = Math.max(1, Math.min(20, val));
    if (qtyInput) qtyInput.value = currentQty;
    if (qtyMinus) {
      if (currentQty <= 1) {
        qtyMinus.classList.add('is-disabled');
        qtyMinus.setAttribute('disabled', 'disabled');
      } else {
        qtyMinus.classList.remove('is-disabled');
        qtyMinus.removeAttribute('disabled');
      }
    }
    updateWhatsAppLink();
  };

  updateWhatsAppLink();

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => updateQtyDisplay(currentQty - 1));
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => updateQtyDisplay(currentQty + 1));
  }
  if (qtyInput) {
    qtyInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10) || 1;
      updateQtyDisplay(val);
    });
  }

  // Setup Add to Cart, Buy Now & Image Order handlers
  const addToCartBtn = document.getElementById('btn-add-to-cart');
  const buyNowBtn = document.getElementById('btn-buy-now');
  const imageOrderBtn = document.getElementById('btn-image-detail-order');

  if (addToCartBtn) {
    addToCartBtn.setAttribute('data-product-id', product.id);
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.VeloraCart) {
        window.VeloraCart.addToCart(product.id, currentQty, true);
      }
    });
  }

  if (imageOrderBtn) {
    imageOrderBtn.setAttribute('data-product-id', product.id);
    imageOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.VeloraCart) {
        window.VeloraCart.addToCart(product.id, currentQty, true);
      }
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.VeloraCart) {
        window.VeloraCart.addToCart(product.id, currentQty, true);
      }
      const origHtml = buyNowBtn.innerHTML;
      buyNowBtn.classList.add('btn-added-state');
      buyNowBtn.innerHTML = `<span>ADDED TO BAG ✓</span>`;
      setTimeout(() => {
        buyNowBtn.innerHTML = origHtml;
        buyNowBtn.classList.remove('btn-added-state');
      }, 1800);
    });
  }

  // Render "Other Fragrances in the Collection"
  renderRelatedFragrances(product.id);
}

function getDetailWhatsAppSvg(size = 18) {
  if (typeof window.getWhatsAppSvg === 'function') {
    return window.getWhatsAppSvg(size);
  }
  return `
    <svg class="whatsapp-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink:0;">
      <path fill="#25D366" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
      <path fill="#FFFFFF" d="M17.47 14.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.6-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/>
    </svg>
  `;
}

function renderRelatedFragrances(currentId) {
  const container = document.getElementById('related-products-grid');
  if (!container || !window.VELORA_PRODUCTS) return;

  const others = window.VELORA_PRODUCTS.filter(p => p.id !== currentId);

  container.innerHTML = others.map(p => {
    const waOrderUrl = `https://wa.me/923036440752?text=${encodeURIComponent('Hello VELORA Concierge, I would like to order ' + p.name + ' (50 ML Eau de Parfum - ' + p.price + ').')}`;

    return `
    <article class="product-card" data-product-id="${p.id}">
      <div class="product-card-visual">
        <!-- Floating Authentic WhatsApp Badge Directly on Product -->
        <a href="${waOrderUrl}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="product-wa-floating-badge" 
           aria-label="Order ${p.name} on WhatsApp" 
           title="Order ${p.name} on WhatsApp">
          ${getDetailWhatsAppSvg(18)}
          <span class="product-wa-badge-text">Order</span>
        </a>

        <a href="product.html?product=${p.slug}" aria-label="View ${p.name}" style="display: contents;">
          <img src="${p.image}" 
               alt="VELORA ${p.name} Eau de Parfum 50 ML" 
               class="product-card-img" 
               loading="lazy" 
               decoding="async"
               onerror="this.onerror=null; this.src='${p.fallbackImage}';" />
        </a>
        <div class="image-cart-overlay">
          <a href="${waOrderUrl}" target="_blank" rel="noopener noreferrer" class="btn-image-cart-order btn-image-whatsapp-order" aria-label="Order ${p.name} via WhatsApp">
            ${getDetailWhatsAppSvg(16)}
            <span>ORDER VIA WHATSAPP</span>
          </a>
        </div>
      </div>
      <div class="product-card-meta">
        <span class="product-card-type">${p.type}</span>
        <span class="product-card-size">${p.size}</span>
      </div>
      <h3 class="product-card-title">
        <a href="product.html?product=${p.slug}">${p.name}</a>
      </h3>
      <p class="product-card-desc">${p.description}</p>
      <div class="product-card-footer" style="flex-direction: column; align-items: stretch; gap: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="product-price" style="font-size: 1.35rem; font-weight: 700; color: var(--color-ivory);">${p.price}</span>
          <span style="font-size: 0.75rem; color: #c5a059; letter-spacing: 0.08em; font-weight: 600;">FREE DELIVERY</span>
        </div>
        <!-- Below: Details and Order Now button (item added to cart and checkout) -->
        <div class="product-card-cta-group" style="width: 100%; display: flex; gap: 0.5rem;">
          <a href="product.html?product=${p.slug}" class="btn btn-secondary" style="flex: 1; text-align: center; padding: 0.82rem 0.5rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; display: inline-flex; align-items: center; justify-content: center;">
            DETAILS
          </a>
          <button type="button" class="btn btn-primary btn-card-order-now" data-product-id="${p.id}" style="flex: 1.6; text-align: center; padding: 0.82rem 0.5rem; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;">
            <span>ORDER NOW</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </article>
  `;
  }).join('');

  // Attach card event listeners
  if (typeof window.attachVeloraCardEvents === 'function') {
    window.attachVeloraCardEvents(container);
  } else {
    container.querySelectorAll('.btn-card-order-now, .btn-card-buy-now').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-product-id');
        if (window.VeloraCart) window.VeloraCart.addToCart(pid, 1, true);
        const origHtml = btn.innerHTML;
        btn.classList.add('btn-added-state');
        btn.innerHTML = `<span>ADDED TO BAG ✓</span>`;
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.classList.remove('btn-added-state');
        }, 1800);
      });
    });
  }
}
