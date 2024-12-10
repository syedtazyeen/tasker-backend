export function stringToEnum<T>(
  enumObj: T,
  value: string,
  defaultValue?: T[keyof T],
): T[keyof T] | undefined {
  return (Object.values(enumObj) as string[]).includes(value)
    ? (value as T[keyof T])
    : defaultValue || undefined;
}
