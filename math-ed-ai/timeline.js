// Vincent's proof timeline.
//
// Markup (in the .md file): a .timeline holding .tl-chapter headings and
// .tl-step bubbles. Each bubble has a .tl-stamp timestamp, a .tl-text caption,
// and one or more drop-downs (<details class="tl-drop">), e.g. "Vincent's
// Screen" and "Transcript"; a transcript drop-down may end with .tl-analysis.
//
// Wide screens: the timeline stays on the left and the selected bubble's
// content shows in a side panel on the right: screenshot(s), then analysis,
// then transcript. When a bubble has both a screenshot and a transcript, the
// screenshot stays pinned at the top of the panel while the transcript
// scrolls under it. Step 1 is selected at start.
//
// Screenshots open full size when clicked.
//
// Narrow screens: drop-downs open under their bubble. Opening one closes the
// drop-downs of every other bubble; clicking a bubble's dot or caption toggles
// its first drop-down.
//
// Everywhere: the space between bubbles grows with the time between their
// timestamps.

const TL_SIDE_QUERY = '(min-width: 1000px)';

function initTimelines(root) {
  root.querySelectorAll('.timeline').forEach(setupTimeline);
}

function tlEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// "11:00" -> 660 seconds, "1:02:30" -> 3750 seconds
function tlSeconds(stamp) {
  const parts = stamp.trim().split(':').map(Number);
  return parts.reduce((total, n) => total * 60 + n, 0);
}

function setupTimeline(timeline) {
  const steps = Array.from(timeline.querySelectorAll(':scope > .tl-step'));
  const dropsOf = (step) => Array.from(step.querySelectorAll(':scope > .tl-drop'));

  addTimeGaps(timeline, steps);

  // Wrap the timeline so a side panel can sit next to it.
  const layout = tlEl('div', 'tl-layout');
  timeline.before(layout);
  layout.append(timeline);
  const side = tlEl('aside', 'tl-side');
  side.setAttribute('aria-live', 'polite');
  layout.append(side);

  const wide = window.matchMedia(TL_SIDE_QUERY);
  let active = null;

  // Side panel: show `step`, with drop-down number `tab` selected.
  function select(step, tab = 0) {
    const drops = dropsOf(step);
    if (!drops.length) return;
    active = step;
    steps.forEach((s) => s.classList.toggle('is-active', s === step));
    steps.forEach((s) => dropsOf(s).forEach((d) => d.classList.toggle('is-current', s === step)));

    // Everything from all of this bubble's drop-downs, shown together:
    // screenshots first, then the analysis, then the transcript.
    const parts = drops.flatMap((d) => Array.from(d.children).filter((c) => c.tagName !== 'SUMMARY'));
    const screens = parts.filter((c) => c.classList.contains('tl-screen'));
    const analyses = parts.filter((c) => c.classList.contains('tl-analysis'));
    const rest = parts.filter((c) => !screens.includes(c) && !analyses.includes(c));

    side.replaceChildren();
    const screenBox = tlEl('div', 'tl-side-screen');
    screens.forEach((c) => screenBox.append(c.cloneNode(true)));
    // With a transcript too, the screen can stay pinned at the top of the
    // panel while the transcript scrolls underneath it (see updatePin).
    screenBox.dataset.pinnable = String(screens.length > 0 && rest.length > 0);
    if (screens.length) side.append(screenBox);
    analyses.forEach((c) => side.append(c.cloneNode(true)));
    rest.forEach((c) => side.append(c.cloneNode(true)));
    side.scrollTop = 0;
    updatePin();
    screenBox.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', updatePin, { once: true });
    });
  }

  // The screen always spans the panel's full width. Pin it only when it
  // leaves enough of the panel for the transcript (taller windows); on
  // shorter windows it scrolls away with the transcript instead.
  const PIN_MAX_SHARE = 0.6;
  function updatePin() {
    const box = side.querySelector('.tl-side-screen');
    if (!box) return;
    const fits = box.offsetHeight <= side.clientHeight * PIN_MAX_SHARE;
    box.classList.toggle('is-pinned', box.dataset.pinnable === 'true' && fits);
  }
  window.addEventListener('resize', updatePin);

  function applyMode() {
    layout.classList.toggle('is-side', wide.matches);
    if (wide.matches) {
      steps.forEach((s) => dropsOf(s).forEach((d) => { d.open = false; }));
      select(active || steps.find((s) => dropsOf(s).length));
    } else {
      side.replaceChildren();
      steps.forEach((s) => {
        s.classList.remove('is-active');
        dropsOf(s).forEach((d) => d.classList.remove('is-current'));
      });
    }
  }

  steps.forEach((step) => {
    const drops = dropsOf(step);
    if (!drops.length) return;

    drops.forEach((drop, i) => {
      // Wide: the drop-down label switches the side panel instead of opening.
      drop.querySelector('summary').addEventListener('click', (e) => {
        if (!wide.matches) return;
        e.preventDefault();
        select(step, i);
      });
      // Narrow: one bubble open at a time.
      drop.addEventListener('toggle', () => {
        if (!drop.open || wide.matches) return;
        steps.forEach((other) => {
          if (other !== step) dropsOf(other).forEach((d) => { d.open = false; });
        });
        if (step.getBoundingClientRect().top < 0) step.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });

    step.querySelectorAll(':scope > .tl-dot, :scope > .tl-text, :scope > .tl-stamp').forEach((node) => {
      node.addEventListener('click', () => {
        if (wide.matches) return select(step, 0);
        const anyOpen = drops.some((d) => d.open);
        drops.forEach((d) => { d.open = false; });
        if (!anyOpen) drops[0].open = true;
      });
    });
  });

  wide.addEventListener('change', applyMode);
  applyMode();

  // Click any screenshot (in the panel or under a bubble) to see it full size.
  layout.addEventListener('click', (e) => {
    const img = e.target.closest('.tl-screen img');
    if (img) tlZoom(img);
  });
}

function tlZoom(img) {
  const overlay = tlEl('div', 'tl-zoom');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Enlarged screenshot. Click or press Escape to close.');
  const big = img.cloneNode();
  overlay.append(big);
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
}

// Space between bubbles: a base gap plus extra that grows with the minutes
// between their timestamps (capped so long gaps don't leave huge holes).
function addTimeGaps(timeline, steps) {
  let added = false;
  for (let i = 0; i < steps.length - 1; i++) {
    const a = steps[i].querySelector('.tl-stamp');
    const b = steps[i + 1].querySelector('.tl-stamp');
    if (!a || !b) continue;
    const minutes = (tlSeconds(b.textContent) - tlSeconds(a.textContent)) / 60;
    if (!(minutes > 0)) continue;
    const gap = tlEl('div', 'tl-gap');
    gap.style.setProperty('--gap', `${Math.min(1.25 + minutes * 0.28, 6.5).toFixed(2)}rem`);
    steps[i].after(gap);
    added = true;
  }
  timeline.classList.toggle('has-gaps', added);
}
