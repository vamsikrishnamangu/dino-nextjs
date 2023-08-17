import React, { useEffect, useRef, useState } from "react";
import { updateGround, setupGround } from "@/Ground/Ground";
import { setDinoLose } from "@/Dino/Dino";
import { updateCactus, setupCactus, getCactusRects } from "@/Cactus/Cactus";
import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "@/store/updateCustomProperty";
import { useGroundStore } from "@/store/store";
const SPEED_SCALE_INCREASE = 0.00001;
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;
export const Game = () => {
  const width = useGroundStore((s) => s.width);
  const setWidth = useGroundStore((s) => s.setWidth);
  const lastTimeRef = useRef<number | null>(null);
  const speedScaleRef = useRef(1);
  const scoreRef = useRef<HTMLDivElement | null>(null);
  let score = useRef<number>(0);
  const dinoRef = useRef<HTMLImageElement | null>(null);
  const startScreenRef = useRef<HTMLDivElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [dinoFrame, setDinoFrame] = useState(0);
  let yVelocity = useRef<number>(0);
  let currentFrameTime = useRef<number>(0);
  const groundRef1 = useRef<HTMLImageElement | null>(null);
  const groundRef2 = useRef<HTMLImageElement | null>(null);
  let gameStarted = useRef<boolean | null>(false);

  useEffect(() => {
    const worldElem: any = document.querySelector("[data-world]");
    const startScreenElem: any = document.querySelector("[data-start-screen]");
    const groundElem: any = document.querySelector("[data-ground]");
    if (!worldElem || !startScreenElem) return;

    function setPixelToWorldScale() {
      const { innerWidth, innerHeight } = window;
      if (innerHeight > innerWidth) {
        worldElem.style.transform = `translate(-50%, -50%) rotate(90deg)`;
        worldElem.style.width = `${innerHeight}px`;
        worldElem.style.height = `${innerWidth}px`;
        groundElem.style.width = `${innerHeight}px`;
        setWidth(innerHeight);
      } else {
        worldElem.style.transform = ``;
        worldElem.style.width = `${innerWidth}px`;
        worldElem.style.height = `${innerHeight}px`;
        groundElem.style.width = `${innerWidth}px`;
        setWidth(innerWidth);
      }
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
    const handleSpacebarJump = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isJumping) {
        setIsJumping(true);
        yVelocity.current = JUMP_SPEED;
      }
    };

    if (gameStarted) {
      document.addEventListener("keydown", handleSpacebarJump);
    }

    return () => {
      document.removeEventListener("keydown", handleSpacebarJump);
    };
  }, [gameStarted, isJumping]);

  const updateDino = (delta: number, speedScale: number) => {
    handleRun(delta, speedScale);
    handleJump(delta);
  };
  const handleRun = (delta: number, speedScale: number) => {
    console.log("ground1", groundRef1.current);
    console.log("ground2", groundRef2.current);
    if (currentFrameTime.current >= FRAME_TIME) {
      setDinoFrame((prevFrame) => {
        const newFrame = (prevFrame + 1) % DINO_FRAME_COUNT;
        return newFrame;
      });
      currentFrameTime.current -= FRAME_TIME;
    } else {
      currentFrameTime.current += delta * speedScale;
    }
  };

  const handleJump = (delta: number) => {
    if (isJumping || !dinoRef.current) return;
    incrementCustomProperty(
      dinoRef.current,
      "--bottom",
      yVelocity.current * delta
    );

    if (getCustomProperty(dinoRef.current, "--bottom") <= 0) {
      setCustomProperty(dinoRef.current, "--bottom", 0);
      setIsJumping(false);
    }
    yVelocity.current -= GRAVITY * delta;
  };
  function handleStart() {
    gameStarted.current = true;
    lastTimeRef.current = null;
    speedScaleRef.current = 1;
    score.current = 0;
    if (startScreenRef.current) {
      startScreenRef.current.textContent = "";
    }
    setupGround(groundRef1.current, groundRef2.current, width);
    setupCactus();
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
      groundRef2.current,
      width
    );
    updateDino(delta, speedScaleRef.current);
    updateCactus(delta, speedScaleRef.current);
    updateSpeedScale(delta);
    score.current += delta * 0.01;
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
    if (startScreenRef.current) {
      startScreenRef.current.textContent =
        "Game Over! Press any key to Start Again";
    }
    setTimeout(() => {
      document.addEventListener("keydown", handleStart, { once: true });
      gameStarted.current = false;
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
    <div className="world" data-world>
      <div
        ref={scoreRef}
        className="score absolute top-0 right-0 text-lg"
        data-score
      >
        {Math.floor(score.current)}
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
          src={
            isJumping ? `/dino-stationary.png` : `/dino-run-${dinoFrame}.png`
          }
          alt="dino"
          data-dino
        />
      </picture>
    </div>
  );
};
