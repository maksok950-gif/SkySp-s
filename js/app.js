/* ============================================================
   SkySp — interactions, cart, checkout, UI
   ============================================================ */

(() => {
  'use strict';

  const DATA = window.SKYSP_DATA;
  const products = DATA.products;
  const categories = DATA.categories;
  const featuredOrder = DATA.featuredOrder;
  const byId = Object.fromEntries(products.map((product) => [product.id, product]));

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const numberFormatter = new Intl.NumberFormat('ru-RU');
  const formatNumber = (value) => numberFormatter.format(value);
  const formatPrice = (value) => `${numberFormatter.format(value)}\u00A0₽`;
  const formatChance = (value) => `${String(value).replace('.', ',')}%`;
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        })[char]
    );
  const iconFor = (product) => product.icon || categories[product.category].icon;

  const CART_KEY = 'skysp_cart_v1';
  const PROMO_CODE = 'SKYSP10';
  const PROMO_PERCENT = 10;

  const header = $('#header');
  const burger = $('#burger');
  const openCartButton = $('#openCart');
  const productGrid = $('#productGrid');
  const loadMoreButton = $('#loadMore');
  const tabs = $$('.shop-tab');
  const cartDrawer = $('#cartDrawer');
  const cartItems = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartFoot = $('#cartFoot');
  const cartTotal = $('[data-cart-total]');
  const checkoutButton = $('#checkoutButton');
  const caseModal = $('#caseModal');
  const caseModalContent = $('#caseModalContent');
  const checkoutModal = $('#checkoutModal');
  const checkoutContent = $('#checkoutContent');
  const toast = $('#toast');
  const toastText = $('#toastText');
  const toastUse = toast.querySelector('.toast__icon use');

  let activeCategory = 'all';
  let visibleCount = 12;
  let cart = {};
  let toastTimer = null;
  let checkoutState = {
    promo: null,
    processing: false
  };

  const paymentLabels = {
    sbp: 'СБП',
    card: 'Банковская карта',
    yoomoney: 'ЮMoney'
  };

  /* ----------------------------------------------------------
     Utilities
     ---------------------------------------------------------- */

  function debounceFrame(callback) {
    let frame = 0;
    return (...args) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => callback(...args));
    };
  }

  function syncScrollLock() {
    const locked =
      document.body.classList.contains('menu-open') ||
      cartDrawer.classList.contains('is-open') ||
      caseModal.classList.contains('is-open') ||
      checkoutModal.classList.contains('is-open');
    document.body.classList.toggle('is-locked', locked);
  }

  function showToast(message, type = 'success') {
    window.clearTimeout(toastTimer);
    toastText.textContent = message;
    toast.classList.toggle('is-error', type === 'error');
    if (toastUse) {
      toastUse.setAttribute('href', type === 'error' ? '#i-close' : '#i-check');
    }
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  function hideToast() {
    window.clearTimeout(toastTimer);
    toast.classList.remove('is-visible');
  }

  function scrollToShop(behavior = 'smooth') {
    const shop = document.getElementById('shop');
    if (shop) shop.scrollIntoView({ behavior, block: 'start' });
  }

  /* ----------------------------------------------------------
     Product catalog
     ---------------------------------------------------------- */

  function getProductsFor(category) {
    if (category === 'all') {
      const featured = featuredOrder.map((id) => byId[id]).filter(Boolean);
      const featuredIds = new Set(featured.map((product) => product.id));
      const rest = products.filter((product) => !featuredIds.has(product.id));
      return [...featured, ...rest];
    }

    return products
      .filter((product) => product.category === category)
      .sort((first, second) => first.price - second.price);
  }

  function productCard(product, index) {
    const category = categories[product.category];
    const oldPrice = product.oldPrice
      ? `<s>${formatPrice(product.oldPrice)}</s>`
      : '';
    const badge = product.badge
      ? `<span class="product__badge">${product.badge}</span>`
      : '';
    const dropsButton = product.drops
      ? `<button class="product__drops-link" type="button" data-case="${product.id}">
           Состав кейса
           <svg class="icon" aria-hidden="true"><use href="#i-arrow-up"/></svg>
         </button>`
      : '';

    return `
      <article class="product" style="--tone:${product.tone};--i:${index}">
        <div class="product__art">
          ${badge}
          <span class="product__type">${category.label}</span>
          <span class="product__ghost" aria-hidden="true">${product.art}</span>
          <span class="product__icon" aria-hidden="true">
            <svg class="icon"><use href="#i-${iconFor(product)}"/></svg>
          </span>
          <span class="product__pixels" aria-hidden="true"></span>
        </div>
        <div class="product__body">
          <h3>${product.name}</h3>
          <p class="product__desc">${product.desc}</p>
          <ul class="product__perks">
            ${product.perks.map((perk) => `<li>${perk}</li>`).join('')}
          </ul>
          ${dropsButton}
          <div class="product__foot">
            <div class="product__price">
              ${oldPrice}
              <strong>${formatPrice(product.price)}</strong>
            </div>
            <button class="buy-button" type="button" data-add="${product.id}" aria-label="Добавить ${product.name} в корзину">
              <svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>
              В корзину
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const allProducts = getProductsFor(activeCategory);
    const shown = allProducts.slice(0, visibleCount);

    productGrid.innerHTML = shown.map(productCard).join('');
    loadMoreButton.hidden =
      activeCategory !== 'all' || visibleCount >= allProducts.length;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.category === activeCategory;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  }

  function setCategory(category, shouldScroll = false) {
    if (category !== 'all' && !categories[category]) return;

    activeCategory = category;
    visibleCount = category === 'all' ? 12 : 999;
    renderProducts();

    if (shouldScroll) {
      scrollToShop();
    }
  }

  function updateCategoryCounts() {
    const counts = { all: products.length };
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });

    $$('[data-count]').forEach((node) => {
      const key = node.dataset.count;
      if (counts[key] !== undefined) {
        node.textContent = counts[key];
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setCategory(tab.dataset.category));
  });

  loadMoreButton.addEventListener('click', () => {
    visibleCount += 8;
    renderProducts();
  });

  /* ----------------------------------------------------------
     Case preview
     ---------------------------------------------------------- */

  function openCaseModal(productId) {
    const product = byId[productId];
    if (!product || !product.drops) return;

    hideToast();
    const category = categories[product.category];
    const oldPrice = product.oldPrice
      ? `<s>${formatPrice(product.oldPrice)}</s>`
      : '';

    caseModalContent.innerHTML = `
      <div class="case-modal">
        <div class="case-modal__head">
          <span class="case-modal__icon" style="--tone:${product.tone}" aria-hidden="true">
            <svg class="icon"><use href="#i-${iconFor(product)}"/></svg>
          </span>
          <div>
            <div class="case-modal__eyebrow">${category.label} · SkySp</div>
            <h2 id="caseModalTitle">${product.name}</h2>
          </div>
        </div>

        <p class="case-modal__desc">${product.desc}</p>

        <div class="case-modal__subhead">
          Содержимое кейса
          <span>шансы указаны для одного открытия</span>
        </div>

        <ul class="drop-list">
          ${product.drops
            .map(
              (drop) => `
              <li class="drop-row">
                <span class="drop-row__name">${drop.name}</span>
                <span class="drop-row__chance">${formatChance(drop.chance)}</span>
                <span class="drop-row__bar"><i style="--w:${drop.chance}%"></i></span>
              </li>`
            )
            .join('')}
        </ul>

        <div class="case-modal__foot">
          <div class="case-modal__price">
            ${oldPrice}
            <strong>${formatPrice(product.price)}</strong>
          </div>
          <button class="button button--primary" type="button" data-add-case="${product.id}">
            Добавить в корзину
            <svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>
          </button>
        </div>

        <div class="checkout__safe">
          <svg class="icon" aria-hidden="true"><use href="#i-lock"/></svg>
          Мгновенная выдача · предмет появится на аккаунте после оплаты
        </div>
      </div>
    `;

    caseModal.classList.add('is-open');
    caseModal.setAttribute('aria-hidden', 'false');
    syncScrollLock();

    window.setTimeout(() => {
      const close = $('.modal__close', caseModal);
      if (close) close.focus();
    }, 80);
  }

  function closeCaseModal() {
    caseModal.classList.remove('is-open');
    caseModal.setAttribute('aria-hidden', 'true');
    syncScrollLock();
  }

  /* ----------------------------------------------------------
     Cart
     ---------------------------------------------------------- */

  function loadCart() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CART_KEY) || '{}');
      if (!saved || typeof saved !== 'object') return;

      Object.entries(saved).forEach(([id, quantity]) => {
        const amount = Math.floor(Number(quantity));
        if (byId[id] && Number.isFinite(amount) && amount > 0) {
          cart[id] = Math.min(amount, 99);
        }
      });
    } catch (error) {
      cart = {};
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      /* storage can be unavailable — cart still works in memory */
    }
  }

  function getCartEntries() {
    return Object.entries(cart)
      .map(([id, quantity]) => ({ product: byId[id], quantity }))
      .filter((entry) => entry.product);
  }

  function getCartCount() {
    return getCartEntries().reduce((sum, entry) => sum + entry.quantity, 0);
  }

  function getCartSubtotal() {
    return getCartEntries().reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0
    );
  }

  function bumpCartCount() {
    $$('[data-cart-count]').forEach((node) => {
      node.classList.remove('is-bumping');
      // restart the CSS animation
      void node.offsetWidth;
      node.classList.add('is-bumping');
      window.setTimeout(() => node.classList.remove('is-bumping'), 450);
    });
  }

  function updateCartUI() {
    const entries = getCartEntries();
    const count = getCartCount();

    $$('[data-cart-count]').forEach((node) => {
      node.textContent = count;
    });

    if (cartTotal) {
      cartTotal.textContent = formatPrice(getCartSubtotal());
    }

    if (!entries.length) {
      cartItems.innerHTML = '';
      cartItems.hidden = true;
      cartEmpty.classList.add('is-visible');
      cartFoot.hidden = true;
      return;
    }

    cartItems.hidden = false;
    cartEmpty.classList.remove('is-visible');
    cartFoot.hidden = false;

    cartItems.innerHTML = entries
      .map(
        ({ product, quantity }) => `
        <div class="cart-item" style="--tone:${product.tone}">
          <div class="cart-item__thumb" aria-hidden="true">
            <svg class="icon"><use href="#i-${iconFor(product)}"/></svg>
          </div>
          <div class="cart-item__body">
            <strong>${product.name}</strong>
            <span>${categories[product.category].label}</span>
            <div class="cart-item__controls">
              <div class="qty">
                <button type="button" data-cart-action="dec" data-id="${product.id}" aria-label="Уменьшить количество" ${quantity <= 1 ? 'disabled' : ''}>
                  <svg class="icon" aria-hidden="true"><use href="#i-minus"/></svg>
                </button>
                <span>${quantity}</span>
                <button type="button" data-cart-action="inc" data-id="${product.id}" aria-label="Увеличить количество">
                  <svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="cart-item__price">
            <button class="cart-item__remove" type="button" data-cart-action="remove" data-id="${product.id}" aria-label="Удалить ${product.name}">
              <svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg>
            </button>
            <strong>${formatPrice(product.price * quantity)}</strong>
          </div>
        </div>
      `
      )
      .join('');
  }

  function addToCart(id) {
    const product = byId[id];
    if (!product) return;

    cart[id] = Math.min((cart[id] || 0) + 1, 99);
    saveCart();
    updateCartUI();
    bumpCartCount();
    showToast(`${product.name} добавлен в корзину`);
  }

  function openCart() {
    if (document.body.classList.contains('menu-open')) closeMenu();
    hideToast();
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    syncScrollLock();

    window.setTimeout(() => {
      const close = $('[data-close-cart]', cartDrawer);
      if (close) close.focus();
    }, 80);
  }

  function closeCart() {
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    syncScrollLock();
  }

  openCartButton.addEventListener('click', openCart);
  checkoutButton.addEventListener('click', openCheckout);

  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;

    const { cartAction: action, id } = button.dataset;
    if (!cart[id]) return;

    if (action === 'inc') {
      cart[id] = Math.min(cart[id] + 1, 99);
    } else if (action === 'dec') {
      cart[id] = Math.max(cart[id] - 1, 1);
    } else if (action === 'remove') {
      delete cart[id];
    }

    saveCart();
    updateCartUI();
  });

  /* ----------------------------------------------------------
     Checkout
     ---------------------------------------------------------- */

  function openCheckout() {
    if (!getCartEntries().length) {
      showToast('Сначала добавь товары в корзину', 'error');
      return;
    }

    hideToast();
    closeCart();
    checkoutState.promo = null;
    checkoutState.processing = false;
    renderCheckoutForm();

    checkoutModal.classList.add('is-open');
    checkoutModal.setAttribute('aria-hidden', 'false');
    syncScrollLock();

    window.setTimeout(() => {
      const nickInput = $('#nickname', checkoutContent);
      if (nickInput) nickInput.focus();
    }, 90);
  }

  function closeCheckout() {
    checkoutModal.classList.remove('is-open');
    checkoutModal.setAttribute('aria-hidden', 'true');
    checkoutState.processing = false;
    syncScrollLock();
  }

  function renderCheckoutForm() {
    const entries = getCartEntries();
    const subtotal = getCartSubtotal();

    checkoutContent.innerHTML = `
      <div class="checkout">
        <div class="checkout__head">
          <h2 id="checkoutTitle">Оформление заказа</h2>
          <p>Проверь данные — покупка привяжется к указанному нику.</p>
        </div>

        <div class="checkout__grid">
          <form class="checkout__form" id="checkoutForm" novalidate>
            <div class="field">
              <label for="nickname">Игровой ник</label>
              <input id="nickname" name="nickname" type="text" placeholder="Steve" maxlength="16" autocomplete="username" spellcheck="false">
              <span class="field__error">От 3 до 16 символов: латиница, цифры и «_».</span>
            </div>

            <div class="field">
              <label for="email">Email для чека <span style="color:#55524c;text-transform:none;letter-spacing:0">— необязательно</span></label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email">
              <span class="field__error">Проверь адрес электронной почты.</span>
            </div>

            <div class="field">
              <span class="field__label">Сервер выдачи</span>
              <div class="segmented">
                <label>
                  <input type="radio" name="server" value="SkySp.ru" checked>
                  <span><b>RU</b> SkySp.ru</span>
                </label>
                <label>
                  <input type="radio" name="server" value="SkySp.eu">
                  <span><b>EU</b> SkySp.eu</span>
                </label>
              </div>
            </div>

            <div class="field">
              <span class="field__label">Способ оплаты</span>
              <div class="payments">
                <label class="payment">
                  <input type="radio" name="payment" value="sbp" checked>
                  <span>СБП<small>без комиссии</small></span>
                </label>
                <label class="payment">
                  <input type="radio" name="payment" value="card">
                  <span>Карта<small>Visa · МИР</small></span>
                </label>
                <label class="payment">
                  <input type="radio" name="payment" value="yoomoney">
                  <span>ЮMoney<small>кошелёк</small></span>
                </label>
              </div>
            </div>

            <button class="button button--primary button--full checkout__submit" id="payButton" type="submit">
              Оплатить ${formatPrice(subtotal)}
              <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>
            </button>
            <div class="checkout__safe">
              <svg class="icon" aria-hidden="true"><use href="#i-lock"/></svg>
              Нажимая «Оплатить», вы соглашаетесь с условиями оферты
            </div>
          </form>

          <aside class="checkout__summary">
            <h3>Твой заказ</h3>
            <div class="summary-items">
              ${entries
                .map(
                  ({ product, quantity }) => `
                  <div class="summary-item">
                    <span>${product.name} × ${quantity}</span>
                    <span>${formatPrice(product.price * quantity)}</span>
                  </div>`
                )
                .join('')}
            </div>

            <form class="promo-form" id="promoForm">
              <input id="promoInput" type="text" placeholder="Промокод" autocomplete="off" spellcheck="false">
              <button type="submit">Применить</button>
            </form>
            <div class="promo-message" id="promoMessage"></div>

            <div class="summary-line">
              <span>Товары</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-discount" id="summaryDiscount" hidden>
              <span>Скидка ${PROMO_CODE}</span>
              <span data-discount-value>−0 ₽</span>
            </div>
            <div class="summary-total">
              <span>К оплате</span>
              <strong data-checkout-total>${formatPrice(subtotal)}</strong>
            </div>
            <div class="checkout__safe">
              <svg class="icon" aria-hidden="true"><use href="#i-bolt"/></svg>
              Выдача автоматическая — в течение 1–5 минут
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function updateCheckoutTotals() {
    const subtotal = getCartSubtotal();
    const discount = checkoutState.promo
      ? Math.round((subtotal * PROMO_PERCENT) / 100)
      : 0;
    const total = Math.max(subtotal - discount, 0);

    const totalNode = $('[data-checkout-total]', checkoutContent);
    if (totalNode) totalNode.textContent = formatPrice(total);

    const discountRow = $('#summaryDiscount', checkoutContent);
    if (discountRow) {
      discountRow.hidden = discount === 0;
      const value = $('[data-discount-value]', discountRow);
      if (value) value.textContent = `−${formatPrice(discount)}`;
    }

    const payButton = $('#payButton', checkoutContent);
    if (payButton && !checkoutState.processing) {
      payButton.innerHTML = `
        Оплатить ${formatPrice(total)}
        <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>
      `;
    }
  }

  function applyPromo() {
    if (checkoutState.processing) return;

    const input = $('#promoInput', checkoutContent);
    const message = $('#promoMessage', checkoutContent);
    if (!input || !message) return;

    const code = input.value.trim().toUpperCase();
    message.classList.remove('is-success');

    if (checkoutState.promo) {
      message.textContent = 'Промокод уже применён к заказу.';
      message.classList.add('is-success');
      return;
    }

    if (code === PROMO_CODE) {
      checkoutState.promo = { code, percent: PROMO_PERCENT };
      message.textContent = `Промокод применён: скидка ${PROMO_PERCENT}%.`;
      message.classList.add('is-success');
      input.value = PROMO_CODE;
      updateCheckoutTotals();
    } else if (!code) {
      message.textContent = 'Введи промокод, чтобы получить скидку.';
    } else {
      message.textContent = 'Такой промокод не найден. Проверь написание.';
    }
  }

  function handleCheckoutSubmit(form) {
    if (checkoutState.processing) return;

    const nicknameInput = $('#nickname', form);
    const emailInput = $('#email', form);
    const nicknameField = nicknameInput.closest('.field');
    const emailField = emailInput.closest('.field');

    const nickname = nicknameInput.value.trim();
    const email = emailInput.value.trim();
    let firstInvalid = null;

    nicknameField.classList.remove('has-error');
    emailField.classList.remove('has-error');

    if (!/^[A-Za-z0-9_]{3,16}$/.test(nickname)) {
      nicknameField.classList.add('has-error');
      firstInvalid = nicknameInput;
    }

    if (email && !emailInput.checkValidity()) {
      emailField.classList.add('has-error');
      if (!firstInvalid) firstInvalid = emailInput;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      showToast('Проверь выделенные поля', 'error');
      return;
    }

    const formData = new FormData(form);
    const server = formData.get('server') || 'SkySp.ru';
    const payment = formData.get('payment') || 'sbp';
    const subtotal = getCartSubtotal();
    const discount = checkoutState.promo
      ? Math.round((subtotal * PROMO_PERCENT) / 100)
      : 0;
    const total = Math.max(subtotal - discount, 0);

    checkoutState.processing = true;

    const payButton = $('#payButton', form);
    if (payButton) {
      payButton.disabled = true;
      payButton.textContent = 'Обрабатываем заказ…';
    }

    window.setTimeout(() => {
      const orderNumber = `SP-${Math.floor(10000 + Math.random() * 89999)}`;

      cart = {};
      saveCart();
      updateCartUI();
      checkoutState.promo = null;
      checkoutState.processing = false;

      renderCheckoutSuccess({
        orderNumber,
        nickname,
        email,
        server,
        payment: paymentLabels[payment] || payment,
        total
      });
    }, 950);
  }

  function renderCheckoutSuccess({ orderNumber, nickname, email, server, payment, total }) {
    const safeNickname = escapeHtml(nickname);
    const safeEmail = escapeHtml(email);
    const safeServer = escapeHtml(server);
    const safePayment = escapeHtml(payment);
    const emailLine = email
      ? `<p class="checkout-success__note">Чек отправлен на <strong>${safeEmail}</strong>.</p>`
      : '';

    checkoutContent.innerHTML = `
      <div class="checkout-success">
        <div class="checkout-success__icon" aria-hidden="true">
          <svg class="icon"><use href="#i-check"/></svg>
        </div>
        <h2>Заказ оформлен</h2>
        <p>
          Спасибо, <strong>${safeNickname}</strong>! Покупка привязана к серверу
          <strong>${safeServer}</strong> и уже отправлена на выдачу.
          Оплата: ${safePayment}.
        </p>
        <div class="order-number">Заказ <strong>${orderNumber}</strong> на ${formatPrice(total)}</div>
        ${emailLine}
        <p class="checkout-success__note">
          Если предмет не появился в течение 15 минут — напиши в поддержку и приложи номер заказа.
        </p>
        <p class="checkout-success__demo">Демонстрационный режим: платёж не был списан.</p>
        <button class="button button--primary" type="button" data-close-checkout>
          Вернуться на сайт
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>
        </button>
      </div>
    `;

    const panel = $('.modal__panel', checkoutModal);
    if (panel) panel.scrollTop = 0;
  }

  /* ----------------------------------------------------------
     Mobile menu
     ---------------------------------------------------------- */

  function openMenu() {
    hideToast();
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    syncScrollLock();
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    syncScrollLock();
  }

  burger.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $$('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener(
    'resize',
    debounceFrame(() => {
      if (window.innerWidth > 1120 && document.body.classList.contains('menu-open')) {
        closeMenu();
      }
    })
  );

  /* ----------------------------------------------------------
     Global delegated clicks
     ---------------------------------------------------------- */

  document.addEventListener('click', (event) => {
    const copyButton = event.target.closest('[data-ip]');
    if (copyButton) {
      event.preventDefault();
      copyIp(copyButton.dataset.ip);
      return;
    }

    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      addToCart(addButton.dataset.add);
      return;
    }

    const addCaseButton = event.target.closest('[data-add-case]');
    if (addCaseButton) {
      addToCart(addCaseButton.dataset.addCase);
      closeCaseModal();
      return;
    }

    const caseOpen = event.target.closest('[data-case-link], [data-case]');
    if (caseOpen) {
      openCaseModal(caseOpen.dataset.caseLink || caseOpen.dataset.case);
      return;
    }

    const closeCartButton = event.target.closest('[data-close-cart]');
    if (closeCartButton) {
      closeCart();
      if (closeCartButton.hasAttribute('data-go-shop')) {
        window.setTimeout(() => scrollToShop(), 260);
      }
      return;
    }

    const closeCaseButton = event.target.closest('[data-close-modal]');
    if (closeCaseButton) {
      closeCaseModal();
      return;
    }

    const closeCheckoutButton = event.target.closest('[data-close-checkout]');
    if (closeCheckoutButton) {
      closeCheckout();
      return;
    }

    const gotoCategory = event.target.closest('[data-goto-category]');
    if (gotoCategory) {
      setCategory(gotoCategory.dataset.gotoCategory, true);
      return;
    }

    const footerCategory = event.target.closest('[data-footer-category]');
    if (footerCategory) {
      event.preventDefault();
      setCategory(footerCategory.dataset.footerCategory, true);
      return;
    }

    const navLink = event.target.closest('.nav__link');
    if (navLink && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  /* ----------------------------------------------------------
     Copy IP
     ---------------------------------------------------------- */

  async function copyIp(ip) {
    let copied = false;

    try {
      await navigator.clipboard.writeText(ip);
      copied = true;
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = ip;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch (fallbackError) {
        copied = false;
      }
      textarea.remove();
    }

    if (!copied) {
      showToast('Не удалось скопировать — выделите IP вручную', 'error');
      return;
    }

    $$(`[data-ip="${ip}"]`).forEach((button) => {
      button.classList.add('is-copied');
    });

    window.setTimeout(() => {
      $$(`[data-ip="${ip}"]`).forEach((button) => {
        button.classList.remove('is-copied');
      });
    }, 1700);

    showToast(`IP ${ip} скопирован`);
  }

  /* ----------------------------------------------------------
     Forms
     ---------------------------------------------------------- */

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'promoForm') {
      event.preventDefault();
      applyPromo();
      return;
    }

    if (event.target.id === 'checkoutForm') {
      event.preventDefault();
      handleCheckoutSubmit(event.target);
    }
  });

  checkoutContent.addEventListener('input', (event) => {
    const field = event.target.closest('.field');
    if (field) field.classList.remove('has-error');
  });

  /* ----------------------------------------------------------
     Online status
     ---------------------------------------------------------- */

  const onlineState = {
    ru: 864,
    eu: 421,
    max: 1000
  };

  function renderOnline() {
    const total = onlineState.ru + onlineState.eu;
    const ruBar = Math.min((onlineState.ru / onlineState.max) * 100, 100);
    const euBar = Math.min((onlineState.eu / onlineState.max) * 100, 100);

    $$('[data-online-total]').forEach((node) => {
      node.textContent = formatNumber(total);
    });
    $$('[data-online-ru]').forEach((node) => {
      node.textContent = formatNumber(onlineState.ru);
    });
    $$('[data-online-eu]').forEach((node) => {
      node.textContent = formatNumber(onlineState.eu);
    });
    $$('[data-bar-ru]').forEach((node) => {
      node.style.width = `${ruBar}%`;
    });
    $$('[data-bar-eu]').forEach((node) => {
      node.style.width = `${euBar}%`;
    });
  }

  function driftOnline() {
    const ruDelta = Math.floor(Math.random() * 11) - 4;
    const euDelta = Math.floor(Math.random() * 9) - 3;

    onlineState.ru = Math.min(979, Math.max(812, onlineState.ru + ruDelta));
    onlineState.eu = Math.min(576, Math.max(356, onlineState.eu + euDelta));
    renderOnline();
  }

  renderOnline();
  window.setInterval(driftOnline, 9500);

  /* ----------------------------------------------------------
     Scroll & navigation
     ---------------------------------------------------------- */

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const navSections = ['home', 'shop', 'cases', 'play', 'faq']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = $$('.nav__link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: '-38% 0px -54% 0px', threshold: 0 }
    );

    navSections.forEach((section) => navObserver.observe(section));
  }

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */

  const revealNodes = $$('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-in'));
  }

  /* ----------------------------------------------------------
     Keyboard
     ---------------------------------------------------------- */

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (checkoutModal.classList.contains('is-open')) {
      closeCheckout();
      return;
    }

    if (caseModal.classList.contains('is-open')) {
      closeCaseModal();
      return;
    }

    if (cartDrawer.classList.contains('is-open')) {
      closeCart();
      return;
    }

    if (document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */

  loadCart();
  updateCartUI();
  updateCategoryCounts();
  renderProducts();
})();
