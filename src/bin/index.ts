#!/usr/bin/env node

import copy from './lib/copy'
import extract from './lib/extract'
import pack from './lib/pack'

Promise.resolve().then(extract).then(pack).then(copy).catch(console.error)
