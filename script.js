(() => {
  'use strict';
  const canvas = document.querySelector('#ribbons');
  const ctx = canvas.getContext('2d');
  const portrait = document.querySelector('#portrait');
  const signatureStrokes = [...document.querySelectorAll('.signature-stroke')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let paused = reducedMotion.matches;
  let width = 0, height = 0, frame = 0, lastTime = 0, time = 0;
  let scroll = 0, targetScroll = window.scrollY;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  // A luminous edge and broad translucent trail form each ribbon.
  const ribbons = [
    { base: .74, amplitude: .17, frequency: 1.04, phase: .2, speed: .14, spread: -.22, colors: ['#5422ee', '#bb35ef', '#447dff'] },
    { base: .80, amplitude: .13, frequency: 1.28, phase: 2.8, speed: .12, spread: .18, colors: ['#ffb57c', '#e563ef', '#3b95ff'] },
    { base: .86, amplitude: .16, frequency: .88, phase: 4.2, speed: .11, spread: -.17, colors: ['#5724ed', '#6137ff', '#bc63ee'] },
    { base: .25, amplitude: .25, frequency: .63, phase: .9, speed: .08, spread: -.16, colors: ['#28246b', '#4235c9', '#6051ec'] },
  ];
  function ribbonY(x, ribbon) {
    const position = x / width;
    return height * (ribbon.base + Math.sin(position * Math.PI * 2 * ribbon.frequency + ribbon.phase + time * ribbon.speed) * ribbon.amplitude)
      + pointer.y * 26 + Math.sin(position * Math.PI) * pointer.x * 28 - scroll * .07;
  }
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'screen';
    for (const ribbon of ribbons) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      ribbon.colors.forEach((color, i) => gradient.addColorStop(i / 2, color));
      const points = [];
      for (let x = -12; x <= width + 24; x += 12) points.push([x, ribbonY(x, ribbon)]);
      // Filled bands share edges, avoiding gaps on steep curves.
      const layers = 48;
      for (let layer = layers - 1; layer >= 0; layer--) {
        const distance = layer / layers;
        const offset = distance * ribbon.spread * height;
        const nextOffset = (layer + 1) / layers * ribbon.spread * height;
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y + offset) : ctx.moveTo(x, y + offset));
        for (let i = points.length - 1; i >= 0; i--) ctx.lineTo(points[i][0], points[i][1] + nextOffset);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = (1 - distance) ** 2 * .32;
        ctx.fill();
      }
      ctx.beginPath();
      points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.strokeStyle = gradient;
      ctx.globalAlpha = .4;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function updatePortrait() {
    const floating = paused ? 0 : Math.sin(time * .85) * 5;
    portrait.style.transform = `translate3d(${pointer.x * 7}px, ${pointer.y * 5 + floating}px, 0) rotateX(${-pointer.y * 5}deg) rotateY(${pointer.x * 7}deg)`;
    portrait.style.setProperty('--light-x', `${50 + pointer.x * 25}%`);
    portrait.style.setProperty('--light-y', `${35 + pointer.y * 20}%`);
  }
  function updateSignature() {
    // 0.4s lead-in, 3.35s handwriting, 9s hold, 0.6s fade, 0.65s rest.
    // Share the scene clock so hidden tabs and reduced motion stop all movement.
    const cycle = time % 14;
    const inkOpacity = cycle < 12.75 ? 1 : Math.max(0, 1 - (cycle - 12.75) / .6);
    const timings = [{ start: .4, duration: 2.1 }, { start: 2.65, duration: 1.1 }];
    signatureStrokes.forEach((stroke, index) => {
      const { start, duration } = timings[index];
      const progress = paused ? 1 : Math.max(0, Math.min(1, (cycle - start) / duration));
      stroke.style.strokeDashoffset = String(1 - progress);
      stroke.style.opacity = String(paused ? 1 : progress > 0 ? inkOpacity : 0);
    });
  }
  function tick(now) {
    frame = 0;
    if (paused || document.hidden) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
    lastTime = now;
    time += delta;
    const easing = 1 - Math.exp(-delta * 4);
    pointer.x += (pointer.targetX - pointer.x) * easing;
    pointer.y += (pointer.targetY - pointer.y) * easing;
    scroll += (targetScroll - scroll) * easing;
    draw();
    updatePortrait();
    updateSignature();
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (!frame && !paused && !document.hidden) { lastTime = 0; frame = requestAnimationFrame(tick); }
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function resetPointer() { pointer.targetX = 0; pointer.targetY = 0; }
  function setPaused(value) {
    paused = value;
    updateSignature();
    if (paused) {
      stop(); resetPointer(); pointer.x = 0; pointer.y = 0;
      updatePortrait(); draw();
    } else start();
  }
  window.addEventListener('pointermove', (event) => {
    if (paused || !finePointer.matches || event.pointerType === 'touch') return;
    pointer.targetX = (event.clientX / width - .5) * 2;
    pointer.targetY = (event.clientY / height - .5) * 2;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetPointer);
  window.addEventListener('blur', resetPointer);
  finePointer.addEventListener('change', resetPointer);
  window.addEventListener('scroll', () => { targetScroll = window.scrollY; }, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stop(); resetPointer(); } else start();
  });
  reducedMotion.addEventListener('change', () => setPaused(reducedMotion.matches));
  resize();
  setPaused(paused);
})();
