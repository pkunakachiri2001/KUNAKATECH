/* ============================================
   KUNAKATECH - TESLA-INSPIRED INTERACTIONS
   Smooth animations, scroll reveals, interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const GROQ_MODEL = 'llama-3.1-8b-instant';
  const GEMINI_PROXY_URL = window.KUNAKA_CHAT_API_URL || '';
  const GROQ_API_KEY = window.KUNAKA_GROQ_API_KEY || '';
  const GROQ_API_URL = GROQ_API_KEY
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : '';

  async function askGemini(promptText) {
    if (GEMINI_PROXY_URL) {
      const proxyResponse = await fetch(GEMINI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemPrompt: 'You are the KUNAKA TECH AI assistant. Answer naturally, helpfully, and concisely.',
          model: GROQ_MODEL,
        }),
      });

      if (!proxyResponse.ok) {
        throw new Error(`Gemini proxy failed: ${proxyResponse.status}`);
      }

      const proxyData = await proxyResponse.json();
      const proxyText = String(proxyData?.reply || '').trim();
      if (!proxyText) {
        throw new Error('Gemini proxy returned an empty response');
      }
      return proxyText;
    }

    if (!GROQ_API_KEY || !GROQ_API_URL) {
      throw new Error('Groq is not configured');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
        max_tokens: 512,
        top_p: 0.95,
        stream: false,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Groq returned an empty response');
    }
    return text;
  }

  window.askGemini = askGemini;
  
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
    const target = parseInt(counter.dataset.target, 10);
    if (Number.isNaN(target) || target <= 0) return;

    const animateCounter = () => {
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 100));

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = `${current}+`;
          window.setTimeout(updateCounter, 50);
        } else {
          counter.textContent = `${target}+`;
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter();
        counterObserver.unobserve(counter);
      }
    });

    counterObserver.observe(counter);
  });

  // ===== CHATBOT WIRING =====
  const GEMINI_SYSTEM_PROMPT = [
    'You are the KUNAKA TECH AI assistant.',
    'Answer naturally, helpfully, and concisely.',
    'Use the company website context when relevant, but otherwise do your best to answer user questions.',
    'Do not refuse to answer except when the user explicitly requests illegal, dangerous, or harmful instructions — in that case refuse briefly and offer a safe alternative or safer guidance.'
  ].join(' ');

  window.openChatModal = function() {
    const modal = document.getElementById('chatModal');
    if (modal) modal.classList.add('active');
  };

  window.closeChatModal = function() {
    const modal = document.getElementById('chatModal');
    if (modal) modal.classList.remove('active');
  };

  window.sendChatMessage = async function() {
    const input = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    if (!input || !chatMessages) return;

    const userMsg = input.value.trim();
    if (!userMsg) return;

    const appendChatMessage = (sender, text) => {
      const msgDiv = document.createElement('div');
      msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    appendChatMessage('You', userMsg);
    input.value = '';
    const thinkingNode = document.createElement('div');
    thinkingNode.innerHTML = '<b>AI:</b> Thinking...';
    chatMessages.appendChild(thinkingNode);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const reply = await window.askGemini(`${GEMINI_SYSTEM_PROMPT}\n\nUser: ${userMsg}`);
      thinkingNode.remove();
      appendChatMessage('AI', reply.replace(/\n/g, '<br>'));
    } catch (error) {
      thinkingNode.remove();
      appendChatMessage('AI', 'Sorry, I could not reach the AI service right now. Please try again in a moment.');
      console.error('Gemini chat error:', error);
    }
  };

  (function(){
    const bubble = document.querySelector('.ai-chat-bubble');
    const closeBtn = document.getElementById('chatCloseBtn');
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');

    if (bubble) bubble.addEventListener('click', window.openChatModal);
    if (closeBtn) closeBtn.addEventListener('click', window.closeChatModal);
    if (sendBtn) sendBtn.addEventListener('click', window.sendChatMessage);
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') window.sendChatMessage();
      });
    }
  })();

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
