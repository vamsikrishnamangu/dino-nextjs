export function getDinoRect(dinoRef: React.RefObject<HTMLImageElement>) {
  return dinoRef.current?.getBoundingClientRect();
}

export function setDinoLose(dinoRef: React.RefObject<HTMLImageElement>) {
  dinoRef.current!.src = "/dino-lose.png";
}
