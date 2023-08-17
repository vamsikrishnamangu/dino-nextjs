import { create } from "zustand";

type GroundState = {
  left1: number;
  left2: number;
  width: number;
  setWidth: (width: number) => void;
  groundRef1: HTMLImageElement | null;
  groundRef2: HTMLImageElement | null;
  worldElem: HTMLElement | null;
  setWorldElem: (worldElem: HTMLElement) => void;
  scoreElem: HTMLElement | null;
  setScoreElem: (scoreElem: HTMLElement) => void;
  startScreenElem: HTMLElement | null;
  setStartScreenElem: (startScreenElem: HTMLElement) => void;
};

export const useGroundStore = create<GroundState>((set) => ({
  left1: 0,
  left2: 300,
  width: 300,
  setWidth: (width: number) => set({ width }),
  groundRef1: null,
  groundRef2: null,
  worldElem: null,
  scoreElem: null,
  startScreenElem: null,
  setWorldElem: (worldElem: HTMLElement) => set({ worldElem }),
  setScoreElem: (scoreElem: HTMLElement) => set({ scoreElem }),
  setStartScreenElem: (startScreenElem: HTMLElement) =>
    set({ startScreenElem }),
}));
