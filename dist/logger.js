"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback = exports.format = exports.parse = exports.prettifier = exports.start = void 0;
var split2_1 = __importDefault(require("split2"));
var through2_1 = __importDefault(require("through2"));
var pump_1 = __importDefault(require("pump"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var dateformat_1 = __importDefault(require("dateformat"));
var levels = {
    10: { prefix: 'TRC 🔎', color: chalk_1.default.rgb(128, 128, 128) },
    20: { prefix: 'DBG 🪲 ', color: chalk_1.default.rgb(255, 255, 0) },
    30: { prefix: 'INF ℹ️ ', color: chalk_1.default.rgb(0, 255, 0) },
    40: { prefix: 'WRN ⚠️ ', color: chalk_1.default.rgb(255, 128, 0) },
    50: { prefix: 'ERR 🔥', color: chalk_1.default.rgb(255, 0, 0) },
    60: { prefix: 'FTL 💣', color: chalk_1.default.bgRgb(255, 0, 0).white }
};
function start() {
    var thru = through2_1.default.obj(callback());
    var parser = (0, split2_1.default)(parse);
    (0, pump_1.default)(process.stdin, parser, thru, process.stdout).on('error', console.error);
    if (!process.stdin.isTTY && !fs_1.default.fstatSync(process.stdin.fd).isFile()) {
        process.once('SIGINT', function noOp() { console.log(); });
    }
}
exports.start = start;
function prettifier() {
    return function (options) {
        var key = options.msg;
        return function (data) {
            var _a;
            var entry = typeof data === 'string' ? parse(data) : data;
            return (_a = format(entry, key)) !== null && _a !== void 0 ? _a : '';
        };
    };
}
exports.prettifier = prettifier;
function parse(line) {
    try {
        var output = JSON.parse(line);
        return output;
    }
    catch (err) {
        return {
            level: 30,
            time: Date.now(),
            tags: ['info'],
            msg: line
        };
    }
}
exports.parse = parse;
function format(data, key) {
    var _a;
    if (key === void 0) { key = 'msg'; }
    var isWeb = data.res != null && data.req != null;
    var level = levels[data.level];
    var prefix = level != null ? level.color(level.prefix) : chalk_1.default.grey('????');
    var web = isWeb ? data.req.method + " " + data.req.url + " (" + data.res.statusCode + (data.responseTime != null ? "/" + data.responseTime.toLocaleString() + "ms" : '') + ")" : '';
    var msg = (_a = data[key]) !== null && _a !== void 0 ? _a : chalk_1.default.grey(JSON.stringify(data));
    var output = prefix + " " + chalk_1.default.dim((0, dateformat_1.default)(data.time, 'HH:mm:ss.l')) + " " + msg + " " + chalk_1.default.dim(web) + "\n";
    return output;
}
exports.format = format;
function callback() {
    return function (input, _enc, cb) {
        try {
            cb(null, format(input));
        }
        catch (err) {
            cb(new Error("Unable to process log: \"" + JSON.stringify(input) + "\". error: " + err.message));
        }
    };
}
exports.callback = callback;
