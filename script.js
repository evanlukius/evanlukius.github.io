// ===== CART (localStorage so it persists across pages) =====
let cart = JSON.parse(localStorage.getItem('moruCart') || '[]');

function saveCart() {
  localStorage.setItem('moruCart', JSON.stringify(cart));
}

// ===== ADD TO CART =====
function addToCart(name, price, emoji) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, emoji, qty: 1 });
  }
  saveCart();
  updateCartCount();
  updateCartPanel();
  showToast(`${emoji} ${name} added to cart!`);
}

// ===== REMOVE FROM CART =====
function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  updateCartCount();
  updateCartPanel();
}

// ===== UPDATE CART COUNT (navbar badge) =====
function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (el) {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    el.textContent = total;
  }
}

// ===== UPDATE CART PANEL (offcanvas, only on shop page) =====
function updateCartPanel() {
  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');
  const waCheckout = document.getElementById('waCheckout');

  if (!cartItems) return;

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // remove old items
  cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartFooter.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartFooter.style.display = 'block';

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">
          Rp ${(item.price * item.qty).toLocaleString('id-ID')}
          ${item.qty > 1 ? `<span style="color:#aaa;font-weight:600;"> x${item.qty}</span>` : ''}
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">
        <i class="bi bi-x-circle-fill"></i>
      </button>
    `;
    cartItems.insertBefore(div, emptyCart);
  });

  cartTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

  // build WA message
  if (waCheckout) {
    const lines = cart.map(i => `${i.emoji} ${i.name} x${i.qty} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`).join('%0A');
    const msg = `Halo Moru Doll! 🐻%0ASaya mau order:%0A${lines}%0A%0ATotal: Rp ${totalPrice.toLocaleString('id-ID')}`;
    waCheckout.href = `https://wa.me/6281717121267?text=${msg}`;
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toastEl = document.getElementById('cartToast');
  if (!toastEl) return;
  document.getElementById('toastMsg').textContent = msg;
  new bootstrap.Toast(toastEl, { delay: 2500 }).show();
}

// ===== PRODUCT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.product-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.display = show ? 'block' : 'none';
      if (show) item.style.animation = 'fadeInUp 0.3s ease';
    });
  });
});

// ===== WISHLIST TOGGLE =====
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const icon = this.querySelector('i');
    const active = icon.classList.contains('bi-heart-fill');
    icon.classList.toggle('bi-heart', active);
    icon.classList.toggle('bi-heart-fill', !active);
    this.style.background = active ? 'rgba(255,255,255,0.9)' : '#ff8fab';
    this.style.color = active ? '#ff8fab' : '#fff';
  });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(255,143,171,0.2)' : 'none';
});

// ===== SMOOTH SCROLL (same-page anchors) =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nav = document.getElementById('navMenu');
      if (nav && nav.classList.contains('show')) new bootstrap.Collapse(nav).hide();
    }
  });
});

// ===== CONTACT FORM → WhatsApp =====
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]').value;
  const phone = form.querySelector('input[type="tel"]').value;
  const subject = form.querySelector('select').value || 'General Inquiry';
  const message = form.querySelector('textarea').value;
  const text = `Halo Moru Doll! 🐻%0ANama: ${name}%0ANo. WA: ${phone}%0ATopic: ${subject}%0A%0A${message}`;
  window.open(`https://wa.me/6281717121267?text=${encodeURIComponent(decodeURIComponent(text))}`, '_blank');
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.product-card, .testi-card, .feature-card, .workshop-card, .contact-card, .occasion-card, .ws-get-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== INIT =====
updateCartCount();
updateCartPanel();
