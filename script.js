
// Ansh & Riya — Wedding Invitation Site
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // fallback in case 'load' already fired or takes too long
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------- Envelope open ---------- */
  const envelope = document.getElementById('envelope');
  const enterBtn = document.getElementById('enter-btn');
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainSite = document.getElementById('main-site');

  enterBtn.addEventListener('click', () => {
    envelope.classList.add('open');
    enterBtn.classList.add('hide');
    enterBtn.disabled = true;

    setTimeout(() => {
      envelopeScreen.classList.add('gone');
      document.body.style.overflow = 'auto';
      mainSite.classList.add('visible');
      initRevealObserver();
      document.getElementById('hero').scrollIntoView({ behavior: 'auto' });
    }, 1400);
  });

  // Lock scroll while envelope screen is showing
  document.body.style.overflow = 'hidden';

  /* ---------- Countdown ---------- */
  const weddingDate = new Date('2027-04-09T19:00:00+08:00').getTime(); // Bali time (WITA, UTC+8)

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(){
    const now = Date.now();
    const diff = weddingDate - now;
    if (diff <= 0){
      cdDays.textContent = '00'; cdHours.textContent = '00';
      cdMins.textContent = '00'; cdSecs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Scroll-triggered reveal (IntersectionObserver) ---------- */
  function initRevealObserver(){
    const revealEls = document.querySelectorAll('.reveal');
    if (prefersReducedMotion){
      revealEls.forEach(el => el.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Lightweight parallax on hero (gated + passive) ---------- */
  if (!prefersReducedMotion && window.innerWidth > 480){
    const heroBg = document.querySelector('.hero-parallax-bg');
    const hero = document.getElementById('hero');
    let ticking = false;

    function onScroll(){
      if (!ticking){
        window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight){
            const offset = window.scrollY * 0.15;
            heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

});