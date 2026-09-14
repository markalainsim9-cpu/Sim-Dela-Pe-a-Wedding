import React, { useEffect, useRef } from 'react';

interface FallingLeavesBackgroundProps {
  enabled?: boolean;
  style?: 'mixed' | 'botanical' | 'petals' | 'gilded';
  density?: 'gentle' | 'medium' | 'lush';
}

type LeafType = 'pointed' | 'eucalyptus' | 'petal' | 'willow';

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  flip: number;
  flipSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  opacity: number;
  type: LeafType;
  primaryColor: string;
  secondaryColor: string;
  veinColor: string;
}

// Romantic Wedding Palette (faded, organic, delicate)
const PALETTES = {
  sage: {
    primary: 'rgba(128, 153, 133, ',
    secondary: 'rgba(152, 175, 156, ',
    vein: 'rgba(102, 128, 107, '
  },
  eucalyptus: {
    primary: 'rgba(110, 140, 130, ',
    secondary: 'rgba(135, 163, 154, ',
    vein: 'rgba(88, 118, 108, '
  },
  dustyBlue: {
    primary: 'rgba(118, 144, 166, ',
    secondary: 'rgba(148, 174, 196, ',
    vein: 'rgba(92, 118, 140, '
  },
  champagneGold: {
    primary: 'rgba(202, 178, 138, ',
    secondary: 'rgba(224, 204, 168, ',
    vein: 'rgba(172, 148, 108, '
  },
  blushPetal: {
    primary: 'rgba(224, 194, 190, ',
    secondary: 'rgba(240, 216, 212, ',
    vein: 'rgba(200, 168, 164, '
  },
  ivoryPetal: {
    primary: 'rgba(238, 230, 220, ',
    secondary: 'rgba(248, 242, 234, ',
    vein: 'rgba(215, 205, 193, '
  }
};

