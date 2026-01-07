import { useState } from 'react';
import { useLevelGame } from '@/hooks/useLevelGame';
import LevelGameCanvas from './LevelGameCanvas';
import LevelScoreDisplay from './LevelScoreDisplay';
import LevelOverlay from './LevelOverlay';
import LevelSelector from './LevelSelector';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

const LevelSnakeGame = () => {
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  
  const {
    snake,
    food,
    obstacles,
    score,
    foodEaten,
    currentLevel,
    gameOver,
    levelComplete,
    allLevelsComplete,
    isPlaying,
    isPaused,
    gridSize,
    cellCount,
    levelConfig,
    startGame,
    togglePause,
    nextLevel,
    restartGame,
    selectLevel,
  } = useLevelGame();

  const handleSelectLevel = (level: number) => {
    selectLevel(level);
    setShowLevelSelect(false);
  };

  const handleBackToLevels = () => {
    setShowLevelSelect(true);
  };

  if (showLevelSelect) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-xl arcade-text text-green-400 mb-6">SELECT LEVEL</h3>
        <LevelSelector onSelectLevel={handleSelectLevel} />
        <p className="text-xs text-muted-foreground mt-6">
          Higher levels = More obstacles & faster speed
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4 w-full max-w-[600px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToLevels}
          className="text-muted-foreground hover:text-green-400"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Levels
        </Button>
      </div>
      
      <LevelScoreDisplay
        score={score}
        currentLevel={currentLevel}
        foodEaten={foodEaten}
        levelConfig={levelConfig}
      />

      <div className="relative">
        <LevelGameCanvas
          snake={snake}
          food={food}
          obstacles={obstacles}
          gridSize={gridSize}
          cellCount={cellCount}
          gameOver={gameOver}
          levelComplete={levelComplete}
        />

        <LevelOverlay
          isPlaying={isPlaying}
          isPaused={isPaused}
          gameOver={gameOver}
          levelComplete={levelComplete}
          allLevelsComplete={allLevelsComplete}
          score={score}
          currentLevel={currentLevel}
          foodEaten={foodEaten}
          levelConfig={levelConfig}
          onStart={startGame}
          onResume={togglePause}
          onNextLevel={nextLevel}
          onRestart={restartGame}
        />

        <div className="scanlines rounded-lg" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          ↑ ↓ ← → or WASD to move • SPACE to pause • Avoid <span className="text-orange-400">obstacles</span>
        </p>
      </div>
    </div>
  );
};

export default LevelSnakeGame;
