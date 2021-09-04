#!/usr/bin/env node
import { start, prettifier } from './logger'

if (require.main === module) {
  start()
}

export const PinoTinyPrettifier = prettifier
