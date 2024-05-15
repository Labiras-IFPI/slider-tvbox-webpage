export const hidePartOfText = (
  text: string,
  takeFromBegin: number,
  takeFromEnd: number
) => {
  if (text.length <= takeFromBegin + takeFromEnd) {
    return text;
  }
  const beginText = text.slice(0, takeFromBegin);

  const endText = text.slice(text.length - takeFromEnd);

  return beginText + "(...)" + endText;
};
