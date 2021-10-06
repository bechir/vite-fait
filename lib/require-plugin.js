"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOrFail = void 0;
const process_1 = require("process");
const logger_1 = __importDefault(require("./logger"));
function requireOrFail(name, id, cb) {
    try {
        const requiredPackage = require(name);
        cb(requiredPackage);
    }
    catch (er) {
        logger_1.default.error(`Install ${id} to use ${name} plugin`);
        (0, process_1.exit)(1);
    }
}
exports.requireOrFail = requireOrFail;
