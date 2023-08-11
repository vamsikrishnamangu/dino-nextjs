export function getCustomProperty(
  elem: HTMLElement | null,
  prop: string
): number {
  return (
    parseFloat(getComputedStyle(elem as Element).getPropertyValue(prop)) || 0
  );
}

export function setCustomProperty(
  elem: HTMLElement | null,
  prop: string,
  value: number | string
): void {
  elem?.style.setProperty(prop, value.toString());
}

export function incrementCustomProperty(
  elem: HTMLElement | null,
  prop: string,
  inc: number
): void {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
