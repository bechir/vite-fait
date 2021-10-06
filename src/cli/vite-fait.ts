#!/usr/bin/env node

import yargs from 'yargs';
import { spawn } from 'child_process';

// import { cac } from 'cac';

// const cli = cac('vite-backend');

// cli.command('[root]')
//     .alias('serve')
//     .alias('dev')

// ;

import { generateBuildEntrypoints, generateDevEntrypoints } from '../entrypoints-generator'
import path from 'path';

yargs
    .command('build', 'Build for production', () => {}, (args: any) => {
        run('build', args.config);
    })
    .command(['dev', '$0'], 'Start dev server', () => {}, (args: any) => {
        run('dev', args.config);
    })
    .command('preview', 'Locally preview production build', () => {}, (args: any) => {
        run('preview', args.config);
    })
    .parse();

function run(mode: 'build' | 'dev' | 'preview', configFile: string) {
    configFile = path.resolve(process.cwd(), configFile ?? 'vite.config.js')

    if(mode !== 'build') {
        // const config = require(configFile);
        // console.log(config);
        require('vite/bin/vite');

        generateDevEntrypoints(configFile);

    } else {
        const ls = spawn(`vite ${mode} --config ${configFile}`, { stdio: "inherit", shell: true });

        ls.on('close', code => {
            if(code !== 0) {
                throw new Error(`yarn process exited with code ${code}`)
            }

            generateBuildEntrypoints(configFile);
        });

        ls.on('error', code => {
            console.log(`child process errored with code ${code}`);
        });
    }
}
