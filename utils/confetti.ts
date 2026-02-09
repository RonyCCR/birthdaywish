
export const startConfetti = () => {
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: any[] = [];
  // Champagne and Soft White luxury colors
  const colors = ['#D4AF37', '#FDFCF0', '#E5E4E2', '#C0C0C0', '#F5E6BE'];

  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      gravity: 0.1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity -= 0.008;
      p.rotation += p.rotationSpeed;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        // Draw elegant square/diamond shards
        ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  animate();
};
