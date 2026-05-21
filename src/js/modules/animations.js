export function initImageHover() {
  document.querySelectorAll('.players__photo, .tournament__image').forEach(el => {
    el.classList.add('img-hover');
  });
}

export function initScrollAnimations() {
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
