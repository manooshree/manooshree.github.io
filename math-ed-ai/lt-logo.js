// Turns the green "T" in the LeanTutor heading three times on load, then stops.
// Hovering the heading afterwards turns it once (to ⊢ and back).
// Hovering while it's already turning does nothing.
function initLeanTutorLogo(root) {
  root.querySelectorAll('.lt-logo').forEach((logo) => {
    const glyph = logo.querySelector('.lt-t-glyph');
    const isTurning = () => glyph.classList.contains('turning') || glyph.classList.contains('turning-once');
    glyph.classList.add('turning');
    glyph.addEventListener('animationend', () => glyph.classList.remove('turning', 'turning-once'));
    logo.addEventListener('mouseenter', () => { if (!isTurning()) glyph.classList.add('turning-once'); });
  });
}
