/**
 * VELORA - Dynamic Product Detail View Controller
 * Handles query parameter parsing (?product=slug), DOM hydration,
 * responsive photography layout, and interactive shopping notifications.
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

  // Setup Add to Cart & Buy Now handlers
  const addToCartBtn = document.getElementById('btn-add-to-cart');
  const buyNowBtn = document.getElementById('btn-buy-now');

  const handleOrderAttempt = (e) => {
    e.preventDefault();
    if (window.triggerOrderNotice) {
      window.triggerOrderNotice(product.name);
    } else {
      alert("Online ordering will be available soon.");
    }
  };

  if (addToCartBtn) addToCartBtn.addEventListener('click', handleOrderAttempt);
  if (buyNowBtn) buyNowBtn.addEventListener('click', handleOrderAttempt);

  // Render "Other Fragrances in the Collection"
  renderRelatedFragrances(product.id);
}

function renderRelatedFragrances(currentId) {
  const container = document.getElementById('related-products-grid');
  if (!container || !window.VELORA_PRODUCTS) return;

  const others = window.VELORA_PRODUCTS.filter(p => p.id !== currentId);

  container.innerHTML = others.map(p => `
    <article class="product-card" data-product-id="${p.id}">
      <a href="product.html?product=${p.slug}" class="product-card-visual" aria-label="View ${p.name}">
        <img src="${p.image}" 
             alt="VELORA ${p.name} Eau de Parfum 50 ML" 
             class="product-card-img" 
             loading="lazy"
             decoding="async"
             onerror="this.onerror=null; this.src='${p.fallbackImage}';" />
      </a>
      <div class="product-card-meta">
        <span class="product-card-type">${p.type}</span>
        <span class="product-card-size">${p.size}</span>
      </div>
      <h3 class="product-card-title">
        <a href="product.html?product=${p.slug}">${p.name}</a>
      </h3>
      <p class="product-card-desc">${p.description}</p>
      <div class="product-card-footer">
        <span class="product-price">${p.price}</span>
        <a href="product.html?product=${p.slug}" class="btn btn-secondary" style="padding: 0.55rem 1.15rem; font-size: 0.75rem;">
          VIEW FRAGRANCE
        </a>
      </div>
    </article>
  `).join('');
}
