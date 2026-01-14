document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     HERO slider (safe)
     ============================= */
  const headlines = [
    "A NEW YEAR\nWITH PRESENCE",
    "SILENCE\nCONNOTES NOISE",
    "LUXURY\nWITHOUT NOISE",
    "PRESENCE\nWITHOUT NOISE",
    "SILENCE\nIS POWER",
    "LUXURY\nWITHOUT NOISE"
  ];

  const slides = Array.from(document.querySelectorAll(".slide"));
  const titleEl = document.getElementById("heroTitle");
  const rings = Array.from(document.querySelectorAll(".ring"));

  let index = 0;
  let timer = null;
  const INTERVAL = 4500;

  function setActiveRing(i) {
    if (!rings.length) return;
    rings.forEach(r => r.classList.remove("is-active"));
    const ring = rings[i];
    if (!ring) return;
    ring.classList.remove("is-active");
    void ring.offsetWidth;
    ring.classList.add("is-active");
  }

  function setHeadline(i) {
    if (!titleEl) return;
    titleEl.classList.add("is-fading");
    window.setTimeout(() => {
      const text = headlines[i] ?? headlines[0];
      titleEl.innerHTML = String(text).replace(/\n/g, "<br/>");
      titleEl.classList.remove("is-fading");
    }, 250);
  }

  function showSlide(i) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove("is-active"));
    if (slides[i]) slides[i].classList.add("is-active");
    setHeadline(i);
    setActiveRing(i);
  }

  function next() {
    if (!slides.length) return;
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function start() {
    stop();
    if (!slides.length) return;
    timer = window.setInterval(next, INTERVAL);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Ring clicks
  if (rings.length) {
    rings.forEach(btn => {
      btn.addEventListener("click", () => {
        const go = Number(btn.getAttribute("data-go"));
        if (Number.isNaN(go)) return;
        index = go;
        showSlide(index);
        start();
      });
    });
  }

  // Init hero ONLY if slides exist
  if (slides.length) {
    showSlide(0);
    start();
  }

  /* =============================
     OVERLAYS (safe)
     ============================= */
  function openOverlay(el) {
    if (!el) return;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  const menuOverlay = document.getElementById("menuOverlay");
  const searchOverlay = document.getElementById("searchOverlay");

  const openMenuBtn = document.getElementById("openMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const openSearchBtn = document.getElementById("openSearch");
  const closeSearchBtn = document.getElementById("closeSearch");

  if (openMenuBtn) openMenuBtn.addEventListener("click", () => openOverlay(menuOverlay));
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", () => closeOverlay(menuOverlay));
  if (menuOverlay) menuOverlay.addEventListener("click", (e) => { if (e.target === menuOverlay) closeOverlay(menuOverlay); });

  if (openSearchBtn) openSearchBtn.addEventListener("click", () => openOverlay(searchOverlay));
  if (closeSearchBtn) closeSearchBtn.addEventListener("click", () => closeOverlay(searchOverlay));
  if (searchOverlay) searchOverlay.addEventListener("click", (e) => { if (e.target === searchOverlay) closeOverlay(searchOverlay); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (menuOverlay && menuOverlay.classList.contains("is-open")) closeOverlay(menuOverlay);
    if (searchOverlay && searchOverlay.classList.contains("is-open")) closeOverlay(searchOverlay);
  });

  /* =============================
     Header scroll (safe)
     ============================= */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }, { passive: true });
  }

  /* =============================
     Gift scroller loop (safe)
     ============================= */
  (() => {
    const scroller = document.getElementById("giftScroller");
    const cards = Array.from(document.querySelectorAll(".gift-card"));
    if (!scroller || cards.length === 0) return;

    // Fade in/out
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          e.target.classList.remove("is-out");
        } else if (e.intersectionRatio === 0) {
          e.target.classList.add("is-out");
        }
      });
    }, { root: scroller, threshold: 0.55 });

    cards.forEach(c => io.observe(c));

    // Safe loop
    let loopLock = false;
    scroller.addEventListener("scroll", () => {
      if (loopLock) return;

      const endCard = scroller.querySelector('[data-loop="end"]');
      if (!endCard) return;

      const endRect = endCard.getBoundingClientRect();
      const rootRect = scroller.getBoundingClientRect();

      const visible = endRect.left < (rootRect.left + 30);
      if (visible) {
        loopLock = true;
        scroller.scrollLeft = 0;
        setTimeout(() => { loopLock = false; }, 120);
      }
    }, { passive: true });
  })();
});
