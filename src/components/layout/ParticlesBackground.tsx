'use client';
import { useEffect, useRef } from 'react';

import { BackgroundTheme, useTheme } from '@/context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
  growing: boolean;
  minRadius: number;
  maxRadius: number;
  growSpeed: number;
  rotation?: number;
  rotationSpeed?: number;
  shape?: string;
  svgPath?: string;
  emoji?: string;
  scale?: number;
  offsetY?: number;
  amplitude?: number;
  frequency?: number;
  speedFactor?: number;
  phaseOffset?: number;
  startTime?: number;
  hasBubbleHighlight?: boolean;
  highlightAngle?: number;
  popTime?: number;
  popped?: boolean;
  hue?: number;
  hueShift?: number;
  width?: number;
  height?: number;
  popupEmoji?: boolean;
  fadeIn?: boolean;
  staying?: boolean;
  fadeOut?: boolean;
  lifespan?: number;
  effectOpacity?: number;
  poppedScale?: number;
  phase?: number;
  pulsePhase?: number;
  isIconFirefly?: boolean;
  driftY?: number;
  blinkTime?: number;
  blinkDuration?: number;
}

// Add some fun SVG shapes and define emojis
const svgShapes: Record<string, string> = {
  star: 'M12 0 L15 9 L24 9 L17 15 L20 24 L12 18 L4 24 L7 15 L0 9 L9 9 Z',
  heart:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  drop: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  leaf: 'M17.45 5.18L16 1.5l-4.95 4.88a10.93 10.93 0 0 0-2.92 9.67 10.93 10.93 0 0 0 7.02 7.97 10.93 10.93 0 0 0 9.07-1.97 10.93 10.93 0 0 0 1.9-10.29c-1.32-3.3-4.05-5.6-7.47-6.1-1.32-.2-2.72 0-4.1.52z',
  bubble: 'M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256z',
  wave: 'M0,100 C150,200 350,0 500,100 L500,400 L0,400 Z',
  sparkle: 'M12 0 L14 8 L22 8 L16 13 L18 21 L12 16 L6 21 L8 13 L2 8 L10 8 Z',
  fish: 'M22 6.38c0 1.78-1.34 3.31-3.25 4.25C21 9.04 22 7.38 22 5.38c0-4-6-5-12-5S0 1.38 0 5.38s6 5 12 5c.5 0 1-.03 1.5-.07C7 13.04 0 13.62 0 17.38c0 4 6 5 12 5s12-1 12-5c0-2-1-3.66-3.25-5.25A5.4 5.4 0 0022 6.38z',
  bubblePop:
    'M21.93 11.08C20.4 7.93 16.95 6 12 6S3.6 7.93 2.07 11.08C1.36 12.59 1 14.24 1 16c0 1.76.36 3.41 1.07 4.92C3.6 24.07 7.05 26 12 26s8.4-1.93 9.93-5.08c.7-1.5 1.07-3.16 1.07-4.92 0-1.76-.36-3.41-1.07-4.92z',
};