export const FallingLeavesBackground: React.FC<FallingLeavesBackgroundProps> = ({
  enabled = true,
  style = 'mixed',
  density = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const breezeRef = useRef<{ x: number; y: number; decay: number }>({ x: 0, y: 0, decay: 0.95 });

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Retina display scaling
    const updateSize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Interaction: subtle breeze on mouse movement or scroll
    let lastX = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const deltaX = clientX - lastX;
      lastX = clientX;
      breezeRef.current.x += Math.max(Math.min(deltaX * 0.04, 1.2), -1.2);
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      breezeRef.current.x += (Math.random() - 0.5) * 0.6;
      breezeRef.current.y = Math.min(breezeRef.current.y + delta * 0.02, 1.5);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Determine particle count based on density and screen width
    const baseCount = density === 'gentle' ? 22 : density === 'lush' ? 48 : 34;
    const count = width < 640 ? Math.round(baseCount * 0.65) : baseCount;

    // Helper to generate a leaf
    const createLeaf = (initY?: number): LeafParticle => {
      // Pick style colors
      let pal = PALETTES.sage;
      const randType = Math.random();

      let type: LeafType = 'pointed';
      if (style === 'petals') {
        type = 'petal';
        pal = Math.random() > 0.4 ? PALETTES.blushPetal : PALETTES.ivoryPetal;
      } else if (style === 'botanical') {
        type = randType < 0.45 ? 'pointed' : randType < 0.8 ? 'eucalyptus' : 'willow';
        pal = randType < 0.4 ? PALETTES.sage : randType < 0.75 ? PALETTES.eucalyptus : PALETTES.dustyBlue;
      } else if (style === 'gilded') {
        type = randType < 0.5 ? 'pointed' : 'willow';
        pal = PALETTES.champagneGold;
      } else {
        // Mixed: elegant balance of olive leaves, eucalyptus, petals, and subtle gold
        if (randType < 0.35) {
          type = 'pointed';
          pal = PALETTES.sage;
        } else if (randType < 0.6) {
          type = 'eucalyptus';
          pal = PALETTES.eucalyptus;
        } else if (randType < 0.82) {
          type = 'petal';
          pal = Math.random() > 0.5 ? PALETTES.blushPetal : PALETTES.ivoryPetal;
        } else if (randType < 0.93) {
          type = 'willow';
          pal = PALETTES.dustyBlue;
        } else {
          type = 'pointed';
          pal = PALETTES.champagneGold;
        }
      }

      // Generous, faded opacity (0.18 to 0.46) for ethereal softness
      const opacity = 0.2 + Math.random() * 0.28;
      const size = 12 + Math.random() * 16;

      return {
        x: Math.random() * width,
        y: initY !== undefined ? initY : Math.random() * height - 40,
        size,
        speedY: 0.35 + Math.random() * 0.75, // slow, dreamy descent
        speedX: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.015 + Math.random() * 0.025,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.018,
        swayAmp: 0.8 + Math.random() * 1.5,
        opacity,
        type,
        primaryColor: pal.primary,
        secondaryColor: pal.secondary,
        veinColor: pal.vein
      };
    };

    // Initialize particles spread vertically
    const leaves: LeafParticle[] = [];
    for (let i = 0; i < count; i++) {
      leaves.push(createLeaf(Math.random() * height));
    }

    // Leaf drawing routines with smooth curves
    const drawPointedLeaf = (
      c: CanvasRenderingContext2D,
      leaf: LeafParticle,
      scaleX: number,
      scaleY: number
    ) => {
      const s = leaf.size;
      c.save();
      c.scale(scaleX, scaleY);

      // Body path
      c.beginPath();
      c.moveTo(0, -s);
      c.bezierCurveTo(s * 0.55, -s * 0.55, s * 0.6, s * 0.4, 0, s);
      c.bezierCurveTo(-s * 0.6, s * 0.4, -s * 0.55, -s * 0.55, 0, -s);
      c.closePath();

      // Soft gradient fill
      const grad = c.createLinearGradient(-s * 0.3, -s, s * 0.3, s);
      grad.addColorStop(0, `${leaf.primaryColor}${leaf.opacity})`);
      grad.addColorStop(1, `${leaf.secondaryColor}${leaf.opacity * 0.75})`);
      c.fillStyle = grad;
      c.fill();

      // Delicate central vein
      c.beginPath();
      c.moveTo(0, -s * 0.85);
      c.quadraticCurveTo(s * 0.05, 0, 0, s * 0.95);
      c.strokeStyle = `${leaf.veinColor}${leaf.opacity * 0.65})`;
      c.lineWidth = 0.75;
      c.stroke();

      c.restore();
    };

    const drawEucalyptusLeaf = (
      c: CanvasRenderingContext2D,
      leaf: LeafParticle,
      scaleX: number,
      scaleY: number
    ) => {
      const s = leaf.size;
      c.save();
      c.scale(scaleX, scaleY);

      // Rounded silver-dollar eucalyptus leaf
      c.beginPath();
      c.ellipse(0, 0, s * 0.55, s * 0.8, 0, 0, Math.PI * 2);

      const grad = c.createRadialGradient(0, -s * 0.2, s * 0.1, 0, 0, s * 0.85);
      grad.addColorStop(0, `${leaf.secondaryColor}${leaf.opacity * 0.95})`);
      grad.addColorStop(1, `${leaf.primaryColor}${leaf.opacity * 0.8})`);
      c.fillStyle = grad;
      c.fill();

      // Subtle translucent ring highlight
      c.strokeStyle = `${leaf.veinColor}${leaf.opacity * 0.4})`;
      c.lineWidth = 0.5;
      c.stroke();

      c.restore();
    };

    const drawRosePetal = (
      c: CanvasRenderingContext2D,
      leaf: LeafParticle,
      scaleX: number,
      scaleY: number
    ) => {
      const s = leaf.size * 0.9;
      c.save();
      c.scale(scaleX, scaleY);

      // Heart/cup curved rose petal
      c.beginPath();
      c.moveTo(0, s * 0.7);
      c.bezierCurveTo(-s * 0.6, s * 0.5, -s * 0.7, -s * 0.4, -s * 0.2, -s * 0.7);
      c.bezierCurveTo(-s * 0.05, -s * 0.85, s * 0.05, -s * 0.85, s * 0.2, -s * 0.7);
      c.bezierCurveTo(s * 0.7, -s * 0.4, s * 0.6, s * 0.5, 0, s * 0.7);
      c.closePath();

      const grad = c.createLinearGradient(0, -s * 0.8, 0, s * 0.8);
      grad.addColorStop(0, `${leaf.primaryColor}${leaf.opacity})`);
      grad.addColorStop(1, `${leaf.secondaryColor}${leaf.opacity * 0.7})`);
      c.fillStyle = grad;
      c.fill();

      c.restore();
    };

    const drawWillowLeaf = (
      c: CanvasRenderingContext2D,
      leaf: LeafParticle,
      scaleX: number,
      scaleY: number
    ) => {
      const s = leaf.size * 1.15;
      c.save();
      c.scale(scaleX, scaleY);

      // Slender elongated graceful leaf
      c.beginPath();
      c.moveTo(0, -s);
      c.bezierCurveTo(s * 0.35, -s * 0.4, s * 0.25, s * 0.5, 0, s);
      c.bezierCurveTo(-s * 0.25, s * 0.5, -s * 0.35, -s * 0.4, 0, -s);
      c.closePath();

      const grad = c.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, `${leaf.primaryColor}${leaf.opacity * 0.9})`);
      grad.addColorStop(1, `${leaf.secondaryColor}${leaf.opacity * 0.7})`);
      c.fillStyle = grad;
      c.fill();

      // Center delicate spine
      c.beginPath();
      c.moveTo(0, -s * 0.9);
      c.lineTo(0, s * 0.9);
      c.strokeStyle = `${leaf.veinColor}${leaf.opacity * 0.5})`;
      c.lineWidth = 0.6;
      c.stroke();

      c.restore();
    };

    // Main animation loop
    let isRunning = true;
    const render = () => {
      if (!isRunning) return;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // Decay interactive breeze
      breezeRef.current.x *= breezeRef.current.decay;
      breezeRef.current.y *= 0.92;

      const currentBreezeX = breezeRef.current.x;
      const currentBreezeY = breezeRef.current.y;

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // Update physics
        leaf.swayPhase += leaf.swaySpeed;
        leaf.angle += leaf.angularSpeed;
        leaf.flip += leaf.flipSpeed;

        const naturalDrift = Math.sin(leaf.swayPhase) * leaf.swayAmp;
        leaf.x += leaf.speedX + naturalDrift + currentBreezeX;
        leaf.y += leaf.speedY + currentBreezeY * 0.4;

        // 3D flip effect (tumbling in air)
        const scaleX = Math.cos(leaf.flip);
        const scaleY = 1 + Math.sin(leaf.swayPhase) * 0.12;

        // Render leaf
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);

        if (leaf.type === 'eucalyptus') {
          drawEucalyptusLeaf(ctx, leaf, scaleX, scaleY);
        } else if (leaf.type === 'petal') {
          drawRosePetal(ctx, leaf, scaleX, scaleY);
        } else if (leaf.type === 'willow') {
          drawWillowLeaf(ctx, leaf, scaleX, scaleY);
        } else {
          drawPointedLeaf(ctx, leaf, scaleX, scaleY);
        }

        ctx.restore();

        // Boundary wrapping: recycle leaf if it floats past bottom or off horizontal edges
        if (leaf.y > height + 40) {
          leaf.y = -30 - Math.random() * 30;
          leaf.x = Math.random() * width;
        } else if (leaf.x < -60) {
          leaf.x = width + 40;
        } else if (leaf.x > width + 60) {
          leaf.x = -40;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Visibility change handler (pause when tab hidden to save CPU/battery)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, style, density]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      id="falling-leaves-canvas"
      className="fixed inset-0 pointer-events-none z-[2] w-full h-full"
      style={{
        willChange: 'transform'
      }}
      aria-hidden="true"
    />
  );
};
