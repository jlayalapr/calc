'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────
const W = 390;
const H = 780;
const PLAYER_SPEED = 4.5;
const BULLET_SPEED = 10;
const SHOOT_INTERVAL = 15; // frames between shots
const PLAYER_Y = H - 110;
const PR_BLUE = '#002D62';
const PR_RED = '#CE1126';

// ── Types ──────────────────────────────────────────────────────────────────
type Phase = 'title' | 'playing' | 'waveclear' | 'gameover';
type EnemyType = 'iguana' | 'mosquito' | 'boss';
type PowerupType = 'piragua' | 'platano' | 'coco';

interface Player {
  x: number; y: number; vx: number;
  hp: number; maxHp: number;
  invincible: number;
  shootTimer: number;
  powerup: PowerupType | null;
  powerupTimer: number;
}

interface Bullet {
  x: number; y: number;
  vx: number; vy: number;
  isEnemy: boolean;
  size: number;
}

interface Enemy {
  x: number; y: number;
  vx: number; vy: number;
  type: EnemyType;
  hp: number; maxHp: number;
  size: number;
  shootTimer: number;
  angle: number;
  phase: number;
  id: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

interface Powerup {
  x: number; y: number; vy: number;
  type: PowerupType;
}

interface Star { x: number; y: number; r: number; twinkle: number; }

interface GS {
  phase: Phase;
  score: number; lives: number; wave: number; highScore: number;
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  powerups: Powerup[];
  stars: Star[];
  spawnTimer: number;
  spawnedCount: number;
  totalInWave: number;
  waveTimer: number;
  frame: number;
  eid: number;
  keys: Set<string>;
  touchLeft: boolean; touchRight: boolean;
}

// ── Drawing helpers ────────────────────────────────────────────────────────
function drawCoqui(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, hop = 0, invincible = 0) {
  ctx.save();
  ctx.translate(x, y - hop);

  // Blink effect when invincible
  if (invincible > 0 && Math.floor(invincible / 4) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, s * 0.9, s * 0.7, s * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  ctx.fillStyle = '#c8f5a0';
  ctx.beginPath();
  ctx.ellipse(0, s * 0.1, s * 0.45, s * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = '#4caf50';
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.52, s * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#43a047';
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.55, s * 0.45, s * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes - white
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-s * 0.2, -s * 0.62, s * 0.18, 0, Math.PI * 2);
  ctx.arc(s * 0.2, -s * 0.62, s * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // Eyes - pupils
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(-s * 0.2, -s * 0.62, s * 0.1, 0, Math.PI * 2);
  ctx.arc(s * 0.2, -s * 0.62, s * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Eyes - shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-s * 0.15, -s * 0.67, s * 0.04, 0, Math.PI * 2);
  ctx.arc(s * 0.25, -s * 0.67, s * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Mouth - smile
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -s * 0.5, s * 0.15, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Back legs
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.ellipse(-s * 0.55, s * 0.5, s * 0.22, s * 0.12, -0.6, 0, Math.PI * 2);
  ctx.ellipse(s * 0.55, s * 0.5, s * 0.22, s * 0.12, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // PR star on belly
  const starX = 0, starY = s * 0.1;
  ctx.fillStyle = '#fff';
  drawStar5(ctx, starX, starY, s * 0.12);

  ctx.restore();
}

function drawStar5(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color?: string) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const b = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
    if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    ctx.lineTo(x + r * 0.4 * Math.cos(b), y + r * 0.4 * Math.sin(b));
  }
  ctx.closePath();
  ctx.fill();
}

function drawIguana(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, hp: number, maxHp: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle * 0.08);

  const ratio = hp / maxHp;
  const g = Math.floor(100 + ratio * 55);
  const bodyColor = `rgb(60,${g},40)`;

  // Tail
  ctx.fillStyle = '#3d5a1e';
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.quadraticCurveTo(s * 0.6, s * 0.8, s * 0.3, s * 1.1);
  ctx.quadraticCurveTo(s * 0.1, s * 0.9, 0, s * 0.3);
  ctx.fill();

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.38, s * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dorsal spikes
  ctx.fillStyle = '#2e4a15';
  for (let i = 0; i < 5; i++) {
    const sy = -s * 0.55 + i * s * 0.2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, sy);
    ctx.lineTo(0, sy - s * 0.18);
    ctx.lineTo(s * 0.08, sy);
    ctx.fill();
  }

  // Head
  ctx.fillStyle = '#5a7a2a';
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.62, s * 0.28, s * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = '#4e6b24';
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.8, s * 0.16, s * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (angry)
  ctx.fillStyle = '#ff4400';
  ctx.beginPath();
  ctx.arc(-s * 0.14, -s * 0.65, s * 0.08, 0, Math.PI * 2);
  ctx.arc(s * 0.14, -s * 0.65, s * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(-s * 0.14, -s * 0.65, s * 0.04, 0, Math.PI * 2);
  ctx.arc(s * 0.14, -s * 0.65, s * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Angry brows
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-s * 0.22, -s * 0.72);
  ctx.lineTo(-s * 0.06, -s * 0.68);
  ctx.moveTo(s * 0.06, -s * 0.68);
  ctx.lineTo(s * 0.22, -s * 0.72);
  ctx.stroke();

  // HP bar
  if (maxHp > 1) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-s * 0.4, s * 0.7, s * 0.8, 6);
    ctx.fillStyle = ratio > 0.5 ? '#4caf50' : ratio > 0.25 ? '#ffb300' : '#f44336';
    ctx.fillRect(-s * 0.4, s * 0.7, s * 0.8 * ratio, 6);
  }

