export async function msleep(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export async function waitSelector<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): Promise<T> {
  return root.querySelector<T>(selector) ?? msleep().then(() => waitSelector(selector, root))
}
