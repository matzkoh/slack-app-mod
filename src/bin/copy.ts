#!/usr/bin/env ts-node-script

import('./lib/copy').then(module => module.default()).catch(console.error)
