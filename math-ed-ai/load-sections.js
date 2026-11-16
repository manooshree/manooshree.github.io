// Fills each <section data-src="..."> with its Markdown file, then any
// <div data-include="..."> placeholders inside them with their HTML file
// (inserted as-is, not run through Markdown), then sets up the widgets.
const sections = document.querySelectorAll('section[data-src]');

async function loadText(url) {
  const res = await fetch(url, { cache: 'no-cache' }); // always pick up edits
  return res.ok ? res.text() : null;
}

// Math: write $...$ for inline math and $$...$$ for a centered display equation,
// in LaTeX (e.g. $x_i^2$, $\frac{1}{n}$). The math is set aside before Markdown runs
// (so Markdown can't mangle underscores or backslashes), then rendered with KaTeX.
// A literal dollar sign needs a backslash: \$5.
function renderMarkdown(text) {
  const math = [];
  const stash = (tex, display) => `@@MATH${math.push({ tex, display }) - 1}@@`;
  text = text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => stash(tex, true))
    .replace(/(^|[^\\])\$(?!\s)([^$\n]+?)(?<!\s)\$/g, (_, pre, tex) => pre + stash(tex, false))
    .replace(/\\\$/g, '$');
  return marked.parse(text).replace(/@@MATH(\d+)@@/g, (_, i) => {
    const { tex, display } = math[i];
    return window.katex
      ? katex.renderToString(tex, { displayMode: display, throwOnError: false })
      : tex;
  });
}

Promise.all(Array.from(sections).map(async (section) => {
  const text = await loadText(section.dataset.src);
  section.innerHTML = text != null
    ? renderMarkdown(text)
    : `<p class="placeholder">Could not load ${section.dataset.src}</p>`;
}))
  .then(() => Promise.all(Array.from(document.querySelectorAll('[data-include]')).map(async (slot) => {
    const html = await loadText(slot.dataset.include);
    if (html != null) slot.outerHTML = html;
    else slot.innerHTML = `<p class="placeholder">Could not load ${slot.dataset.include}</p>`;
  })))
  .then(() => {
    initCarousels(document);
    initLeanTutorLogo(document);
    initTimelines(document);
  });

// Question boxes: clicking either answer label opens (or closes) both answers together,
// so the two communities' responses are always compared side by side.
// A toggle outside a question box (e.g. "Read more reactions") works on its own.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.answer-toggle');
  if (!btn) return;
  const open = btn.getAttribute('aria-expanded') !== 'true';
  const box = btn.closest('.question-box');
  const group = box ? box.querySelectorAll('.answer-toggle') : [btn];
  group.forEach((b) => {
    b.setAttribute('aria-expanded', String(open));
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    if (panel) panel.hidden = !open;
  });
});

// In-page links (e.g. "boxed in green" -> #nick-whiteboard): if the target is
// inside a closed drop-down, open it first, then scroll the target into view.
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
  if (!target) return;
  for (let d = target.closest('details'); d; d = d.parentElement.closest('details')) d.open = true;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  history.replaceState(null, '', link.getAttribute('href'));
});
