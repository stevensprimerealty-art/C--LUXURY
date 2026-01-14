/* =============================
   C-LUXURY — Hero slider 6 slides
   4.5s autoplay, fade image + fade text, tap rings to change
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
const INTERVAL = 4500; // 4.5s

function setActiveRing(i){
  rings.forEach(r => r.classList.remove("is-active"));
  const ring = rings[i];
  if(!ring) return;
  ring.classList.remove("is-active");
  void ring.offsetWidth; // restart animation
  ring.classList.add("is-active");
}

function setHeadline(i){
  titleEl.classList.add("is-fading");
  window.setTimeout(() => {
    titleEl.innerHTML = headlines[i].replace(/\n/g, "<br/>");
    titleEl.classList.remove("is-fading");
  }, 250);
}

function showSlide(i){
  slides.forEach(s => s.classList.remove("is-active"));
  if(slides[i]) slides[i].classList.add("is-active");
  setHeadline(i);
  setActiveRing(i);
}

function next(){
  index = (index + 1) % slides.length;
  showSlide(index);
}

function start(){
  stop();
  timer = window.setInterval(next, INTERVAL);
}
function stop(){
  if(timer) window.clearInterval(timer);
  timer = null;
}

rings.forEach(btn => {
  btn.addEventListener("click", () => {
    const go = Number(btn.getAttribute("data-go"));
    if(Number.isNaN(go)) return;
    index = go;
    showSlide(index);
    start(); // reset timer
  });
});

/* Overlay open/close */
function openOverlay(el){
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeOverlay(el){
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

const menuOverlay = document.getElementById("menuOverlay");
document.getElementById("openMenu").addEventListener("click", () => openOverlay(menuOverlay));
document.getElementById("closeMenu").addEventListener("click", () => closeOverlay(menuOverlay));
menuOverlay.addEventListener("click", (e) => { if(e.target === menuOverlay) closeOverlay(menuOverlay); });

const searchOverlay = document.getElementById("searchOverlay");
document.getElementById("openSearch").addEventListener("click", () => openOverlay(searchOverlay));
document.getElementById("closeSearch").addEventListener("click", () => closeOverlay(searchOverlay));
searchOverlay.addEventListener("click", (e) => { if(e.target === searchOverlay) closeOverlay(searchOverlay); });

document.addEventListener("keydown", (e) => {
  if(e.key !== "Escape") return;
  if(menuOverlay.classList.contains("is-open")) closeOverlay(menuOverlay);
  if(searchOverlay.classList.contains("is-open")) closeOverlay(searchOverlay);
});

/* init */
showSlide(index);
start();

// Header scroll behavior
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
});

/* =============================
   Gift touch scroll: fade in/out + safe loop
   ============================= */
(() => {
  const scroller = document.getElementById("giftScroller");
  const cards = Array.from(document.querySelectorAll(".gift-card"));
  if (!scroller || cards.length === 0) return;

  // Fade in/out when card is in view inside the scroller
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        e.target.classList.remove("is-out");
      } else if (e.intersectionRatio === 0) {
        // when fully out, soften it
        e.target.classList.add("is-out");
      }
    });
  }, { root: scroller, threshold: 0.55 });

  cards.forEach(c => io.observe(c));

  // Safe loop: when you reach the duplicate end card, jump back to the first
  let loopLock = false;
  scroller.addEventListener("scroll", () => {
    if (loopLock) return;

    const endCard = scroller.querySelector('[data-loop="end"]');
    const startCard = scroller.querySelector('[data-loop="start"]');
    if (!endCard || !startCard) return;

    const endRect = endCard.getBoundingClientRect();
    const rootRect = scroller.getBoundingClientRect();

    // if end card is mostly visible
    const visible = endRect.left < (rootRect.left + 30);
    if (visible) {
      loopLock = true;
      // jump back instantly (no break, no flicker)
      scroller.scrollLeft = 0;
      setTimeout(() => { loopLock = false; }, 120);
    }
  }, { passive: true });
})();


/* =========================
   C NEW ARRIVALS logic (FIXED)
   ========================= */
