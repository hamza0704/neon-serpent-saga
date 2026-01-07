interface LevelConfig {
  level: number;
  speed: number;
  obstacleCount: number;
  foodToWin: number;
}

interface LevelScoreDisplayProps {
  score: number;
  currentLevel: number;
  foodEaten: number;
  levelConfig: LevelConfig;
}

const LevelScoreDisplay = ({ score, currentLevel, foodEaten, levelConfig }: LevelScoreDisplayProps) => {
  const progress = (foodEaten / levelConfig.foodToWin) * 100;

  return (
    <div className="flex flex-col w-full max-w-[600px] mb-4 px-2 gap-3">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-xs text-muted-foreground mb-1">LEVEL</p>
          <p className="text-2xl arcade-text text-green-400">{currentLevel}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">SCORE</p>
          <p className="text-2xl arcade-text text-primary">{score.toString().padStart(4, '0')}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">FOOD</p>
          <p className="text-xl arcade-text text-yellow-400">
            {foodEaten}/{levelConfig.foodToWin}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-yellow-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LevelScoreDisplay;
