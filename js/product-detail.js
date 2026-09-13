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

  const updateQtyDisplay = (val) => {
    currentQty = Math.max(1, Math.min(20, val));
    if (qtyInput) qtyInput.value = currentQty;
  };

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
        // Add to cart preserving other items, then redirect directly to checkout
        window.VeloraCart.addToCart(product.id, currentQty, false);
      }
      window.location.href = 'checkout.html';
    });
  }

  // Render "Other Fragrances in the Collection"
  renderRelatedFragrances(product.id);
}

function renderRelatedFragrances(currentId) {
  const container = document.getElementById('related-products-grid');
  if (!container || !window.VELORA_PRODUCTS) return;

  const others = window.VELORA_PRODUCTS.filter(p => p.id !== currentId);

  container.innerHTML = others.map(p => `
    <article class="product-card" data-product-id="${p.id}">
      <div class="product-card-visual">
        <a href="product.html?product=${p.slug}" aria-label="View ${p.name}" style="display: contents;">
          <img src="${p.image}" 
               alt="VELORA ${p.name} Eau de Parfum 50 ML" 
               class="product-card-img" 
               loading="lazy"
               decoding="async"
               onerror="this.onerror=null; this.src='${p.fallbackImage}';" />
        </a>
        <div class="image-cart-overlay">
          <button type="button" class="btn-image-cart-order btn-add-to-cart" data-product-id="${p.id}" aria-label="Order ${p.name} Now">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Cart / Order Now
          </button>
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
      <div class="product-card-footer" style="flex-wrap: wrap; gap: 0.65rem;">
        <span class="product-price">${p.price}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center; width: 100%;">
          <a href="product.html?product=${p.slug}" class="btn btn-secondary" style="flex: 1; text-align: center; padding: 0.55rem 0.6rem; font-size: 0.72rem;">
            VIEW DETAILS
          </a>
          <button type="button" class="btn btn-primary btn-add-to-cart" data-product-id="${p.id}" style="flex: 1; padding: 0.55rem 0.6rem; font-size: 0.72rem;">
            Cart / Order Now
          </button>
        </div>
      </div>
    </article>
  `).join('');
}
