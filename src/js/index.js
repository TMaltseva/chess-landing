import '../css/main.css';

function initSmoothScroll() {
  const buttons = document.querySelectorAll('[data-scroll-to]');

  buttons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const targetId = button.getAttribute('data-scroll-to');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

function initSingleTicker(ticker) {
  const tickerLine = ticker.querySelector('.ticker__line');
  const originalText = ticker.querySelector('.ticker__text');

  if (!tickerLine || !originalText) return;

  const { textContent } = originalText;
  const textWithSeparator = `${textContent} • `;

  tickerLine.replaceChildren();

  for (let i = 0; i < 15; i += 1) {
    const span = document.createElement('span');
    span.className = 'ticker__text';
    span.textContent = textWithSeparator;
    tickerLine.appendChild(span);
  }

  tickerLine.style.animationDuration = '100s';
}

function initTicker() {
  document.querySelectorAll('.ticker').forEach(ticker => initSingleTicker(ticker));
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

  let startX = 0;
  grid.addEventListener(
    'touchstart',
    e => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  grid.addEventListener(
    'touchend',
    e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    },
    { passive: true },
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
  const counterCurrentEls = Array.from(document.querySelectorAll('.players__counter-current'));

  if (!track || !cards.length) return;

  const total = cards.length;
  let current = 0;
  let autoTimer = null;

  function getVisibleCount() {
    return window.innerWidth >= 768 ? 3 : 1;
  }

  function goTo(index) {
    const visibleCount = getVisibleCount();
    const maxIndex = total - visibleCount;

    if (index < 0) current = maxIndex;
    else if (index > maxIndex) current = 0;
    else current = index;

    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${current * (card.offsetWidth + gap)}px)`;

    counterCurrentEls.forEach(el => {
      el.textContent = Math.min(current + visibleCount, total);
    });
    prevBtns.forEach(btn => {
      btn.disabled = false;
    });
    nextBtns.forEach(btn => {
      btn.disabled = false;
    });
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + getVisibleCount()), 4000);
  }

  prevBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      goTo(current - getVisibleCount());
      resetTimer();
    }),
  );
  nextBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      goTo(current + getVisibleCount());
      resetTimer();
    }),
  );

  window.addEventListener('resize', () => {
    const visibleCount = getVisibleCount();
    const snapped = Math.round(current / visibleCount) * visibleCount;
    goTo(Math.min(snapped, total - visibleCount));
    resetTimer();
  });

  goTo(0);
  resetTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initTicker();
  initStepsCarousel();
  initPlayersCarousel();
});
