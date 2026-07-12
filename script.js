// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1600);
});

// Custom Cursor
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();
document.querySelectorAll('a, button, .project-card, .service-card, .product-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover-big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover-big'));
});

// Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

// Active Nav
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(s => {
    const top = s.offsetTop, bottom = top + s.offsetHeight;
    const id = s.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = mobileMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = mobileMenu.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = mobileMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
function closeMobileMenu() { mobileMenu.classList.remove('open'); }

// Dark Mode
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
let isDark = localStorage.getItem('theme') === 'dark';
function applyTheme() {
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
applyTheme();
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
});

// Scroll Reveal
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// Skill Bars
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.getAttribute('data-width');
      entry.target.style.width = width + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(el => skillObserver.observe(el));

// Portfolio Filter
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.getAttribute('data-filter');
    projectCards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.includes(filter);
      card.style.opacity = show ? '1' : '0.25';
      card.style.transform = show ? '' : 'scale(0.95)';
      card.style.pointerEvents = show ? 'all' : 'none';
      card.style.transition = 'all 0.4s ease';
    });
  });
});

// Testimonials Slider
const slider = document.getElementById('testimonials-slider');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let autoSlideInterval;

function getVisibleCount() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function updateSlider() {
  const visible = getVisibleCount();
  const total = slider.children.length;
  const maxSlide = total - visible;
  currentSlide = Math.min(currentSlide, maxSlide);
  const cardWidth = slider.children[0]?.offsetWidth || 0;
  const gap = 28;
  slider.style.transform = `translateX(-${currentSlide * (cardWidth + gap)}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

document.getElementById('next-btn').addEventListener('click', () => {
  const visible = getVisibleCount();
  const max = slider.children.length - visible;
  currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
  updateSlider(); resetAutoSlide();
});
document.getElementById('prev-btn').addEventListener('click', () => {
  const visible = getVisibleCount();
  const max = slider.children.length - visible;
  currentSlide = currentSlide <= 0 ? max : currentSlide - 1;
  updateSlider(); resetAutoSlide();
});
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { currentSlide = i; updateSlider(); resetAutoSlide(); });
});
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    const visible = getVisibleCount();
    const max = slider.children.length - visible;
    currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
    updateSlider();
  }, 4000);
}
function resetAutoSlide() { clearInterval(autoSlideInterval); startAutoSlide(); }
startAutoSlide();
window.addEventListener('resize', () => { updateSlider(); });

// Back to Top
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact Form
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
function submitForm() {
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();
  if (!name || !email || !message) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }
  showToast('✅ Message sent! I\'ll get back to you within 24 hours.');
  document.getElementById('f-name').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-phone').value = '';
  document.getElementById('f-message').value = '';
  document.getElementById('f-service').value = '';
}

// Smooth nav link scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Animate numbers on scroll
function animateCounter(el, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else { el.textContent = Math.floor(current) + '+'; }
  }, 30);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const t = parseInt(n.textContent);
        if (!isNaN(t)) animateCounter(n, t);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);
