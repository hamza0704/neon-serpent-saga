import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_COUNT = 30;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
const DIRECTIONS: Record<Direction, { x: number; y: number }> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITES: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

interface Position {
  x: number;
  y: number;
}

interface LevelConfig {
  level: number;
  speed: number;
  obstacleCount: number;
  foodToWin: number;
}

// Level configurations - difficulty increases with each level
const LEVELS: LevelConfig[] = [
  { level: 1, speed: 150, obstacleCount: 3, foodToWin: 5 },
  { level: 2, speed: 140, obstacleCount: 5, foodToWin: 7 },
  { level: 3, speed: 130, obstacleCount: 8, foodToWin: 8 },
  { level: 4, speed: 120, obstacleCount: 12, foodToWin: 10 },
  { level: 5, speed: 110, obstacleCount: 16, foodToWin: 12 },
  { level: 6, speed: 100, obstacleCount: 20, foodToWin: 14 },
  { level: 7, speed: 90, obstacleCount: 25, foodToWin: 16 },
  { level: 8, speed: 80, obstacleCount: 30, foodToWin: 18 },
  { level: 9, speed: 70, obstacleCount: 36, foodToWin: 20 },
  { level: 10, speed: 60, obstacleCount: 45, foodToWin: 25 },
];

interface LevelGameState {
  snake: Position[];
  food: Position;
  obstacles: Position[];
  direction: Direction;
  nextDirection: Direction;
  score: number;
  foodEaten: number;
  currentLevel: number;
  gameOver: boolean;
  levelComplete: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  allLevelsComplete: boolean;
}

// Generate obstacles for a level
const generateObstacles = (count: number, snake: Position[]): Position[] => {
  const obstacles: Position[] = [];
  const center = Math.floor(CELL_COUNT / 2);
  
  // Keep center area clear for snake start
  const isSafeZone = (x: number, y: number) => {
    return Math.abs(x - center) <= 4 && Math.abs(y - center) <= 2;
  };

  while (obstacles.length < count) {
    const pos = {
      x: Math.floor(Math.random() * CELL_COUNT),
      y: Math.floor(Math.random() * CELL_COUNT),
    };

    const isOnSnake = snake.some(s => s.x === pos.x && s.y === pos.y);
    const isOnObstacle = obstacles.some(o => o.x === pos.x && o.y === pos.y);
    const isInSafeZone = isSafeZone(pos.x, pos.y);

    if (!isOnSnake && !isOnObstacle && !isInSafeZone) {
      obstacles.push(pos);
    }
  }

  return obstacles;
};

// Generate food position
const generateFood = (snake: Position[], obstacles: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * CELL_COUNT),
      y: Math.floor(Math.random() * CELL_COUNT),
    };
  } while (
    snake.some(s => s.x === newFood.x && s.y === newFood.y) ||
    obstacles.some(o => o.x === newFood.x && o.y === newFood.y)
  );
  return newFood;
};

