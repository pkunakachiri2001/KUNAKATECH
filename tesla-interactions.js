/* ============================================
   KUNAKATECH - TESLA-INSPIRED INTERACTIONS
   Smooth animations, scroll reveals, interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== SCROLL REVEAL ANIMATION =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all scroll-reveal elements
  const revealElements = document.querySelectorAll('.card, .feature-item, .section-title p');
  revealElements.forEach(element => {
    element.classList.add('scroll-reveal');
    observer.observe(element);
  });

  // ===== SMOOTH SCROLL NAVIGATION =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ===== PARALLAX SCROLL EFFECT =====
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero::before');
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // ===== BUTTON HOVER RIPPLE EFFECT =====
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== NAVIGATION ACTIVE STATE =====
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ===== HEADER SHADOW ON SCROLL =====
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
      nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.8)';
    } else {
      nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }
  });

  // ===== CARD HOVER EFFECT =====
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ===== LAZY LOAD IMAGES =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== FORM SUBMISSION (FORMSPREE) =====
  const contactForms = document.querySelectorAll('form.contact-form, form[action*="formspree.io"]');
  contactForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const inputs = this.querySelectorAll('input, textarea');
      let isValid = true;
      inputs.forEach(input => {
        if (input.type === 'hidden' || input.classList.contains('honeypot')) return;
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });

      if (!isValid) {
        const status = this.querySelector('.form-status');
        if (status) {
          status.textContent = 'Please fill in all required fields.';
          status.classList.remove('sr-only');
          status.classList.add('visible', 'form-error');
        }
        return;
      }

      const status = this.querySelector('.form-status');
      if (status) {
        status.textContent = 'Sending message...';
        status.classList.remove('sr-only', 'form-success', 'form-error');
        status.classList.add('visible');
      }

      try {
        const response = await fetch(this.action, {
          method: this.method || 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: new FormData(this)
        });

        if (response.ok) {
          this.reset();
          if (status) {
            status.textContent = 'Message sent successfully. We will reply soon.';
            status.classList.remove('form-error');
            status.classList.add('form-success');
          }
        } else {
          const errorText = 'Unable to send message right now. Please try again later.';
          if (status) {
            status.textContent = errorText;
            status.classList.remove('form-success');
            status.classList.add('form-error');
          }
        }
      } catch (error) {
        if (status) {
          status.textContent = 'Network error while sending. Please try again.';
          status.classList.remove('form-success');
          status.classList.add('form-error');
        }
      }
    });
  });

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      this.classList.toggle('active');
      this.setAttribute('aria-expanded', isActive);
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Don't close for hash links (scroll to sections)
        if (!this.getAttribute('href').startsWith('#')) {
          navMenu.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current) + '+';
        setTimeout(updateCounter, 50);
      } else {
        counter.textContent = target + '+';
      }
    };

    // Start animation when visible
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });

    counterObserver.observe(counter);
  });

  // ===== SCROLL PROGRESS BAR =====
  const scrollProgressBar = document.getElementById('scroll-progress');
  if (scrollProgressBar) {
    const updateScrollProgress = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    // Initialize on load
    updateScrollProgress();
  }

  console.log('✓ KUNAKATECH Tesla-inspired interactions loaded');
});

// ===== RIPPLE EFFECT CSS =====
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    pointer-events: none;
    animation: rippleAnimation 0.6s ease-out;
  }

  @keyframes rippleAnimation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  input.error, textarea.error {
    border-color: #ec4899 !important;
    background: rgba(236, 72, 153, 0.1) !important;
  }

  .success-message {
    background: rgba(0, 217, 255, 0.2);
    border: 1px solid #00d9ff;
    color: #00d9ff;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    text-align: center;
    animation: slideInUp 0.3s ease-out;
  }

  nav a.active {
    color: #00d9ff;
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #f5f5f5;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1001;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    nav ul {
      position: absolute;
      top: 70px;
      left: 0;
      width: 100%;
      background: rgba(10, 14, 39, 0.95);
      flex-direction: column;
      gap: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    nav ul.active {
      max-height: 500px;
    }

    nav ul li {
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--border-subtle);
    }
  }
`;
document.head.appendChild(style);
