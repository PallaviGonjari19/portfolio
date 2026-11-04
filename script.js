/* =============================================
   PALLAVI GONJARI - PORTFOLIO JS v2
   ============================================= */

// =============================================
// PAGE LOADER
// =============================================
const loader = document.getElementById('pageLoader');
const loaderFill = document.getElementById('loaderFill');

let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18 + 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    loaderFill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }, 400);
  }
  loaderFill.style.width = progress + '%';
}, 80);

document.body.style.overflow = 'hidden';

function initAnimations() {
  AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-cubic',
    offset: 80,
  });
}

// =============================================
// THEME TOGGLE (Light / Dark)
// =============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);

  // Update particle colors
  if (typeof updateParticleTheme === 'function') updateParticleTheme(next);
});

// =============================================
// CUSTOM CURSOR
// =============================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
  dotX = e.clientX; dotY = e.clientY;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top = dotY + 'px';
});

function animateRing() {
  ringX += (dotX - ringX) * 0.12;
  ringY += (dotY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover state
document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

// =============================================
// SCROLL PROGRESS BAR
// =============================================
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrolled / total * 100) + '%';
});

// =============================================
// =============================================
// NAVBAR & MOBILE MENU
// =============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function setMobileMenu(open) {
  navLinks.classList.toggle('open', open);
  hamburger.classList.toggle('active', open);
  if (navOverlay) navOverlay.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}

function toggleMobileMenu() {
  const isOpen = navLinks.classList.contains('open');
  setMobileMenu(!isOpen);
}

if (hamburger) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    setMobileMenu(false);
  });
}

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMobileMenu(false);
  }
});

// Close mobile menu if resized above 900px
window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
    setMobileMenu(false);
  }
});

// Close mobile menu and smoothly navigate on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      setMobileMenu(false);
    }
  });
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightNavLink();
  updateBackToTop();
});

const sections = document.querySelectorAll('section[id]');
function highlightNavLink() {
  const y = window.scrollY + 120;
  sections.forEach(s => {
    const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if (!link) return;
    if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 76;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// =============================================
// TYPEWRITER EFFECT
// =============================================
const texts = [
  'Full Stack Developer',
  'Data & ML Analyst',
  'Python Engineer',
  'ML & Logistic Regression Dev',
  'Tableau Analytics Specialist',
  'Django Developer',
];
let tIdx = 0, cIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
  const current = texts[tIdx];
  if (isDeleting) {
    typeEl.textContent = current.slice(0, cIdx--);
    if (cIdx < 0) { isDeleting = false; tIdx = (tIdx + 1) % texts.length; setTimeout(typewrite, 500); return; }
    setTimeout(typewrite, 55);
  } else {
    typeEl.textContent = current.slice(0, cIdx++);
    if (cIdx > current.length) { isDeleting = true; setTimeout(typewrite, 2200); return; }
    setTimeout(typewrite, 85);
  }
}
setTimeout(typewrite, 1000);

// =============================================
// PARTICLE CANVAS
// =============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let isDark = html.getAttribute('data-theme') === 'dark';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Particle() {
  this.reset = function () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  };
  this.reset();
  this.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  };
  this.draw = function () {
    const color = isDark ? '167, 139, 250' : '124, 58, 237';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
    ctx.fill();
  };
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

let mouseX = -1000, mouseY = -1000;
canvas.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update(); p.draw();
    // Connect close particles
    particles.forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const color = isDark ? '167, 139, 250' : '124, 58, 237';
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color}, ${(1 - dist / 100) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
    // Mouse attraction
    const dxM = p.x - mouseX, dyM = p.y - mouseY;
    const distM = Math.sqrt(dxM * dxM + dyM * dyM);
    if (distM < 120) {
      p.x += dxM / distM * 0.8;
      p.y += dyM / distM * 0.8;
    }
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.updateParticleTheme = function (theme) {
  isDark = theme === 'dark';
};

// =============================================
// VANILLA TILT
// =============================================
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': 0.15,
    perspective: 1000,
  });
}

// =============================================
// STAT COUNTERS (Intersection Observer)
// =============================================
const statItems = document.querySelectorAll('.stat-item');
let countersStarted = false;

function animateCounter(el, target, suffix) {
  const isFloat = !Number.isInteger(target);
  const duration = 1800;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = target * eased;
    el.textContent = isFloat ? current.toFixed(2) + suffix : Math.round(current) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    statItems.forEach(item => {
      const target = parseFloat(item.dataset.count);
      const suffix = item.dataset.suffix || '';
      const numEl = item.querySelector('.stat-num');
      animateCounter(numEl, target, suffix);
    });
  }
}, { threshold: 0.6 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

// =============================================
// CONTACT FORM
// =============================================
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    submitBtn.disabled = true;
    submitBtn.style.background = 'linear-gradient(135deg, #7c3aed, #ec4899)';

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Sent!</span>';
      submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      formMsg.textContent = '✓ Thanks for reaching out! I\'ll get back to you soon 🎉';
      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        formMsg.textContent = '';
      }, 4500);
    }, 1600);
  });
}

// =============================================
// BACK TO TOP
// =============================================
const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =============================================
// MOUSE PARALLAX ON BLOBS
// =============================================
const blobs = document.querySelectorAll('.blob');
document.addEventListener('mousemove', e => {
  const xPct = (e.clientX / window.innerWidth - 0.5);
  const yPct = (e.clientY / window.innerHeight - 0.5);
  blobs.forEach((b, i) => {
    const factor = (i + 1) * 18;
    b.style.transform = `translate(${xPct * factor}px, ${yPct * factor}px)`;
  });
});

// =============================================
// DOWNLOAD RESUME — sparkle effect
// =============================================
document.querySelectorAll('[download]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 200);
  });
});
