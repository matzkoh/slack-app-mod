export async function msleep(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export async function msleepReject(ms = 0, message = 'timeout'): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
}

export async function waitSelector<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
  timeout = 10_000,
): Promise<T> {
  return (
    root.querySelector<T>(selector) ??
    Promise.race([
      msleep(100).then(() => waitSelector<T>(selector, root)),
      msleepReject(timeout, `querySelector timed out (${timeout} ms): ${selector}`),
    ])
  )
}

export function lazy<T>(fn: () => T) {
  let result: T | undefined

  return () => {
    if (result === undefined) {
      result = fn()
    }

    return result
  }
}

export function safe<T, P extends unknown[], R>(fn: (this: T, ...args: P) => R) {
  return function (this: T, ...args: P) {
    try {
      return fn.apply(this, args)
    } catch {}
  }
}
