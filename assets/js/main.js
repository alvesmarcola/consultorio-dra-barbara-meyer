/**
 * CONSULTÓRIO ODONTOLÓGICO DRA. BÁRBARA MEYER | GRAMADO/RS
 * Clean Light Mode Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initTreatmentTabs();
  initComparisonSlider();
  initTestimonialsCarousel();
  initFaqAccordion();
  initBookingModal();
  initScrollReveal();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const closeDrawerBtn = document.querySelector('.drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open / Close Drawer
  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   2. HERO TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const targetElement = document.getElementById('typing-text');
  if (!targetElement) return;

  const phrases = [
    'Começa Aqui.',
    'Com Tecnologia 3D.',
    'Com Conforto Absoluto.',
    'Com Alta Precisão.',
    'Na Serra Gaúcha.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 95;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Tempo de exibição da frase completa
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pausa antes de digitar a próxima
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. ABAS FILTRÁVEIS DE TRATAMENTOS
   ========================================================================== */
function initTreatmentTabs() {
  const tabButtons = document.querySelectorAll('.tab-pill-btn');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-tab');

      // Atualiza botão ativo
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtra os cards com transição suave
      treatmentCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory.includes(targetCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. COMPARADOR ANTES & DEPOIS INTERATIVO
   ========================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('comparison-slider');
  if (!container) return;

  const afterImg = container.querySelector('.slider-img.img-after');
  const handle = container.querySelector('.slider-handle');

  function updateSliderDimensions() {
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--slider-width', `${rect.width}px`);
  }
  updateSliderDimensions();
  window.addEventListener('resize', updateSliderDimensions);

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;

    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    afterImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Eventos de Mouse
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Eventos de Toque (Mobile / Tablet)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });
}

/* ==========================================================================
   5. CARROSSEL DE DEPOIMENTOS
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-btn.btn-prev');
  const nextBtn = document.querySelector('.carousel-btn.btn-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let itemsPerPage = getItemsPerPage();
  let maxIndex = Math.max(0, cards.length - itemsPerPage);
  let autoPlayTimer;

  function getItemsPerPage() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  // Cria pontos indicadores
  dotsContainer.innerHTML = '';
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('span');
    dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToIndex(i));
    dotsContainer.appendChild(dot);
  }

  function updateCarousel() {
    itemsPerPage = getItemsPerPage();
    maxIndex = Math.max(0, cards.length - itemsPerPage);
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 32; // 2rem
    const moveAmount = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${moveAmount}px)`;

    // Atualiza indicadores
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToIndex(idx) {
    currentIndex = Math.max(0, Math.min(idx, maxIndex));
    updateCarousel();
    resetAutoPlay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateCarousel();
      resetAutoPlay();
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    }, 6500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  track.addEventListener('mouseleave', () => startAutoPlay());

  window.addEventListener('resize', () => {
    updateCarousel();
  });

  startAutoPlay();
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens abertos
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Alterna o item atual
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. MODAL DE AGENDAMENTO INTELIGENTE (WHATSAPP)
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const modalTriggerButtons = document.querySelectorAll('.open-scheduler-btn');
  const form = document.getElementById('booking-form');
  const treatmentSelect = document.getElementById('treatment-select');

  if (!modal) return;

  function openModal(defaultTreatment = '') {
    if (defaultTreatment && treatmentSelect) {
      treatmentSelect.value = defaultTreatment;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalTriggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const specificTreatment = btn.getAttribute('data-treatment') || '';
      openModal(specificTreatment);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Envio do Formulário -> WhatsApp
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patient-name').value.trim();
      const treatment = document.getElementById('treatment-select').value;
      const period = document.getElementById('period-select').value;
      const message = document.getElementById('patient-message').value.trim();

      // Formata mensagem elegante para o WhatsApp
      let text = `Olá, Dra. Bárbara Meyer! Gostaria de solicitar um agendamento no consultório em Gramado.\n\n`;
      text += `👤 *Nome:* ${name}\n`;
      text += `✨ *Interesse:* ${treatment}\n`;
      text += `🕒 *Período de Preferência:* ${period}\n`;
      if (message) {
        text += `💬 *Observação:* ${message}\n`;
      }
      text += `\nAguardarei seu retorno para confirmar o melhor horário. Muito obrigado(a)!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/message/UBK775IYXXLME1?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
      closeModal();
      form.reset();
    });
  }
}

/* ==========================================================================
   8. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. ROLAGEM SUAVE PARA LINKS INTERNOS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
