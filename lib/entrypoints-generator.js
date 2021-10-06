"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDevEntrypoints = exports.generateBuildEntrypoints = void 0;
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
const path_1 = __importDefault(require("path"));
const IMPORTS = ['imports', 'dynamicImports'];
/**
 *
 * @param {string} configFile
 * @default `vite.config.js`
 */
function generateBuildEntrypoints(configFile) {
    const { config, absOutDir } = getConfigFromFile(configFile);
    const manifestPath = path_1.default.resolve(absOutDir, 'manifest.json');
    if (!fs_1.default.existsSync(manifestPath)) {
        logger_1.default.error(`manifest.json not found in ${absOutDir}`);
        process.exit(1);
    }
    const manifest = JSON.parse(fs_1.default.readFileSync(manifestPath, 'utf-8'));
    const entrypoints = buildEntrypoints(manifest, config, (value) => addOutputPathPrefix(config.base, absOutDir, value));
    outputEntrypoints(entrypoints, absOutDir);
}
exports.generateBuildEntrypoints = generateBuildEntrypoints;
function addOutputPathPrefix(base, outDir, value) {
    const from = outDir.lastIndexOf(removeTrainingSlash(base));
    if (from === -1) {
        return path_1.default.join(base, value);
    }
    return path_1.default.resolve(outDir.substr(from), value);
}
function generateDevEntrypoints(configFile) {
    const { config, absOutDir } = getConfigFromFile(configFile);
    const entries = getViteEntries(config);
    const entrypoints = new Map();
    const { host = 'localhost', port = 3000, https = false } = config.server;
    const baseUrl = `http${https ? 's' : ''}://${host}:${port}`;
    for (const [name, entry] of Object.entries(entries)) {
        entrypoints.set(name, {
            js: [
                baseUrl + `${config.base}@vite/client`,
                baseUrl + addOutputPathPrefix(config.base, absOutDir, path_1.default.basename(entry))
            ]
        });
    }
    outputEntrypoints(entrypoints, absOutDir);
}
exports.generateDevEntrypoints = generateDevEntrypoints;
function getConfigFromFile(file) {
    const config = require(file)({ command: 'build' });
    return {
        config,
        absOutDir: path_1.default.resolve(config.root || '', config.build.outDir)
    };
}
function outputEntrypoints(entries, outDir) {
    const entrypointsFilename = path_1.default.resolve(outDir, 'entrypoints.json');
    const dir = path_1.default.dirname(entrypointsFilename);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    fs_1.default.writeFile(entrypointsFilename, JSON.stringify({ 'entrypoints': Object.fromEntries(entries) }, null, 2), err => {
        if (err) {
            throw err;
        }
        logger_1.default.success(`Generated ${entrypointsFilename.substr(process.cwd().length + 1)}`);
    });
}
function removeTrainingSlash(_path) {
    return _path.replace(/\/$/, '').replace(/\\$/, '');
}
function getViteEntries(config) {
    if (!config.build || !config.build.rollupOptions) {
        throw new Error("Provide at least one entry point.");
    }
    const entries = config.build.rollupOptions.input;
    if (typeof entries !== "object") {
        logger_1.default.error("rollupOptions.input must be of type object - eg. {app: './assets/app.js'}");
        process.exit(1);
    }
    return entries;
}
function buildEntrypoints(manifest, config, outputPathPrefixer) {
    var _a;
    const entrypoints = new Map();
    const entries = getViteEntries(config);
    for (let [entryName, entryKey] of Object.entries(entries)) {
        entryKey = path_1.default.normalize(entryKey.replace(/^.+\.\//, ''));
        const chunk = manifest[entryKey];
        const javascripts = [outputPathPrefixer(chunk.file)];
        const stylesheets = [...(((_a = chunk.css) === null || _a === void 0 ? void 0 : _a.map((css) => outputPathPrefixer(css))) || [])];
        IMPORTS.forEach(type => {
            const imports = extractImports(chunk[type], manifest, outputPathPrefixer);
            javascripts.push(...imports.javascripts);
            stylesheets.push(...imports.stylesheets);
        });
        const uniques = (val, index, arr) => arr.indexOf(val) === index;
        entrypoints.set(entryName, {
            js: javascripts.filter(uniques),
            css: stylesheets.filter(uniques)
        });
    }
    return entrypoints;
}
/**
 * Recursively add files from [imports] and [dynamicImports] in manifest object
 *
 * @param imports
 * @param manifest
 * @param outputPathPrefixer
 * @returns {object} javascripts and stylesheets
 */
function extractImports(imports, manifest, outputPathPrefixer) {
    const javascripts = [];
    const stylesheets = [];
    if (imports && imports.length >= 1) {
        imports.forEach(name => {
            const newManifest = manifest[name];
            if (newManifest !== undefined) {
                if (newManifest.file) {
                    javascripts.push(outputPathPrefixer(newManifest.file));
                }
                if (newManifest.css) {
                    stylesheets.push(...newManifest.css.map((css) => outputPathPrefixer(css)));
                }
                IMPORTS.forEach(type => {
                    var _a;
                    if (((_a = newManifest[type]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        const { javascripts: js, stylesheets: css } = extractImports(newManifest[type], manifest, outputPathPrefixer);
                        javascripts.push(...js);
                        stylesheets.push(...css);
                    }
                });
            }
        });
    }
    return { javascripts, stylesheets };
}
