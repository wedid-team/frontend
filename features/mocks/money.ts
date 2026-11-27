// The fixtures use won. Existing UI and saved plan budgets use ten-thousand won.
export const toManwon = (won: number) => won / 10_000;
export const toManwonRange = ([min, max]: readonly [number, number]): [number, number] => [
  toManwon(min),
  toManwon(max),
];
