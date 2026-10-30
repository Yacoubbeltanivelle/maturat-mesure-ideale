/* Bloom Field motion, using the parameters supplied by the user.
 * The original bitmap supplies the grain; it is never regenerated per frame.
 */

const seed = 174074637;
const phase = (index, axis) => {
  const value = Math.sin(seed + index * 127.1 + axis * 311.7) * 43758.5453;
  return (value - Math.floor(value)) * Math.PI * 2;
};
const blobs = [
  { x:67.04, y:45.93, rgb:'226, 226, 226', stops:[19.02,38.05,57.07,76.1] },
  { x:35.47, y:65.92, rgb:'27, 159, 254', stops:[12.9,25.8,38.7,51.6] },
  { x:48.33, y:20.11, rgb:'27, 159, 254', stops:[16.75,33.5,50.25,67] },
  { x:80.81, y:88.03, rgb:'74, 201, 255', stops:[10.28,20.55,30.83,41.1] }
].map((blob,index) => ({ ...blob, p:phase(index,0), p2:phase(index,1) }));

function backgroundAt(t) {
  const ph = t * 1.00, amt = 1.00, dir = 1, spin = ph * dir;
  return blobs.map(b => {
    const x = b.x + (Math.sin(spin * .55 + b.p) - Math.sin(b.p)) * 14 * amt;
    const y = b.y + (Math.sin(spin * .43 + b.p2) - Math.sin(b.p2)) * 14 * amt;
    const [s1,s2,s3,s4] = b.stops;
    return `radial-gradient(circle at ${x}% ${y}%, rgba(${b.rgb},1) 0%, rgba(${b.rgb},.844) ${s1}%, rgba(${b.rgb},.5) ${s2}%, rgba(${b.rgb},.156) ${s3}%, rgba(${b.rgb},0) ${s4}%)`;
  }).join(',');
}

function mount(root, reduced) {
  if (!root) return () => {};
  const mesh = root.querySelector('.hero-bloom-mesh');
  const texture = root.querySelector('.hero-focus-texture');
  let frame = 0, last = null, elapsed = 0, visible = true, disposed = false;
  mesh.style.backgroundImage = backgroundAt(0);
  const paint = t => {
    mesh.style.backgroundImage = backgroundAt(t);
    // Both translations and the change in zoom are exactly zero at t = 0.
    texture.style.transform = `translate3d(${Math.sin(t*.19)*1.4}%,${Math.sin(t*.15)*.9}%,0) scale(${1.04 + (Math.cos(t*.18)-1)*.008})`;
  };
  const active = () => !disposed && !reduced && visible && !document.hidden;
  const tick = now => {
    frame = 0;
    if (!active()) { last = null; return; }
    if (last !== null) elapsed += (now - last) / 1000;
    last = now;
    paint(elapsed);
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (active()) {
      if (!frame) { last = null; frame = requestAnimationFrame(tick); }
    } else {
      cancelAnimationFrame(frame); frame = 0; last = null;
    }
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }, { threshold:0 });
  observer.observe(root);
  document.addEventListener('visibilitychange', sync);
  paint(0);
  sync();
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
  };
}

export { mount, backgroundAt };
