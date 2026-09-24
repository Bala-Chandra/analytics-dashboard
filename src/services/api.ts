export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

export const createRequestId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
