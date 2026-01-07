import { useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface LevelGameCanvasProps {
  snake: Position[];
  food: Position;
  obstacles: Position[];
  gridSize: number;
  cellCount: number;
  gameOver: boolean;
  levelComplete: boolean;
}

const LevelGameCanvas = ({ 
  snake, 
  food, 
  obstacles, 
  gridSize, 
  cellCount, 
  gameOver, 
  levelComplete 
}: LevelGameCanvasProps) => {
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

    // Draw obstacles with orange/red glow
    obstacles.forEach(obstacle => {
      const x = obstacle.x * gridSize;
      const y = obstacle.y * gridSize;

      ctx.shadowColor = 'hsl(30, 100%, 50%)';
      ctx.shadowBlur = 15;

      const obstacleGradient = ctx.createRadialGradient(
        x + gridSize / 2, y + gridSize / 2, 0,
        x + gridSize / 2, y + gridSize / 2, gridSize / 2
      );
      obstacleGradient.addColorStop(0, 'hsl(30, 100%, 60%)');
      obstacleGradient.addColorStop(0.5, 'hsl(20, 100%, 50%)');
      obstacleGradient.addColorStop(1, 'hsl(0, 80%, 40%)');

      ctx.fillStyle = obstacleGradient;
      
      // Draw X shape for obstacle
      const padding = 3;
      ctx.beginPath();
      ctx.moveTo(x + padding, y + padding);
      ctx.lineTo(x + gridSize - padding, y + gridSize - padding);
      ctx.moveTo(x + gridSize - padding, y + padding);
      ctx.lineTo(x + padding, y + gridSize - padding);
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'hsl(30, 100%, 50%)';
      ctx.stroke();

      // Draw obstacle block
      ctx.fillStyle = obstacleGradient;
      ctx.beginPath();
      ctx.roundRect(x + padding, y + padding, gridSize - padding * 2, gridSize - padding * 2, 3);
      ctx.fill();
    });

    ctx.shadowBlur = 0;

    // Draw snake with green glow for level mode
    snake.forEach((segment, index) => {
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;
      const isHead = index === 0;

      ctx.shadowColor = 'hsl(120, 100%, 50%)';
      ctx.shadowBlur = isHead ? 20 : 10;

      const gradient = ctx.createRadialGradient(
        x + gridSize / 2, y + gridSize / 2, 0,
        x + gridSize / 2, y + gridSize / 2, gridSize / 2
      );

      if (isHead) {
        gradient.addColorStop(0, 'hsl(120, 100%, 70%)');
        gradient.addColorStop(1, 'hsl(120, 100%, 50%)');
      } else {
        const fadeRatio = 1 - (index / snake.length) * 0.3;
        gradient.addColorStop(0, `hsl(120, 100%, ${60 * fadeRatio}%)`);
        gradient.addColorStop(1, `hsl(120, 100%, ${40 * fadeRatio}%)`);
      }

      ctx.fillStyle = gradient;
      const padding = 2;
      const radius = 4;
      ctx.beginPath();
      ctx.roundRect(x + padding, y + padding, gridSize - padding * 2, gridSize - padding * 2, radius);
      ctx.fill();

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

    // Draw food with yellow glow
    const foodX = food.x * gridSize;
    const foodY = food.y * gridSize;

    ctx.shadowColor = 'hsl(60, 100%, 50%)';
    ctx.shadowBlur = 25;

    const foodGradient = ctx.createRadialGradient(
      foodX + gridSize / 2, foodY + gridSize / 2, 0,
      foodX + gridSize / 2, foodY + gridSize / 2, gridSize / 2
    );
    foodGradient.addColorStop(0, 'hsl(60, 100%, 80%)');
    foodGradient.addColorStop(0.5, 'hsl(60, 100%, 60%)');
    foodGradient.addColorStop(1, 'hsl(50, 100%, 40%)');

    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 2, foodY + gridSize / 2, (gridSize - 4) / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'hsl(60, 100%, 90%)';
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 2 - 2, foodY + gridSize / 2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Overlay for game over or level complete
    if (gameOver || levelComplete) {
      ctx.fillStyle = 'hsla(240, 20%, 4%, 0.85)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
  }, [snake, food, obstacles, gridSize, cellCount, canvasSize, gameOver, levelComplete]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="rounded-lg"
      style={{ 
        imageRendering: 'pixelated',
        boxShadow: '0 0 20px hsl(120 100% 50% / 0.5), 0 0 40px hsl(120 100% 50% / 0.3)'
      }}
    />
  );
};

export default LevelGameCanvas;
