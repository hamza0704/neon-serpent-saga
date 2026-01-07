import { useState, useEffect, useCallback, useRef } from 'react';

// Game constants
const GRID_SIZE = 20;
const CELL_COUNT = 30;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

// Direction vectors
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
const DIRECTIONS: Record<Direction, { x: number; y: number }> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Opposite directions to prevent 180-degree turns
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

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  gameOver: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  highScore: number;
}

// Generate random position not on snake
const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * CELL_COUNT),
      y: Math.floor(Math.random() * CELL_COUNT),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

// Get initial snake position at center
const getInitialSnake = (): Position[] => {
  const center = Math.floor(CELL_COUNT / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
};

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    const initialSnake = getInitialSnake();
    return {
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      gameOver: false,
      isPlaying: false,
      isPaused: false,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
    };
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Calculate current speed based on score
  const getSpeed = useCallback(() => {
    const speedReduction = Math.floor(gameState.score / 5) * SPEED_INCREMENT;
    return Math.max(MIN_SPEED, INITIAL_SPEED - speedReduction);
  }, [gameState.score]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Space to start/pause
      if (e.key === ' ') {
        if (gameState.gameOver) {
          restartGame();
        } else if (!gameState.isPlaying) {
          startGame();
        } else {
          togglePause();
        }
        return;
      }

      // Direction controls
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
  }, [gameState.direction, gameState.isPlaying, gameState.gameOver]);

  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) {
      return;
    }

    const speed = getSpeed();
    if (timestamp - lastUpdateRef.current < speed) {
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

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= CELL_COUNT || newHead.y < 0 || newHead.y >= CELL_COUNT) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        localStorage.setItem('snakeHighScore', newHighScore.toString());
        return { ...prev, gameOver: true, highScore: newHighScore };
      }

      // Check self collision (exclude tail as it will move)
      const willEat = newHead.x === prev.food.x && newHead.y === prev.food.y;
      const bodyToCheck = willEat ? prev.snake : prev.snake.slice(0, -1);
      if (bodyToCheck.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        localStorage.setItem('snakeHighScore', newHighScore.toString());
        return { ...prev, gameOver: true, highScore: newHighScore };
      }

      // Move snake
      const newSnake = [newHead, ...prev.snake];
      if (!willEat) {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: willEat ? generateFood(newSnake) : prev.food,
        direction,
        score: willEat ? prev.score + 1 : prev.score,
      };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, getSpeed]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameLoop]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const restartGame = () => {
    const initialSnake = getInitialSnake();
    setGameState(prev => ({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      gameOver: false,
      isPlaying: true,
      isPaused: false,
      highScore: prev.highScore,
    }));
    lastUpdateRef.current = 0;
  };

  return {
    ...gameState,
    gridSize: GRID_SIZE,
    cellCount: CELL_COUNT,
    startGame,
    togglePause,
    restartGame,
    speed: getSpeed(),
  };
};