  ctx.restore();
}

function drawMosquito(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  ctx.save();
  ctx.translate(x, y);

  // Wings (animated)
  const wFlap = Math.sin(frame * 0.5) * 0.4;
  ctx.fillStyle = 'rgba(180,220,255,0.6)';
  ctx.beginPath();
  ctx.ellipse(-s * 0.35, -s * 0.1 + wFlap * s, s * 0.3, s * 0.15, -0.4, 0, Math.PI * 2);
  ctx.ellipse(s * 0.35, -s * 0.1 - wFlap * s, s * 0.3, s * 0.15, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.14, s * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(0, -s * 0.42, s * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // Proboscis
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.lineTo(0, -s * 0.85);
  ctx.stroke();

  // Red eyes
  ctx.fillStyle = '#f44336';
  ctx.beginPath();
  ctx.arc(-s * 0.07, -s * 0.44, s * 0.06, 0, Math.PI * 2);
  ctx.arc(s * 0.07, -s * 0.44, s * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Stripe markings
  ctx.fillStyle = '#666';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-s * 0.12, -s * 0.05 + i * s * 0.18, s * 0.24, s * 0.06);
  }

  ctx.restore();
}

function drawBoss(ctx: CanvasRenderingContext2D, e: Enemy, frame: number) {
  const { x, y, size: s } = e;
  ctx.save();
  ctx.translate(x, y);

  const rot = frame * 0.02;

  // Outer storm clouds
  ctx.save();
  ctx.rotate(rot);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const cx = Math.cos(a) * s * 0.75;
    const cy = Math.sin(a) * s * 0.75;
    const cr = s * 0.32 + Math.sin(frame * 0.05 + i) * s * 0.07;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grad.addColorStop(0, 'rgba(150,160,200,0.9)');
    grad.addColorStop(1, 'rgba(80,90,140,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Lightning bolts
  ctx.save();
  ctx.rotate(-rot * 1.5);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + frame * 0.03;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.55);
    ctx.lineTo(s * 0.08, s * 0.7);
    ctx.lineTo(-s * 0.04, s * 0.75);
    ctx.lineTo(s * 0.06, s * 0.92);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Main cloud body
  const grad2 = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s * 0.6);
  grad2.addColorStop(0, '#c8cfe8');
  grad2.addColorStop(0.6, '#8892b8');
  grad2.addColorStop(1, 'rgba(80,90,140,0)');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.3, s * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Angry iris
  ctx.fillStyle = PR_RED;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.07, 0, Math.PI * 2);
  ctx.fill();

  // Eye brows
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-s * 0.32, -s * 0.18);
  ctx.lineTo(-s * 0.1, -s * 0.08);
  ctx.moveTo(s * 0.1, -s * 0.08);
  ctx.lineTo(s * 0.32, -s * 0.18);
  ctx.stroke();

  // Angry mouth
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, s * 0.1, s * 0.18, 0.15, Math.PI - 0.15, true);
  ctx.stroke();

  // HP bar
  const ratio = e.hp / e.maxHp;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(-s * 0.7, s * 0.75, s * 1.4, 10);
  ctx.fillStyle = ratio > 0.5 ? '#f44336' : ratio > 0.25 ? '#ff6d00' : '#ff1744';
  ctx.fillRect(-s * 0.7, s * 0.75, s * 1.4 * ratio, 10);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-s * 0.7, s * 0.75, s * 1.4, 10);

  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, stars: Star[], frame: number) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7);
  sky.addColorStop(0, '#050a1f');
  sky.addColorStop(0.5, '#0a1440');
  sky.addColorStop(1, '#0d1e5a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.7);

  // Ground
  const ground = ctx.createLinearGradient(0, H * 0.7, 0, H);
  ground.addColorStop(0, '#2a1a0a');
  ground.addColorStop(1, '#1a0f05');
  ctx.fillStyle = ground;
  ctx.fillRect(0, H * 0.7, W, H * 0.3);

  // Moon
  ctx.fillStyle = '#fff9e6';
  ctx.beginPath();
  ctx.arc(W - 60, 60, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8dfc0';
  ctx.beginPath();
  ctx.arc(W - 53, 56, 22, 0, Math.PI * 2);
  ctx.fill();

  // Stars
  stars.forEach(s => {
    const alpha = 0.5 + 0.5 * Math.sin(frame * 0.02 + s.twinkle);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // El Morro silhouette
  ctx.fillStyle = '#0d0a08';
  // Main walls
  ctx.fillRect(0, H * 0.78, W * 0.28, H);
  ctx.fillRect(W * 0.7, H * 0.8, W * 0.3, H);
  // Battlements left
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(i * 22, H * 0.72, 12, H * 0.07);
  }
  // Tower
  ctx.fillRect(W * 0.1, H * 0.65, 40, H * 0.15);
  ctx.fillRect(W * 0.1 - 4, H * 0.63, 48, 8);
  // Right battlements
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(W * 0.72 + i * 22, H * 0.75, 12, H * 0.06);
  }

  // Palm trees
  drawPalm(ctx, 60, H * 0.72, 55);
  drawPalm(ctx, W - 55, H * 0.74, 50);
  drawPalm(ctx, W * 0.5, H * 0.71, 45);

  // Ground texture
  ctx.fillStyle = 'rgba(255,180,80,0.05)';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(0, H * 0.7 + i * 12, W, 6);
  }
}

