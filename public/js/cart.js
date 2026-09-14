/**
 * VELORA - Shopping Cart Architecture (Vanilla JavaScript & localStorage)
 * 
 * Complies strictly with zero-cost, serverless, static constraints:
 * - Local storage key: "velora_cart"
 * - Stores only product IDs and quantities (no sensitive data)
 * - Safe error recovery against invalid or corrupted localStorage
 * - Real-time badge updates and elegant luxury notification toasts
 * - Full quantity increment, decrement, remove, and clear methods
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'velora_cart';

  const VELORA_CANONICAL_PRICES = {
    'midnight': { name: 'MIDNIGHT', numericPrice: 3000, price: 'PKR 3,000' },
    'silver-storm': { name: 'SILVER STORM', numericPrice: 2000, price: 'PKR 2,000' },
    'royal-dusk': { name: 'ROYAL DUSK', numericPrice: 2500, price: 'PKR 2,500' },
    'noir-vanilla': { name: 'NOIR VANILLA', numericPrice: 1800, price: 'PKR 1,800' }
  };

  /**
   * Safe localStorage reader with corruption recovery
   * @returns {Array<{id: string, quantity: number}>}
   */
  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      // Sanitize items: ensure valid id and positive integer quantity
      return parsed
        .filter(item => item && typeof item.id === 'string' && Number.isInteger(item.quantity) && item.quantity > 0)
        .map(item => ({ id: item.id.trim().toLowerCase(), quantity: item.quantity }));
    } catch (e) {
      console.warn('Recovered from corrupted cart localStorage:', e);
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      return [];
    }
  }

  /**
   * Save cart to localStorage and broadcast change
   * @param {Array<{id: string, quantity: number}>} cart
   */
  function saveCart(cart) {
    try {
      const sanitized = (cart || [])
        .filter(item => item && item.id && item.quantity > 0)
        .map(item => ({ id: item.id.trim().toLowerCase(), quantity: Math.floor(item.quantity) }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
    updateCartBadges();
    window.dispatchEvent(new CustomEvent('velora:cart-updated', { detail: { cart } }));
  }

  /**
   * Add a product to cart (or increment quantity if already present)
   * @param {string} productId 
   * @param {number} quantity 
   * @param {boolean} showToast 
   */
  function addToCart(productId, quantity = 1, showToast = true) {
    if (!productId) return false;
    const cleanId = String(productId).trim().toLowerCase();
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);

    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === cleanId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += cleanQty;
    } else {
      cart.push({ id: cleanId, quantity: cleanQty });
    }

    saveCart(cart);

    if (showToast) {
      const product = window.getVeloraProductById ? window.getVeloraProductById(cleanId) : null;
      const title = product ? product.name : (VELORA_CANONICAL_PRICES[cleanId] ? VELORA_CANONICAL_PRICES[cleanId].name : 'Fragrance');
      showCartNotification(`${title} — Product is added to cart.`);
    }

    return true;
  }

  /**
   * Update quantity of a product in cart
   * @param {string} productId 
   * @param {number} newQuantity 
   */
  function updateQuantity(productId, newQuantity) {
    if (!productId) return;
    const cleanId = String(productId).trim().toLowerCase();
    const qty = parseInt(newQuantity, 10);

    const cart = getCart();
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(cleanId);
      return;
    }

    const item = cart.find(i => i.id === cleanId);
    if (item) {
      item.quantity = qty;
      saveCart(cart);
    }
  }

  /**
   * Remove a single product from cart
   * @param {string} productId 
   */
  function removeFromCart(productId) {
    if (!productId) return;
    const cleanId = String(productId).trim().toLowerCase();
    const cart = getCart().filter(item => item.id !== cleanId);
    saveCart(cart);
  }

  /**
   * Clear all items from cart
   */
  function clearCart() {
    saveCart([]);
  }

  /**
   * Get total quantity of items in cart
   * @returns {number}
   */
  function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  /**
   * Get cart items enriched with full product details
   * @returns {{ items: Array<object>, totalCount: number, subtotalDisplay: string, totalDisplay: string }}
   */
  function getCartSummary() {
    const cart = getCart();
    let totalCount = 0;
    let numericSubtotal = 0;

    const enrichedItems = cart.map(item => {
      const cleanId = String(item.id).trim().toLowerCase();
      const product = window.getVeloraProductById ? window.getVeloraProductById(cleanId) : null;
      const canonical = VELORA_CANONICAL_PRICES[cleanId] || { name: cleanId.toUpperCase(), numericPrice: 2000, price: 'PKR 2,000' };

      totalCount += item.quantity;

      const unitPrice = (product && typeof product.numericPrice === 'number' && product.numericPrice > 0)
        ? product.numericPrice
        : canonical.numericPrice;

      const itemSubtotal = unitPrice * item.quantity;
      numericSubtotal += itemSubtotal;

      const displayPrice = (product && product.price) ? product.price : canonical.price;

      return {
        id: cleanId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        lineTotal: itemSubtotal,
        lineTotalDisplay: `PKR ${itemSubtotal.toLocaleString()}`,
        product: product || {
          id: cleanId,
          name: canonical.name,
          price: displayPrice,
          size: '50 ML',
          type: 'EAU DE PARFUM',
          image: `assets/images/${cleanId}.webp`,
          fallbackImage: `assets/images/${cleanId}.jpg`,
          slug: cleanId
        }
      };
    });

    const subtotalDisplay = `PKR ${numericSubtotal.toLocaleString()}`;

    return {
      items: enrichedItems,
      totalCount,
      subtotalDisplay,
      totalDisplay: subtotalDisplay
    };
  }

  /**
   * Update all cart badge counters in the DOM
   */
  function updateCartBadges() {
    const totalCount = getCartTotalCount();
    const badges = document.querySelectorAll('.cart-badge, [data-cart-badge]');
    badges.forEach(badge => {
      badge.textContent = String(totalCount);
      if (totalCount > 0) {
        badge.classList.add('has-items');
      } else {
        badge.classList.remove('has-items');
      }
    });

    const labels = document.querySelectorAll('.cart-count-display');
    labels.forEach(lbl => {
      lbl.textContent = `BAG (${totalCount})`;
    });
  }

  /**
   * Luxury Notification Toast
   * @param {string} message 
   */
  function showCartNotification(message) {
    let toast = document.getElementById('velora-cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'velora-cart-toast';
      toast.className = 'velora-cart-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="cart-toast-inner">
        <svg class="cart-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="cart-toast-text">${message}</span>
        <a href="cart.html" class="cart-toast-link">VIEW BAG</a>
      </div>
    `;

    toast.classList.add('is-visible');

    if (window._veloraToastTimeout) {
      clearTimeout(window._veloraToastTimeout);
    }

    window._veloraToastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4200);
  }

  /**
   * Setup global click listener for Add To Cart buttons
   */
  function initCartListeners() {
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add-to-cart], .btn-add-to-cart');
      if (addBtn) {
        e.preventDefault();
        const productId = addBtn.getAttribute('data-product-id') || addBtn.dataset.productId;
        const qtyInput = document.getElementById('product-qty-input') || document.querySelector('[name="quantity"]');
        const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        
        if (productId) {
          addToCart(productId, quantity, true);
        }
      }
    });

    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        updateCartBadges();
        window.dispatchEvent(new CustomEvent('velora:cart-updated', { detail: { cart: getCart() } }));
      }
    });

    updateCartBadges();
  }

  // Public API
  window.VeloraCart = {
    getCart,
    saveCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotalCount,
    getCartSummary,
    updateCartBadges,
    showCartNotification
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartListeners);
  } else {
    initCartListeners();
  }
})();
