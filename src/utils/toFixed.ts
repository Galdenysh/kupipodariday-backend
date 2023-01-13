export function toFixed(value: unknown, point: number) {
  const number = Number(value);

  if (number) {
    if (!Number.isInteger(number)) {
      return number.toFixed(point);
    }
  }

  return value;
}
