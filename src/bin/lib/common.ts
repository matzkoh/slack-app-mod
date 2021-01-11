import { promises as fs } from 'fs'
import { resolve } from 'path'
import _rimraf from 'rimraf'
import { promisify } from 'util'

export const rimraf = promisify(_rimraf)

export const asarExtractRoot = 'asar/extract'
export const asarPackRoot = 'asar/pack'

export const asarPath = '/Applications/Slack.app/Contents/Resources/app.asar'
export const backupAsarPath = asarPath + '.bak'

export const unpackedPath = asarPath + '.unpacked'
export const backupUnpackedPath = backupAsarPath + '.unpacked'

export async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(dirent => {
      const abs = resolve(dir, dirent.name)

      return dirent.isDirectory() ? listFiles(abs) : [abs]
    }),
  )

  return files.flat()
}

export function run(fn: () => unknown) {
  const result = fn()

  if (result instanceof Promise) {
    result.then(() => console.log('success'), console.error)
  } else {
    console.log('success')
  }
}

export function logger(title: string) {
  return (message: string) => console.log(`[${title}] ${message}`)
}
