import React, { useRef, useEffect, useState } from 'react';
import { Destination } from '../../types/game';
import { soundManager } from '../../services/sound';
import { RotateCcw, Award, ChevronUp, ChevronDown, Play, Sparkles } from 'lucide-react';

interface Props {
  destination: Destination;
  onFinish: (scoreEarned: number, reachedCheckpoint: boolean) => void;
  onBack: () => void;
  onPlanHoliday: (destinationId: string) => void;
}

interface Item {
  x: number;
  y: number;
  type: 'star' | 'luggage' | 'cloud' | 'bird';
  size: number;
  speed: number;
  collected?: boolean;
}

export const FlyWithMuseGame: React.FC<Props> = ({
  destination,
  onFinish,
  onBack,
  onPlanHoliday,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'CRASHED' | 'VICTORY'>('READY');
  const [score, setScore] = useState(0);
  const [starsCount, setStarsCount] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [health, setHealth] = useState(3);

  // Plane physics
  const planeRef = useRef({
    y: 150,
    vy: 0,
    targetY: 150,
  });

  const targetDistance = 1000; // 1000 km journey
  const itemsRef = useRef<Item[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        planeRef.current.targetY = Math.max(30, planeRef.current.targetY - 35);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        planeRef.current.targetY = Math.min(270, planeRef.current.targetY + 35);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const moveUp = () => {
    soundManager.playClick();
    planeRef.current.targetY = Math.max(30, planeRef.current.targetY - 45);
  };

  const moveDown = () => {
    soundManager.playClick();
    planeRef.current.targetY = Math.min(270, planeRef.current.targetY + 45);
  };

  const startGame = () => {
    soundManager.playClick();
    setScore(0);
    setStarsCount(0);
    setDistanceKm(0);
    setHealth(3);
    planeRef.current.y = 150;
    planeRef.current.targetY = 150;
    itemsRef.current = [];
    setGameState('PLAYING');
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localDistance = 0;
    let localScore = 0;
    let localStars = 0;
    let localHealth = 3;
    let spawnTimer = 0;

    const gameLoop = () => {
      // Clear canvas with sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#1e3a8a'); // Royal blue
      skyGradient.addColorStop(0.6, '#38bdf8'); // Sky blue
      skyGradient.addColorStop(1, '#bae6fd'); // Tropical horizon
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background drifting cloud waves
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 4; i++) {
        const cx = ((localDistance * 1.5 + i * 140) % (canvas.width + 100)) - 50;
        ctx.beginPath();
        ctx.arc(cx, 40 + i * 60, 35, 0, Math.PI * 2);
        ctx.arc(cx + 25, 35 + i * 60, 45, 0, Math.PI * 2);
        ctx.arc(cx + 50, 40 + i * 60, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      // Smooth plane movement
      planeRef.current.y += (planeRef.current.targetY - planeRef.current.y) * 0.15;
      const planeX = 70;
      const planeY = planeRef.current.y;

      // Draw Plane (Posch Holidays Flight with Muse)
      ctx.save();
      ctx.translate(planeX, planeY);

      // Plane Body (Streamlined Royal Blue & Golden Wing)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wing (Golden yellow)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(8, 14);
      ctx.lineTo(16, 14);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      // Tail Fin (Royal blue with gold tip)
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-24, -14);
      ctx.lineTo(-17, -14);
      ctx.lineTo(-12, 0);
      ctx.closePath();
      ctx.fill();

      // Cockpit Window (Cyan glass with aviator mascot outline)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(10, -3, 5, 0, Math.PI * 2);
      ctx.fill();

      // Spinning Propeller
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.5;
      const propAngle = (Date.now() / 30) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(25, -Math.sin(propAngle) * 12);
      ctx.lineTo(25, Math.sin(propAngle) * 12);
      ctx.stroke();

      ctx.restore();

      // Spawn items
      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        const rand = Math.random();
        const yPos = 40 + Math.random() * (canvas.height - 80);
        if (rand < 0.45) {
          itemsRef.current.push({ x: canvas.width + 20, y: yPos, type: 'star', size: 14, speed: 4 });
        } else if (rand < 0.65) {
          itemsRef.current.push({ x: canvas.width + 20, y: yPos, type: 'luggage', size: 18, speed: 4 });
        } else if (rand < 0.85) {
          itemsRef.current.push({ x: canvas.width + 20, y: yPos, type: 'cloud', size: 28, speed: 3.5 });
        } else {
          itemsRef.current.push({ x: canvas.width + 20, y: yPos, type: 'bird', size: 16, speed: 5 });
        }
      }

      // Update & Render items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.x -= item.speed;

        // Draw item
        if (item.type === 'star') {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText('★', item.x - 4, item.y + 4);
          ctx.shadowBlur = 0;
        } else if (item.type === 'luggage') {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(item.x - 10, item.y - 8, 20, 16);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(item.x - 10, item.y - 8, 20, 16);
        } else if (item.type === 'cloud') {
          // Storm cloud
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
          ctx.arc(item.x + 12, item.y - 6, item.size * 0.8, 0, Math.PI * 2);
          ctx.arc(item.x - 12, item.y + 4, item.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'bird') {
          ctx.fillStyle = '#1e293b';
          ctx.font = '16px sans-serif';
          ctx.fillText('🦅', item.x - 8, item.y + 6);
        }

        // Collision Check
        const dist = Math.hypot(planeX - item.x, planeY - item.y);
        if (dist < 28 && !item.collected) {
          item.collected = true;
          if (item.type === 'star') {
            soundManager.playCollectStar();
            localScore += 15;
            localStars += 1;
            setScore(localScore);
            setStarsCount(localStars);
          } else if (item.type === 'luggage') {
            soundManager.playCollectStar();
            localScore += 30;
            setScore(localScore);
          } else {
            // Hit obstacle
            soundManager.playError();
            localHealth -= 1;
            setHealth(localHealth);
            if (localHealth <= 0) {
              setGameState('CRASHED');
              onFinish(localScore, false);
              return;
            }
          }
          itemsRef.current.splice(i, 1);
          continue;
        }

        // Remove off-screen items
        if (item.x < -40) {
          itemsRef.current.splice(i, 1);
        }
      }

      // Progress distance
      localDistance += 2.5;
      setDistanceKm(Math.min(targetDistance, Math.round(localDistance)));

      if (localDistance >= targetDistance) {
        soundManager.playVictory();
        localScore += 100; // Checkpoint arrival bonus
        setScore(localScore);
        setGameState('VICTORY');
        onFinish(localScore, true);
        return;
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, onFinish]);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden my-4">
      {/* HUD Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-sky-950 p-4 text-white">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-amber-400">Game C · Fly with Muse</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold tabular-nums">Score: {score}</span>
            <button
              onClick={onBack}
              className="text-xs text-blue-200 hover:text-white px-2 py-0.5 rounded bg-blue-800/60"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Distance Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-blue-200">
            <span>Flight to {destination.name}</span>
            <span className="font-semibold text-amber-300 tabular-nums">
              {distanceKm} / {targetDistance} km
            </span>
          </div>
          <div className="w-full h-2 bg-blue-950/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-200"
              style={{ width: `${(distanceKm / targetDistance) * 100}%` }}
            />
          </div>
        </div>

        {/* Health Hearts */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex gap-1 items-center">
            <span className="text-[11px] text-blue-300 mr-1">Aircraft Shield:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="text-sm">
                {i < health ? '❤️' : '🤍'}
              </span>
            ))}
          </div>
          <span className="text-amber-300 text-xs font-medium">★ {starsCount} Stars</span>
        </div>
      </div>

      {/* Arcade Canvas */}
      <div className="relative w-full h-[300px] bg-sky-300 overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={450}
          height={300}
          className="w-full h-full block touch-none"
        />

        {/* READY STATE OVERLAY */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-1">Fly with Muse</h3>
            <p className="text-xs text-blue-200 mb-4 max-w-xs">
              Steer your flight toward {destination.name}! Collect golden stars and baggage while dodging storm clouds and turbulence.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:brightness-105 active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Take Off Now
            </button>
            <span className="text-[10px] text-blue-300 mt-3">Use Up/Down buttons or Arrow Keys</span>
          </div>
        )}

        {/* CRASHED OVERLAY */}
        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="text-xl font-bold mb-1">Turbulence Encountered!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Your flight reached {distanceKm} km and collected {starsCount} stars!
            </p>
            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="py-2.5 px-5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-105 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Try Flight Again
              </button>
              <button
                onClick={onBack}
                className="py-2.5 px-5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700"
              >
                Back to Quest
              </button>
            </div>
          </div>
        )}

        {/* VICTORY OVERLAY */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-blue-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mb-3 shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-1">Smooth Landing at {destination.name}!</h3>
            <p className="text-xs text-emerald-200 mb-4">
              Checkpoint reached! Final score: <strong className="text-amber-300 text-sm tabular-nums">+{score} pts</strong>
            </p>
            <div className="w-full max-w-xs space-y-2">
              <button
                onClick={() => onPlanHoliday(destination.id)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-105"
              >
                Plan Your Real {destination.name} Holiday
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-800 text-white font-semibold text-xs hover:bg-blue-700"
              >
                Return to Quest
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls for Steering */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Flight Controls:</span> Tap buttons to climb or descend.
          </div>
          <div className="flex gap-2">
            <button
              onClick={moveUp}
              disabled={gameState !== 'PLAYING'}
              className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center active:scale-90 transition shadow hover:bg-blue-800 disabled:opacity-40"
              aria-label="Climb Aircraft"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <button
              onClick={moveDown}
              disabled={gameState !== 'PLAYING'}
              className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center active:scale-90 transition shadow hover:bg-blue-800 disabled:opacity-40"
              aria-label="Descend Aircraft"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
