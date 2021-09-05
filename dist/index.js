#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Run = exports.PinoTinyPrettifier = void 0;
var logger_1 = require("./logger");
var yargs_1 = __importDefault(require("yargs/yargs"));
var helpers_1 = __importDefault(require("yargs/helpers"));
function run(filter) {
    var argv = (0, yargs_1.default)(helpers_1.default.hideBin(process.argv)).options({
        i: { type: 'boolean', default: false, alias: 'hide-icons', description: 'Hide level emoji icons.' },
        l: { type: 'boolean', default: false, alias: 'hide-letters', description: 'Hide level letters.' },
        t: { type: 'boolean', default: false, alias: 'hide-timestamp', description: 'Hide the timestamp.' },
        c: { type: 'boolean', default: false, alias: 'hide-colors', description: 'Remove ansi colors from output.' },
        w: { type: 'boolean', default: false, alias: 'hide-web', description: 'Hide web stats.' },
        m: { type: 'string', default: 'msg', alias: 'msg-key', description: 'The key to use for message from the JSON log data.' }
    }).parseSync();
    var cliOptions = {
        hideIcons: argv.i,
        hideLetters: argv.l,
        hideTimestamp: argv.t,
        hideColors: argv.c,
        msgKey: argv.m,
        hideWeb: argv.w
    };
    if (filter != null)
        cliOptions.filter = filter;
    (0, logger_1.start)(cliOptions);
}
if (require.main === module) {
    run();
}
exports.PinoTinyPrettifier = logger_1.prettifier;
exports.Run = run;
