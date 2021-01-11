import { extractAll } from 'asar'
import { promises as fs } from 'fs'

import { asarExtractRoot, asarPath, backupAsarPath, backupUnpackedPath, logger, rimraf, unpackedPath } from './common'

const log = logger('EXTRACT')

export default async function () {
  log('start')

  const { targetAsarPath, isBak } = await getPathToExtract(asarPath, backupAsarPath)

  log('cleaning')
  await rimraf(asarExtractRoot)

  if (isBak) {
    log('extract from backup')

    try {
      log('temp symlink creating')
      await fs.symlink(unpackedPath, backupUnpackedPath)
    } catch {}
  }

  log('extracting')
  extractAll(targetAsarPath, asarExtractRoot)

  if (isBak) {
    log('temp symlink deleting')
    await fs.unlink(backupUnpackedPath)
  }

  log('success')
}

async function getPathToExtract(org: string, bak: string) {
  return fs.stat(bak).then(
    () => ({ targetAsarPath: bak, isBak: true }),
    () => ({ targetAsarPath: org, isBak: false }),
  )
}
