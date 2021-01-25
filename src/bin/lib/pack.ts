import { createPackageWithOptions } from 'asar'
import { createReadStream } from 'fs'
import { basename, join, relative } from 'path'
import { Readable } from 'stream'

import {
  asarExtractRoot,
  asarPackRoot,
  asarPath,
  contentScriptPath,
  listFiles,
  logger,
  rimraf,
  unpackedPath,
} from './common'

const log = logger('PACK')

export default async function () {
  log('start')

  log('cleaning')
  await rimraf(asarPackRoot)

  log('packing')
  await createPackageWithOptions(asarExtractRoot, join(asarPackRoot, basename(asarPath)), {
    // @ts-expect-error: async generator is supported
    transform: transformer(),
    unpack: toGlobPattern(await listUnpacked()),
  })

  log('success')
}

async function listUnpacked() {
  const files = await listFiles(unpackedPath)

  return files.map(file => relative(unpackedPath, file))
}

function toGlobPattern(files: string[]) {
  return `{${files.map(file => join(asarExtractRoot, file)).join(',')}}`
}

function transformer() {
  const preloader = join(asarExtractRoot, 'dist/preload.bundle.js')

  return (file: string) => {
    if (file === preloader) {
      return injectContentScript
    }
  }
}

async function* injectContentScript(source: Readable) {
  await Promise.resolve()
  yield* createReadStream(contentScriptPath)
  yield* Readable.from('\n')
  yield* source
}
