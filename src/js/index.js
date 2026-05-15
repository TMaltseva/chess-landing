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
  const mq = window.matchMedia('(max-width: 1365px)');
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
  if (!track) return;

  const prevBtns = Array.from(document.querySelectorAll('.players__nav-btn--prev'));
  const nextBtns = Array.from(document.querySelectorAll('.players__nav-btn--next'));
  const counterEls = Array.from(document.querySelectorAll('.players__counter-current'));
  const originals = Array.from(track.querySelectorAll('.players__card'));
  const total = originals.length;
  if (!total) return;

  let pos = 0;
  let autoTimer = null;
  let looping = false;
  let snapTo = null;

  function visible() {
    return window.innerWidth >= 768 ? 3 : 1;
  }
  function maxPos() {
    return total - visible();
  }

  function setupClones() {
    track.querySelectorAll('[data-clone]').forEach(n => n.remove());
    const v = visible();
    for (let i = v - 1; i >= 0; i -= 1) {
      const c = originals[(total - v + i) % total].cloneNode(true);
      c.dataset.clone = '';
      track.insertBefore(c, track.firstChild);
    }
    for (let i = 0; i < v; i += 1) {
      const c = originals[i % total].cloneNode(true);
      c.dataset.clone = '';
      track.appendChild(c);
    }
  }

  function cardStep() {
    const first = track.querySelector('.players__card');
    if (!first) return 0;
    return first.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
  }

  function render(p, animate) {
    const v = visible();
    const x = (v + p) * cardStep();
    if (!animate) {
      track.style.transition = 'none';
      track.style.transform = `translateX(-${x}px)`;
      track.getBoundingClientRect();
      track.style.transition = '';
    } else {
      track.style.transform = `translateX(-${x}px)`;
    }
    counterEls.forEach(el => {
      el.textContent = Math.min(pos + v, total);
    });
  }

  track.addEventListener('transitionend', e => {
    if (e.propertyName !== 'transform') return;
    looping = false;
    if (snapTo !== null) {
      pos = snapTo;
      snapTo = null;
      render(pos, false);
    }
  });

  function advance(delta) {
    if (looping) return;
    const v = visible();
    const max = maxPos();
    const next = pos + delta;

    if (next > max) {
      looping = true;
      snapTo = next - total;
      render(max + v, true);
    } else if (next < 0) {
      looping = true;
      snapTo = next + total;
      render(-v, true);
    } else {
      pos = next;
      render(pos, true);
    }
  }

  function scheduleAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => advance(visible()), 4000);
  }

  prevBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      advance(-visible());
      scheduleAuto();
    }),
  );
  nextBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      advance(visible());
      scheduleAuto();
    }),
  );
  addSwipe(
    track,
    () => {
      advance(1);
      scheduleAuto();
    },
    () => {
      advance(-1);
      scheduleAuto();
    },
  );

  let prevV = visible();
  window.addEventListener('resize', () => {
    const v = visible();
    if (v !== prevV) {
      prevV = v;
      looping = false;
      snapTo = null;
      pos = Math.min(pos, maxPos());
      setupClones();
    }
    render(pos, false);
  });

  [...prevBtns, ...nextBtns].forEach(btn => {
    btn.disabled = false;
  });
  setupClones();
  render(pos, false);

  const section = document.querySelector('.players');
  if (section && window.IntersectionObserver) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleAuto();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(section);
  } else {
    scheduleAuto();
  }
}

function initScrollAnimations() {
  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver(
    entries =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
  );

  [
    '.about__content',
    '.tournament__image',
    '.tournament__info',
    '.steps__header',
    '.steps__slider',
    '.players__header',
    '.players__slider',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initTickers();
  initStepsCarousel();
  initPlayersCarousel();
  initScrollAnimations();
});
