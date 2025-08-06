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

function initTicker() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;

  const tickerLine = ticker.querySelector('.ticker__line');
  const originalText = ticker.querySelector('.ticker__text');

  if (!originalText) return;

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

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initTicker();
});
