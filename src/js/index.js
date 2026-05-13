import '../css/main.css';

function initSmoothScroll() {
  document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(button.getAttribute('data-scroll-to'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function buildTickerContent(ticker) {
  const line = ticker.querySelector('.ticker__line');
  const source = ticker.querySelector('.ticker__text');
  if (!line || !source) return;

  const text = `${source.textContent} • `;
  line.replaceChildren(
    ...Array.from({ length: 15 }, () => {
      const span = document.createElement('span');
      span.className = 'ticker__text';
      span.textContent = text;
      return span;
    }),
  );
  line.style.animationDuration = '100s';
}

function initTickers() {
  document.querySelectorAll('.ticker').forEach(buildTickerContent);
}

function addSwipe(element, onNext, onPrev, threshold = 50) {
  let startX = 0;
  element.addEventListener(
    'touchstart',
    e => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  element.addEventListener(
    'touchend',
    e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > threshold) (diff > 0 ? onNext : onPrev)();
    },
    { passive: true },
  );
}

function initStepsCarousel() {
  const mq = window.matchMedia('(max-width: 767px)');
  const grid = document.querySelector('.steps__grid');
  const slides = Array.from(document.querySelectorAll('.steps__slide'));
  const dots = Array.from(document.querySelectorAll('.steps__dot'));
  const prevBtn = document.querySelector('.steps__nav-btn--prev');
  const nextBtn = document.querySelector('.steps__nav-btn--next');

  if (!grid || !slides.length || !prevBtn || !nextBtn) return;

  const total = slides.length;
  let current = 0;

  function goTo(index) {
    if (!mq.matches) return;
    current = Math.max(0, Math.min(index, total - 1));
    grid.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('steps__dot--active', i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  addSwipe(
    grid,
    () => goTo(current + 1),
    () => goTo(current - 1),
  );

  mq.addEventListener('change', e => {
    grid.style.transform = '';
    if (e.matches) goTo(0);
  });

  if (mq.matches) goTo(0);
}

function initPlayersCarousel() {
  const track = document.querySelector('.players__track');
  const cards = Array.from(document.querySelectorAll('.players__card'));
  const prevBtns = Array.from(document.querySelectorAll('.players__nav-btn--prev'));
  const nextBtns = Array.from(document.querySelectorAll('.players__nav-btn--next'));
  const counterEls = Array.from(document.querySelectorAll('.players__counter-current'));

  if (!track || !cards.length) return;

  const total = cards.length;
  let current = 0;
  let autoTimer = null;

  function visibleCount() {
    return window.innerWidth >= 768 ? 3 : 1;
  }

  function clampIndex(index) {
    const max = total - visibleCount();
    if (index < 0) return max;
    if (index > max) return 0;
    return index;
  }

  function updateDisplay() {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${current * (cards[0].offsetWidth + gap)}px)`;
    counterEls.forEach(el => {
      el.textContent = Math.min(current + visibleCount(), total);
    });
    [...prevBtns, ...nextBtns].forEach(btn => {
      btn.disabled = false;
    });
  }

  function goTo(index) {
    current = clampIndex(index);
    updateDisplay();
  }

  function scheduleAutoAdvance() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + visibleCount()), 4000);
  }

  prevBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      goTo(current - visibleCount());
      scheduleAutoAdvance();
    }),
  );

  nextBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      goTo(current + visibleCount());
      scheduleAutoAdvance();
    }),
  );

  addSwipe(
    track,
    () => goTo(current + 1),
    () => goTo(current - 1),
  );

  window.addEventListener('resize', () => {
    const count = visibleCount();
    goTo(Math.min(Math.round(current / count) * count, total - count));
  });

  goTo(0);
  scheduleAutoAdvance();
}

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initTickers();
  initStepsCarousel();
  initPlayersCarousel();
});
