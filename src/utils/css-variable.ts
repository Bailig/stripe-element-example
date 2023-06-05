import convert from "color-convert";

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name);

const toHslNumbers = (hsl: string): [number, number, number] => {
  const [h, s, l] = hsl.replaceAll("%", "").split(" ");
  if (h === undefined || s === undefined || l === undefined) {
    throw new Error("Invalid HSL color, must be in format 'h s l'");
  }
  return [+h, +s, +l];
};

export const getCssVariableHexColor = (name: string) => {
  const colorString = getCssVariable(name);
  const colorTuple = toHslNumbers(colorString);
  return `#${convert.hsl.hex(colorTuple)}`;
};