function drawPalm(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  ctx.save();
  ctx.strokeStyle = '#2a1a05';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 10, y - h * 0.5, x + 5, y - h);
  ctx.stroke();

  // Fronds
  ctx.strokeStyle = '#1a3a0a';
  ctx.lineWidth = 3;
  const leafAngles = [-1.0, -0.4, 0.2, 0.7, 1.3, 1.8, -1.6];
  leafAngles.forEach(a => {
    ctx.save();
    ctx.translate(x + 5, y - h);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(15, -5, 30, -2, 40, 10);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

function drawPowerup(ctx: CanvasRenderingContext2D, p: Powerup) {
  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.type === 'piragua') {
    // Snow cone - triangle + scoop
    ctx.fillStyle = '#e0f4ff';
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(-12, -6);
    ctx.lineTo(12, -6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b0d8f0';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Scoop
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(0, -10, 12, 0, Math.PI * 2);
    ctx.fill();
    // Rainbow stripes
    ['#ff4',  '#4f4', '#4ff'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(-10 + i * 7, -18, 5, 8);
    });
  } else if (p.type === 'platano') {
    // Banana
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#cc9900';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#cc9900';
    ctx.fillRect(-3, -10, 6, 6);
  } else {
    // Coco - brown circle
    ctx.fillStyle = '#6b3d1e';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a2810';
    ctx.beginPath();
    ctx.arc(-4, -4, 4, 0, Math.PI * 2);
    ctx.arc(3, -2, 3, 0, Math.PI * 2);
    ctx.arc(0, 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💥', 0, 4);
  }

  ctx.restore();
}

function drawHUD(ctx: CanvasRenderingContext2D, gs: GS) {
  // Top bar background
  const barH = 55;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, barH);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, barH);
  ctx.lineTo(W, barH);
  ctx.stroke();

  // Lives (mini coquíes)
  for (let i = 0; i < gs.player.maxHp; i++) {
    if (i < gs.player.hp) {
      ctx.fillStyle = '#4caf50';
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
    }
    ctx.beginPath();
    ctx.arc(18 + i * 24, 20, 9, 0, Math.PI * 2);
    ctx.fill();
    if (i < gs.player.hp) {
      ctx.fillStyle = '#fff';
      drawStar5(ctx, 18 + i * 24, 20, 5);
    }
  }

  // Score
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(gs.score.toString(), W / 2, 32);

  // Wave badge
  ctx.fillStyle = PR_BLUE;
  ctx.beginPath();
  ctx.roundRect(W - 72, 8, 60, 26, 13);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`OLA ${gs.wave}`, W - 42, 25);

  // Powerup indicator
  if (gs.player.powerup) {
    const ratio = gs.player.powerupTimer / 300;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 36, 38, 72, 14, 7);
    ctx.fill();
    ctx.fillStyle = gs.player.powerup === 'piragua' ? '#4fc3f7' : gs.player.powerup === 'platano' ? '#FFD700' : '#f44336';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 36, 38, 72 * ratio, 14, 7);
    ctx.fill();

    const label = gs.player.powerup === 'piragua' ? 'TURBO' : gs.player.powerup === 'platano' ? 'SPREAD' : 'BOMBA';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, W / 2, 48);
  }
}

