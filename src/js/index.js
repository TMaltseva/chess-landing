import '../css/main.css';
import initSmoothScroll from './modules/smooth-scroll';
import initTickers from './modules/ticker';
import initStepsCarousel from './modules/steps-carousel';
import initPlayersCarousel from './modules/players-carousel';
import { initImageHover, initScrollAnimations } from './modules/animations';

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initTickers();
  initStepsCarousel();
  initPlayersCarousel();
  initImageHover();
  initScrollAnimations();
});
