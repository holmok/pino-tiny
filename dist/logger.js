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
var strip_ansi_1 = __importDefault(require("strip-ansi"));
var levels = {
    10: { letters: 'TRC', icon: ' 🔎', color: chalk_1.default.rgb(128, 128, 128) },
    20: { letters: 'DBG', icon: ' 🪲 ', color: chalk_1.default.rgb(255, 255, 0) },
    30: { letters: 'INF', icon: ' ℹ️ ', color: chalk_1.default.rgb(0, 255, 0) },
    40: { letters: 'WRN', icon: ' ⚠️ ', color: chalk_1.default.rgb(255, 128, 0) },
    50: { letters: 'ERR', icon: ' 🔥', color: chalk_1.default.rgb(255, 0, 0) },
    60: { letters: 'FTL', icon: ' 💣', color: chalk_1.default.bgRgb(255, 0, 0).white }
};
var unknown = { letters: '???', icon: ' 🤷‍', color: chalk_1.default.rgb(128, 128, 128) };
function start(options) {
    var thru = through2_1.default.obj(callback(options));
    var parser = (0, split2_1.default)(parse);
    (0, pump_1.default)(process.stdin, parser, thru, process.stdout).on('error', console.error);
    if (!process.stdin.isTTY && !fs_1.default.fstatSync(process.stdin.fd).isFile()) {
        process.once('SIGINT', function noOp() { console.log(); });
    }
}
exports.start = start;
function prettifier(options) {
    return function () {
        return function (data) {
            var _a;
            var entry = typeof data === 'string' ? parse(data) : data;
            return (_a = format(entry, options)) !== null && _a !== void 0 ? _a : '';
        };
    };
}
exports.prettifier = prettifier;
function parse(line) {
    try {
        var output = JSON.parse(line);
        console.log(line);
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
function format(data, options) {
    var _a, _b, _c, _d, _e, _f;
    if (options === void 0) { options = {}; }
    if (options.filter != null) {
        data = options.filter(data);
    }
    if (data == null)
        return;
    var parts = [];
    var level = (_a = levels[data.level]) !== null && _a !== void 0 ? _a : unknown;
    if (!((_b = options.hideLetters) !== null && _b !== void 0 ? _b : false)) {
        var prefix = [level.letters];
        if ((!((_c = options.hideIcons) !== null && _c !== void 0 ? _c : false))) {
            prefix.push(level.icon);
        }
        parts.push(level.color(prefix.join(' ')));
    }
    if (!((_d = options.hideTimestamp) !== null && _d !== void 0 ? _d : false)) {
        parts.push(chalk_1.default.dim((0, dateformat_1.default)(data.time, 'HH:mm:ss.l')));
    }
    parts.push(data.msg);
    if (!((_e = options.hideTimestamp) !== null && _e !== void 0 ? _e : false) && data.res != null && data.req != null) {
        parts.push(chalk_1.default.dim(data.req.method + " " + data.req.url + " (" + data.res.statusCode + (data.responseTime != null ? "/" + data.responseTime.toLocaleString() + "ms" : '') + ")"));
    }
    var output = parts.join(' ') + "\n";
    return ((_f = options.hideColors) !== null && _f !== void 0 ? _f : false) ? (0, strip_ansi_1.default)(output) : output;
}
exports.format = format;
function callback(options) {
    return function (input, _enc, cb) {
        try {
            cb(null, format(input, options));
        }
        catch (err) {
            cb(new Error("Unable to process log: \"" + JSON.stringify(input) + "\". error: " + err.message));
        }
    };
}
exports.callback = callback;
