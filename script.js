// Theme selection is remembered, while the first visit always starts in dark mode.
const root = document.documentElement;
root.classList.add('js');
const themeButton = document.querySelector('.theme-toggle');
try {
  if (localStorage.getItem('portfolio-theme') === 'light') root.dataset.theme = 'light';
} catch (_) { /* The site still works when storage is unavailable. */ }

function updateThemeButton() {
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeButton.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeButton.innerHTML = light ? '<i class="fa-regular fa-moon" aria-hidden="true"></i>' : '<i class="fa-regular fa-sun" aria-hidden="true"></i>';
}
updateThemeButton();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) {}
  updateThemeButton();
});

// Keep mobile navigation accessible and close it after choosing a destination.
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
function closeMenu() {
  navLinks.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => { if (window.innerWidth > 720) closeMenu(); });

// Reveal content as it enters the viewport, with a safe fallback.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('is-visible'));
}

// Update the current navigation link as the visitor moves through the page.
const sections = [...document.querySelectorAll('main section[id]')];
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
function updateActiveLink() {
  let current = sections[0]?.id;
  const position = window.scrollY + 160;
  sections.forEach((section) => { if (section.offsetTop <= position) current = section.id; });
  sectionLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// The static form opens the visitor's email app; it does not send data to a server.
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const subject = `Portfolio inquiry from ${data.get('name').toString().trim()}`;
  const body = `${data.get('message').toString().trim()}\n\nFrom: ${data.get('name').toString().trim()}\nEmail: ${data.get('email').toString().trim()}`;
  document.querySelector('.form-status').textContent = 'Your email app will open with your message ready to send.';
  window.location.href = `mailto:${contactForm.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

