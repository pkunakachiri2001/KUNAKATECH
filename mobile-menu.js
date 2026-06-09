document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('primary-menu');
  const nav = document.querySelector('nav[aria-label="Main navigation"]');

  if (!menuToggle || !navMenu || !nav) {
    return;
  }

  // Inject dynamic backdrop overlay if not present
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const setMenuState = (isOpen) => {
    menuToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    backdrop.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  };

  menuToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    setMenuState(!navMenu.classList.contains('active'));
  });

  navMenu.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      setMenuState(false);
    }
  });

  // Close when clicking outside on the blurred backdrop
  backdrop.addEventListener('click', function () {
    setMenuState(false);
  });

  // Swipe-to-Close Gestures (Swipe Right to dismiss the right-drawer)
  let touchStartX = 0;
  let touchStartY = 0;

  navMenu.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  navMenu.addEventListener('touchend', function (e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Trigger close if swiped right by more than 60px and horizontal movement is dominant
    if (diffX > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      setMenuState(false);
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });
});