// ── Game logic ─────────────────────────────────────────────────────────────
function initStars(): Star[] {
  return Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.65,
    r: Math.random() * 1.5 + 0.3,
    twinkle: Math.random() * Math.PI * 2,
  }));
}

function makePlayer(): Player {
  return {
    x: W / 2, y: PLAYER_Y, vx: 0,
    hp: 3, maxHp: 3,
    invincible: 0, shootTimer: 0,
    powerup: null, powerupTimer: 0,
  };
}

function spawnEnemy(gs: GS) {
  const wave = gs.wave;
  let type: EnemyType;
  let hp = 1;
  let size = 22;
  let vy = 1.2 + wave * 0.15;
  let vx = 0;

  if (wave >= 10 && gs.spawnedCount === 0 && gs.enemies.length === 0) {
    // Boss wave
    type = 'boss';
    hp = 30 + wave * 5;
    size = 52;
    vy = 0.6;
  } else if (wave >= 4 && Math.random() < 0.35) {
    type = 'mosquito';
    hp = 1;
    size = 16;
    vy = 2 + wave * 0.2;
    vx = (Math.random() - 0.5) * 3;
  } else {
    type = 'iguana';
    hp = wave >= 6 ? 2 : 1;
    size = 24;
    vy = 1.0 + wave * 0.12;
    if (wave >= 3) vx = (Math.random() - 0.5) * 2;
  }

  gs.enemies.push({
    x: size + Math.random() * (W - size * 2),
    y: -size * 1.5,
    vx, vy, type, hp, maxHp: hp, size,
    shootTimer: type === 'boss' ? 60 : (type === 'iguana' && wave >= 5) ? 90 + Math.random() * 60 : Infinity,
    angle: 0, phase: Math.random() * Math.PI * 2,
    id: gs.eid++,
  });
  gs.spawnedCount++;
}

function spawnParticles(gs: GS, x: number, y: number, count: number, color: string) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = Math.random() * 4 + 1;
    gs.particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 30 + Math.random() * 30,
      maxLife: 60,
      color, size: Math.random() * 4 + 2,
    });
  }
}

function firePlayerBullets(gs: GS) {
  const p = gs.player;
  const spreadShot = p.powerup === 'platano';
  const rapid = p.powerup === 'piragua';
  const interval = rapid ? 6 : SHOOT_INTERVAL;

  if (p.shootTimer <= 0) {
    if (spreadShot) {
      [-3, 0, 3].forEach(dx => {
        gs.bullets.push({ x: p.x + dx * 10, y: p.y - 20, vx: dx * 0.8, vy: -BULLET_SPEED, isEnemy: false, size: 6 });
      });
    } else {
      gs.bullets.push({ x: p.x, y: p.y - 20, vx: 0, vy: -BULLET_SPEED, isEnemy: false, size: 7 });
    }
    p.shootTimer = interval;
  }
}

