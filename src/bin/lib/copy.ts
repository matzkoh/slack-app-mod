import { constants as fsConstants, promises as fs } from 'fs'

import { asarPackRoot, asarPath, backupAsarPath, logger } from './common'

const log = logger('COPY')

export default async function () {
  log('start')

  try {
    log('trying to create backup')
    await fs.copyFile(asarPath, backupAsarPath, fsConstants.COPYFILE_EXCL)
    log('backup success')
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error?.code === 'EEXIST') {
      log('backup already exists. skipping')
    } else {
      throw error
    }
  }

  log('copying')
  await fs.copyFile(`${asarPackRoot}/app.asar`, asarPath)

  log('success')
}
