(() => {
  const root = document.getElementById('process');
  const wrap = root?.querySelector('.mp-motion-wrap');
  if (!wrap) return;
  const svg = wrap.querySelector('.mp-motion-paths');
  const routeGroup = wrap.querySelector('.mp-routes');
  const boxes = [...wrap.querySelectorAll('.mp-step')];
  const dot = wrap.querySelector('.mp-dot');
  const halo = wrap.querySelector('.mp-dot-halo');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let routes = [], nodes = [], active = -1, visible = false, frameId = 0;
  let start = performance.now();
  function highlight(index) {
    if (active === index) return;
    active = index;
    boxes.forEach((box, i) => box.classList.toggle('mp-active', i === index));
  }
  function move(x, y, opacity = 1) {
    for (const element of [dot, halo]) {
      element.setAttribute('cx', x); element.setAttribute('cy', y);
      element.style.opacity = String(opacity * (element === halo ? .14 : 1));
    }
  }
  function measure() {
    const outer = wrap.getBoundingClientRect();
    if (!outer.width || boxes.length < 2) return;
    const rects = boxes.map(box => box.getBoundingClientRect());
    const horizontal = Math.abs(rects[0].top - rects[1].top) < 5;
    svg.setAttribute('viewBox', `0 0 ${outer.width} ${outer.height}`);
    nodes = rects.map(r => ({x:r.left - outer.left + r.width / 2,y:r.top - outer.top}));
    routeGroup.replaceChildren(); routes = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i], b = nodes[i+1];
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      const y = horizontal ? a.y : rects[i].bottom - outer.top;
      // Rounded corners and a small open arrowhead keep direction clear.
      path.setAttribute('d', horizontal
        ? `M ${a.x} ${y-1} V ${y-10} Q ${a.x} ${y-22} ${a.x+12} ${y-22} H ${b.x-12} Q ${b.x} ${y-22} ${b.x} ${y-10} V ${b.y-5}`
        : `M ${a.x} ${y+1} L ${b.x} ${b.y-5}`);
      path.setAttribute('marker-end','url(#process-arrow-tip)');
      routeGroup.appendChild(path);
      routes.push({path,length:path.getTotalLength()});
    }
    move(nodes[0].x,nodes[0].y); highlight(0);
  }
  function frame(now) {
    frameId = 0;
    if (!visible || document.hidden || motion.matches || !nodes.length) return;
    const time = ((now-start)/1000)%9.5;
    const index = Math.min(boxes.length-1,Math.floor(time/1.75));
    const phase = time-index*1.75;
    highlight(index);
    if (index < routes.length && phase > .95) {
      const t = Math.min(1,(phase-.95)/.8);
      const eased = t*t*(3-2*t);
      const route = routes[index];
      const p = route.path.getPointAtLength(route.length*eased);
      move(p.x,p.y);
    } else {
      const opacity = time>8.7 ? Math.max(0,(9.5-time)/.8) : 1;
      move(nodes[index].x,nodes[index].y,opacity);
    }
    frameId = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(frameId); frameId = 0;
    if (motion.matches && nodes.length) { highlight(0); move(nodes[0].x,nodes[0].y); }
    else if (visible && !document.hidden) frameId = requestAnimationFrame(frame);
  }
  const resize = new ResizeObserver(measure); resize.observe(wrap);
  const intersection = new IntersectionObserver(entries => {
    const next = entries[0].isIntersecting;
    if (next && !visible) start = performance.now();
    visible = next; sync();
  }, {threshold:.05});
  intersection.observe(wrap);
  motion.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  measure();
})();
