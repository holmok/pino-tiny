#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoTinyPrettifier = void 0;
var logger_1 = require("./logger");
if (require.main === module) {
    (0, logger_1.start)();
}
exports.PinoTinyPrettifier = logger_1.prettifier;
