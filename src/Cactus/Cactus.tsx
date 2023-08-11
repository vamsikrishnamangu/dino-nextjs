import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "@/store/updateCustomProperty";
import { useEffect, useState } from "react";

const SPEED = 0.05;
const CACTUS_INTERVAL_MIN = 500;
const CACTUS_INTERVAL_MAX = 2000;

let nextCactusTime: number;
function Cactus() {
  const [worldElem, setWorldElem] = useState<any>(null);
  useEffect(() => {
    const worldElem = document.querySelector("[data-world]") as HTMLElement;
    setWorldElem(worldElem);
  }, []);
}
export function setupCactus(): void {
  nextCactusTime = CACTUS_INTERVAL_MIN;
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    cactus.remove();
  });
}

export function updateCactus(delta: number, speedScale: number): void {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(
      cactus as HTMLElement,
      "--left",
      delta * speedScale * SPEED * -1
    );
    if (getCustomProperty(cactus as HTMLElement, "--left") <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 0) {
    createCactus();
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
      speedScale;
  }
  nextCactusTime -= delta;
}

export function getCactusRects(): DOMRect[] {
  return Array.from(document.querySelectorAll("[data-cactus]")).map(
    (cactus: Element) => {
      return cactus.getBoundingClientRect();
    }
  );
}

function createCactus(): void {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = "true";
  cactus.src = "/cactus.png";
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  worldElem.append(cactus);
}

function randomNumberBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
