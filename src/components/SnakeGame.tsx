import { useSnakeGame } from '@/hooks/useSnakeGame';
import GameCanvas from './GameCanvas';
import ScoreDisplay from './ScoreDisplay';
import GameOverlay from './GameOverlay';

const SnakeGame = () => {
  const {
    snake,
    food,
    score,
    highScore,
    gameOver,
    isPlaying,
    isPaused,
    gridSize,
    cellCount,
    speed,
    startGame,
    togglePause,
    restartGame,
  } = useSnakeGame();

  return (
    <div className="flex flex-col items-center">
      <ScoreDisplay score={score} highScore={highScore} speed={speed} />
      
      <div className="relative">
        <GameCanvas
          snake={snake}
          food={food}
          gridSize={gridSize}
          cellCount={cellCount}
          gameOver={gameOver}
        />
        
        <GameOverlay
          isPlaying={isPlaying}
          isPaused={isPaused}
          gameOver={gameOver}
          score={score}
          highScore={highScore}
          onStart={startGame}
          onResume={togglePause}
          onRestart={restartGame}
        />
        
        {/* Scanline effect overlay */}
        <div className="scanlines rounded-lg" />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          ↑ ↓ ← → or WASD to move • SPACE to pause
        </p>
      </div>
    </div>
  );
};

export default SnakeGame;
