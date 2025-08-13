export const generateCode = (length: number = 6) => {
  return Math.random()
    .toString()
    .slice(2, 2 + length)
}
