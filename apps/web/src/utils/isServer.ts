export const isServer = () => {
  return typeof window === 'undefined' && typeof globalThis !== 'undefined'
}
