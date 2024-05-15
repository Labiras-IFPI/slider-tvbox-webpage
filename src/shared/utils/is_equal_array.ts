export const isEqualArray = <T>(
  newArray: Array<T>,
  oldArray: Array<T>
): Boolean => {
  return JSON.stringify(newArray) !== JSON.stringify(oldArray);
};
