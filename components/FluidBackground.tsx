/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { PaletteMood } from '../types';

interface FluidBackgroundProps {
  mood?: PaletteMood;
}

const PALETTE_CONFIGS: Record<PaletteMood, {
  color1: string;
  color2: string;
  color3: string;
  glow: string;
  meshRgb: [number, number, number];
}> = {
  vermilion: {
    color1: '#ff4b26', // Signature Vermilion
    color2: '#e0a96d', // Warm architectural gold
    color3: '#7c1e13', // Deep Tuscan wine
    glow: 'rgba(255, 75, 38, 0.18)',
    meshRgb: [255, 75, 38]
  },
  obsidian: {
    color1: '#ffffff', // Crisp monochrome
    color2: '#71717a', // Slate graphite
    color3: '#27272a', // Zinc
    glow: 'rgba(255, 255, 255, 0.12)',
    meshRgb: [200, 200, 210]
  },
  solaris: {
    color1: '#f59e0b', // Radiant amber
    color2: '#ea580c', // Burnt orange
    color3: '#b45309', // Antique ochre
    glow: 'rgba(245, 158, 11, 0.16)',
    meshRgb: [245, 158, 11]
  },
  'kinetic-mint': {
    color1: '#2ee9a7', // Kinetic mint
    color2: '#38bdf8', // Sky cyan
    color3: '#0f766e', // Deep emerald
    glow: 'rgba(46, 233, 167, 0.15)',
    meshRgb: [46, 233, 167]
  }
};

const FluidBackground: React.FC<FluidBackgroundProps> = ({ mood = 'vermilion' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });

  const currentConfig = PALETTE_CONFIGS[mood] || PALETTE_CONFIGS.vermilion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    mouseRef.current.x = width * 0.5;
    mouseRef.current.y = height * 0.5;
    mouseRef.current.targetX = width * 0.5;
    mouseRef.current.targetY = height * 0.5;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Node field for kinetic studio mesh
    const nodeCount = 28;
    const nodes = Array.from({ length: nodeCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.5 + 1.2,
      phase: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 40 + 20
    }));

    let time = 0;

    const render = () => {
      time += 0.008;

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render subtle artistic ambient radial glow following cursor
      const [r, g, b] = currentConfig.meshRgb;
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        10,
        mouseRef.current.x,
        mouseRef.current.y,
        Math.max(width * 0.45, 450)
      );
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.03)`);
      gradient.addColorStop(1, 'rgba(12, 12, 16, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Secondary ambient top-left & bottom-right painterly orbs
      const topGrad = ctx.createRadialGradient(
        width * 0.15,
        height * 0.2,
        0,
        width * 0.15,
        height * 0.2,
        width * 0.4
      );
      topGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.07)`);
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height);

      // Kinetic node lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Wrap edges smoothly
        if (node.x < -50) node.x = width + 50;
        if (node.x > width + 50) node.x = -50;
        if (node.y < -50) node.y = height + 50;
        if (node.y > height + 50) node.y = -50;

        // Magnetic attraction to cursor
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const force = (220 - dist) / 220;
          node.x -= (dx / dist) * force * 0.8;
          node.y -= (dy / dist) * force * 0.8;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const distBetween = Math.hypot(node.x - other.x, node.y - other.y);
          if (distBetween < 180) {
            const alpha = (1 - distBetween / 180) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node points
        const pulse = Math.sin(time + node.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + pulse * 0.4})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mood, currentConfig]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0c0c10]">
      {/* Dynamic interactive canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Subtle architectural noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Architectural subtle hairline grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0c0c10]/40 to-[#0c0c10] pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