(function () {
  const slider = document.getElementById("naSlider");
  if (!slider) return;

  const nameEl = document.getElementById("naName");

  const leftImg = document.getElementById("naLeftImg");
  const leftName = document.getElementById("naLeftName");
  const leftFade = document.getElementById("naLeftFade");
  const leftMore = document.getElementById("naLeftMore");

  const modal = document.getElementById("naModal");
  const modalTitle = document.getElementById("naModalTitle");
  const modalMock1 = document.getElementById("naModalMock1");
  const modalMock2 = document.getElementById("naModalMock2");

  const cards = Array.from(slider.querySelectorAll(".na-card"))
    .filter(c => !c.classList.contains("na-dup"));

  if (cards.length === 0) return;

  const PX_PER_TICK = 0.7;
  const TICK_MS = 16;
  const RESUME_AFTER_MS = 3700;

  let paused = false;
  let resumeTimer = null;
  let activeIndex = 0;

  function getCardData(card) {
    return {
      name: card.getAttribute("data-name") || "",
      main: card.getAttribute("data-main") || "",
      mock1: card.getAttribute("data-mock1") || "",
      mock2: card.getAttribute("data-mock2") || ""
    };
  }

  function setActive(i) {
    activeIndex = (i + cards.length) % cards.length;
    const data = getCardData(cards[activeIndex]);

    if (nameEl) nameEl.textContent = data.name;

    if (leftFade) leftFade.style.opacity = "1";
    window.setTimeout(() => {
      if (leftImg) leftImg.src = data.main;
      if (leftName) leftName.textContent = data.name;
      if (leftFade) leftFade.style.opacity = "0";
    }, 220);

    if (leftMore) {
      leftMore.dataset.main = data.main;
      leftMore.dataset.name = data.name;
      leftMore.dataset.mock1 = data.mock1;
      leftMore.dataset.mock2 = data.mock2;
    }
  }

  function openModalFromData(data) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (modalTitle) modalTitle.textContent = data.name || "PRODUCT";
    if (modalMock1) modalMock1.src = data.mock1 || data.main || "";
    if (modalMock2) modalMock2.src = data.mock2 || data.main || "";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function pauseThenResume() {
    paused = true;
    if (resumeTimer) window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      paused = false;
    }, RESUME_AFTER_MS);
  }

  // Initial
  setActive(0);

  // Card button opens modal
  slider.addEventListener("click", (e) => {
    const btn = e.target.closest(".na-card-more");
    if (!btn) return;

    const card = btn.closest(".na-card");
    if (!card || card.classList.contains("na-dup")) return;

    pauseThenResume();
    openModalFromData(getCardData(card));
  });

  // Left SEE MORE opens current
  if (leftMore) {
    leftMore.addEventListener("click", () => {
      pauseThenResume();
      openModalFromData({
        name: leftMore.dataset.name || (leftName ? leftName.textContent : "PRODUCT"),
        main: leftMore.dataset.main || (leftImg ? leftImg.src : ""),
        mock1: leftMore.dataset.mock1 || (leftImg ? leftImg.src : ""),
        mock2: leftMore.dataset.mock2 || (leftImg ? leftImg.src : "")
      });
    });
  }

  // Close modal
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) closeModal();
  });

  // Pause on interaction (FIXED)
  ["pointerdown", "touchstart", "wheel"].forEach((evt) => {
    slider.addEventListener(evt, pauseThenResume, { passive: true });
  });

  // Auto scroll tick
  function tick() {
    if (!paused) {
      slider.scrollLeft += PX_PER_TICK;

      const cardW = cards[0].getBoundingClientRect().width + 12;
      const idx = Math.floor(slider.scrollLeft / cardW) % cards.length;

      if (idx !== activeIndex) setActive(idx);

      const maxBeforeReset = cardW * cards.length;
      if (slider.scrollLeft >= maxBeforeReset) {
        slider.scrollLeft -= maxBeforeReset;
      }
    }

    window.setTimeout(tick, TICK_MS);
  }

  tick();
})();
