import { useState, useEffect, useRef, useCallback } from 'react';
import { Point, Direction, GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED } from '../types';
import { Trophy, RefreshCcw, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (400 / GRID_SIZE)),
        y: Math.floor(Math.random() * (400 / GRID_SIZE)),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const wrapPosition = (pos: number, max: number) => {
    if (pos >= max) return 0;
    if (pos < 0) return max - 1;
    return pos;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const width = 400 / GRID_SIZE;
      const height = 400 / GRID_SIZE;

      switch (direction) {
        case Direction.UP: head.y = wrapPosition(head.y - 1, height); break;
        case Direction.DOWN: head.y = wrapPosition(head.y + 1, height); break;
        case Direction.LEFT: head.x = wrapPosition(head.x - 1, width); break;
        case Direction.RIGHT: head.x = wrapPosition(head.x + 1, width); break;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== Direction.DOWN) setDirection(Direction.UP); break;
        case 'ArrowDown': if (direction !== Direction.UP) setDirection(Direction.DOWN); break;
        case 'ArrowLeft': if (direction !== Direction.RIGHT) setDirection(Direction.LEFT); break;
        case 'ArrowRight': if (direction !== Direction.LEFT) setDirection(Direction.RIGHT); break;
        case ' ': 
          if (gameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f43f5e';
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

      // Draw snake
    ctx.shadowBlur = 0;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
      if (isHead) {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
        // Head detail
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 4, y + 4, 4, 4);
      } else {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  const gameLoop = useCallback((timestamp: number) => {
    if (timestamp - lastUpdateRef.current > INITIAL_SPEED) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, draw]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div id="neural-link" className="flex flex-col gap-4 items-center screen-tear">
      <div className="flex items-center justify-between w-full">
        <div className="bg-black border-2 border-cyan px-4 py-1 text-cyan font-bold">
          <span className="text-[8px] block opacity-50 uppercase">Neural_Load</span>
          <span className="text-lg leading-tight">{score.toString().padStart(6, '0')}</span>
        </div>
        
        <div className="flex gap-2">
            <button 
              onClick={resetGame}
              className="bg-magenta text-black px-2 py-1 text-[10px] font-bold uppercase border-2 border-magenta hover:bg-black hover:text-magenta transition-all"
            >
              Flush_Mem
            </button>
        </div>
      </div>

      <div className="relative border-4 border-magenta shadow-[8px_8px_0px_#00ffff]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block bg-black"
        />

        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-magenta flex flex-col items-center justify-center p-8 text-black z-10 overflow-hidden"
            >
              <div className="noise-overlay" />
              <h2 className="text-4xl font-black mb-4 uppercase leading-none glitch-text" data-text="K_STACK_OVERFLOW">K_STACK_OVERFLOW</h2>
              <div className="bg-black text-magenta p-4 w-full text-center text-xs font-bold mb-8">
                 ERROR_CODE: 0x808_SNAKE_DEATH<br/>
                 FINAL_BITRATE: {score}
              </div>
              <button 
                onClick={resetGame}
                className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                [REINITIALIZE]
              </button>
            </motion.div>
          )}

          {isPaused && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center pointer-events-none"
            >
               <div className="border-4 border-cyan bg-black px-8 py-4">
                  <span className="text-cyan text-2xl font-black uppercase glitch-text" data-text="LINK_PAUSED">LINK_PAUSED</span>
               </div>
               <div className="mt-4 text-magenta text-[8px] font-bold uppercase tracking-widest animate-pulse">
                  // WAITING_FOR_INPUT_SIGNAL //
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-[8px] text-white/40 font-bold uppercase">
        <div className="flex flex-col gap-1 border-l border-white/20 pl-2">
           <span className="text-cyan">Vector_Input:</span>
           <span>Primary_D-Pad</span>
        </div>
        <div className="flex flex-col gap-1 border-l border-white/20 pl-2">
           <span className="text-magenta">Manual_Override:</span>
           <span>Key_Spacebar</span>
        </div>
      </div>
    </div>
  );
}
