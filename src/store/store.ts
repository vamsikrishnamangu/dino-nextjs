import { create } from "zustand";

type GroundState = {
  left1: number;
  left2: number;
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
  worldElem: null,
  scoreElem: null,
  startScreenElem: null,
  setWorldElem: (worldElem: HTMLElement) => set({ worldElem }),
  setScoreElem: (scoreElem: HTMLElement) => set({ scoreElem }),
  setStartScreenElem: (startScreenElem: HTMLElement) =>
    set({ startScreenElem }),
}));
