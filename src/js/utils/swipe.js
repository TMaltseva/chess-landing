export default function addSwipe(element, onNext, onPrev, threshold = 50) {
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
