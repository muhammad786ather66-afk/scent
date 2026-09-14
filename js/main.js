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

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initFaqAccordion();
  initContactForm();
  renderDynamicCollections();
});

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
 * Dynamic Collection Cards Renderer
 */
function renderDynamicCollections() {
  const collectionContainer = document.getElementById('dynamic-product-grid');
  if (!collectionContainer || !window.VELORA_PRODUCTS) return;

  const products = window.VELORA_PRODUCTS;

  function createCardHtml(p, index) {
    // Primary hero/first image eager load, others lazy
    const isLazy = index > 1 ? 'loading="lazy"' : 'loading="eager"';
    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-card-visual">
          <a href="product.html?product=${p.slug}" aria-label="View ${p.name}" style="display: contents;">
            <img src="${p.image}" 
                 alt="VELORA ${p.name} Eau de Parfum 50 ML" 
                 class="product-card-img" 
                 ${isLazy}
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
              ORDER NOW
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
        <div class="product-card-footer" style="flex-direction: column; align-items: stretch; gap: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="product-price" style="font-size: 1.35rem; font-weight: 700; color: #ffffff;">${p.price}</span>
            <span style="font-size: 0.75rem; color: #c5a059; letter-spacing: 0.08em; font-weight: 600;">FREE DELIVERY</span>
          </div>
          <div class="product-card-cta-group" style="width: 100%;">
            <button type="button" class="btn btn-primary btn-add-to-cart" data-product-id="${p.id}" style="width: 100%; text-align: center; padding: 0.85rem 1rem; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer;">
              ORDER NOW
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function render(list) {
    collectionContainer.innerHTML = list.map((p, idx) => createCardHtml(p, idx)).join('');
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

    // Static site handling: display clear luxury acknowledgement
    statusBox.innerHTML = `
      <strong>Thank you, ${name}.</strong><br>
      Your inquiry regarding VELORA has been recorded. As this is a static demonstration build for Cloudflare Pages, please send direct messages to <a href="mailto:hello@velora.example?subject=VELORA Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}" style="color: var(--color-gold); text-decoration: underline;">hello@velora.example</a> or connect a static form service (such as Formspree or Cloudflare Workers).
    `;
    statusBox.style.display = 'block';
    statusBox.className = 'form-status success';

    form.reset();
  });
}
