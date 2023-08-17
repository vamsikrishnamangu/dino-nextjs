import React, { useEffect, useRef, useState } from "react";
import { updateGround, setupGround } from "@/Ground/Ground";
import { setDinoLose } from "@/Dino/Dino";
import { updateCactus, setupCactus, getCactusRects } from "@/Cactus/Cactus";
import { useGroundStore } from "@/store/store";
import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "@/store/updateCustomProperty";
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;
export const Game = () => {
  const worldElem = useGroundStore((s) => s.worldElem);
  const setWorldElem = useGroundStore((s) => s.setWorldElem);
  const scoreElem = useGroundStore((s) => s.scoreElem);
  const setScoreElem = useGroundStore((s) => s.setScoreElem);
  const setStartScreenElem = useGroundStore((s) => s.setStartScreenElem);
  const startScreenElem = useGroundStore((s) => s.startScreenElem);
  const lastTimeRef = useRef<number | null>(null);
  const speedScaleRef = useRef(1);
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const dinoRef = useRef<HTMLImageElement | null>(null);
  const startScreenRef = useRef<HTMLImageElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [dinoFrame, setDinoFrame] = useState(0);
  const [yVelocity, setYVelocity] = useState(0);
  const [currentFrameTime, setCurrentFrameTime] = useState(0);
  const groundRef1 = useRef<HTMLImageElement | null>(null);
  const groundRef2 = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const worldElem: any = document.querySelector("[data-world]");
    setWorldElem(worldElem);
    let scoreElem: any = document.querySelector("[data-score]");
    setScoreElem(scoreElem);
    const startScreenElem: any = document.querySelector("[data-start-screen]");
    setStartScreenElem(startScreenElem);
    if (!worldElem || !startScreenElem) return;

    // function handleResize() {
    //   let worldToPixelScale;
    //   if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    //     worldToPixelScale = window.innerWidth / WORLD_WIDTH;
    //   } else {
    //     worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
    //   }
    //   if (worldElem) {
    //     worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
    //     worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
    //   }
    // }
    function setPixelToWorldScale() {
      let worldToPixelScale;
      if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH;
      } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
      }

      worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
      worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
    }
    window.addEventListener("resize", setPixelToWorldScale);
    document.addEventListener("keydown", handleStart, { once: true });
    setPixelToWorldScale();
    return () => {
      document.removeEventListener("keydown", handleStart);
      window.removeEventListener("resize", setPixelToWorldScale);
    };
  }, []);
  useEffect(() => {
    function onJump(e: KeyboardEvent) {
      if (e.code !== "Space" || isJumping) return;
      setYVelocity(JUMP_SPEED);
      setIsJumping(true);
    }

    document.addEventListener("keydown", onJump);
    return () => {
      document.removeEventListener("keydown", onJump);
    };
  }, [isJumping]);
  const setupDino = () => {
    setIsJumping(false);
    setDinoFrame(0);
    setCurrentFrameTime(0);
    setYVelocity(0);

    if (dinoRef.current) {
      setCustomProperty(dinoRef.current, "--bottom", 0);
    }
  };

  const updateDino = (delta: number, speedScale: number) => {
    handleRun(delta, speedScale);
    handleJump(delta);
  };
  const handleRun = (delta: number, speedScale: number) => {
    if (isJumping && dinoRef.current) {
      dinoRef.current.src = `/dino-stationary.png`;
      return;
    }
    if (currentFrameTime >= FRAME_TIME) {
      setDinoFrame((prevFrame) => {
        const newFrame = (prevFrame + 1) % DINO_FRAME_COUNT;
        if (dinoRef.current) {
          dinoRef.current.src = `/dino-run-${newFrame}.png`;
        }
        return newFrame;
      });

      setCurrentFrameTime((prevTime) => prevTime - FRAME_TIME);
    } else {
      setCurrentFrameTime((prevTime) => prevTime + delta * speedScale);
    }
  };

  const handleJump = (delta: number) => {
    if (!isJumping || !dinoRef.current) return;
    incrementCustomProperty(dinoRef.current, "--bottom", yVelocity * delta);

    if (getCustomProperty(dinoRef.current, "--bottom") <= 0) {
      setCustomProperty(dinoRef.current, "--bottom", 0);
      setIsJumping(false);
    }

    setYVelocity((prev) => prev - GRAVITY * delta);
  };

  function handleStart() {
    lastTimeRef.current = null;
    speedScaleRef.current = 1;
    if (scoreElem !== null) {
      setScore(0);
    }
    setupDino();
    setupGround(groundRef1.current, groundRef2.current);
    setupCactus();
    startScreenRef.current?.classList.add("hide");
    window.requestAnimationFrame(update);
  }
  function update(time: number) {
    if (lastTimeRef.current == null) {
      lastTimeRef.current = time;
      window.requestAnimationFrame(update);
      return;
    }
    const delta = time - lastTimeRef.current;
    updateGround(
      delta,
      speedScaleRef.current,
      groundRef1.current,
      groundRef2.current
    );
    updateDino(delta, speedScaleRef.current);
    updateCactus(delta, speedScaleRef.current);
    updateSpeedScale(delta);
    setScore((prev) => prev + delta * 0.01);
    if (checkLose()) {
      handleLose();
    } else {
      lastTimeRef.current = time;
      window.requestAnimationFrame(update);
    }
  }
  function updateSpeedScale(delta: number) {
    speedScaleRef.current += delta * SPEED_SCALE_INCREASE;
  }
  function handleLose() {
    setDinoLose(dinoRef);
    setTimeout(() => {
      document.addEventListener("keydown", handleStart, { once: true });
      if (!startScreenElem) return;
      startScreenElem.classList.remove("hide");
    }, 100);
  }

  function checkLose() {
    const dinoElem = dinoRef.current;
    if (dinoElem) {
      return getCactusRects().some((rect) =>
        isCollision(rect, dinoElem.getBoundingClientRect())
      );
    }
  }
  function isCollision(rect1: DOMRect, rect2: DOMRect) {
    return (
      rect1.left < rect2.right &&
      rect1.top < rect2.bottom &&
      rect1.right > rect2.left &&
      rect1.bottom > rect2.top
    );
  }

  const dinoStyle = {
    bottom: `${getCustomProperty(dinoRef.current, "--bottom")}%`,
  };
  return (
    <div className="world relative h-screen w-screen" data-world>
      <div
        ref={scoreRef}
        className="score absolute top-0 right-0 text-lg"
        data-score
      >
        {Math.floor(score)}
      </div>
      <div
        ref={startScreenRef}
        className="start-screen absolute inset-0"
        data-start-screen
      >
        Press Any Key To Start
      </div>
      <picture>
        <img
          ref={groundRef1}
          className="ground absolute bottom-0 left-0"
          src="/ground.png"
          alt="ground"
          data-ground
        />
        <img
          ref={groundRef2}
          className="ground absolute bottom-0 left-0"
          src="/ground.png"
          alt="ground"
          data-ground
        />
        <img
          className="dino absolute bottom-0 left-0"
          style={dinoStyle}
          ref={dinoRef}
          src={`/dino-stationary.png`}
          alt="dino"
          data-dino
        />
      </picture>
    </div>
  );
};
