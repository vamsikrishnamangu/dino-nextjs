import React, { useState, useEffect, useRef } from "react";
import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "@/store/updateCustomProperty";

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

export const Dino: React.FC = () => {
  const dinoRef = useRef<HTMLImageElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [dinoFrame, setDinoFrame] = useState(0);
  const [yVelocity, setYVelocity] = useState(0);
  const [currentFrameTime, setCurrentFrameTime] = useState(0);

  useEffect(() => {
    const onJump = (e: KeyboardEvent) => {
      if (e.code !== "Space" || isJumping) return;

      setYVelocity(JUMP_SPEED);
      setIsJumping(true);
    };

    document.addEventListener("keydown", onJump);
    return () => document.removeEventListener("keydown", onJump);
  }, [isJumping]);

  const handleRun = (delta: number, speedScale: number) => {
    if (isJumping) {
      dinoRef.current!.src = "./dino-stationary.png";
      return;
    }

    if (currentFrameTime >= FRAME_TIME) {
      setDinoFrame((dinoFrame + 1) % DINO_FRAME_COUNT);
      setCurrentFrameTime(currentFrameTime - FRAME_TIME);
    }
    setCurrentFrameTime(currentFrameTime + delta * speedScale);
  };

  const handleJump = (delta: number) => {
    if (!isJumping) return;

    incrementCustomProperty(dinoRef.current, "--bottom", yVelocity * delta);

    if (getCustomProperty(dinoRef.current, "--bottom") <= 0) {
      setCustomProperty(dinoRef.current, "--bottom", 0);
      setIsJumping(false);
    }

    setYVelocity(yVelocity - GRAVITY * delta);
  };

  // Your update function here (it should call handleRun and handleJump)

  return (
    <picture>
      <img
        className="absolute bottom-0 left-0"
        style={{ bottom: `${getCustomProperty(dinoRef.current, "--bottom")}%` }}
        ref={dinoRef}
        src={`./dino-run-${dinoFrame}.png`}
        alt="dino"
        data-dino
      />
    </picture>
  );
};

export function getDinoRect(dinoRef: React.RefObject<HTMLImageElement>) {
  return dinoRef.current?.getBoundingClientRect();
}

export function setDinoLose(dinoRef: React.RefObject<HTMLImageElement>) {
  dinoRef.current!.src = "./dino-lose.png";
}
