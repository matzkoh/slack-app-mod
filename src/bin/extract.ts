#!/usr/bin/env ts-node-script

import('./lib/extract').then(module => module.default()).catch(console.error)
