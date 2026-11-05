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

    if (window.playUiSound) window.playUiSound('click');

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Sent!</span>';
      submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      formMsg.textContent = '✓ Thanks for reaching out! I\'ll get back to you soon 🎉';
      contactForm.reset();

      if (window.fireConfetti) window.fireConfetti();
      if (window.playUiSound) window.playUiSound('success');

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        formMsg.textContent = '';
      }, 4500);
    }, 1400);
  });
}

// =============================================
// BACK TO TOP
// =============================================
const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
}
if (backToTop) {
  backToTop.addEventListener('click', () => {
    if (window.playUiSound) window.playUiSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

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
// DOWNLOAD RESUME — Confetti & Feedback
// =============================================
document.querySelectorAll('[download]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.95)';
    if (window.playUiSound) window.playUiSound('success');
    if (window.fireConfetti) window.fireConfetti();
    setTimeout(() => btn.style.transform = '', 200);
  });
});

// =============================================
// LIVE CLOCK WIDGET (Bento Grid)
// =============================================
const liveTimeEl = document.getElementById('liveTime');
function updateLiveClock() {
  if (!liveTimeEl) return;
  const now = new Date();
  // Format in IST (UTC+5:30) or local browser time
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  try {
    liveTimeEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  } catch (err) {
    liveTimeEl.textContent = now.toLocaleTimeString();
  }
}
if (liveTimeEl) {
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
}

// =============================================
// SPOTLIGHT CARD CURSOR GLOW
// =============================================
const spotlightCards = document.querySelectorAll('.spotlight-card');
spotlightCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// =============================================
// PROJECT CATEGORY FILTER
// =============================================
const filterButtons = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('#projectsGrid .project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    if (window.playUiSound) window.playUiSound('click');

    // Update active button state
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter project cards
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('filter-hidden');
      } else {
        card.classList.add('filter-hidden');
      }
    });

    // Refresh animations if available
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });
});

// =============================================
// WEB AUDIO API SOUND SYNTHESIZER
// =============================================
const soundToggle = document.getElementById('soundToggle');
let soundEnabled = localStorage.getItem('portfolio-sound') === 'on';
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function updateSoundButtonUI() {
  if (!soundToggle) return;
  const icon = soundToggle.querySelector('i');
  if (soundEnabled) {
    soundToggle.classList.add('active');
    soundToggle.setAttribute('data-tooltip', 'Sound Effects: ON');
    soundToggle.setAttribute('aria-label', 'Sound Effects: ON');
    if (icon) icon.className = 'fas fa-volume-high';
  } else {
    soundToggle.classList.remove('active');
    soundToggle.setAttribute('data-tooltip', 'Sound Effects: OFF');
    soundToggle.setAttribute('aria-label', 'Sound Effects: OFF');
    if (icon) icon.className = 'fas fa-volume-xmark';
  }
}

window.playUiSound = function(type = 'click') {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(860, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'success') {
      // Two tone chime
      const now = ctx.currentTime;
      [587.33, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    }
  } catch (e) {
    // Audio context may not be allowed before gesture
  }
};

if (soundToggle) {
  updateSoundButtonUI();
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('portfolio-sound', soundEnabled ? 'on' : 'off');
    updateSoundButtonUI();
    if (soundEnabled) {
      window.playUiSound('success');
    }
  });
}

// Attach subtle click sound to interactive buttons
document.querySelectorAll('.btn, .nav-icon-btn, .term-chip, .theme-toggle').forEach(el => {
  el.addEventListener('click', () => {
    if (window.playUiSound) window.playUiSound('click');
  });
});

// =============================================
// FULLSCREEN CELEBRATION CONFETTI ENGINE
// =============================================
const confettiCanvas = document.getElementById('confettiCanvas');
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimId = null;

if (confettiCanvas) {
  confettiCtx = confettiCanvas.getContext('2d');
  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);
}

window.fireConfetti = function(count = 110) {
  if (!confettiCanvas || !confettiCtx) return;

  const colors = ['#7c3aed', '#ec4899', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'];
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.6;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * Math.random());
    const velocity = Math.random() * 12 + 6;
    confettiParticles.push({
      x: startX + (Math.random() - 0.5) * 80,
      y: startY + (Math.random() - 0.5) * 50,
      w: Math.random() * 9 + 5,
      h: Math.random() * 7 + 4,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 16,
      opacity: 1,
      gravity: 0.35,
      drag: 0.985
    });
  }

  if (!confettiAnimId) {
    runConfetti();
  }
};

function runConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.rotation += p.rotSpeed;
    p.opacity -= 0.007;

    if (p.opacity <= 0 || p.y > confettiCanvas.height + 40) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(p.opacity, 0);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimId = requestAnimationFrame(runConfetti);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiAnimId = null;
  }
}

// =============================================
// INTERACTIVE DEVELOPER TERMINAL CLI
// =============================================
const terminalModal = document.getElementById('terminalModal');
const cmdPill = document.getElementById('cmdPill');
const terminalNavBtn = document.getElementById('terminalNavBtn');
const termCloseBtn = document.getElementById('termCloseBtn');
const terminalBackdrop = document.getElementById('terminalBackdrop');
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const terminalBody = document.getElementById('terminalBody');

let cmdHistory = [];
let cmdHistoryIndex = -1;

function openTerminal() {
  if (!terminalModal) return;
  terminalModal.classList.add('active');
  terminalModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (terminalInput) {
    setTimeout(() => terminalInput.focus(), 80);
  }
  if (window.playUiSound) window.playUiSound('click');
}

function closeTerminal() {
  if (!terminalModal) return;
  terminalModal.classList.remove('active');
  terminalModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (window.playUiSound) window.playUiSound('click');
}

if (cmdPill) cmdPill.addEventListener('click', openTerminal);
if (terminalNavBtn) terminalNavBtn.addEventListener('click', openTerminal);
if (termCloseBtn) termCloseBtn.addEventListener('click', closeTerminal);
if (terminalBackdrop) terminalBackdrop.addEventListener('click', closeTerminal);

// Keyboard shortcut: Ctrl + K or Cmd + K to toggle Terminal
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    if (terminalModal && terminalModal.classList.contains('active')) {
      closeTerminal();
    } else {
      openTerminal();
    }
  } else if (e.key === 'Escape' && terminalModal && terminalModal.classList.contains('active')) {
    closeTerminal();
  }
});

// Quick-action chips click
document.querySelectorAll('.term-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const cmd = chip.getAttribute('data-cmd');
    if (cmd) {
      executeTerminalCommand(cmd);
      if (terminalInput) terminalInput.focus();
    }
  });
});

if (terminalForm) {
  terminalForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!terminalInput) return;
    const cmd = terminalInput.value.trim();
    if (cmd) {
      cmdHistory.push(cmd);
      cmdHistoryIndex = cmdHistory.length;
      executeTerminalCommand(cmd);
      terminalInput.value = '';
    }
  });

  // Up/Down arrow command history navigation
  if (terminalInput) {
    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0 && cmdHistoryIndex > 0) {
          cmdHistoryIndex--;
          terminalInput.value = cmdHistory[cmdHistoryIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cmdHistoryIndex < cmdHistory.length - 1) {
          cmdHistoryIndex++;
          terminalInput.value = cmdHistory[cmdHistoryIndex];
        } else {
          cmdHistoryIndex = cmdHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }
}

