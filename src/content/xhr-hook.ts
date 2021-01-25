import { createExposedContext } from './context'
import { safe } from './util'

interface ResponseData<T = any> {
  url: string
  response: T
}

type Hook<T = any> = (response: ResponseData<T>) => ResponseData<T> | void

type JsonHook<T> = (url: URL, json: T) => boolean | void

const hooks = new Set<Hook>()

function runHooks(data: ResponseData) {
  try {
    return Array.from(hooks).reduce((response, fn) => fn(response) || response, data)
  } catch (error) {
    alert(`runHooks error: ${String(error)}`)

    return data
  }
}

export function addHook<T>(fn: Hook<T>) {
  hooks.add(fn)
}

export function addJsonHook<T>(fn: JsonHook<T>) {
  addHook<string>(({ url, response }) => {
    const json = safe(() => JSON.parse(response) as T)()

    if (json !== undefined) {
      const modified = fn(new URL(url), json)

      if (modified) {
        return {
          url,
          response: JSON.stringify(json),
        }
      }
    }
  })
}

createExposedContext({ runHooks }).execute(exposed => {
  const RawXHR = XMLHttpRequest

  window.XMLHttpRequest = new Proxy(RawXHR, {
    construct() {
      const xhr = new RawXHR()

      xhr.addEventListener('load', function () {
        const { response } = exposed.runHooks({
          url: xhr.responseURL,
          response: xhr.response,
        })

        Object.defineProperty(xhr, 'response', {
          configurable: true,
          enumerable: true,
          get: response,
        })
      })

      return xhr
    },
  })
})
