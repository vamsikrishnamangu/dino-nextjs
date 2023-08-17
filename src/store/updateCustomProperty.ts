export function getCustomProperty(
  elem: HTMLElement | null,
  prop: string
): number {
  if (!elem) {
    console.log("Attempting to get a style of a non-existent element.");
    return 0;
  }

  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
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