function executeTerminalCommand(rawCmd) {
  if (!terminalOutput) return;
  const cmd = rawCmd.trim().toLowerCase();

  // Create terminal line wrapper
  const line = document.createElement('div');
  line.className = 'term-line';

  // Command echo
  const echo = document.createElement('div');
  echo.className = 'term-cmd-echo';
  echo.innerHTML = `<span style="color:#10b981;">pallavi@portfolio:~$</span> <span>${escapeHtml(rawCmd)}</span>`;
  line.appendChild(echo);

  // Response container
  const resp = document.createElement('div');
  resp.className = 'term-response';

  switch (cmd) {
    case 'help':
      resp.innerHTML = `
<strong>AVAILABLE COMMANDS:</strong>
  • <span style="color:#a78bfa;">about</span>      : Learn about Pallavi Gonjari & background
  • <span style="color:#a78bfa;">skills</span>     : View technical skills stack & toolchain
  • <span style="color:#a78bfa;">projects</span>   : Inspect featured projects & repositories
  • <span style="color:#a78bfa;">resume</span>     : Download or preview full PDF CV
  • <span style="color:#a78bfa;">contact</span>    : Direct email, LinkedIn, and phone contacts
  • <span style="color:#a78bfa;">theme</span>      : Toggle light / dark mode
  • <span style="color:#a78bfa;">clear</span>      : Clear the terminal console output
  • <span style="color:#f472b6; font-weight:bold;">sudo hire</span>  : Hire Pallavi Gonjari (Easter egg 🚀)`;
      break;

    case 'about':
      resp.innerHTML = `
<strong>Pallavi Gonjari</strong> — Full Stack & Machine Learning Engineer
📍 Location: Pune, Maharashtra, India (IST / UTC+5:30)
🎓 Degree: B.E. in Computer Engineering, Savitribai Phule Pune University (8.75 CGPA)
🚀 Passion: Crafting high-performance web systems and ML analytics models.`;
      break;

    case 'skills':
      resp.innerHTML = `
<strong>CORE SKILLS STACK:</strong>
  • <strong>Languages:</strong> Python, Java, JavaScript (ES6+), C/C++, HTML5, CSS3, SQL
  • <strong>Frameworks:</strong> React, Django, Node.js, Express, Bootstrap, Tailwind
  • <strong>Data & ML:</strong> Scikit-Learn, Logistic Regression, Pandas, NumPy, Tableau, EDA
  • <strong>Databases & Tools:</strong> MySQL, MongoDB, Git/GitHub, REST APIs, VS Code`;
      break;

    case 'projects':
      resp.innerHTML = `
<strong>FEATURED PROJECTS:</strong>
  1. <strong>Logistics Bottleneck & Delay Analyzer</strong> (ML & Analytics)
     • Logistic regression model predicting shipment delays with 85%+ accuracy.
     • <a href="https://github.com/PallaviGonjari19/Logistics-Bottleneck-Delay-Analyzer-Data-Analytics-.git" target="_blank">View GitHub Repo ↗</a>

  2. <strong>E-Learning Management Platform</strong> (Full Stack)
     • Responsive React & Node course delivery application with quiz modules.

  3. <strong>Healthcare Patient Record Management</strong> (Full Stack & DB)
     • Secure medical dashboard with role-based auth & real-time appointment tracking.`;
      break;

    case 'resume':
    case 'cv':
      resp.innerHTML = `
📄 <span class="term-success">Opening Pallavi's Resume...</span>
If your browser didn't automatically open it, click here: 
<a href="Pallavi_Gonjari_Resume.pdf" target="_blank" download>Download Pallavi_Gonjari_Resume.pdf ↗</a>`;
      if (window.fireConfetti) window.fireConfetti();
      window.open('Pallavi_Gonjari_Resume.pdf', '_blank');
      break;

    case 'contact':
      resp.innerHTML = `
<strong>GET IN TOUCH:</strong>
  • ✉️ Email    : <a href="mailto:gonjaripallavi19@gmail.com">gonjaripallavi19@gmail.com</a>
  • 💼 LinkedIn : <a href="https://linkedin.com/in/pallavi-gonjari" target="_blank">linkedin.com/in/pallavi-gonjari ↗</a>
  • 🐙 GitHub   : <a href="https://github.com/PallaviGonjari19" target="_blank">github.com/PallaviGonjari19 ↗</a>
  • 📱 Phone    : <a href="tel:+917841029199">+91 7841029199</a>`;
      break;

    case 'theme':
    case 'theme toggle':
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      if (typeof updateParticleTheme === 'function') updateParticleTheme(next);
      resp.innerHTML = `<span class="term-success">Theme changed to: <strong>${next}</strong> mode</span>`;
      break;

    case 'clear':
      terminalOutput.innerHTML = '';
      return;

    case 'sudo hire':
    case 'hire':
      resp.innerHTML = `
<div style="color:#ec4899; font-size:1.05rem; font-weight:800; margin-bottom:6px;">
  🚀 [ACCESS GRANTED] OFFER ACCEPTED! 🎉
</div>
<div style="color:#f8fafc; line-height:1.6;">
  Thank you for choosing to work together! Let's build something phenomenal.<br/>
  Direct email: <a href="mailto:gonjaripallavi19@gmail.com">gonjaripallavi19@gmail.com</a><br/>
  Direct phone: <a href="tel:+917841029199">+91 7841029199</a>
</div>`;
      if (window.fireConfetti) {
        window.fireConfetti(180);
      }
      if (window.playUiSound) {
        window.playUiSound('success');
      }
      break;

    default:
      resp.innerHTML = `<span class="term-err">zsh: command not found: ${escapeHtml(rawCmd)}. Type <span style="color:#38bdf8;">'help'</span> for available commands.</span>`;
      break;
  }

  line.appendChild(resp);
  terminalOutput.appendChild(line);

  // Auto scroll to bottom of terminal
  if (terminalBody) {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
