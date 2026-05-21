export default function initSmoothScroll() {
  document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(button.getAttribute('data-scroll-to'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
