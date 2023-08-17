import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "@/store/updateCustomProperty";
const SPEED = 0.05;

export function setupGround(
  groundRef1: HTMLImageElement | null,
  groundRef2: HTMLImageElement | null,
  width: number
) {
  setCustomProperty(groundRef1, "--left", 0);
  setCustomProperty(groundRef2, "--left", width);
}

export function updateGround(
  delta: number,
  speedScale: number,
  groundRef1: HTMLImageElement | null,
  groundRef2: HTMLImageElement | null,
  width: number
) {
  [groundRef1, groundRef2].forEach((groundRef) => {
    incrementCustomProperty(
      groundRef,
      "--left",
      delta * speedScale * SPEED * -1
    );

    if (getCustomProperty(groundRef, "--left") <= -width) {
      incrementCustomProperty(groundRef, "--left", width * 2);
    }
  });
}
