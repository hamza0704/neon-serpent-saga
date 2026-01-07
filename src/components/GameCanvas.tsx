import { useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface GameCanvasProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  cellCount: number;
  gameOver: boolean;
}

const GameCanvas = ({ snake, food, gridSize, cellCount, gameOver }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = gridSize * cellCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(240, 20%, 4%)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = 'hsl(240, 20%, 12%)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= cellCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvasSize, i * gridSize);
      ctx.stroke();
    }

    // Draw snake with glow effect
    snake.forEach((segment, index) => {
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;
      const isHead = index === 0;
      
      // Glow effect
      ctx.shadowColor = 'hsl(180, 100%, 50%)';
      ctx.shadowBlur = isHead ? 20 : 10;

      // Snake body gradient
      const gradient = ctx.createRadialGradient(
        x + gridSize / 2, y + gridSize / 2, 0,
        x + gridSize / 2, y + gridSize / 2, gridSize / 2
      );
      
      if (isHead) {
        gradient.addColorStop(0, 'hsl(180, 100%, 70%)');
        gradient.addColorStop(1, 'hsl(180, 100%, 50%)');
      } else {
        const fadeRatio = 1 - (index / snake.length) * 0.3;
        gradient.addColorStop(0, `hsl(180, 100%, ${60 * fadeRatio}%)`);
        gradient.addColorStop(1, `hsl(180, 100%, ${40 * fadeRatio}%)`);
      }

      ctx.fillStyle = gradient;
      
      // Rounded rectangle for each segment
      const padding = 2;
      const radius = 4;
      ctx.beginPath();
      ctx.roundRect(x + padding, y + padding, gridSize - padding * 2, gridSize - padding * 2, radius);
      ctx.fill();

      // Head details (eyes)
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'hsl(240, 20%, 4%)';
        const eyeSize = 3;
        const eyeOffset = 5;
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y + gridSize / 2 - 2, eyeSize, 0, Math.PI * 2);
        ctx.arc(x + eyeOffset, y + gridSize / 2 + 2, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food with pulsing glow
    const foodX = food.x * gridSize;
    const foodY = food.y * gridSize;
    
    ctx.shadowColor = 'hsl(320, 100%, 60%)';
    ctx.shadowBlur = 25;

    const foodGradient = ctx.createRadialGradient(
      foodX + gridSize / 2, foodY + gridSize / 2, 0,
      foodX + gridSize / 2, foodY + gridSize / 2, gridSize / 2
    );
    foodGradient.addColorStop(0, 'hsl(320, 100%, 80%)');
    foodGradient.addColorStop(0.5, 'hsl(320, 100%, 60%)');
    foodGradient.addColorStop(1, 'hsl(320, 100%, 40%)');

    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 2, foodY + gridSize / 2, (gridSize - 4) / 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner glow
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'hsl(320, 100%, 90%)';
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 2 - 2, foodY + gridSize / 2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Game over overlay
    if (gameOver) {
      ctx.fillStyle = 'hsla(240, 20%, 4%, 0.85)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
  }, [snake, food, gridSize, cellCount, canvasSize, gameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="rounded-lg arcade-glow-cyan"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
