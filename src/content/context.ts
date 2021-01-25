export function createExposedContext<T extends Record<string, (...args: any[]) => any>>(exposed: T) {
  const NAMESPACE = 'slackAppMod'

  ;[require][0]('electron').contextBridge.exposeInMainWorld(NAMESPACE, exposed)

  return {
    execute(fn: (exposed: T) => void) {
      const script = document.createElement('script')
      script.text = `(${fn.toString()})(window.${NAMESPACE})`
      document.appendChild(script).remove()
    },
  }
}
