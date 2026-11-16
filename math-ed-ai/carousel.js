// Wires up every .carousel under root: prev/next buttons, dots (if present), and swipe/scroll sync.
// Carousels marked data-autoplay advance on their own, pausing while hovered or focused.
const AUTOPLAY_MS = 8000;

function initCarousels(root) {
  root.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const dots = carousel.querySelector('.carousel-dots');

    const current = () => Math.round(track.scrollLeft / track.clientWidth);
    const goTo = (i) => {
      const index = (i + slides.length) % slides.length;
      track.scrollTo({ left: index * track.clientWidth });
    };

    if (dots) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to image ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
      });
      const updateDots = () => {
        const active = current();
        Array.from(dots.children).forEach((d, i) => d.classList.toggle('active', i === active));
      };
      track.addEventListener('scroll', updateDots, { passive: true });
      updateDots();
    }

    carousel.querySelector('.prev').addEventListener('click', () => goTo(current() - 1));
    carousel.querySelector('.next').addEventListener('click', () => goTo(current() + 1));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (carousel.hasAttribute('data-autoplay') && !reducedMotion) {
      let paused = false;
      carousel.addEventListener('mouseenter', () => { paused = true; });
      carousel.addEventListener('mouseleave', () => { paused = false; });
      carousel.addEventListener('focusin', () => { paused = true; });
      carousel.addEventListener('focusout', () => { paused = false; });
      setInterval(() => { if (!paused) goTo(current() + 1); }, AUTOPLAY_MS);
    }
  });
}