const getInitialSnake = (): Position[] => {
  const center = Math.floor(CELL_COUNT / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
};

export const useLevelGame = () => {
  const [gameState, setGameState] = useState<LevelGameState>(() => {
    const initialSnake = getInitialSnake();
    const obstacles = generateObstacles(LEVELS[0].obstacleCount, initialSnake);
    return {
      snake: initialSnake,
      food: generateFood(initialSnake, obstacles),
      obstacles,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      foodEaten: 0,
      currentLevel: 1,
      gameOver: false,
      levelComplete: false,
      isPlaying: false,
      isPaused: false,
      allLevelsComplete: false,
    };
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const getCurrentLevelConfig = useCallback(() => {
    return LEVELS[gameState.currentLevel - 1];
  }, [gameState.currentLevel]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameState.gameOver || gameState.allLevelsComplete) {
          restartGame();
        } else if (gameState.levelComplete) {
          nextLevel();
        } else if (!gameState.isPlaying) {
          startGame();
        } else {
          togglePause();
        }
        return;
      }

      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
      };

      const newDirection = keyToDirection[e.key];
      if (newDirection && newDirection !== OPPOSITES[gameState.direction]) {
        setGameState(prev => ({ ...prev, nextDirection: newDirection }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction, gameState.isPlaying, gameState.gameOver, gameState.levelComplete, gameState.allLevelsComplete]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || gameState.levelComplete) {
      return;
    }

    const config = getCurrentLevelConfig();
    if (timestamp - lastUpdateRef.current < config.speed) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    lastUpdateRef.current = timestamp;

    setGameState(prev => {
      const direction = prev.nextDirection;
      const head = prev.snake[0];
      const delta = DIRECTIONS[direction];

      const newHead: Position = {
        x: head.x + delta.x,
        y: head.y + delta.y,
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= CELL_COUNT || newHead.y < 0 || newHead.y >= CELL_COUNT) {
        return { ...prev, gameOver: true };
      }

      // Obstacle collision
      if (prev.obstacles.some(o => o.x === newHead.x && o.y === newHead.y)) {
        return { ...prev, gameOver: true };
      }

      // Self collision
      const willEat = newHead.x === prev.food.x && newHead.y === prev.food.y;
      const bodyToCheck = willEat ? prev.snake : prev.snake.slice(0, -1);
      if (bodyToCheck.some(s => s.x === newHead.x && s.y === newHead.y)) {
        return { ...prev, gameOver: true };
      }

      // Move snake
      const newSnake = [newHead, ...prev.snake];
      if (!willEat) {
        newSnake.pop();
      }

      const newFoodEaten = willEat ? prev.foodEaten + 1 : prev.foodEaten;
      const levelConfig = LEVELS[prev.currentLevel - 1];

      // Check level complete
      if (newFoodEaten >= levelConfig.foodToWin) {
        if (prev.currentLevel >= 10) {
          return {
            ...prev,
            snake: newSnake,
            score: prev.score + (willEat ? 10 * prev.currentLevel : 0),
            foodEaten: newFoodEaten,
            allLevelsComplete: true,
            levelComplete: true,
          };
        }
        return {
          ...prev,
          snake: newSnake,
          food: willEat ? generateFood(newSnake, prev.obstacles) : prev.food,
          score: prev.score + (willEat ? 10 * prev.currentLevel : 0),
          foodEaten: newFoodEaten,
          levelComplete: true,
        };
      }

      return {
        ...prev,
        snake: newSnake,
        food: willEat ? generateFood(newSnake, prev.obstacles) : prev.food,
        direction,
        score: prev.score + (willEat ? 10 * prev.currentLevel : 0),
        foodEaten: newFoodEaten,
      };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.levelComplete, getCurrentLevelConfig]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver && !gameState.levelComplete) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.levelComplete, gameLoop]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const nextLevel = () => {
    const newLevel = gameState.currentLevel + 1;
    const initialSnake = getInitialSnake();
    const obstacles = generateObstacles(LEVELS[newLevel - 1].obstacleCount, initialSnake);

    setGameState(prev => ({
      ...prev,
      snake: initialSnake,
      food: generateFood(initialSnake, obstacles),
      obstacles,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      foodEaten: 0,
      currentLevel: newLevel,
      levelComplete: false,
      isPlaying: true,
    }));
    lastUpdateRef.current = 0;
  };

  const restartGame = () => {
    const initialSnake = getInitialSnake();
    const obstacles = generateObstacles(LEVELS[0].obstacleCount, initialSnake);

    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake, obstacles),
      obstacles,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      foodEaten: 0,
      currentLevel: 1,
      gameOver: false,
      levelComplete: false,
      isPlaying: true,
      isPaused: false,
      allLevelsComplete: false,
    });
    lastUpdateRef.current = 0;
  };

  const selectLevel = (level: number) => {
    const initialSnake = getInitialSnake();
    const obstacles = generateObstacles(LEVELS[level - 1].obstacleCount, initialSnake);

    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake, obstacles),
      obstacles,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      foodEaten: 0,
      currentLevel: level,
      gameOver: false,
      levelComplete: false,
      isPlaying: false,
      isPaused: false,
      allLevelsComplete: false,
    });
  };

  return {
    ...gameState,
    gridSize: GRID_SIZE,
    cellCount: CELL_COUNT,
    levelConfig: getCurrentLevelConfig(),
    startGame,
    togglePause,
    nextLevel,
    restartGame,
    selectLevel,
  };
};
