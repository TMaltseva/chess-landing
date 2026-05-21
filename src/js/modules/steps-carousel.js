import addSwipe from '../utils/swipe';

export default function initStepsCarousel() {
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
