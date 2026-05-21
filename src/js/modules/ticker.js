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

export default function initTickers() {
  document.querySelectorAll('.ticker').forEach(buildTickerContent);
}
