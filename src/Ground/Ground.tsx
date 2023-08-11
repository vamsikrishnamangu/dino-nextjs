import React, { useRef } from "react";
import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "@/store/updateCustomProperty";

const SPEED = 0.05;

export const Ground: React.FC = () => {
  const groundRef1 = useRef<HTMLDivElement | null>(null);
  const groundRef2 = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative bottom-0">
      <div ref={groundRef1} data-ground className="absolute bottom-0 left-0">
        <img src="./ground.png" alt="ground" />
      </div>
      <div ref={groundRef2} data-ground className="absolute bottom-0 left-0">
        <img src="./ground.png" alt="ground" />
      </div>
    </div>
  );
};

export function setupGround(
  groundRef1: HTMLDivElement | null,
  groundRef2: HTMLDivElement | null
) {
  setCustomProperty(groundRef1, "--left", 0);
  setCustomProperty(groundRef2, "--left", 300);
}

export function updateGround(
  delta: number,
  speedScale: number,
  groundRef1: HTMLDivElement | null,
  groundRef2: HTMLDivElement | null
) {
  [groundRef1, groundRef2].forEach((groundRef) => {
    incrementCustomProperty(
      groundRef,
      "--left",
      delta * speedScale * SPEED * -1
    );

    if (getCustomProperty(groundRef, "--left") <= -300) {
      incrementCustomProperty(groundRef, "--left", 600);
    }
  });
}
