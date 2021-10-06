#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const child_process_1 = require("child_process");
// import { cac } from 'cac';
// const cli = cac('vite-backend');
// cli.command('[root]')
//     .alias('serve')
//     .alias('dev')
// ;
const entrypoints_generator_1 = require("../entrypoints-generator");
const path_1 = __importDefault(require("path"));
yargs_1.default
    .command('build', 'Build for production', () => { }, (args) => {
    run('build', args.config);
})
    .command(['dev', '$0'], 'Start dev server', () => { }, (args) => {
    run('dev', args.config);
})
    .command('preview', 'Locally preview production build', () => { }, (args) => {
    run('preview', args.config);
})
    .parse();
function run(mode, configFile) {
    configFile = path_1.default.resolve(process.cwd(), configFile !== null && configFile !== void 0 ? configFile : 'vite.config.js');
    if (mode !== 'build') {
        // const config = require(configFile);
        // console.log(config);
        require('vite/bin/vite');
        (0, entrypoints_generator_1.generateDevEntrypoints)(configFile);
    }
    else {
        const ls = (0, child_process_1.spawn)(`vite ${mode} --config ${configFile}`, { stdio: "inherit", shell: true });
        ls.on('close', code => {
            if (code !== 0) {
                throw new Error(`yarn process exited with code ${code}`);
            }
            (0, entrypoints_generator_1.generateBuildEntrypoints)(configFile);
        });
        ls.on('error', code => {
            console.log(`child process errored with code ${code}`);
        });
    }
}
