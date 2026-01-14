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


/* =============================
   C NEW ARRIVALS — IN-BOX MOCKUP + AUTO SLIDER
   ============================= */
(() => {
  const slider = document.getElementById("naSlider");
  const box = document.querySelector(".na-card-box");

  const mainImg = document.getElementById("naMainImg");
  const mockImg = document.getElementById("naMockImg");

  const closeBtn = document.getElementById("naClose");
  const prevBtn = document.getElementById("naPrev");
  const nextBtn = document.getElementById("naNext");

  const displayName = document.getElementById("naDisplayName");
  const nowName = document.getElementById("naName");

  if (!slider || !box || !mainImg || !mockImg) return;

  // Only real cards (ignore duplicates)
  const cards = Array.from(slider.querySelectorAll(".na-card"))
    .filter(c => !c.classList.contains("na-dup"));

  if (cards.length === 0) return;

  // Auto-slide settings
  const PX_PER_TICK = 0.7;
  const TICK_MS = 16;
  const RESUME_AFTER_MS = 3800;

  let paused = false;
  let resumeTimer = null;

  // Mock state
  let mocks = [];
  let mockIndex = 0;

  function pauseThenResume() {
    paused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      paused = false;
    }, RESUME_AFTER_MS);
  }

  function showMainOnly() {
    box.classList.remove("show-mockup");
    mockImg.classList.remove("is-visible");
    mainImg.classList.add("is-visible");
    mocks = [];
  }

  function showMock(i) {
    if (mocks.length === 0) return;
    mockIndex = (i + mocks.length) % mocks.length;

    mockImg.src = mocks[mockIndex];
    mainImg.classList.remove("is-visible");
    mockImg.classList.add("is-visible");
    box.classList.add("show-mockup");
  }

  function setLeftToCard(card) {
    const name = card.getAttribute("data-name") || "";
    const main = card.getAttribute("data-main") || "";
    const m1 = card.getAttribute("data-mock1") || "";
    const m2 = card.getAttribute("data-mock2") || "";

    // Update text (black on white)
    if (displayName) displayName.textContent = name;
    if (nowName) nowName.textContent = name;

    // IMPORTANT: Only update left image if NOT currently showing mockups
    if (!box.classList.contains("show-mockup")) {
      mainImg.src = main;
      mainImg.classList.add("is-visible");
      mockImg.classList.remove("is-visible");
      mockImg.src = "";
    }

    // Save mocks for when user taps
    card._mocks = [m1, m2].filter(Boolean);
  }

  // Init left with first real card
  setLeftToCard(cards[0]);

  // Tap card OR SEE MORE => show mock in left box (not modal)
  slider.addEventListener("click", (e) => {
    const card = e.target.closest(".na-card");
    if (!card || card.classList.contains("na-dup")) return;

    pauseThenResume();

    // Ensure left display text/main matches tapped product
    setLeftToCard(card);

    // Then show mockups inside box
    mocks = (card._mocks || []).slice();
    if (mocks.length) {
      showMock(0);
    }
  });

  // Controls inside box (tap)
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      pauseThenResume();
      showMock(mockIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      pauseThenResume();
      showMock(mockIndex + 1);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showMainOnly();
      pauseThenResume();
    });
  }

  // Resume if user scrolls page (your rule)
  let scrollTimer;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      // If mockups open, revert back to main after scroll
      if (box.classList.contains("show-mockup")) showMainOnly();
      paused = false;
    }, 180);
  }, { passive: true });

  // Also pause on direct slider interaction
  ["pointerdown", "touchstart", "wheel"].forEach((evt) => {
    slider.addEventListener(evt, pauseThenResume, { passive: true });
  });

  // Auto scroll loop + keep updating left product name/main (when not in mock view)
  function tick() {
    if (!paused) {
      slider.scrollLeft += PX_PER_TICK;

      const cardW = cards[0].getBoundingClientRect().width + 12;
      const idx = Math.floor(slider.scrollLeft / cardW) % cards.length;

      // Update left display to match current index ONLY if not in mock mode
      setLeftToCard(cards[idx]);

      const maxBeforeReset = cardW * cards.length;
      if (slider.scrollLeft >= maxBeforeReset) {
        slider.scrollLeft -= maxBeforeReset;
      }
    }
    setTimeout(tick, TICK_MS);
  }

  tick();
})();