function updateGame(gs: GS) {
  const p = gs.player;
  gs.frame++;

  // Player movement
  const moveLeft = gs.keys.has('ArrowLeft') || gs.keys.has('a') || gs.keys.has('A') || gs.touchLeft;
  const moveRight = gs.keys.has('ArrowRight') || gs.keys.has('d') || gs.keys.has('D') || gs.touchRight;

  if (moveLeft) p.vx = -PLAYER_SPEED;
  else if (moveRight) p.vx = PLAYER_SPEED;
  else p.vx *= 0.7;

  p.x = Math.max(24, Math.min(W - 24, p.x + p.vx));
  if (p.invincible > 0) p.invincible--;
  if (p.shootTimer > 0) p.shootTimer--;
  if (p.powerupTimer > 0) {
    p.powerupTimer--;
    if (p.powerupTimer <= 0) p.powerup = null;
  }

  // Shoot
  firePlayerBullets(gs);

  // Update bullets
  gs.bullets = gs.bullets.filter(b => {
    b.x += b.vx;
    b.y += b.vy;
    return b.y > -10 && b.y < H + 10 && b.x > -10 && b.x < W + 10;
  });

  // Update enemies
  const bossPresent = gs.enemies.some(e => e.type === 'boss');
  gs.enemies.forEach(e => {
    e.angle += 1;
    e.phase += 0.03;

    if (e.type === 'boss') {
      // Boss hovers and moves horizontally
      const targetX = W / 2 + Math.sin(gs.frame * 0.008) * (W * 0.3);
      const targetY = 180;
      e.x += (targetX - e.x) * 0.015;
      e.y += (targetY - e.y) * 0.02;

      // Boss shoots 4-directional
      if (e.shootTimer > 0) e.shootTimer--;
      if (e.shootTimer <= 0) {
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + gs.frame * 0.05;
          gs.bullets.push({ x: e.x, y: e.y, vx: Math.cos(a) * 3.5, vy: Math.sin(a) * 3.5, isEnemy: true, size: 8 });
        }
        e.shootTimer = Math.max(30, 80 - gs.wave * 2);
      }
    } else if (e.type === 'mosquito') {
      // Zigzag
      e.vx = Math.sin(e.phase * 2.5) * 3;
      e.x += e.vx;
      e.y += e.vy;
    } else {
      // Iguana - drift then dive
      e.x += Math.sin(e.phase) * 1.2 + e.vx;
      e.y += e.vy;
      if (e.x < e.size) e.vx = Math.abs(e.vx);
      if (e.x > W - e.size) e.vx = -Math.abs(e.vx);

      // Iguana shoots at player (higher waves)
      if (e.shootTimer !== Infinity) {
        if (e.shootTimer > 0) e.shootTimer--;
        if (e.shootTimer <= 0) {
          const dx = p.x - e.x;
          const dy = p.y - e.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          gs.bullets.push({ x: e.x, y: e.y, vx: (dx / dist) * 3, vy: (dy / dist) * 3, isEnemy: true, size: 6 });
          e.shootTimer = 80 + Math.random() * 60;
        }
      }
    }
  });

  // Bullet-enemy collisions
  const bulletsToRemove = new Set<number>();
  const enemiesToKill: number[] = [];

  gs.bullets.forEach((b, bi) => {
    if (b.isEnemy) return;
    gs.enemies.forEach((e, ei) => {
      const dx = b.x - e.x;
      const dy = b.y - e.y;
      if (Math.sqrt(dx * dx + dy * dy) < e.size) {
        bulletsToRemove.add(bi);
        e.hp--;
        spawnParticles(gs, b.x, b.y, 3, e.type === 'boss' ? '#ff8800' : '#4caf50');
        if (e.hp <= 0) {
          enemiesToKill.push(ei);
        }
      }
    });
  });

  enemiesToKill.sort((a, b) => b - a).forEach(i => {
    const e = gs.enemies[i];
    const pts = e.type === 'boss' ? 500 : e.type === 'mosquito' ? 30 : 10 * gs.wave;
    gs.score += pts;
    spawnParticles(gs, e.x, e.y, e.type === 'boss' ? 50 : 15, e.type === 'boss' ? '#FFD700' : '#ff5722');
    // Drop powerup
    if (Math.random() < (e.type === 'boss' ? 1.0 : 0.12)) {
      const types: PowerupType[] = ['piragua', 'platano', 'coco'];
      gs.powerups.push({ x: e.x, y: e.y, vy: 2, type: types[Math.floor(Math.random() * types.length)] });
    }
    gs.enemies.splice(i, 1);
  });

  gs.bullets = gs.bullets.filter((_, i) => !bulletsToRemove.has(i));

  // Enemy-player collisions
  if (p.invincible <= 0) {
    gs.enemies.forEach(e => {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < e.size + 18) {
        p.hp--;
        p.invincible = 90;
        spawnParticles(gs, p.x, p.y, 20, '#fff');
        if (p.hp <= 0) {
          gs.phase = 'gameover';
          gs.highScore = Math.max(gs.highScore, gs.score);
        }
      }
    });

    // Enemy bullet-player collision
    gs.bullets.forEach((b, bi) => {
      if (!b.isEnemy) return;
      const dx = b.x - p.x;
      const dy = b.y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < 18) {
        p.hp--;
        p.invincible = 90;
        bulletsToRemove.add(bi);
        spawnParticles(gs, p.x, p.y, 15, PR_RED);
        if (p.hp <= 0) {
          gs.phase = 'gameover';
          gs.highScore = Math.max(gs.highScore, gs.score);
        }
      }
    });
  }

  // Remove enemies that escape
  gs.enemies = gs.enemies.filter(e => {
    if (e.y > H + e.size * 2 && e.type !== 'boss') {
      if (p.invincible <= 0) {
        p.hp--;
        p.invincible = 60;
        if (p.hp <= 0) {
          gs.phase = 'gameover';
          gs.highScore = Math.max(gs.highScore, gs.score);
        }
      }
      return false;
    }
    return true;
  });

  // Powerup collection
  gs.powerups = gs.powerups.filter(pu => {
    pu.y += pu.vy;
    if (pu.y > H + 20) return false;
    const dx = pu.x - p.x;
    const dy = pu.y - p.y;
    if (Math.sqrt(dx * dx + dy * dy) < 30) {
      if (pu.type === 'coco') {
        // Screen clear
        gs.enemies.forEach(e => {
          gs.score += e.type === 'boss' ? 200 : 10;
          spawnParticles(gs, e.x, e.y, 12, '#FFD700');
        });
        gs.enemies = [];
        gs.bullets = gs.bullets.filter(b => !b.isEnemy);
        spawnParticles(gs, W / 2, H / 2, 80, '#FFD700');
      } else {
        p.powerup = pu.type;
        p.powerupTimer = 300;
      }
      return false;
    }
    return true;
  });

  // Particles
  gs.particles = gs.particles.filter(pt => {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vy += 0.08;
    pt.life--;
    return pt.life > 0;
  });

  // Wave spawning
  const totalInWave = gs.totalInWave;
  const isBossWave = gs.wave % 5 === 0 && gs.wave > 0;

  if (gs.spawnedCount < totalInWave && !bossPresent) {
    gs.spawnTimer--;
    if (gs.spawnTimer <= 0) {
      spawnEnemy(gs);
      gs.spawnTimer = Math.max(30, 80 - gs.wave * 5);
    }
  }

  // Check wave clear
  const allSpawned = gs.spawnedCount >= totalInWave;
  if (allSpawned && gs.enemies.length === 0 && gs.phase === 'playing') {
    gs.phase = 'waveclear';
    gs.waveTimer = 90;
  }
}

