// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// =============================================
// SCROLL REVEAL ANIMATION
// =============================================
const revealElements = document.querySelectorAll(
  '.stat-card, .skill-badge, .timeline-item, .project-card, .skill-category-card, .contact-info-card, .edu-card'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// =============================================
// CONTACT FORM HANDLER
// =============================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = contactForm.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        valid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (!valid) return;

    // Simulate form submission
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

    setTimeout(() => {
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Send Message';
      formSuccess.classList.remove('d-none');

      setTimeout(() => {
        formSuccess.classList.add('d-none');
      }, 5000);
    }, 1500);
  });

  // Remove invalid class on input
  contactForm.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('is-invalid');
      }
    });
  });
}

// =============================================
// ACTIVE NAV LINK HIGHLIGHT
// =============================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
