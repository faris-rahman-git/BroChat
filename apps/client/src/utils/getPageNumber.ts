export function getPageNumber(current: number, totaldata: number) {
  const result = totaldata % 10 === 1 ? current - 1 : current;
  console.log(current, totaldata, result);
  return result < 1 ? 1 : result;
}