function updateWaveClear(gs: GS) {
  gs.frame++;
  // Update particles
  gs.particles = gs.particles.filter(pt => {
    pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.08; pt.life--;
    return pt.life > 0;
  });
  gs.waveTimer--;
  if (gs.waveTimer <= 0) {
    gs.wave++;
    gs.phase = 'playing';
    gs.spawnTimer = 60;
    gs.spawnedCount = 0;
    const isBoss = gs.wave % 5 === 0;
    gs.totalInWave = isBoss ? 1 : Math.min(5 + gs.wave * 2, 30);
    // Restore 1 HP between waves
    if (gs.player.hp < gs.player.maxHp) gs.player.hp++;
  }
}

function drawGame(ctx: CanvasRenderingContext2D, gs: GS) {
  ctx.clearRect(0, 0, W, H);
  drawBackground(ctx, gs.stars, gs.frame);

  // Powerups
  gs.powerups.forEach(p => drawPowerup(ctx, p));

  // Enemy bullets
  gs.bullets.filter(b => b.isEnemy).forEach(b => {
    ctx.fillStyle = PR_RED;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,150,150,0.5)';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player bullets
  gs.bullets.filter(b => !b.isEnemy).forEach(b => {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.fillStyle = '#FFD700';
    drawStar5(ctx, 0, 0, b.size);
    ctx.restore();
  });

  // Enemies
  gs.enemies.forEach(e => {
    if (e.type === 'boss') drawBoss(ctx, e, gs.frame);
    else if (e.type === 'mosquito') drawMosquito(ctx, e.x, e.y, e.size, gs.frame);
    else drawIguana(ctx, e.x, e.y, e.size, e.hp, e.maxHp, e.angle);
  });

  // Player
  const hop = Math.abs(gs.player.vx) > 0.5 ? Math.sin(gs.frame * 0.3) * 3 : 0;
  drawCoqui(ctx, gs.player.x, gs.player.y, 22, hop, gs.player.invincible);

  // Particles
  gs.particles.forEach(pt => {
    const a = pt.life / pt.maxLife;
    ctx.globalAlpha = a;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * a, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  drawHUD(ctx, gs);

  // Wave clear overlay
  if (gs.phase === 'waveclear') {
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = PR_BLUE;
    ctx.beginPath();
    ctx.roundRect(W / 2 - 130, H / 2 - 55, 260, 110, 20);
    ctx.fill();

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`OLA ${gs.wave} COMPLETADA!`, W / 2, H / 2 - 8);
    ctx.fillStyle = '#fff';
    ctx.font = '18px sans-serif';
    ctx.fillText('Siguiente ola...', W / 2, H / 2 + 28);
  }
}

// ── React Component ────────────────────────────────────────────────────────
export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS | null>(null);
  const rafRef = useRef<number>(0);
  const [phase, setPhase] = useState<Phase>('title');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const initGS = useCallback((): GS => ({
    phase: 'playing',
    score: 0, lives: 3, wave: 1, highScore: gsRef.current?.highScore ?? 0,
    player: makePlayer(),
    bullets: [], enemies: [], particles: [], powerups: [],
    stars: initStars(),
    spawnTimer: 60, spawnedCount: 0, totalInWave: 7, waveTimer: 0,
    frame: 0, eid: 0,
    keys: new Set(),
    touchLeft: false, touchRight: false,
  }), []);

  const startGame = useCallback(() => {
    const gs = initGS();
    gsRef.current = gs;
    setPhase('playing');
    setScore(0);
  }, [initGS]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const gs = gsRef.current;
      if (!gs) return;
      if (down) gs.keys.add(e.key);
      else gs.keys.delete(e.key);
    };
    const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false);

    const onTouch = (e: TouchEvent) => {
      const gs = gsRef.current;
      if (!gs || gs.phase !== 'playing') return;
      e.preventDefault();
      let left = false, right = false;
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        if (t.clientX < canvas.getBoundingClientRect().width / 2) left = true;
        else right = true;
      }
      gs.touchLeft = left;
      gs.touchRight = right;
    };
    const onTouchEnd = () => {
      const gs = gsRef.current;
      if (gs) { gs.touchLeft = false; gs.touchRight = false; }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('touchmove', onTouch, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);

    const loop = () => {
      const gs = gsRef.current;
      if (gs) {
        if (gs.phase === 'playing') updateGame(gs);
        else if (gs.phase === 'waveclear') updateWaveClear(gs);

        if (gs.phase === 'playing' || gs.phase === 'waveclear') {
          drawGame(ctx, gs);
        }

        if (gs.phase !== phase) setPhase(gs.phase);
        if (gs.score !== score) setScore(gs.score);
        if (gs.highScore !== highScore) setHighScore(gs.highScore);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showOverlay = phase === 'title' || phase === 'gameover';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      touchAction: 'none', userSelect: 'none',
    }}>
      <div style={{ position: 'relative', width: W, height: H, flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          width={W} height={H}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        {/* Title Screen */}
        {phase === 'title' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #050a1f 0%, #0a1a50 60%, #1a0a10 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 0,
          }}>
            {/* Stars */}
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                borderRadius: '50%',
                background: '#fff',
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
              }} />
            ))}

            {/* PR Flag stripe */}
            <div style={{ width: '100%', height: 8, background: PR_RED, position: 'absolute', top: '20%' }} />
            <div style={{ width: '100%', height: 8, background: '#fff', position: 'absolute', top: 'calc(20% + 10px)' }} />
            <div style={{ width: '100%', height: 8, background: PR_RED, position: 'absolute', top: 'calc(20% + 20px)' }} />

            <div style={{ textAlign: 'center', zIndex: 10, padding: '0 20px' }}>
              <div style={{ fontSize: 14, color: '#FFD700', letterSpacing: 6, marginBottom: 8, fontWeight: 600 }}>
                BORICUA GAMES
              </div>
              <div style={{
                fontSize: 52, fontWeight: 900,
                color: '#fff',
                textShadow: '0 0 30px rgba(206,17,38,0.8), 0 4px 0 #CE1126',
                lineHeight: 1, marginBottom: 4,
                fontFamily: 'sans-serif',
              }}>
                EL COQUÍ
              </div>
              <div style={{
                fontSize: 36, fontWeight: 800,
                color: '#FFD700',
                textShadow: '0 0 20px rgba(255,215,0,0.6), 0 3px 0 #cc8800',
                marginBottom: 24,
                fontFamily: 'sans-serif',
              }}>
                REY
              </div>

              <div style={{
                width: 80, height: 80,
                background: '#4caf50',
                borderRadius: '50%',
                margin: '0 auto 28px',
                border: '4px solid #FFD700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44,
                boxShadow: '0 0 30px rgba(76,175,80,0.8)',
              }}>
                🐸
              </div>

              <button
                onClick={startGame}
                style={{
                  padding: '16px 48px',
                  fontSize: 22, fontWeight: 800,
                  background: `linear-gradient(135deg, ${PR_RED}, #ff1744)`,
                  color: '#fff',
                  border: 'none', borderRadius: 50,
                  cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(206,17,38,0.6)',
                  letterSpacing: 2,
                  fontFamily: 'sans-serif',
                  marginBottom: 20,
                  transition: 'transform 0.1s',
                }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                ¡JUGAR!
              </button>

              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>
                ← → Mover &nbsp;|&nbsp; Disparo automático
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                Toca izquierda/derecha en móvil
              </div>
            </div>

            {/* Bottom decoration */}
            <div style={{ position: 'absolute', bottom: 40, display: 'flex', gap: 20, fontSize: 24 }}>
              <span>🌴</span><span>🏖️</span><span>⭐</span><span>🌴</span>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {phase === 'gameover' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>💀</div>
            <div style={{
              fontSize: 40, fontWeight: 900, color: PR_RED,
              textShadow: '0 0 20px rgba(206,17,38,0.6)',
              fontFamily: 'sans-serif',
            }}>
              GAME OVER
            </div>
            <div style={{
              background: 'rgba(0,45,98,0.8)',
              border: `2px solid ${PR_BLUE}`,
              borderRadius: 20, padding: '20px 40px',
              textAlign: 'center',
            }}>
              <div style={{ color: '#aaa', fontSize: 14, letterSpacing: 2 }}>PUNTUACIÓN</div>
              <div style={{ color: '#FFD700', fontSize: 44, fontWeight: 900, fontFamily: 'sans-serif' }}>
                {gsRef.current?.score ?? 0}
              </div>
              <div style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>
                RÉCORD: <span style={{ color: '#FFD700' }}>{gsRef.current?.highScore ?? 0}</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
                OLA {gsRef.current?.wave ?? 1}
              </div>
            </div>

            <button
              onClick={startGame}
              style={{
                padding: '14px 44px',
                fontSize: 20, fontWeight: 800,
                background: `linear-gradient(135deg, ${PR_BLUE}, #0052cc)`,
                color: '#fff',
                border: 'none', borderRadius: 50,
                cursor: 'pointer',
                boxShadow: `0 6px 20px rgba(0,45,98,0.6)`,
                letterSpacing: 2,
                fontFamily: 'sans-serif',
                marginTop: 8,
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              REINTENTAR
            </button>

            <a href="/" style={{
              color: 'rgba(255,255,255,0.4)', fontSize: 13,
              textDecoration: 'none', marginTop: 8,
            }}>
              ← Volver
            </a>
          </div>
        )}

        {/* Touch controls hint */}
        {phase === 'playing' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 60, display: 'flex', pointerEvents: 'none',
            opacity: 0.15,
          }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: '0 0 0 10px' }} />
            <div style={{ width: 2, background: 'transparent' }} />
            <div style={{ flex: 1, background: '#fff', borderRadius: '0 0 10px 0' }} />
          </div>
        )}
      </div>
    </div>
  );
}
