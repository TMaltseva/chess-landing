import addSwipe from '../utils/swipe';

export default function initPlayersCarousel() {
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
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleAuto();
        } else {
          clearInterval(autoTimer);
        }
      },
      { threshold: 0.3 },
    ).observe(section);
  } else {
    scheduleAuto();
  }
}
