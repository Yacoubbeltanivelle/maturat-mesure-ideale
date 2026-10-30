/* Effets locaux, démontés à chaque rendu du routeur. */
export function mountFooterMotion(root, reduced) {
  const scene = root.querySelector('.footer-scene');
  if (!scene) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const curtain = scene.querySelector('.footer-landscape');
  const layers = [
    [root.querySelector('.footer-contact-cta h2'), 46],
    [root.querySelector('.footer-cta-content'), 28],
    [scene.querySelector('.footer-identity'), 22],
    ...Array.from(scene.querySelectorAll('.footer-column'), (el, i) => [el, 28 + i * 9]),
    [scene.querySelector('.footer-meta'), 16],
    [scene.querySelector('.footer-wordmark'), 80],
    [scene.querySelector('.footer-relief-distant'), 60],
    [scene.querySelector('.footer-relief:not(.footer-relief-distant)'), 24],
  ].filter(([el]) => el);
  const heading = root.querySelector('.footer-contact-cta');
  const systemReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0;
  const disabled = () => reduced || systemReduced.matches;
  const update = () => {
    frame = 0;
    const rect = scene.getBoundingClientRect();
    scene.classList.toggle('footer-waves-active', !disabled() && rect.top < innerHeight && rect.bottom > 0);
    const safeCurtain = !disabled() && innerWidth > 650;
    curtain.style.transform = safeCurtain ? `translateY(${Math.max(-45, Math.min(0, innerHeight - rect.bottom))}px)` : '';
    const headingRect = heading?.getBoundingClientRect();
    const mobileScale = innerWidth <= 650 ? .4 : 1;
    for (const [el, depth] of layers) {
      const anchor = heading?.contains(el) ? headingRect : rect;
      const progress = Math.max(0, Math.min(1, (innerHeight - anchor.top) / (innerHeight + anchor.height * .25)));
      // Keyboard focus only — mouse focus leaves translate intact.
      el.style.translate = disabled() || el.matches(':focus-visible') || el.querySelector(':focus-visible') ? '' : `0 ${((1 - progress) * depth * mobileScale).toFixed(2)}px`;
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  for (const name of ['scroll', 'resize']) window.addEventListener(name, schedule, { passive: true, signal });
  root.addEventListener('focusin', update, { signal });
  root.addEventListener('focusout', schedule, { signal });
  systemReduced.addEventListener('change', update, { signal });
  root.querySelector('[data-footer-top]').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: disabled() ? 'instant' : 'smooth' });
    document.querySelector('.site-header .brand')?.focus({ preventScroll: true });
  }, { signal });
  for (const el of root.querySelectorAll('.footer-settings button, .footer-heading .text-button')) {
    el.classList.add('footer-magnetic');
    el.addEventListener('pointermove', e => {
      if (disabled() || !fine.matches || e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * .15));
      const y = Math.max(-4, Math.min(4, (e.clientY - r.top - r.height / 2) * .15));
      el.style.translate = `${x}px ${y}px`;
    }, { signal });
    for (const name of ['pointerleave', 'blur', 'focus']) el.addEventListener(name, () => { el.style.translate = ''; }, { signal });
  }
  update();
  return () => { controller.abort(); cancelAnimationFrame(frame); };
}
