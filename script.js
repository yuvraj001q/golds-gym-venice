/* ============================================================
   GOLD'S GYM VENICE - PREMIUM SCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ==================== DOM REFERENCES ==================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const nav = $('#nav');
  const navBurger = $('#navBurger');
  const navLinks = $('#navLinks');
  const heroCtaPrimary = $('#heroCtaPrimary');
  const vipModal = $('#vipModal');
  const modalClose = $('#modalClose');
  const vipForm = $('#vipForm');
  const vipAutomation = $('#vipAutomation');
  const chatFab = $('#chatFab');
  const chatWidget = $('#chatWidget');
  const chatMinimize = $('#chatMinimize');
  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const quickReplies = $('#quickReplies');
  const heroParticles = $('#heroParticles');
  const finalForm = $('#finalForm');
  const finalWorkflow = $('#finalWorkflow');

  /* ==================== NAVIGATION ==================== */
  let lastScroll = 0;

  function handleScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    lastScroll = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ==================== SMOOTH SCROLL ==================== */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = $(anchor.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ==================== HERO PARTICLES ==================== */
  function createParticles() {
    if (!heroParticles) return;
    const count = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 4 + 's';
      p.style.animationDuration = 3 + Math.random() * 3 + 's';
      p.style.width = p.style.height = 1 + Math.random() * 2 + 'px';
      heroParticles.appendChild(p);
    }
  }
  createParticles();

  /* ==================== SCROLL REVEAL ==================== */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  $$('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ==================== COUNTER ANIMATION ==================== */
  function animateCounters() {
    $$('.stat__number[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;

      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = $('#stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* ==================== VIP PASS MODAL ==================== */
  function openModal() {
    vipModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    vipModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      vipForm.classList.remove('hidden');
      vipForm.style.display = '';
      const header = vipModal.querySelector('.modal__header');
      if (header) header.classList.remove('hidden');
      vipAutomation.classList.remove('active');
      $$('.automation-step', vipAutomation).forEach(s => s.classList.remove('active'));
      const complete = $('#automationComplete');
      if (complete) complete.classList.remove('active');
    }, 300);
  }

  heroCtaPrimary.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  vipModal.addEventListener('click', e => { if (e.target === vipModal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  vipForm.addEventListener('submit', e => {
    e.preventDefault();
    vipForm.classList.add('hidden');
    const header = vipModal.querySelector('.modal__header');
    if (header) header.classList.add('hidden');
    vipAutomation.classList.add('active');

    const steps = $$('.automation-step', vipAutomation);
    steps.forEach((step, i) => {
      setTimeout(() => step.classList.add('active'), 400 * (i + 1));
    });

    setTimeout(() => {
      const complete = $('#automationComplete');
      if (complete) complete.classList.add('active');
    }, 400 * steps.length + 600);
  });

  /* ==================== FINAL FORM ==================== */
  if (finalForm) {
    finalForm.addEventListener('submit', e => {
      e.preventDefault();
      finalForm.style.display = 'none';

      if (finalWorkflow) {
        const steps = $$('.workflow-step', finalWorkflow);
        steps.forEach((step, i) => {
          setTimeout(() => step.classList.add('active'), 500 * (i + 1));
        });
      }
    });
  }

  /* ==================== CHAT WIDGET ==================== */
  let chatOpen = false;

  function openChat() {
    chatOpen = true;
    chatWidget.classList.add('active');
    chatFab.classList.add('hidden');
    startChatDemo();
  }

  function closeChat() {
    chatOpen = false;
    chatWidget.classList.remove('active');
    chatFab.classList.remove('hidden');
  }

  chatFab.addEventListener('click', openChat);
  chatMinimize.addEventListener('click', closeChat);

  /* ==================== CHAT DEMO ==================== */
  let chatDemoStarted = false;
  let chatDemoStep = 0;

  const chatConversation = [
    { role: 'ai', text: "What are your fitness goals?" },
    { role: 'user', text: "Build muscle." },
    { role: 'ai', text: "Great choice! Would you like a complimentary 3-day VIP pass to experience our full facility?" },
    { role: 'user', text: "Yes, absolutely!" },
    { role: 'ai', text: "Perfect. I've reserved your pass and notified our front desk team. You'll receive an SMS with your VIP details shortly. See you at the Mecca!" },
    { role: 'system', text: "Lead captured automatically. SMS sent. Front desk notified." }
  ];

  function addChatMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${role === 'system' ? 'system' : role}`;

    if (role === 'system') {
      msg.style.cssText = 'justify-content: center; padding: 8px 16px; background: rgba(50,213,131,0.1); border-radius: 8px; border: 1px solid rgba(50,213,131,0.2); margin-top: 8px;';
      msg.innerHTML = `<span style="font-size:0.75rem; color:var(--success); font-weight:600; text-align:center;">${text}</span>`;
    } else {
      const avatar = role === 'ai' ? 'AI' : 'U';
      msg.innerHTML = `
        <div class="chat-msg__avatar">${avatar}</div>
        <div class="chat-msg__content">
          <p>${text}</p>
          <span class="chat-msg__time">Just now</span>
        </div>
      `;
    }

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg--ai';
    typing.id = 'chatTyping';
    typing.innerHTML = `
      <div class="chat-msg__avatar">AI</div>
      <div class="chat-msg__content">
        <div class="chat-typing"><span></span><span></span><span></span></div>
      </div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  function removeTypingIndicator() {
    const t = $('#chatTyping');
    if (t) t.remove();
  }

  function processNextAIMessage() {
    if (chatDemoStep >= chatConversation.length) return;

    const entry = chatConversation[chatDemoStep];

    if (entry.role === 'user') {
      chatDemoStep++;
      setTimeout(() => processNextAIMessage(), 800);
      return;
    }

    const typing = addTypingIndicator();
    const delay = entry.text.length * 20 + 500;

    setTimeout(() => {
      removeTypingIndicator();
      addChatMessage(entry.role, entry.text);
      chatDemoStep++;

      if (chatDemoStep < chatConversation.length && chatConversation[chatDemoStep].role === 'user') {
        setTimeout(() => processNextAIMessage(), 1200);
      }
    }, delay);
  }

  function startChatDemo() {
    if (chatDemoStarted) return;
    chatDemoStarted = true;
    chatDemoStep = 0;

    setTimeout(() => {
      processNextAIMessage();
    }, 1500);
  }

  /* Quick Replies */
  quickReplies.addEventListener('click', e => {
    const btn = e.target.closest('.quick-reply');
    if (!btn) return;

    const message = btn.dataset.message;
    addChatMessage('user', message);
    quickReplies.style.display = 'none';
    chatDemoStep = 1;

    setTimeout(() => processNextAIMessage(), 1000);
  });

  /* Chat Input */
  function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    addChatMessage('user', text);
    quickReplies.style.display = 'none';

    const typing = addTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addChatMessage('ai', "Thanks for your interest! I've noted your message. Would you like to claim your complimentary 3-day VIP pass?");
      chatDemoStep = 2;
    }, 1200);
  }

  chatSend.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

  /* ==================== CARD TILT ==================== */
  if (window.innerWidth > 1024) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ==================== PARALLAX (subtle) ==================== */
  let ticking = false;
  function handleParallax() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const hero = $('#hero');
      if (hero && scrollY < window.innerHeight) {
        const overlay = hero.querySelector('.hero__overlay');
        if (overlay) overlay.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', handleParallax, { passive: true });

})();
