import { UserConfig } from "vite";
import fs from 'fs';
import logger from './logger';
import path from "path";

const IMPORTS = ['imports', 'dynamicImports'];

/**
 * 
 * @param {string} configFile
 * @default `vite.config.js`
 */
export function generateBuildEntrypoints(configFile: string) {
    const {config, absOutDir} = getConfigFromFile(configFile);
    const manifestPath = path.resolve(absOutDir, 'manifest.json');

    if(!fs.existsSync(manifestPath)) {
        logger.error(`manifest.json not found in ${absOutDir}`);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    const entrypoints = buildEntrypoints(
        manifest,
        config,
        (value: string) => addOutputPathPrefix(config.base, absOutDir, value)
    );

    outputEntrypoints(entrypoints, absOutDir);
}

function addOutputPathPrefix(base: string, outDir: string, value: string) {
    const from = outDir.lastIndexOf(removeTrainingSlash(base));

    if(from === -1) {
        return path.join(base, value);
    }

    return path.resolve(outDir.substr(from), value);
}

type EntryChunk = {
    js: string[];
    css?: string[];
}

export function generateDevEntrypoints(configFile: string) {
    const {config, absOutDir} = getConfigFromFile(configFile);

    const entries = getViteEntries(config);
    const entrypoints = new Map<string, EntryChunk>();

    const { host = 'localhost', port = 3000, https = false } = config.server;
    const baseUrl = `http${https ? 's' : ''}://${host}:${port}`

    for (const [name, entry] of Object.entries(entries)) {
        entrypoints.set(name, {
            js: [
                baseUrl+`${config.base}@vite/client`,
                baseUrl+addOutputPathPrefix(config.base, absOutDir, path.basename(entry))
            ]
        });
    }

    outputEntrypoints(entrypoints, absOutDir);
}

function getConfigFromFile(file: string) {
    const config = require(file)({ command: 'build' });

    return {
        config,
        absOutDir: path.resolve(config.root || '', config.build.outDir)
    };
}

function outputEntrypoints(entries: any, outDir: string) {
    const entrypointsFilename = path.resolve(outDir, 'entrypoints.json');

    const dir = path.dirname(entrypointsFilename);
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(entrypointsFilename, JSON.stringify({'entrypoints': Object.fromEntries(entries)}, null, 2), err => {
        if(err) {
            throw err;
        }
        logger.success(`Generated ${entrypointsFilename.substr(process.cwd().length+1)}`);
    })
}

function removeTrainingSlash(_path: string): string {
    return _path.replace(/\/$/, '').replace(/\\$/, '');
}

function getViteEntries(config: UserConfig) {
    if(!config.build || !config.build.rollupOptions) {
        throw new Error("Provide at least one entry point.");
    }

    const entries = config.build.rollupOptions.input;

    if(typeof entries !== "object") {
        logger.error("rollupOptions.input must be of type object - eg. {app: './assets/app.js'}");
        process.exit(1);
    }

    return entries;
}

function buildEntrypoints(manifest: any, config: UserConfig, outputPathPrefixer: CallableFunction) {
    const entrypoints = new Map();
    const entries = getViteEntries(config);

    for(let [entryName, entryKey] of Object.entries(entries)) {
        
        entryKey = path.normalize(entryKey.replace(/^.+\.\//,''));

        const chunk = manifest[entryKey];
        const javascripts = [outputPathPrefixer(chunk.file)];
        const stylesheets = [...(chunk.css?.map((css: string) => outputPathPrefixer(css)) || [])];

        IMPORTS.forEach(type => {
            const imports = extractImports(chunk[type], manifest, outputPathPrefixer);

            javascripts.push(...imports.javascripts)
            stylesheets.push(...imports.stylesheets)
        })

        const uniques = (val: string, index: number, arr: string[]) => arr.indexOf(val) === index;

        entrypoints.set(entryName, {
            js: javascripts.filter(uniques), // remove possible duplicates
            css: stylesheets.filter(uniques)
        })
    }

    return  entrypoints;
}

/**
 * Recursively add files from [imports] and [dynamicImports] in manifest object 
 * 
 * @param imports 
 * @param manifest 
 * @param outputPathPrefixer 
 * @returns {object} javascripts and stylesheets
 */
function extractImports(imports: null | undefined | string[], manifest: any, outputPathPrefixer: CallableFunction) {
    const javascripts: string[] = [];
    const stylesheets: string[] = [];

    if(imports && imports.length >= 1) {
        imports.forEach(name => {
            const newManifest = manifest[name];
            if(newManifest !== undefined) {
                if(newManifest.file) {
                    javascripts.push(outputPathPrefixer(newManifest.file));
                }
                if(newManifest.css) {
                    stylesheets.push(...newManifest.css.map((css: string) => outputPathPrefixer(css)));
                }

                IMPORTS.forEach(type => {
                    if(newManifest[type]?.length > 0) {
                        const {javascripts: js, stylesheets: css} = extractImports(newManifest[type], manifest, outputPathPrefixer)
                        javascripts.push(...js)
                        stylesheets.push(...css);
                    }
                })
            }
        });
    }

    return {javascripts, stylesheets}
}
