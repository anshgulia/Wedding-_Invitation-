// Ansh & Shefali Wedding Invitation

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ==========================================
     LOADER
     ========================================== */

  const loader = document.getElementById("loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 500);
  });

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 2500);


  /* ==========================================
     MAIN ELEMENTS
     ========================================== */

  const envelope = document.getElementById("envelope");
  const enterBtn = document.getElementById("enter-btn");
  const envelopeScreen = document.getElementById(
    "envelope-screen"
  );
  const mainSite = document.getElementById("main-site");
  const hero = document.getElementById("hero");
  const weddingMusic = document.getElementById(
    "wedding-music"
  );


  /* ==========================================
     WEDDING MUSIC
     ========================================== */

  if (weddingMusic) {
    weddingMusic.volume = 0.45;
    weddingMusic.loop = true;
  }

  async function playWeddingMusic() {
    if (!weddingMusic) {
      return;
    }

    try {
      await weddingMusic.play();
    } catch (error) {
      console.log(
        "The browser blocked music playback:",
        error
      );
    }
  }


  /* ==========================================
     ENVELOPE OPENING
     ========================================== */

  document.body.style.overflow = "hidden";

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      // Starts the music when Enter the Celebration is pressed
      playWeddingMusic();

      envelope.classList.add("open");
      enterBtn.classList.add("hide");
      enterBtn.disabled = true;

      setTimeout(() => {
        envelopeScreen.classList.add("gone");
        document.body.style.overflow = "auto";
        mainSite.classList.add("visible");

        initRevealObserver();

        if (hero) {
          hero.scrollIntoView({
            behavior: "auto"
          });
        }
      }, 1400);
    });
  }


  /* ==========================================
     COUNTDOWN
     ========================================== */

  const weddingDate = new Date(
    "2027-04-09T19:00:00+08:00"
  ).getTime();

  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function updateCountdown() {
    const now = Date.now();
    const difference = weddingDate - now;

    if (
      !cdDays ||
      !cdHours ||
      !cdMins ||
      !cdSecs
    ) {
      return;
    }

    if (difference <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMins.textContent = "00";
      cdSecs.textContent = "00";
      return;
    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(minutes);
    cdSecs.textContent = pad(seconds);
  }

  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );


  /* ==========================================
     SCROLL REVEAL ANIMATIONS
     ========================================== */

  function initRevealObserver() {
    const revealElements = document.querySelectorAll(
      ".reveal"
    );

    if (prefersReducedMotion) {
      revealElements.forEach((element) => {
        element.classList.add("in-view");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }


  /* ==========================================
     HERO PARALLAX
     ========================================== */

  if (
    !prefersReducedMotion &&
    window.innerWidth > 480
  ) {
    const heroBackground = document.querySelector(
      ".hero-parallax-bg"
    );

    let ticking = false;

    function handleScroll() {
      if (
        ticking ||
        !heroBackground ||
        !hero
      ) {
        return;
      }

      window.requestAnimationFrame(() => {
        const heroPosition =
          hero.getBoundingClientRect();

        if (
          heroPosition.bottom > 0 &&
          heroPosition.top < window.innerHeight
        ) {
          const offset = window.scrollY * 0.15;

          heroBackground.style.transform =
            `translate3d(0, ${offset}px, 0)`;
        }

        ticking = false;
      });

      ticking = true;
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );
  }


  /* ==========================================
     FLIPPING PHOTO MEMORIES
     ========================================== */

  const photoCards = document.querySelectorAll(
    ".photo-card"
  );

  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const opening =
        !card.classList.contains("is-flipped");

      photoCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove(
            "is-flipped"
          );

          otherCard.setAttribute(
            "aria-pressed",
            "false"
          );
        }
      });

      card.classList.toggle(
        "is-flipped",
        opening
      );

      card.setAttribute(
        "aria-pressed",
        String(opening)
      );
    });
  });
});