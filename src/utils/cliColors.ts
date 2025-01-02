const colors = {
  red: ['red', 31],
  green: ['green', 32],
  blue: ['blue', 34],
  white: ['white', 37],
  cyan: ['cyan', 36],
  magenta: ['magenta', 35],
  yellow: ['yellow', 33],
  orange: ['orange', 93],
};

export const {
  red,
  green,
  blue,
  white,
  cyan,
  magenta,
  yellow,
  orange,
}: Record<keyof typeof colors, (f: string) => string> = Object.values(colors).reduce(
  (cols, col) => ({
    ...cols,
    [col[0]]: (f: string) => `\x1b[${col[1]}m${f}\x1b[0m`,
  }),
  {} as Record<keyof typeof colors, (f: string) => string>
);
