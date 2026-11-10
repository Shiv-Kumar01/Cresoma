import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

window.WindowGames = window.WindowGames || {};

(() => {
    const GAME_WIDTH = 1080;
    const GAME_HEIGHT = 650;
    const BIRD_SIZE = 35;
    const PIPE_WIDTH = 55;
    const PIPE_GAP = 160;
    const GRAVITY = 0.1;
    const JUMP_STRENGTH = -3;
    const PIPE_SPEED = 2.0;
    const PIPE_SPAWN_INTERVAL = 2200;
    const HITBOX_PADDING = 3;
    const BIRD_FLAP_SPEED = 5;

    const generatePipe = () => {
      const minTopHeight = 50;
      const maxTopHeight = GAME_HEIGHT - PIPE_GAP - 50;
      const topPipeHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight + 1)) + minTopHeight;

      return {
        x: GAME_WIDTH,
        topHeight: topPipeHeight,
        bottomHeight: GAME_HEIGHT - topPipeHeight - PIPE_GAP,
        passed: false,
      };
    };

    const Bird = React.memo(({ y, frame }) => {
        const flapOffset = (frame % 3) - 1;

        return (
            <div
                className="absolute bg-yellow-400 rounded-full border-2 border-orange-500 shadow-lg"
                style={{
                    left: 50,
                    top: y,
                    width: BIRD_SIZE,
                    height: BIRD_SIZE,
                    boxShadow: '0 0 10px #ff0, 0 0 20px #ff0, inset 0 0 5px #ff6',
                    transform: `translateY(${flapOffset * 2}px) rotateZ(${-flapOffset * 5}deg)`,
                }}
            >
                <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full" />
            </div>
        );
    });

    const Pipe = React.memo(({ pipe, color = 'emerald' }) => {
      const topColor = color === 'emerald' ? 'bg-emerald-600' : 'bg-red-600';
      const bottomColor = color === 'emerald' ? 'bg-emerald-600' : 'bg-red-600';
      const shadow = color === 'emerald' ? '0 0 10px #0f0' : '0 0 10px #f00';

      return (
        <div className="absolute" style={{ left: pipe.x, width: PIPE_WIDTH }}>
          <div className={`w-full ${topColor} border-b-4 border-black/50`} style={{ height: pipe.topHeight, boxShadow: shadow, borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
            <div className="h-4 w-full bg-emerald-700/80 rounded-t-lg shadow-inner"></div>
          </div>
          <div style={{ height: PIPE_GAP }}></div>
          <div className={`w-full ${bottomColor} border-t-4 border-black/50`} style={{ height: pipe.bottomHeight, boxShadow: shadow, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, }} >
            <div className="h-4 w-full bg-emerald-700/80 rounded-b-lg shadow-inner"></div>
          </div>
        </div>
      );
    });

    const FlappyBirdGame = ({ onExit }) => {
      const [score, setScore] = useState(0);
      const [bestScore, setBestScore] = useState(() => parseInt(sessionStorage.getItem('bestScore') || '0', 10));
      const [gameState, setGameState] = useState('start');
      const [birdFrame, setBirdFrame] = useState(0);

      const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
      const [velocity, setVelocity] = useState(0);
      const [pipes, setPipes] = useState([]);

      const gameLoopRef = useRef();
      const lastTimeRef = useRef(0);
      const pipeSpawnTimerRef = useRef(0);

      const startGame = useCallback(() => {
        setBirdY(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
        setVelocity(0);
        setPipes([generatePipe()]);
        setScore(0);
        setGameState('playing');
        pipeSpawnTimerRef.current = 0;
        lastTimeRef.current = 0;
      }, []);

      const handleGameOver = useCallback((currentScore) => {
        if (currentScore > bestScore) {
            setBestScore(currentScore);
            sessionStorage.setItem('bestScore', currentScore);
        }
        setGameState('gameover');
      }, [bestScore]);

      const handleJump = useCallback(() => {
        if (gameState === 'start') {
          startGame();
        }
        if (gameState === 'playing') {
          setVelocity(JUMP_STRENGTH);
        } else if (gameState === 'gameover') {
          startGame();
        }
      }, [gameState, startGame]);

      const updateGame = useCallback((currentTime) => {
        if (gameState !== 'playing') {
          lastTimeRef.current = currentTime;
          gameLoopRef.current = requestAnimationFrame(updateGame);
          return;
        }

        const deltaTime = currentTime - lastTimeRef.current;
        if (deltaTime > 100) {
          lastTimeRef.current = currentTime;
          gameLoopRef.current = requestAnimationFrame(updateGame);
          return;
        }

        setVelocity(v => v + GRAVITY);
        setBirdY(y => y + velocity);
        setBirdFrame(f => (f + 1) % 60);

        setPipes(prevPipes => {
          const newPipes = prevPipes.map(p => ({ ...p, x: p.x - PIPE_SPEED })).filter(p => p.x > -PIPE_WIDTH);

          let currentScore = score;
          newPipes.forEach(p => {
            if (!p.passed && p.x + PIPE_WIDTH < 50) {
              p.passed = true;
              currentScore += 1;
            }
          });
          setScore(currentScore);

          pipeSpawnTimerRef.current += deltaTime;
          if (pipeSpawnTimerRef.current >= PIPE_SPAWN_INTERVAL) {
            newPipes.push(generatePipe());
            pipeSpawnTimerRef.current = 0;
          }
          return newPipes;
        });

        const birdYCurrent = birdY + velocity;
        const effectiveBirdY = birdYCurrent + HITBOX_PADDING;
        const effectiveBirdSize = BIRD_SIZE - 2 * HITBOX_PADDING;
        const effectiveBirdX = 50 + HITBOX_PADDING;
        const effectiveBirdXEnd = 50 + BIRD_SIZE - HITBOX_PADDING;

        if (birdYCurrent + BIRD_SIZE >= GAME_HEIGHT || birdYCurrent <= 0) {
          handleGameOver(score);
          return;
        }

        pipes.forEach(p => {
          const pipeXEnd = p.x + PIPE_WIDTH;
          const isBirdInPipeXRange = effectiveBirdXEnd > p.x && effectiveBirdX < pipeXEnd;

          if (isBirdInPipeXRange) {
            const hitTop = effectiveBirdY < p.topHeight;
            const hitBottom = effectiveBirdY + effectiveBirdSize > p.topHeight + PIPE_GAP;

            if (hitTop || hitBottom) {
              handleGameOver(score);
            }
          }
        });

        lastTimeRef.current = currentTime;
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }, [gameState, birdY, velocity, pipes, score, handleGameOver]);

      useEffect(() => {
        gameLoopRef.current = requestAnimationFrame(updateGame);
        return () => cancelAnimationFrame(gameLoopRef.current);
      }, [updateGame]);

      useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.code === 'Space') {
            e.preventDefault();
            handleJump();
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [handleJump]);

      const pipeTheme = gameState === 'gameover' ? 'red' : 'emerald';

      return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black text-white p-4 font-mono">
            <h1 className="text-4xl font-bold text-cyan-400 mb-6" style={{ textShadow: '0 0 10px #0ff' }}>NEON FLAP</h1>

            <div
                className="relative border-4 border-cyan-500 rounded-lg shadow-2xl overflow-hidden"
                style={{
                    width: `${GAME_WIDTH}px`,
                    height: `${GAME_HEIGHT}px`,
                    transform: `scale(min(1, 98vw / ${GAME_WIDTH}, 98vh / ${GAME_HEIGHT}))`,
                    transformOrigin: 'top center',
                    background: 'radial-gradient(circle, #1f0f36 0%, #000 100%)',
                    boxShadow: '0 0 50px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(255, 0, 255, 0.3)',
                }}
                onClick={handleJump}
            >
                <Bird y={birdY} frame={birdFrame} />

                {pipes.map((pipe, index) => (<Pipe key={index} pipe={pipe} color={pipeTheme} />))}

                {gameState === 'playing' && (
                    <div className="absolute top-4 left-0 right-0 text-center text-5xl font-extrabold text-white/90 z-20"
                        style={{ textShadow: '0 0 10px #000' }}>
                        {score}
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-800 border-t-4 border-cyan-500/50" style={{ boxShadow: '0 0 10px #0ff' }}></div>

                {gameState !== 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-30"
                    >
                        <h2 className="text-6xl font-black text-cyan-400 mb-6" style={{ textShadow: '0 0 20px #0ff' }}>
                            {gameState === 'gameover' ? 'GAME OVER' : 'NEON FLAP'}
                        </h2>
                        {gameState === 'gameover' && (
                            <div className="text-lg text-white mb-6 text-center">
                                <p>Score: **{score}**</p>
                                <p>Best: **{bestScore}**</p>
                            </div>
                        )}
                        <p className="text-xl text-white mb-8">
                            {gameState === 'gameover' ? 'Tap or Space to Retry' : 'Tap or Space to Start'}
                        </p>
                        <motion.button
                            onClick={handleJump}
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 text-2xl font-bold rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black shadow-lg"
                            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)' }}
                        >
                            {gameState === 'gameover' ? 'RETRY' : 'START'}
                        </motion.button>
                    </motion.div>
                )}
            </div>

            <div className="mt-6 text-center text-sm font-sans z-10">
                <motion.button
                    onClick={onExit}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 mb-4 rounded-full bg-black/30 border-2 border-cyan-600/70 text-cyan-400 font-bold tracking-wider hover:bg-black/50 transition-all"
                    style={{
                        textShadow: '0 0 5px #0ff',
                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)'
                    }}
                >
                    ← Back to GAMING HUB
                </motion.button>
                <motion.p
                    className="text-gray-300 text-sm"
                    animate={{ color: ['#aaa', '#fff', '#aaa'], transition: { duration: 5, repeat: Infinity } }}
                >
                    Click or press **Spacebar** to jump. Avoid the neon pipes!
                </motion.p>
            </div>
        </div>
      );
    };

    window.WindowGames.FlappyBirdGame = FlappyBirdGame;
