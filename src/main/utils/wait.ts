export const wait = (ms: number = 50): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