export default function ParticlesBackground() {
  const { backgroundTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Add transition state tracking
  const prevThemeRef = useRef<BackgroundTheme>(backgroundTheme);
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(0);
  const oldParticlesRef = useRef<Particle[]>([]);

  // Enhanced theme color palettes
  const themePalettes = {
    bubbles: [
      'rgba(144, 175, 255, 0.8)', // Brighter blue
      'rgba(188, 156, 255, 0.7)', // Brighter purple
      'rgba(255, 160, 210, 0.75)', // Brighter pink
      'rgba(140, 210, 255, 0.85)', // Bright light blue
      'rgba(180, 240, 255, 0.8)', // Very light blue
    ],
    particles: [
      '#FFFF00', // Bright yellow
      '#FFFF66', // Lighter yellow
      '#CCFF00', // Chartreuse
      '#99FF00', // Lime green
      '#E8FF33', // Yellow-green
      '#EEFF41', // Light yellow-green
      '#F4FF81', // Pale yellow-green
      '#FFFF8D', // Pale yellow
      '#FFE57F', // Light amber
      '#FFECB3', // Pale amber
    ],
    gradient: [
      '#4D9EFF', // Vivid Sky Blue
      '#FFD033', // Bright Yellow
      '#45E795', // Bright Mint Green
      '#FF73C0', // Bright Pink
      '#9C5FFF', // Vibrant Purple
    ],
    waves: [
      'rgba(84, 234, 218, 0.7)', // Brighter turquoise
      'rgba(0, 224, 173, 0.7)', // Vibrant green-blue
      'rgba(44, 176, 189, 0.7)', // Deeper teal
      'rgba(92, 239, 255, 0.7)', // Bright sky blue
      'rgba(30, 209, 247, 0.7)', // Bright blue
    ],
    confetti: [
      '#FF9999', // Light red
      '#FFCC99', // Peach
      '#FFFF99', // Light yellow
      '#99FF99', // Light green
      '#99FFFF', // Light cyan
      '#9999FF', // Light blue
      '#FF99FF', // Light magenta
      '#FFDD00', // Gold
      '#FF3377', // Rose
    ],
  };

  // Theme backgrounds
  const themeBackgrounds = {
    bubbles: ['#f6f9fc', '#f0f6fd'], // Lighter, more neutral background for soap bubbles
    particles: ['#2C3E50', '#4A5568'], // Lighter twilight gradient for better text visibility
    gradient: ['#3F5978', '#5B81A9'], // Lighter blue-gray gradient for even better text readability
    waves: ['#e0f7ff', '#b3e0ff'], // Override the default with the same as our wave gradient
    confetti: ['#ffffff', '#fffafa'], // Warm white gradient
    emoji: ['#f0f8ff', '#e6f2ff'], // Light sky blue for a sunny day food truck scene
  };

  const createParticles = (canvas: HTMLCanvasElement) => {
    let newParticles: Particle[] = [];

    switch (backgroundTheme) {
      case 'bubbles':
        newParticles = createBubbleParticles(canvas);
        break;
      case 'particles':
        newParticles = createParticleParticles(canvas);
        break;
      case 'gradient':
        newParticles = createGradientParticles(canvas);
        break;
      case 'waves':
        newParticles = createWaveParticles(canvas);
        break;
      case 'confetti':
        newParticles = createConfettiParticles(canvas);
        break;
      default:
        newParticles = createDefaultParticles(canvas);
    }

    // No transition logic - directly set new particles
    particlesRef.current = newParticles;
  };

  // Helper function to draw SVG path on canvas
  const drawSvgPath = (
    ctx: CanvasRenderingContext2D,
    svgPath: string,
    x: number,
    y: number,
    scale: number,
    rotation: number = 0,
    color?: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Better scaling for visibility
    ctx.scale(scale / 25, scale / 25); // Adjusted from 35 to 25 for larger icons

    // Set the fill style if color is provided
    if (color) {
      ctx.fillStyle = color;
    }

    const path = new Path2D(svgPath);
    ctx.fill(path);

    ctx.restore();
  };

  // Add a function to draw bubble popping animation with enhanced visibility
  const drawBubblePop = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    progress: number,
    color: string
  ) => {
    ctx.save();

    // Draw burst effect
    const fragments = 10; // More fragments
    const outerRadius = radius * (1 + progress * 1.8); // More dramatic expansion

    ctx.globalAlpha = 1 - progress; // Start fully visible

    // Draw fragments
    for (let i = 0; i < fragments; i++) {
      const angle = (i / fragments) * Math.PI * 2;
      const fragmentX = x + Math.cos(angle) * outerRadius * 0.8;
      const fragmentY = y + Math.sin(angle) * outerRadius * 0.8;

      ctx.beginPath();
      ctx.arc(fragmentX, fragmentY, radius * 0.25, 0, Math.PI * 2); // Larger fragments
      ctx.fillStyle = color;
      ctx.fill();

      // Add small trails to fragments
      ctx.beginPath();
      ctx.moveTo(fragmentX, fragmentY);
      ctx.lineTo(
        fragmentX + Math.cos(angle) * radius * 0.4 * progress,
        fragmentY + Math.sin(angle) * radius * 0.4 * progress
      );
      ctx.lineWidth = radius * 0.1;
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // Draw ripple effect - more dramatic
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.stroke();

    // Add inner ripple
    ctx.beginPath();
    ctx.arc(x, y, outerRadius * 0.7, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
  };

  const drawParticles = (canvas: HTMLCanvasElement, timestamp: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Calculate delta time for animation
    lastTimeRef.current = timestamp;

    // Check if theme has changed - but immediately switch instead of transition
    if (prevThemeRef.current !== backgroundTheme) {
      // Update previous theme reference
      prevThemeRef.current = backgroundTheme;

      // Create new particles for the current theme immediately
      createParticles(canvas);

      // No transition needed - reset all transition-related variables
      isTransitioningRef.current = false;
      oldParticlesRef.current = [];
      transitionProgressRef.current = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCountRef.current++;

    // Draw background - no transition blending
    const bg = themeBackgrounds[backgroundTheme];
    const gradientBg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradientBg.addColorStop(0, bg[0]);
    gradientBg.addColorStop(1, bg[1]);
    ctx.fillStyle = gradientBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Special case for gradient theme - no transition needed
    if (backgroundTheme === 'gradient') {
      drawGradientEffect(ctx, canvas);
      return;
    }

    const particles = particlesRef.current;

    // Always draw current theme at full opacity
    drawThemeParticles(ctx, canvas, particles, timestamp, backgroundTheme, 1);
  };

  // Helper function to draw particles with a specific opacity
  const drawThemeParticles = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    timestamp: number,
    theme: BackgroundTheme,
    opacity: number
  ) => {
    // Save the context state for opacity
    ctx.save();
    ctx.globalAlpha = opacity;

    // Use the appropriate drawing function based on theme
    switch (theme) {
      case 'bubbles':
        drawBubbleEffect(ctx, canvas, particles, timestamp);
        break;
      case 'particles':
        drawParticleEffect(ctx, canvas, particles, timestamp);
        break;
      case 'waves':
        drawWaveEffect(ctx, canvas, particles, timestamp);
        break;
      case 'confetti':
        drawConfettiEffect(ctx, canvas, particles, timestamp);
        break;
      case 'gradient':
        drawGradientEffect(ctx, canvas);
        break;
    }

    // Restore the context
    ctx.restore();
  };

  // Enhanced soap bubble effect with iridescent highlights
  const drawBubbleEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    timestamp: number
  ) => {
    // Don't draw connecting lines for soap bubbles
    const poppedBubbles: Particle[] = [];

    // Occasionally add a new bubble
    if (Math.random() > 0.991 && particles.length < 7) {
      // Lower chance, max 7 bubbles
      const minRadius = Math.random() * 30 + 60; // Same size as initial bubbles
      const maxRadius = minRadius * 1.2;

      // Staggered starting position - spread bubbles out more initially
      const initialOffset = Math.random() * 200; // Spread bubbles apart by 300-500px

      particles.push({
        x: canvas.width + minRadius + initialOffset,
        y: Math.random() * canvas.height,
        radius: minRadius,
        minRadius,
        maxRadius,
        color: themePalettes.bubbles[Math.floor(Math.random() * themePalettes.bubbles.length)],
        speedX: -(Math.random() * 1.2 + 1.0),
        speedY: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.15 + 0.85,
        growing: true,
        growSpeed: Math.random() * 0.003 + 0.001,
        hasBubbleHighlight: true,
        highlightAngle: Math.random() * Math.PI * 2,
        popTime: Math.random() > 0.7 ? timestamp + Math.random() * 20000 + 15000 : 0,
        popped: false,
        shape: 'circle',
      });
    }

    // Draw bubbles with iridescent highlights
    particles.forEach(particle => {
      // Check if it's time to pop
      if (particle.popTime && !particle.popped && timestamp > particle.popTime) {
        particle.popped = true;
        poppedBubbles.push({ ...particle });
      }

      // Skip drawing if popped
      if (particle.popped) {
        return;
      }

      // Regular bubble animation
      if (particle.growing) {
        particle.radius += particle.growSpeed;
        if (particle.radius >= particle.maxRadius) {
          particle.radius = particle.maxRadius;
          particle.growing = false;
        }
      } else {
        particle.radius -= particle.growSpeed;
        if (particle.radius <= particle.minRadius) {
          particle.radius = particle.minRadius;
          particle.growing = true;
        }
      }

      // Draw the bubble with iridescent effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      // Create soap bubble effect with iridescent gradient
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius
      );

      // Iridescent colors based on position and time - more vibrant
      const hue1 = (particle.x * 0.1 + timestamp * 0.02) % 360;
      const hue2 = (hue1 + 60) % 360;
      const hue3 = (hue1 + 180) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 100%, 80%, 0.4)`); // More visible
      gradient.addColorStop(0.4, `hsla(${hue2}, 100%, 70%, 0.35)`); // More visible
      gradient.addColorStop(0.8, `hsla(${hue3}, 100%, 60%, 0.3)`); // More visible
      gradient.addColorStop(0.95, 'rgba(255, 255, 255, 0.35)'); // More visible
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.45)'); // More visible

      ctx.fillStyle = gradient;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();

      // Bubble edge/border - much more visible
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; // Near full opacity border
      ctx.lineWidth = 3; // Even thicker border
      ctx.stroke();

      // Add a second darker border for definition
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius - 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 230, 255, 0.5)'; // Inner border for definition
      ctx.lineWidth = 1.5; // Even thicker border
      ctx.stroke();

      // Enhanced multiple bubble highlights to create iridescent effect
      if (particle.hasBubbleHighlight) {
        // Main highlight (top-left) - increased size and opacity
        ctx.beginPath();
        const highlightAngle1 = particle.highlightAngle as number;
        const highlightDistance1 = particle.radius * 0.6;
        const highlightX1 = particle.x + highlightDistance1 * Math.cos(highlightAngle1);
        const highlightY1 = particle.y + highlightDistance1 * Math.sin(highlightAngle1);
        const highlightRadius1 = particle.radius * 0.4; // Larger highlight

        const highlightGradient1 = ctx.createRadialGradient(
          highlightX1,
          highlightY1,
          0,
          highlightX1,
          highlightY1,
          highlightRadius1
        );
        highlightGradient1.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Full opacity
        highlightGradient1.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)'); // More visible transition
        highlightGradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.arc(highlightX1, highlightY1, highlightRadius1, 0, Math.PI * 2);
        ctx.fillStyle = highlightGradient1;
        ctx.fill();

        // Secondary highlight - increased visibility
        ctx.beginPath();
        const highlightAngle2 = (highlightAngle1 + Math.PI / 2) % (Math.PI * 2);
        const highlightDistance2 = particle.radius * 0.4;
        const highlightX2 = particle.x + highlightDistance2 * Math.cos(highlightAngle2);
        const highlightY2 = particle.y + highlightDistance2 * Math.sin(highlightAngle2);
        const highlightRadius2 = particle.radius * 0.3; // Larger secondary highlight

        const highlightGradient2 = ctx.createRadialGradient(
          highlightX2,
          highlightY2,
          0,
          highlightX2,
          highlightY2,
          highlightRadius2
        );
        highlightGradient2.addColorStop(0, 'rgba(255, 255, 255, 0.95)'); // Nearly full opacity
        highlightGradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.arc(highlightX2, highlightY2, highlightRadius2, 0, Math.PI * 2);
        ctx.fillStyle = highlightGradient2;
        ctx.fill();

        // Add a third small bright highlight for extra sparkle
        ctx.beginPath();
        const highlightAngle3 = (highlightAngle1 + Math.PI * 1.5) % (Math.PI * 2);
        const highlightDistance3 = particle.radius * 0.7;
        const highlightX3 = particle.x + highlightDistance3 * Math.cos(highlightAngle3);
        const highlightY3 = particle.y + highlightDistance3 * Math.sin(highlightAngle3);
        const highlightRadius3 = particle.radius * 0.15;

        ctx.arc(highlightX3, highlightY3, highlightRadius3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // Update position - move from right to left with slight drift
      particle.x += particle.speedX;
      particle.y += particle.speedY + Math.sin(timestamp * 0.0005 + particle.x * 0.005) * 0.05; // Gentler drift

      // Reset when out of bounds (off the left side of the screen)
      if (particle.x + particle.radius < 0) {
        // Reset to right side
        particle.x = canvas.width + particle.radius + Math.random() * 100;
        particle.y = Math.random() * canvas.height;
        // New random pop time
        if (Math.random() > 0.6) {
          particle.popTime = timestamp + Math.random() * 20000 + 15000;
          particle.popped = false;
        }
      }

      // Keep bubbles in vertical bounds with gentle bouncing
      if (particle.y - particle.radius < 0) {
        particle.y = particle.radius;
        particle.speedY = Math.abs(particle.speedY) * 0.5;
      } else if (particle.y + particle.radius > canvas.height) {
        particle.y = canvas.height - particle.radius;
        particle.speedY = -Math.abs(particle.speedY) * 0.5;
      }
    });

    // Draw popping animations with enhanced visibility
    poppedBubbles.forEach(bubble => {
      // Calculate animation progress (0 to 1 over 1 second)
      const popStart = bubble.popTime as number;
      const progress = Math.min(1, (timestamp - popStart) / 1000);

      if (progress < 1) {
        drawBubblePop(ctx, bubble.x, bubble.y, bubble.radius, progress, 'rgba(255, 255, 255, 0.9)'); // More visible pop effect
      }
    });
  };

  // Create firefly particles with pulsing glow and occasional icons
  const createParticleParticles = (canvas: HTMLCanvasElement): Particle[] => {
    const particles: Particle[] = [];

    // Firefly colors - brighter pastel colors with more vibrancy
    const particleColors = [
      '#FF8A8A', // Brighter pastel red (more vibrant)
      '#FFAC73', // Brighter pastel orange
      '#FFEE66', // Brighter pastel yellow
      '#BBFF66', // Brighter pastel lime
      '#66FFBB', // Brighter pastel mint
      '#66D9FF', // Brighter pastel sky blue
      '#66A1FF', // Brighter pastel blue
      '#B573FF', // Brighter pastel purple
      '#FF73F3', // Brighter pastel magenta
      '#FF99B3', // Brighter pastel pink
    ];

    const count = 75; // Increased from 60 for more particles

    // Get all available nature shapes

    // Create a grid-like distribution to ensure particles are well-spaced
    const gridCols = 10;
    const gridRows = 6;
    const cellWidth = canvas.width / gridCols;
    const cellHeight = canvas.height / gridRows;

    for (let i = 0; i < count; i++) {
      // Calculate a grid position with some randomness
      const gridX = i % gridCols;
      const gridY = Math.floor(i / gridCols) % gridRows;

      // Add randomness within the cell
      const x = gridX * cellWidth + Math.random() * cellWidth;
      const y = gridY * cellHeight + Math.random() * cellHeight;

      // Core particle properties
      const baseRadius = Math.random() * 1.5 + 1.5; // 1.5-3 pixels for core particles
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];

      // Determine if this particle will have a nature icon (20% chance)
      const hasNatureIcon = Math.random() < 0.2;

      // Create the core particle
      const coreParticle: Particle = {
        x,
        y,
        radius: baseRadius,
        minRadius: baseRadius * 0.7,
        maxRadius: baseRadius * 1.5,
        color,
        speedX: (Math.random() - 0.5) * 0.5, // Even slower movement
        speedY: -Math.random() * 0.3 - 0.05, // Gentler upward drift
        alpha: Math.random() * 0.1 + 0.9, // Increased from 0.8 to 0.9 for more visibility
        growing: Math.random() > 0.5,
        growSpeed: Math.random() * 0.008 + 0.004, // Slower pulsing
        pulsePhase: Math.random() * Math.PI * 2,
        shape: 'circle',
        driftY: Math.random() * 0.015 + 0.005, // Gentler vertical drift
        blinkTime: Math.random() < 0.3 ? Date.now() + Math.random() * 7000 : 0, // Some fireflies blink
        blinkDuration: Math.random() * 300 + 200, // 200-500ms blink
        isIconFirefly: hasNatureIcon, // Flag to identify icon-based fireflies
      };

      // For simple dot fireflies, make them glow more
      coreParticle.radius *= 1.1;
      coreParticle.minRadius *= 1.1;
      coreParticle.maxRadius *= 1.3;

      particles.push(coreParticle);
    }

    return particles;
  };

  // Enhance the particle effect drawing with subtle connections and glowing effect
  const drawParticleEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    timestamp: number
  ) => {
    // Draw very subtle connecting lines between very nearby particles
    ctx.lineWidth = 0.3; // Thinner lines
    const connectionDistance = Math.min(canvas.width, canvas.height) * 0.06; // Much smaller connection distance

    // First draw connections - only between particles that are quite close
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const opacity = 0.08 * (1 - distance / connectionDistance); // Much more subtle lines

          // Create a gradient color based on the particle colors
          let color1 = p1.color;
          let color2 = p2.color;

          // Convert hex to rgba format if not already in rgba
          if (color1.startsWith('#')) {
            const r = parseInt(color1.slice(1, 3), 16);
            const g = parseInt(color1.slice(3, 5), 16);
            const b = parseInt(color1.slice(5, 7), 16);
            color1 = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          } else {
            color1 = color1.replace(/[^,]+(?=\))/, `${opacity}`);
          }

          if (color2.startsWith('#')) {
            const r = parseInt(color2.slice(1, 3), 16);
            const g = parseInt(color2.slice(3, 5), 16);
            const b = parseInt(color2.slice(5, 7), 16);
            color2 = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          } else {
            color2 = color2.replace(/[^,]+(?=\))/, `${opacity}`);
          }

          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, color1);
          gradient.addColorStop(1, color2);
          ctx.strokeStyle = gradient;
          ctx.stroke();
        }
      }
    }

    // Then draw each particle with its satellites
    particles.forEach(particle => {
      // Calculate pulsing based on time
      const pulseTime = timestamp * 0.001;
      const pulseFactor = particle.pulsePhase
        ? Math.sin(pulseTime + particle.pulsePhase) * 0.5 + 0.5
        : 0.5;

      // Apply pulsing to radius
      const pulseRange = particle.maxRadius - particle.minRadius;
      const pulsedRadius = particle.minRadius + pulseRange * pulseFactor;
      particle.radius = pulsedRadius;

      // Handle firefly blinking effect
      let currentAlpha = particle.alpha;
      if (particle.blinkTime) {
        const blinkDuration = particle.blinkDuration || 300;

        // Check if it's time to blink
        if (particle.blinkTime < timestamp && particle.blinkTime + blinkDuration > timestamp) {
          // During blink period - reduce alpha based on sin wave
          const blinkProgress = (timestamp - particle.blinkTime) / blinkDuration;
          const blinkIntensity = Math.sin(blinkProgress * Math.PI); // 0->1->0 over the duration
          currentAlpha = particle.alpha * (1 - blinkIntensity * 0.9); // Dim but not completely
        } else if (particle.blinkTime + blinkDuration < timestamp) {
          // Reset blink time for future blinks - random interval between 3-10 seconds
          particle.blinkTime = timestamp + Math.random() * 7000 + 3000;
        }
      }

      // Draw the core particle with potentially modified alpha (for blinking)
      ctx.save();
      ctx.globalAlpha = currentAlpha;

      // Convert hex color to rgb format if needed
      const particleColor = particle.color;
      let gradientColor0 = particleColor;
      let gradientColor1, gradientColor2, gradientColor3;

      if (particleColor.startsWith('#')) {
        const r = parseInt(particleColor.slice(1, 3), 16);
        const g = parseInt(particleColor.slice(3, 5), 16);
        const b = parseInt(particleColor.slice(5, 7), 16);
        gradientColor0 = `rgba(${r}, ${g}, ${b}, 1)`;
        gradientColor1 = `rgba(${r}, ${g}, ${b}, 0.3)`;
        gradientColor2 = `rgba(${r}, ${g}, ${b}, 0.07)`;
        gradientColor3 = `rgba(${r}, ${g}, ${b}, 0)`;
      } else {
        gradientColor1 = particleColor.replace(/[^,]+(?=\))/, '0.3');
        gradientColor2 = particleColor.replace(/[^,]+(?=\))/, '0.07');
        gradientColor3 = particleColor.replace(/[^,]+(?=\))/, '0');
      }

      // Create a glowing core with warmer glow
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 9 // Increased from 7 to 9 for an even larger, softer glow
      );

      // Modify gradient for a softer, more diffused glow that suits pastel colors
      gradient.addColorStop(0, gradientColor0);
      gradient.addColorStop(0.03, gradientColor1); // Changed from 0.05 to 0.03 for more intense inner core
      gradient.addColorStop(0.25, gradientColor2); // Changed from 0.3 to 0.25 for slightly more vibrant appearance
      gradient.addColorStop(1, gradientColor3);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
      ctx.fill();

      // Add a solid center for better visibility
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      // Add a subtle shadow outline for more definition against bright background
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius + 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Increased from 0.15 to 0.2 for slightly more definition
      ctx.lineWidth = 0.5; // Increased from 0.4 to 0.5 for slightly more visibility
      ctx.stroke();

      ctx.restore();

      // Update particle position with natural firefly movement
      // Base movement
      particle.x += particle.speedX;

      // For fireflies, use gentle upward drift with small variations
      const driftY = particle.driftY || 0.01;
      // Gentle upward movement with slight bobbing
      particle.y += particle.speedY - driftY;

      // Add gentle bobbing motion for natural movement
      particle.x += Math.sin(timestamp * 0.0008 + particle.y * 0.01) * 0.2;
      particle.y += Math.cos(timestamp * 0.0008 + particle.x * 0.01) * 0.15;

      // Slow natural deceleration for speedY to make movement more organic
      particle.speedY *= 0.998;

      // Occasional speed change to simulate natural movement
      if (Math.random() < 0.01) {
        particle.speedX += (Math.random() - 0.5) * 0.05;
        particle.speedY += (Math.random() - 0.5) * 0.05;
      }

      // Sometimes make fireflies hover - slow horizontal movement
      if (Math.random() < 0.008) {
        particle.speedX *= 0.9;
      }

      // Bounce off edges with slight dampening
      if (particle.x - particle.radius < 0) {
        particle.x = particle.radius;
        particle.speedX = Math.abs(particle.speedX) * 0.95;
      } else if (particle.x + particle.radius > canvas.width) {
        particle.x = canvas.width - particle.radius;
        particle.speedX = -Math.abs(particle.speedX) * 0.95;
      }

      if (particle.y - particle.radius < 0) {
        particle.y = particle.radius;
        particle.speedY = Math.abs(particle.speedY) * 0.95;
      } else if (particle.y + particle.radius > canvas.height) {
        particle.y = canvas.height - particle.radius;
        particle.speedY = -Math.abs(particle.speedY) * 0.95;
      }

      // Occasionally reset particles at the bottom when they drift too high
      // This creates continuous upward-drifting fireflies
      if (particle.y < canvas.height * 0.1 && Math.random() < 0.01) {
        particle.y = canvas.height - Math.random() * (canvas.height * 0.2);
        particle.speedY = -Math.random() * 0.2 - 0.05; // Reset upward speed
      }
    });
  };

  // Implement missing gradient effect
  const drawGradientEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Create a colorful moving gradient background
    const time = Date.now() * 0.001;
    const colors = themePalettes.gradient;

    // Create multiple radial gradients that move over time
    for (let i = 0; i < 3; i++) {
      const x = Math.sin(time * (0.2 + i * 0.1)) * canvas.width * 0.5 + canvas.width * 0.5;
      const y = Math.cos(time * (0.3 + i * 0.1)) * canvas.height * 0.5 + canvas.height * 0.5;
      const radius = Math.max(canvas.width, canvas.height) * (0.3 + Math.sin(time * 0.4) * 0.1);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

      const colorIndex1 = (i + Math.floor(time)) % colors.length;

      // Increase opacity for better visibility against lighter background
      gradient.addColorStop(0, colors[colorIndex1] + 'DD'); // 87% opacity for more vibrant appearance
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'lighter';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Add some enhanced dynamic highlights for visual interest
    const highlightX = Math.sin(time * 0.3) * canvas.width * 0.4 + canvas.width * 0.5;
    const highlightY = Math.cos(time * 0.2) * canvas.height * 0.4 + canvas.height * 0.5;
    const highlightRadius = Math.max(canvas.width, canvas.height) * 0.15;

    const highlightGradient = ctx.createRadialGradient(
      highlightX,
      highlightY,
      0,
      highlightX,
      highlightY,
      highlightRadius
    );

    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); // Increased from 0.3 to 0.4
    highlightGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = highlightGradient;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add a second smaller, brighter highlight for extra dimension
    const highlight2X = Math.sin(time * 0.4) * canvas.width * 0.3 + canvas.width * 0.6;
    const highlight2Y = Math.cos(time * 0.35) * canvas.height * 0.3 + canvas.height * 0.4;
    const highlight2Radius = Math.max(canvas.width, canvas.height) * 0.08;

    const highlight2Gradient = ctx.createRadialGradient(
      highlight2X,
      highlight2Y,
      0,
      highlight2X,
      highlight2Y,
      highlight2Radius
    );

    highlight2Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    highlight2Gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = highlight2Gradient;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };

  // Implement wave effect with a completely new simplified approach
  const drawWaveEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    timestamp: number
  ) => {
    const time = timestamp * 0.0018; // Even faster animation speed

    // Create a more vibrant ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#a9d9f4'); // Lighter sky blue at top
    gradient.addColorStop(0.45, '#73c2fb'); // Medium blue
    gradient.addColorStop(0.5, '#1e90ff'); // Royal blue at horizon
    gradient.addColorStop(1, '#0052a5'); // Deep blue at bottom

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate horizon position
    const horizonY = canvas.height * 0.45;

    // Draw enhanced fish with more active movement
    drawEnhancedFish(ctx, particles, time);

    // Draw multiple wave layers with dramatically increased amplitude
    // Bottom waves (deeper water)
    drawSimpleWaveLayer(
      ctx,
      canvas,
      time * 0.7,
      horizonY + 120,
      75, // Dramatically increased amplitude
      0.0035, // Increased frequency
      'rgba(0, 65, 130, 0.6)',
      0.08 // Faster wave speed
    );

    // Middle waves
    drawSimpleWaveLayer(
      ctx,
      canvas,
      time * 1.5,
      horizonY + 70,
      65, // Dramatically increased amplitude
      0.003,
      'rgba(25, 105, 180, 0.5)',
      0.1 // Faster wave speed
    );

    // Surface waves
    drawSimpleWaveLayer(
      ctx,
      canvas,
      time * 1.2,
      horizonY + 25,
      50, // Dramatically increased amplitude
      0.0025,
      'rgba(65, 145, 230, 0.5)',
      0.12 // Faster wave speed
    );

    // Top waves (with foam)
    drawSimpleWaveLayer(
      ctx,
      canvas,
      time * 1.4,
      horizonY,
      45, // Dramatically increased amplitude
      0.0022,
      'rgba(100, 180, 255, 0.45)',
      0.15, // Much faster wave speed
      true // Add foam to top layer
    );

    // Add enhanced sun reflection on water
    drawSunReflection(ctx, canvas, horizonY);
  };

  // Enhanced wave layer with more complex waves
  const drawSimpleWaveLayer = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
    baseY: number,
    amplitude: number,
    frequency: number,
    color: string,
    speed: number,
    addFoam: boolean = false
  ) => {
    ctx.beginPath();

    // Start at left bottom
    ctx.moveTo(0, canvas.height);

    // Use many points for smooth rendering
    const segmentCount = 300;
    const width = canvas.width;

    // Store wave points for foam if needed
    const wavePoints: { x: number; y: number }[] = [];

    for (let i = 0; i <= segmentCount; i++) {
      const x = (i / segmentCount) * width;

      // Primary wave with more movement
      const primaryWave = Math.sin(x * frequency + time * speed);

      // Add a stronger secondary wave component
      const secondaryWave = Math.sin(x * frequency * 2.5 + time * (speed * 0.9)) * 0.4;

      // Add a third wave component for more complexity
      const tertiaryWave = Math.sin(x * frequency * 4 + time * (speed * 1.3)) * 0.2;

      // Add a long slow wave for general sea level changes
      const slowWave = Math.sin(time * (speed * 0.2)) * 0.25;

      // Add dramatic peaks at random intervals
      const peakEffect = Math.sin(x * frequency * 0.3 + time * (speed * 0.5)) * 0.3;

      // Combine waves with emphasis on dramatic movement
      const waveHeight =
        amplitude * (primaryWave + secondaryWave + tertiaryWave + slowWave + peakEffect);

      const y = baseY + waveHeight;
      ctx.lineTo(x, y);

      if (addFoam) {
        wavePoints.push({ x, y });
      }
    }

    // Close the path
    ctx.lineTo(width, canvas.height);
    ctx.lineTo(0, canvas.height);

    // Fill with color
    ctx.fillStyle = color;
    ctx.fill();

    // Add foam to top wave if requested
    if (addFoam) {
      drawFoam(ctx, wavePoints, time);
    }
  };

  // Draw more active foam along wave peaks with additional spray
  const drawFoam = (
    ctx: CanvasRenderingContext2D,
    wavePoints: { x: number; y: number }[],
    time: number
  ) => {
    ctx.save();

    // Draw a thicker foam line along the wave
    ctx.beginPath();
    ctx.moveTo(wavePoints[0].x, wavePoints[0].y);

    for (let i = 1; i < wavePoints.length; i++) {
      ctx.lineTo(wavePoints[i].x, wavePoints[i].y);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; // Brighter foam
    ctx.lineWidth = 4; // Thicker foam line
    ctx.stroke();

    // Add more foam clusters at peaks (reduced spacing between clusters)
    for (let i = 5; i < wavePoints.length - 5; i += 15) {
      // Even more frequent foam clusters
      // Find local maxima (wave peaks)
      if (wavePoints[i].y < wavePoints[i - 5].y && wavePoints[i].y < wavePoints[i + 5].y) {
        const foamSize = 6 + Math.sin(time * 1.2 + i * 0.1) * 4; // Larger, more animated foam

        // Draw foam cluster
        ctx.beginPath();
        ctx.arc(wavePoints[i].x, wavePoints[i].y, foamSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // Brighter foam
        ctx.fill();

        // Add wave spray effect at high peaks (when the wave is at least 30% of max height)
        const waveIntensity = Math.abs(wavePoints[i].y - wavePoints[i + 5].y);
        if (waveIntensity > 4) {
          // Add spray droplets above peak
          for (let j = 0; j < 8; j++) {
            // More spray particles
            const sprayDistance = 4 + Math.random() * 12;
            const sprayAngle = Math.PI * (1.2 + Math.random() * 0.6); // Mostly upward
            const sprayX = wavePoints[i].x + Math.cos(sprayAngle) * sprayDistance;
            const sprayY = wavePoints[i].y + Math.sin(sprayAngle) * sprayDistance;
            const spraySize = 0.5 + Math.random() * 2.5;

            ctx.beginPath();
            ctx.arc(sprayX, sprayY, spraySize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
          }
        }

        // Add more smaller bubbles around main foam
        for (let j = 0; j < 7; j++) {
          // More bubbles
          const angle = Math.PI * 2 * Math.random();
          const distance = 4 + Math.random() * 8;
          const bubbleX = wavePoints[i].x + Math.cos(angle) * distance;
          const bubbleY = wavePoints[i].y + Math.sin(angle) * distance;
          const bubbleSize = 1.5 + Math.random() * 3; // Larger bubbles

          ctx.beginPath();
          ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fill();
        }
      }
    }

    ctx.restore();
  };

  // Draw sun reflection on water
  const drawSunReflection = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    horizonY: number
  ) => {
    // Create a gradient for sun reflection
    const reflectionGradient = ctx.createRadialGradient(
      canvas.width * 0.7,
      horizonY,
      0,
      canvas.width * 0.7,
      horizonY,
      canvas.width * 0.3
    );

    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    reflectionGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.2)');
    reflectionGradient.addColorStop(0.5, 'rgba(255, 180, 100, 0.05)');
    reflectionGradient.addColorStop(1, 'rgba(255, 140, 0, 0)');

    ctx.fillStyle = reflectionGradient;
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);
  };

  // Draw fish with more active movement
  const drawEnhancedFish = (ctx: CanvasRenderingContext2D, particles: Particle[], time: number) => {
    particles.forEach(particle => {
      if (particle.shape === 'fish' && particle.svgPath) {
        ctx.save();
        ctx.globalAlpha = particle.alpha;

        // Add stronger vertical movement based on position
        const verticalOffset = Math.sin(time * 0.3 + particle.x * 0.01) * 8;

        // Determine fish direction - if moving right, face right
        const fishFacingRight = particle.speedX > 0;

        // Draw fish with more active vertical movement
        drawSvgPath(
          ctx,
          particle.svgPath,
          particle.x,
          particle.y + verticalOffset,
          particle.radius * 2,
          fishFacingRight ? 0 : Math.PI // Rotate fish based on direction
        );

        ctx.restore();

        // Move fish with faster speeds
        particle.x += particle.speedX * 0.8;

        // Reset when off screen
        if (particle.x > ctx.canvas.width + 50) {
          particle.x = -50;
          particle.y = Math.random() * ctx.canvas.height * 0.3 + ctx.canvas.height * 0.5;
          particle.speedX = Math.random() * 1.2 + 0.6; // Faster fish
        }
        if (particle.x < -50) {
          particle.x = ctx.canvas.width + 50;
          particle.y = Math.random() * ctx.canvas.height * 0.3 + ctx.canvas.height * 0.5;
          particle.speedX = -(Math.random() * 1.2 + 0.6); // Faster fish
        }
      }
    });

    // More frequently add bubbles from fish
    if (Math.random() > 0.98) {
      const fishIndex = Math.floor(Math.random() * particles.length);
      const fish = particles[fishIndex];

      if (fish && fish.shape === 'fish') {
        // Create a bubble behind the fish
        const bubbleOffsetX = fish.speedX > 0 ? -15 : 15;

        particlesRef.current.push({
          x: fish.x + bubbleOffsetX,
          y: fish.y,
          radius: Math.random() * 2 + 1,
          minRadius: 1,
          maxRadius: 3,
          color: 'rgba(255, 255, 255, 0.6)',
          speedX: fish.speedX * 0.2,
          speedY: -0.5 - Math.random() * 0.8, // Faster rising bubbles
          alpha: 0.7,
          growing: true,
          growSpeed: 0.01,
          shape: 'circle',
        });
      }
    }
  };

  // Implement confetti effect
  const drawConfettiEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    timestamp: number
  ) => {
    // Draw each confetti particle
    particles.forEach(particle => {
      ctx.save();
      ctx.translate(particle.x, particle.y);

      if (particle.rotation !== undefined) {
        ctx.rotate(particle.rotation);
      }

      ctx.globalAlpha = particle.alpha;

      // Different shapes for confetti
      if (particle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      } else if (particle.shape === 'square') {
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.radius, -particle.radius, particle.radius * 2, particle.radius * 2);
      } else if (particle.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(0, -particle.radius);
        ctx.lineTo(particle.radius, particle.radius);
        ctx.lineTo(-particle.radius, particle.radius);
        ctx.closePath();
        ctx.fillStyle = particle.color;
        ctx.fill();
      } else if (particle.svgPath) {
        ctx.fillStyle = particle.color;
        const path = new Path2D(particle.svgPath);
        ctx.scale(particle.radius / 12, particle.radius / 12);
        ctx.fill(path);
      }

      ctx.restore();

      // Update position with gravity and physics
      particle.speedY += 0.08; // Gravity
      particle.speedX *= 0.99; // Air resistance
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Add swinging motion
      particle.x += Math.sin(timestamp * 0.002 + particle.y * 0.01) * 0.3;

      // Update rotation if defined
      if (particle.rotation !== undefined && particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed;
      }

      // Fade out confetti that's been around for a while
      if (particle.alpha > 0.1) {
        particle.alpha -= 0.0005;
      }

      // Reset particles when they go off-screen
      if (
        particle.y > canvas.height + 50 ||
        particle.x < -50 ||
        particle.x > canvas.width + 50 ||
        particle.alpha <= 0.1
      ) {
        // Reset to launch position with new velocity and properties
        resetConfettiParticle(particle, canvas);
      }
    });

    // Occasionally add new confetti bursts
    if (Math.random() > 0.97 && particles.length < 300) {
      const burstSize = Math.floor(Math.random() * 5) + 3; // 3-7 particles per burst

      for (let i = 0; i < burstSize; i++) {
        const newParticle = createConfettiParticle(canvas);
        particlesRef.current.push(newParticle);
      }
    }
  };

  // Helper function to create new confetti particles
  const createConfettiParticle = (canvas: HTMLCanvasElement): Particle => {
    const colors = themePalettes.confetti;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shapes = ['circle', 'square', 'triangle', 'star', 'heart'] as const;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    // Choose a corner to launch from (bottom left or bottom right)
    const cornerX = Math.random() > 0.5 ? 50 : canvas.width - 50;
    const cornerY = canvas.height - 50;

    // Calculate launch angle (45-135 degrees if from left, 45-135 degrees if from right)
    const isLeftCorner = cornerX < canvas.width / 2;
    const minAngle = isLeftCorner ? -135 : -135;
    const maxAngle = isLeftCorner ? -45 : -45;
    const angle = ((minAngle + Math.random() * (maxAngle - minAngle)) * Math.PI) / 180;

    // Calculate velocity components
    const speed = 5 + Math.random() * 10;
    const speedX = Math.cos(angle) * speed * (isLeftCorner ? 1 : -1);
    const speedY = Math.sin(angle) * speed;

    return {
      x: cornerX,
      y: cornerY,
      radius: Math.random() * 5 + 2,
      minRadius: 2,
      maxRadius: 7,
      color,
      speedX,
      speedY,
      alpha: 0.8 + Math.random() * 0.2,
      growing: false,
      growSpeed: 0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      shape,
      svgPath:
        shape !== 'circle' && shape !== 'square' && shape !== 'triangle'
          ? svgShapes[shape]
          : undefined,
    };
  };

  // Reset an existing confetti particle to launch position
  const resetConfettiParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
    const colors = themePalettes.confetti;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Choose a corner to launch from (bottom left or bottom right)
    const cornerX = Math.random() > 0.5 ? 50 : canvas.width - 50;
    const cornerY = canvas.height - 50;

    // Calculate launch angle (45-135 degrees if from left, 45-135 degrees if from right)
    const isLeftCorner = cornerX < canvas.width / 2;
    const minAngle = isLeftCorner ? -135 : -135;
    const maxAngle = isLeftCorner ? -45 : -45;
    const angle = ((minAngle + Math.random() * (maxAngle - minAngle)) * Math.PI) / 180;

    // Calculate velocity components
    const speed = 5 + Math.random() * 10;
    const speedX = Math.cos(angle) * speed * (isLeftCorner ? 1 : -1);
    const speedY = Math.sin(angle) * speed;

    // Update particle properties
    particle.x = cornerX;
    particle.y = cornerY;
    particle.speedX = speedX;
    particle.speedY = speedY;
    particle.alpha = 0.8 + Math.random() * 0.2;
    particle.rotation = Math.random() * Math.PI * 2;
    particle.color = color;
  };

  // Update the animation loop to use requestAnimationFrame's timestamp
  useEffect(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles(canvas);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      createParticles(canvas);

      let animationFrameId: number;

      const animate = (timestamp: number) => {
        drawParticles(canvas, timestamp);
        animationFrameId = window.requestAnimationFrame(animate);
      };

      animationFrameId = window.requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.cancelAnimationFrame(animationFrameId);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backgroundTheme]
  );

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}

// Add basic implementations of the missing particle creation functions
const createDefaultParticles = (canvas: HTMLCanvasElement): Particle[] => {
  const particles: Particle[] = [];
  const count = 30;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 2,
      minRadius: Math.random() * 3 + 2,
      maxRadius: Math.random() * 5 + 4,
      color: '#FFFFFF',
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.5,
      growing: Math.random() > 0.5,
      growSpeed: Math.random() * 0.02 + 0.01,
    });
  }

  return particles;
};

const createBubbleParticles = (canvas: HTMLCanvasElement): Particle[] => {
  const particles: Particle[] = [];
  const bubbleColors = [
    'rgba(144, 175, 255, 0.8)', // Brighter blue
    'rgba(188, 156, 255, 0.7)', // Brighter purple
    'rgba(255, 160, 210, 0.75)', // Brighter pink
    'rgba(140, 210, 255, 0.85)', // Bright light blue
    'rgba(180, 240, 255, 0.8)', // Very light blue
  ];
  const count = 5; // Start with fewer bubbles

  for (let i = 0; i < count; i++) {
    const minRadius = Math.random() * 30 + 60;
    const maxRadius = minRadius * 1.2;

    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: minRadius,
      minRadius,
      maxRadius,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      speedX: -(Math.random() * 1.2 + 1.0),
      speedY: Math.random() * 0.2 - 0.1,
      alpha: Math.random() * 0.15 + 0.85,
      growing: true,
      growSpeed: Math.random() * 0.003 + 0.001,
      hasBubbleHighlight: true,
      highlightAngle: Math.random() * Math.PI * 2,
      popTime: Math.random() > 0.7 ? Date.now() + Math.random() * 20000 + 15000 : 0,
      popped: false,
      shape: 'circle',
    });
  }

  return particles;
};

const createGradientParticles = (_canvas: HTMLCanvasElement): Particle[] => {
  // For the gradient theme, we don't actually need particles as it's a full-screen effect
  return [];
};

const createWaveParticles = (canvas: HTMLCanvasElement): Particle[] => {
  const particles: Particle[] = [];
  const count = 20;

  // Create fish particles for the wave theme
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 15 + 10;

    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.5 + Math.random() * canvas.height * 0.5,
      radius: size,
      minRadius: size,
      maxRadius: size,
      color: 'rgba(255, 255, 255, 0.8)',
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.3 + 0.7,
      growing: false,
      growSpeed: 0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      shape: 'fish',
      svgPath: svgShapes.fish,
    });
  }

  return particles;
};

const createConfettiParticles = (canvas: HTMLCanvasElement): Particle[] => {
  const particles: Particle[] = [];
  // Define confetti colors directly
  const confettiColors = [
    '#FF9999', // Light red
    '#FFCC99', // Peach
    '#FFFF99', // Light yellow
    '#99FF99', // Light green
    '#99FFFF', // Light cyan
    '#9999FF', // Light blue
    '#FF99FF', // Light magenta
    '#FFDD00', // Gold
    '#FF3377', // Rose
  ];
  const count = 75; // Increased from 60 for more particles

  for (let i = 0; i < count; i++) {
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const cornerX = Math.random() > 0.5 ? 50 : canvas.width - 50;
    const cornerY = canvas.height - 50;
    const isLeftCorner = cornerX < canvas.width / 2;
    const minAngle = isLeftCorner ? -135 : -135;
    const maxAngle = isLeftCorner ? -45 : -45;
    const angle = ((minAngle + Math.random() * (maxAngle - minAngle)) * Math.PI) / 180;
    const speed = 5 + Math.random() * 10;
    const speedX = Math.cos(angle) * speed * (isLeftCorner ? 1 : -1);
    const speedY = Math.sin(angle) * speed;

    particles.push({
      x: cornerX,
      y: cornerY,
      radius: Math.random() * 5 + 5,
      minRadius: 5,
      maxRadius: 10,
      color,
      speedX,
      speedY,
      alpha: 0.8 + Math.random() * 0.2,
      growing: false,
      growSpeed: 0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    });
  }

  return particles;
};
