/**
 * VELORA - Luxury Fragrance House
 * Main Client-Side Controller (Vanilla JavaScript)
 * 
 * Features:
 * - Header scroll appearance
 * - Accessible mobile menu drawer with focus trap & keyboard listeners
 * - Dynamic collection card rendering from products.js
 * - Collection category filtering
 * - Vanilla FAQ accordion (one item open at a time)
 * - Future ecommerce notice modal ("Online ordering will be available soon")
 * - Static contact form interaction
 */

// Immediate theme application to prevent flash of wrong theme (default to light mode)
(function() {
  try {
    const saved = localStorage.getItem('velora_theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    // Local storage unavailable
  }
})();

function initAll() {
  initTheme();
  initHeader();
  initMobileMenu();
  initFaqAccordion();
  initContactForm();
  renderDynamicCollections();
  initWhatsAppIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/**
 * Header Scroll & Active Links
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Accessible Mobile Navigation Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first link in drawer
    const firstLink = drawer.querySelector('a, button');
    if (firstLink) firstLink.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  // Ensure mobile drawer has direct WhatsApp button
  const mobileFooter = drawer.querySelector('.mobile-nav-footer');
  if (mobileFooter && !mobileFooter.querySelector('.mobile-whatsapp-link')) {
    const waLink = document.createElement('a');
    waLink.className = 'whatsapp-direct-btn mobile-whatsapp-link';
    waLink.href = 'https://wa.me/923036440752?text=' + encodeURIComponent('Hello VELORA Concierge, I would like to place an order.');
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.style.marginTop = '0.75rem';
    waLink.style.textDecoration = 'none';
    waLink.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      Order via WhatsApp
    `;
    mobileFooter.appendChild(waLink);
  }

  // Close when clicking any nav link
  const drawerLinks = drawer.querySelectorAll('.mobile-nav-link, .btn');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Keyboard navigation: Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * Canonical Authentic WhatsApp SVG Icon (Brand Colors & Precision Vector)
 * Instantly recognizable WhatsApp icon with signature green bubble and white phone receiver.
 */
function getWhatsAppSvg(size = 18) {
  return `
    <svg class="whatsapp-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink:0;">
      <path fill="#25D366" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
      <path fill="#FFFFFF" d="M17.47 14.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.6-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/>
    </svg>
  `;
}
window.getWhatsAppSvg = getWhatsAppSvg;

/**
 * Dynamic Collection Cards Renderer
 */
function renderDynamicCollections() {
  const collectionContainer = document.getElementById('dynamic-product-grid');
  if (!collectionContainer || !window.VELORA_PRODUCTS) return;

  const products = window.VELORA_PRODUCTS;

  function attachCardListeners(container) {
    if (!container) return;

    container.querySelectorAll('.btn-card-order-now, .btn-card-buy-now').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-product-id');
        if (window.VeloraCart) {
          // Add item to bag and display notification toast
          window.VeloraCart.addToCart(pid, 1, true);
        }
        
        // Immediate tactile visual confirmation on button
        const origHtml = btn.innerHTML;
        btn.classList.add('btn-added-state');
        btn.innerHTML = `<span>ADDED TO BAG ✓</span>`;
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.classList.remove('btn-added-state');
        }, 1800);
      });
    });

    container.querySelectorAll('.btn-card-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-product-id');
        if (window.VeloraCart) {
          window.VeloraCart.addToCart(pid, 1, true);
        }
        const origHtml = btn.innerHTML;
        btn.classList.add('btn-added-state');
        btn.innerHTML = `<span>ADDED ✓</span>`;
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.classList.remove('btn-added-state');
        }, 1800);
      });
    });
  }
  window.attachVeloraCardEvents = attachCardListeners;

  function buildCompleteWhatsAppOrderUrl(p, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const unitPrice = p.price || 'PKR 3,000';
    const numPrice = p.numericPrice || (parseInt(unitPrice.replace(/[^0-9]/g, ''), 10) || 3000);
    const totalDue = 'PKR ' + (numPrice * qty).toLocaleString();
    const type = p.type || 'Extrait de Parfum';
    const size = p.size || '50 ML';

    const message = 
`*VELORA HAUTE PARFUMERIE — OFFICIAL ORDER*
────────────────────────
*ORDER DETAILS:*
• Fragrance: *${p.name}*
• Concentration: ${type}
• Volume: ${size} (1.7 FL. OZ.)
• Unit Price: ${unitPrice}
• Quantity: ${qty} flacon(s)
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

    return `https://wa.me/923036440752?text=${encodeURIComponent(message)}`;
  }
  window.buildCompleteWhatsAppOrderUrl = buildCompleteWhatsAppOrderUrl;

  function createCardHtml(p, index) {
    // Primary hero/first image eager load, others lazy
    const isLazy = index > 1 ? 'loading="lazy"' : 'loading="eager"';
    const waOrderUrl = buildCompleteWhatsAppOrderUrl(p, 1);

    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-card-visual">
          <!-- WhatsApp Order on the image -->
          <a href="${waOrderUrl}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="product-wa-floating-badge" 
             aria-label="Order ${p.name} on WhatsApp" 
             title="Order ${p.name} on WhatsApp">
            ${getWhatsAppSvg(18)}
            <span class="product-wa-badge-text">Order</span>
          </a>

          <a href="product.html?product=${p.slug}" aria-label="View ${p.name}" style="display: contents;">
            <img src="${p.image}" 
                 alt="VELORA ${p.name} Eau de Parfum 50 ML" 
                 class="product-card-img" 
                 ${isLazy}
                 decoding="async"
                 onerror="this.onerror=null; this.src='${p.fallbackImage}';" />
          </a>
          <div class="image-cart-overlay">
            <a href="${waOrderUrl}" target="_blank" rel="noopener noreferrer" class="btn-image-cart-order btn-image-whatsapp-order" aria-label="Order ${p.name} via WhatsApp">
              ${getWhatsAppSvg(16)}
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
            <span class="product-price" style="font-size: 1.35rem; font-weight: 700; color: #ffffff;">${p.price}</span>
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
  }

  function render(list) {
    collectionContainer.innerHTML = list.map((p, idx) => createCardHtml(p, idx)).join('');
    attachCardListeners(collectionContainer);
  }

  render(products);

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      if (!filterVal || filterVal === 'all') {
        render(products);
      } else {
        const filtered = products.filter(p => p.id === filterVal || p.slug === filterVal);
        render(filtered);
      }
    });
  });
}

