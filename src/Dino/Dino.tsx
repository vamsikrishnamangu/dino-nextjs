export function setDinoLose(dinoRef: React.RefObject<HTMLImageElement>) {
  dinoRef.current!.src = "/dino-lose.png";
}
