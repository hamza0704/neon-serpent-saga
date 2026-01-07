import { Button } from '@/components/ui/button';

interface GameOverlayProps {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const GameOverlay = ({
  isPlaying,
  isPaused,
  gameOver,
  score,
  highScore,
  onStart,
  onResume,
  onRestart,
}: GameOverlayProps) => {
  if (isPlaying && !isPaused && !gameOver) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg backdrop-blur-sm z-10">
      {!isPlaying && !gameOver && (
        <>
          <h2 className="text-3xl arcade-text text-primary mb-8 animate-pulse-glow">SNAKE</h2>
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-4">Use Arrow Keys or WASD to move</p>
            <p className="text-sm text-muted-foreground">Press SPACE to pause</p>
          </div>
          <Button
            onClick={onStart}
            variant="arcade"
            size="lg"
            className="text-lg"
          >
            START GAME
          </Button>
        </>
      )}

      {isPaused && !gameOver && (
        <>
          <h2 className="text-3xl arcade-text text-secondary mb-8">PAUSED</h2>
          <Button
            onClick={onResume}
            variant="arcade"
            size="lg"
            className="text-lg"
          >
            RESUME
          </Button>
        </>
      )}

      {gameOver && (
        <>
          <h2 className="text-3xl arcade-text text-destructive mb-4">GAME OVER</h2>
          
          <div className="text-center mb-8">
            <p className="text-xl arcade-text text-primary mb-2">
              SCORE: {score}
            </p>
            {score >= highScore && score > 0 && (
              <p className="text-sm text-secondary animate-pulse">NEW HIGH SCORE!</p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Best: {highScore}
            </p>
          </div>
          
          <Button
            onClick={onRestart}
            variant="arcade"
            size="lg"
            className="text-lg"
          >
            PLAY AGAIN
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">Press SPACE to restart</p>
        </>
      )}
    </div>
  );
};

export default GameOverlay;