/**
 * FAQ Accordion (Single Open Item)
 */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Contact Form Interaction (Static Deployment Safe)
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      statusBox.textContent = 'Please provide your name, email, and message.';
      statusBox.style.display = 'block';
      statusBox.className = 'form-status error';
      return;
    }

    // Contact form confirmation: luxury brand concierge acknowledgment
    statusBox.innerHTML = `
      <strong>Thank you, ${name}.</strong><br>
      Your inquiry has been received by our concierge team. We will review your message and get back to you shortly. You may also reach us directly at <a href="mailto:hello@velorafragrances.com?subject=VELORA Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}" style="color: var(--color-gold); text-decoration: underline;">hello@velorafragrances.com</a>.
    `;
    statusBox.style.display = 'block';
    statusBox.className = 'form-status success';

    form.reset();
  });
}

/**
 * Site-Wide Authentic WhatsApp Icon Enhancer
 * Ensures every WhatsApp touchpoint displays the authentic green & white WhatsApp vector icon
 */
function initWhatsAppIcons() {
  // Update header WhatsApp icon buttons
  document.querySelectorAll('.header-whatsapp-icon-btn').forEach(btn => {
    btn.innerHTML = getWhatsAppSvg(18);
  });

  // Update top announcement bar WhatsApp link
  document.querySelectorAll('.announcement-whatsapp-link').forEach(link => {
    const textSpan = link.querySelector('span');
    const label = textSpan ? textSpan.textContent.trim() : 'Order via WhatsApp';
    link.innerHTML = `${getWhatsAppSvg(14)}<span>${label}</span>`;
  });

  // Update floating concierge button
  initWhatsAppFloatingBtn();
}

/**
 * Site-Wide Floating WhatsApp Concierge Button
 * Directly connects clients with the VELORA Atelier Concierge on 03036440752
 */
function initWhatsAppFloatingBtn() {
  let floatingBtn = document.getElementById('floating-whatsapp-concierge');

  if (!floatingBtn) {
    floatingBtn = document.createElement('a');
    floatingBtn.id = 'floating-whatsapp-concierge';
    floatingBtn.className = 'floating-whatsapp-btn';
    floatingBtn.href = 'https://wa.me/923036440752?text=' + encodeURIComponent('Hello VELORA Concierge, I would like to inquire about your luxury fragrance collection.');
    floatingBtn.target = '_blank';
    floatingBtn.rel = 'noopener noreferrer';
    floatingBtn.setAttribute('aria-label', 'Order via WhatsApp with VELORA Concierge');
    document.body.appendChild(floatingBtn);
  }

  floatingBtn.innerHTML = `
    ${getWhatsAppSvg(24)}
    <div class="floating-whatsapp-text">
      <span class="floating-whatsapp-kicker">Concierge</span>
      <span class="floating-whatsapp-phone">Order via WhatsApp</span>
    </div>
  `;
}

/**
 * VELORA LUXURY THEME ENGINE (DARK & LIGHT MODE)
 * Provides smooth background transitions and persistent theme state
 */
function getPreferredTheme() {
  try {
    const saved = localStorage.getItem('velora_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (e) {}
  return 'light'; // Default to light mode as requested
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('velora_theme', theme);
  } catch (e) {}

  const isDark = theme === 'dark';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });

  document.querySelectorAll('.mobile-theme-mode-text').forEach(el => {
    el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

function initTheme() {
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  // Attach click listeners to all desktop and mobile theme toggle triggers
  document.querySelectorAll('.theme-toggle-btn, .mobile-theme-row-btn').forEach(btn => {
    // Avoid double binding
    if (btn.dataset.themeBound) return;
    btn.dataset.themeBound = 'true';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTheme();
    });
  });
}

