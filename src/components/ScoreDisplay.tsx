interface ScoreDisplayProps {
  score: number;
  highScore: number;
  speed: number;
}

const ScoreDisplay = ({ score, highScore, speed }: ScoreDisplayProps) => {
  return (
    <div className="flex justify-between items-center w-full max-w-[600px] mb-4 px-2">
      <div className="text-left">
        <p className="text-xs text-muted-foreground mb-1">SCORE</p>
        <p className="text-2xl arcade-text text-primary">{score.toString().padStart(4, '0')}</p>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1">SPEED</p>
        <p className="text-lg arcade-text text-secondary">{Math.round((150 - speed) / 5 + 1)}x</p>
      </div>
      
      <div className="text-right">
        <p className="text-xs text-muted-foreground mb-1">HIGH</p>
        <p className="text-2xl arcade-text text-accent">{highScore.toString().padStart(4, '0')}</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