//game
// ---------------------- MEMORY MATCH GAME ----------------------
const MemoryMatchGame = ({ onExit }) => {
  const emojis = ["🔥", "⚡", "🌙", "⭐", "🌈", "💎", "🎯", "🎵"];
  const totalPairs = emojis.length;

  const createDeck = () =>
    [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));

  const [deck, setDeck] = useState(createDeck());
  const [flipped, setFlipped] = useState([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);

  const handleFlip = (card) => {
    if (lock || card.flipped || card.matched) return;

    const newDeck = [...deck];
    newDeck[card.id].flipped = true;
    setDeck(newDeck);

    if (flipped.length === 0) {
      setFlipped([card]);
      return;
    }

    const [first] = flipped;
    setLock(true);

    setTimeout(() => {
      const updated = [...newDeck];

      if (first.emoji === card.emoji) {
        updated[first.id].matched = true;
        updated[card.id].matched = true;
        setMatched((m) => m + 1);
      } else {
        updated[first.id].flipped = false;
        updated[card.id].flipped = false;
      }

      setDeck(updated);
      setMoves((m) => m + 1);
      setFlipped([]);
      setLock(false);
    }, 700);
  };

  const resetGame = () => {
    setDeck(createDeck());
    setMoves(0);
    setMatched(0);
    setFlipped([]);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">

      {/* BIG NEON BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900 via-black to-purple-900 opacity-70" />

      {/* GAME TITLE */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl md:text-7xl font-black text-fuchsia-300 drop-shadow-[0_0_30px_#f0f] tracking-wider mb-8 z-10"
      >
        MEMORY MATCH
      </motion.h1>

      {/* SCORE INFO */}
      <div className="text-xl md:text-2xl mb-6 text-fuchsia-200 z-10">
        Moves: <span className="font-bold">{moves}</span> &nbsp; | &nbsp;
        Matches: <span className="font-bold">{matched}/{totalPairs}</span>
      </div>

      {/* *** FULL SCREEN GRID NOW *** */}
      <div
        className="grid gap-6 p-8 rounded-2xl z-10 backdrop-blur-xl bg-white/10 shadow-[0_0_35px_#f0f]"
        style={{
          gridTemplateColumns: "repeat(4, minmax(100px, 1fr))",
          width: "clamp(500px, 80vw, 900px)",   // ★ huge now
          height: "clamp(500px, 80vh, 900px)"   // ★ fills vertically
        }}
      >
        {deck.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleFlip(card)}
            whileHover={{ scale: card.flipped ? 1 : 1.07 }}
            className={`flex items-center justify-center text-5xl md:text-6xl font-bold rounded-xl cursor-pointer border-2
              ${card.matched ? "border-green-400 bg-green-700/30" :
                card.flipped ? "border-fuchsia-300 bg-fuchsia-600/30" :
                "border-fuchsia-400 bg-black/40"}
            `}
            style={{
              boxShadow: card.flipped || card.matched
                ? "0 0 25px #f0f"
                : "0 0 15px #f0f50",
            }}
          >
            {(card.flipped || card.matched) ? card.emoji : "?"}
          </motion.div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-6 mt-8 z-10">
        <motion.button
          onClick={resetGame}
          whileHover={{ scale: 1.15 }}
          className="px-8 py-4 text-xl bg-fuchsia-500 text-black font-bold rounded-xl shadow-lg"
        >
          Restart
        </motion.button>

        <motion.button
          onClick={onExit}
          whileHover={{ scale: 1.15 }}
          className="px-8 py-4 text-xl bg-black/40 border border-fuchsia-400 text-fuchsia-300 font-bold rounded-xl shadow-lg"
        >
          ← Back
        </motion.button>
      </div>
    </div>
  );
};

window.WindowGames.MemoryMatchGame = MemoryMatchGame;

})();

const componentStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

function ParticleField() {
  const points = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      color.setHSL(0.5 + Math.random() * 0.1, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0003;
    }
  });

  return (
    <points ref={ref} geometry={points}>
      <pointsMaterial
        size={0.1}
        vertexColors={true}
        transparent
        opacity={1.0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function GameHub() {
  const [activeGameName, setActiveGameName] = useState(null);

  const ComponentToRender = activeGameName ? window.WindowGames[activeGameName] : null;

  const games = [
    {
      title: "Neon Flap",
      emoji: "🐦",
      desc: "Fly through neon pipes.",
      name: "FlappyBirdGame",
      bgColorClass: "bg-blue-900/95",
      hoverBorderClass: "hover:border-blue-400",
      cardTransform: 'skewX(-15deg) skewY(-3deg) rotateZ(1deg)',
      borderRadius: '25px 5px 40px 5px',
      neonColor: '#0ff',
      neonTitleColor: 'text-cyan-300'
    },
    {
      title: "Memory Match",
      emoji: "🧠",
      desc: "Test your focus with card pairs.",
      name: "MemoryMatchGame",
      bgColorClass: "bg-purple-900/95",
      hoverBorderClass: "hover:border-purple-400",
      cardTransform: 'rotateZ(8deg) skewX(5deg)',
      borderRadius: '50px 0 50px 0',
      neonColor: '#f0f',
      neonTitleColor: 'text-fuchsia-300'
    },
    {
      title: "Neon Dash",
      emoji: "🏎️",
      desc: "Race through glowing tracks.",
      name: "NeonDashGame",
      bgColorClass: "bg-green-900/95",
      hoverBorderClass: "hover:border-green-400",
      cardTransform: 'skewX(12deg) rotateZ(-2deg)',
      borderRadius: '5px 50px 5px 50px',
      neonColor: '#0f0',
      neonTitleColor: 'text-lime-300'
    },
    {
      title: "Space Shooter",
      emoji: "🚀",
      desc: "Defend the galaxy from invaders.",
      name: "SpaceShooterGame",
      bgColorClass: "bg-red-900/95",
      hoverBorderClass: "hover:border-red-400",
      cardTransform: 'skewX(-10deg) skewY(10deg) rotateZ(5deg)',
      borderRadius: '10px 40px 10px 40px',
      neonColor: '#f30',
      neonTitleColor: 'text-red-300'
    },
    {
      title: "Maze Runner",
      emoji: "🧭",
      desc: "Find your way out of the fractal maze.",
      name: "MazeRunnerGame",
      bgColorClass: "bg-yellow-900/95",
      hoverBorderClass: "hover:border-yellow-400",
      cardTransform: 'skewX(8deg) skewY(2deg)',
      borderRadius: '10px 40px 10px 40px',
      neonColor: '#ff0',
      neonTitleColor: 'text-yellow-300'
    },
    {
      title: "Block Stacker",
      emoji: "🧱",
      desc: "Classic stacking puzzle challenge.",
      name: "BlockStackerGame",
      bgColorClass: "bg-indigo-900/95",
      hoverBorderClass: "hover:border-indigo-400",
      cardTransform: 'skewY(12deg) rotateZ(-4deg)',
      borderRadius: '50px 5px 50px 5px',
      neonColor: '#30f',
      neonTitleColor: 'text-indigo-300'
    },
    {
      title: "Cyber Snake",
      emoji: "🐍",
      desc: "Grow your snake in the digital field.",
      name: "CyberSnakeGame",
      bgColorClass: "bg-teal-900/95",
      hoverBorderClass: "hover:border-teal-400",
      cardTransform: 'skewY(6deg)',
      borderRadius: '40px 10px 40px 10px',
      neonColor: '#0af',
      neonTitleColor: 'text-teal-300'
    },
  ];

  const cardPositions = [
    { top: '15%', left: '8%' },
    { top: '50%', left: '3%' },
    { top: '30%', left: '33%' },
    { top: '70%', left: '38%' },
    { top: '10%', right: '10%', left: 'auto' },
    { top: '45%', right: '5%', left: 'auto' },
    { top: '80%', right: '20%', left: 'auto' },
  ];

  const handleGameClick = (path, name) => {
    if (window.WindowGames[name]) {
        setActiveGameName(name);
        console.log(`Launching: ${name}`);
    } else {
        console.log(`Error: Game component for ${name} not found in WindowGames.`);
    }
  };

  const handleExitGame = () => {
      setActiveGameName(null);
  };

  if (ComponentToRender) {
    return <ComponentToRender onExit={handleExitGame} />;
  }

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans">

      <div style={componentStyle}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 70 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.8} />
          <ParticleField />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-12 md:py-20 min-h-screen">

        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0]
          }}
          transition={{
            duration: 1.5,
            y: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white text-center tracking-wider mt-16 mb-20"
          style={{
              textShadow: '0 0 10px #fff, 0 0 20px #0ff, 0 0 40px #f0f, 0 0 80px #0ff, 0 0 90px #f0f',
          }}
        >
          GAMING HUB
        </motion.h1>

        <div className="relative w-full max-w-7xl h-[calc(100vh-200px)] mt-4">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [1, 0.3, 1],
                scale: 1,
                y: [0, -15 * (i % 2 === 0 ? 1 : -1), 0],
                x: [0, 10 * (i % 2 === 0 ? -1 : 1), 0],
              }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 9 + Math.random() * 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              whileHover={{
                scale: 1.15,
                rotateZ: 0,
                y: 0,
                x: 0,
                boxShadow: `0 0 25px ${game.neonColor}, 0 0 50px ${game.neonColor}80, 0 0 75px ${game.neonColor}60, 0 0 100px ${game.neonColor}40`
              }}
              className={`absolute w-72 h-80 bg-black/50 backdrop-blur-sm border-2 transition-all cursor-pointer shadow-2xl ${game.hoverBorderClass} flex flex-col justify-between group`}
              style={{
                  ...cardPositions[i],
                  transform: game.cardTransform,
                  borderRadius: game.borderRadius,
                  transformOrigin: 'center center',
                  borderColor: game.neonColor,
                  boxShadow: `0 0 10px ${game.neonColor}40, inset 0 0 10px ${game.neonColor}20`,
              }}
              onClick={() => handleGameClick(game.path, game.name)}
            >
                <div
                    className="relative z-10 flex flex-col items-center h-full text-center p-8 border-2 border-dashed border-white/20"
                    style={{
                        transform: `skewX(0deg) skewY(0deg) rotateZ(0deg)`,
                        background: `radial-gradient(circle at center, ${game.bgColorClass.replace('bg-', '#')} 0%, #000 100%)`,
                        boxShadow: `inset 0 0 20px ${game.neonColor}30`,
                        borderRadius: game.borderRadius,
                    }}
                >

                    <div className="text-7xl mb-6 bg-transparent rounded-xl shadow-lg transform group-hover:scale-110 transition duration-300">
                        {game.emoji}
                    </div>

                    <h2
                        className={`text-3xl font-extrabold mb-2 ${game.neonTitleColor} transition-all duration-300 group-hover:scale-[1.02]`}
                        style={{
                            textShadow: `0 0 5px ${game.neonColor}, 0 0 10px ${game.neonColor}`
                        }}
                    >
                        {game.title}
                    </h2>

                    <p className="text-gray-200 flex-grow text-sm mb-4"
                        style={{
                            textShadow: '0 0 2px rgba(255,255,255,0.8)'
                        }}>
                        {game.desc}
                    </p>

                    <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGameClick(game.path, game.name);
                        }}
                        whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${game.neonColor}` }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-auto px-6 py-2 rounded-lg text-lg font-bold text-black border-2 transition-all transform"
                        style={{
                            background: `linear-gradient(90deg, #fff 0%, ${game.neonColor} 50%, #fff 100%)`,
                            borderColor: game.neonColor,
                            textShadow: '0 0 2px #fff',
                            boxShadow: `0 0 8px ${game.neonColor}60`
                        }}
                    >
                        PLAY NOW
                    </motion.button>
                </div>
              </motion.div>
          ))}
        </div>
      </div>

       <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-600 z-10">
        Powered by React Fiber & Three.js
      </div>
    </div>
  );
}