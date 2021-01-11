export function run(fn: () => void | Promise<void>) {
  void Promise.resolve(fn()).catch(console.error)
}
