"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function error(...text) {
    console.log(chalk_1.default.white.bgRed(text, '\n'));
}
function info(...text) {
    console.log(chalk_1.default.underline(text));
}
function success(...text) {
    console.log(chalk_1.default.green(text));
}
exports.default = {
    error,
    info,
    success
};
