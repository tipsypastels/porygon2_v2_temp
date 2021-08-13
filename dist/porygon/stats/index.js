"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailurePercentStat = exports.CounterStat = exports.TimeDifferenceStat = exports.uptime = void 0;
const time_difference_1 = require("./time_difference");
Object.defineProperty(exports, "TimeDifferenceStat", { enumerable: true, get: function () { return time_difference_1.TimeDifferenceStat; } });
exports.uptime = new time_difference_1.TimeDifferenceStat();
var counter_1 = require("./counter");
Object.defineProperty(exports, "CounterStat", { enumerable: true, get: function () { return counter_1.CounterStat; } });
var failure_percent_1 = require("./failure_percent");
Object.defineProperty(exports, "FailurePercentStat", { enumerable: true, get: function () { return failure_percent_1.FailurePercentStat; } });
