// Game.tsx
import React, { useEffect, useRef, useState } from "react";
import { updateGround, setupGround } from "@/Ground/Ground";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "@/Dino/Dino";
import { updateCactus, setupCactus, getCactusRects } from "@/Cactus/Cactus";
import { useStore } from "zustand";
import { useGroundStore } from "@/store/store";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

export const Game = () => {
  //const worldElem = useGroundStore((s) => s.worldElem);
  const setWorldElem = useGroundStore((s) => s.setWorldElem);
  //const scoreElem = useGroundStore((s) => s.scoreElem);
  const setScoreElem = useGroundStore((s) => s.setScoreElem);
  const setStartScreenElem = useGroundStore((s) => s.setStartScreenElem);
  //const startScreenElem = useGroundStore((s) => s.startScreenElem);
  const lastTimeRef = useRef<number | null>(null);
  const speedScaleRef = useRef(1);

  useEffect(() => {
    const worldElem: any = document.querySelector("[data-world]");
    setWorldElem(worldElem);
    const scoreElem: any = document.querySelector("[data-score]");
    setScoreElem(scoreElem);
    const startScreenElem: any = document.querySelector("[data-start-screen]");
    setStartScreenElem(startScreenElem);
    if (!worldElem || !startScreenElem) return;

    function handleStart() {
      lastTimeRef.current = null;
      speedScaleRef.current = 1;
      if (scoreElem !== null) {
        scoreElem.textContent = 0;
      }
      setupGround();
      setupDino();
      setupCactus();
      if (startScreenElem) {
        startScreenElem.classList.add("hide");
      }
      requestAnimationFrame(update);
    }

    function handleResize() {
      let worldToPixelScale;
      if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH;
      } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
      }
      if (worldElem) {
        worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
        worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
      }
    }

    function update(time: number) {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
        requestAnimationFrame(update);
        return;
      }
      const delta = time - lastTimeRef.current;
      updateGround(delta, speedScaleRef.current);
      updateDino(delta, speedScaleRef.current);
      updateCactus(delta, speedScaleRef.current);
      speedScaleRef.current += delta * SPEED_SCALE_INCREASE;
      scoreRef.current += delta * 0.01;

      // Update the score
      if (scoreRef.current) {
        scoreRef.current.textContent = Math.floor(scoreRef.current).toString();
      }

      if (checkLose()) {
        handleLose();
      } else {
        lastTimeRef.current = time;
        requestAnimationFrame(update);
      }
    }

    function handleLose() {
      setDinoLose();
      setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true });
        if (!startScreenElem) return;
        startScreenElem.classList.remove("hide");
      }, 100);
    }

    function checkLose() {
      const dinoRect = getDinoRect();
      return getCactusRects().some((rect) => isCollision(rect, dinoRect));
    }

    function isCollision(rect1: DOMRect, rect2: DOMRect) {
      return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
      );
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleStart, { once: true });
    handleResize();
    return () => {
      document.removeEventListener("keydown", handleStart);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="world relative h-screen w-screen" data-world>
      <div className="score absolute top-0 right-0 text-lg" data-score>
        0
      </div>
      <div className="start-screen absolute inset-0" data-start-screen>
        Press Any Key To Start
      </div>
      <picture>
        <img src="/ground.png" alt="ground" className="ground" data-ground />
        <img src="/ground.png" alt="ground" className="ground" data-ground />
        <img src="/dino-stationary.png" alt="dino" className="dino" data-dino />
      </picture>
    </div>
  );
};
