import { Button } from '@/components/ui/button';

interface LevelConfig {
  level: number;
  speed: number;
  obstacleCount: number;
  foodToWin: number;
}

interface LevelOverlayProps {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  allLevelsComplete: boolean;
  score: number;
  currentLevel: number;
  foodEaten: number;
  levelConfig: LevelConfig;
  onStart: () => void;
  onResume: () => void;
  onNextLevel: () => void;
  onRestart: () => void;
}

const LevelOverlay = ({
  isPlaying,
  isPaused,
  gameOver,
  levelComplete,
  allLevelsComplete,
  score,
  currentLevel,
  foodEaten,
  levelConfig,
  onStart,
  onResume,
  onNextLevel,
  onRestart,
}: LevelOverlayProps) => {
  if (isPlaying && !isPaused && !gameOver && !levelComplete) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg backdrop-blur-sm z-10">
      {!isPlaying && !gameOver && !levelComplete && (
        <>
          <h2 className="text-2xl arcade-text text-green-400 mb-4">LEVEL {currentLevel}</h2>
          <div className="text-center mb-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Obstacles: <span className="text-orange-400">{levelConfig.obstacleCount}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Food needed: <span className="text-yellow-400">{levelConfig.foodToWin}</span>
            </p>
          </div>
          <Button onClick={onStart} variant="arcade" size="lg">
            START LEVEL
          </Button>
        </>
      )}

      {isPaused && !gameOver && !levelComplete && (
        <>
          <h2 className="text-3xl arcade-text text-yellow-400 mb-8">PAUSED</h2>
          <Button onClick={onResume} variant="arcade" size="lg">
            RESUME
          </Button>
        </>
      )}

      {levelComplete && !allLevelsComplete && (
        <>
          <h2 className="text-3xl arcade-text text-green-400 mb-4">LEVEL COMPLETE!</h2>
          <p className="text-xl arcade-text text-primary mb-6">
            +{foodEaten * 10 * currentLevel} PTS
          </p>
          <Button onClick={onNextLevel} variant="arcade" size="lg">
            NEXT LEVEL
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Press SPACE to continue</p>
        </>
      )}

      {allLevelsComplete && (
        <>
          <h2 className="text-3xl arcade-text text-yellow-400 mb-4">🏆 YOU WIN! 🏆</h2>
          <p className="text-lg text-green-400 mb-2">All 10 levels completed!</p>
          <p className="text-xl arcade-text text-primary mb-6">
            FINAL SCORE: {score}
          </p>
          <Button onClick={onRestart} variant="arcade" size="lg">
            PLAY AGAIN
          </Button>
        </>
      )}

      {gameOver && !levelComplete && (
        <>
          <h2 className="text-3xl arcade-text text-destructive mb-4">GAME OVER</h2>
          <div className="text-center mb-6">
            <p className="text-lg arcade-text text-primary mb-2">
              Level {currentLevel} - Score: {score}
            </p>
            <p className="text-sm text-muted-foreground">
              Food: {foodEaten}/{levelConfig.foodToWin}
            </p>
          </div>
          <Button onClick={onRestart} variant="arcade" size="lg">
            TRY AGAIN
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Press SPACE to restart</p>
        </>
      )}
    </div>
  );
};

export default LevelOverlay;
