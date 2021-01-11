#!/usr/bin/env ts-node-script

import('./lib/pack').then(module => module.default()).catch(console.error)
