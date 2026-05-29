document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('primary-menu');
  const nav = document.querySelector('nav[aria-label="Main navigation"]');

  if (!menuToggle || !navMenu || !nav) {
    return;
  }

  const setMenuState = (isOpen) => {
    menuToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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

  document.addEventListener('click', function (event) {
    if (!nav.contains(event.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });
});