"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViteConfig = void 0;
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
class ViteConfig {
    constructor(env) {
        this.env = env;
        this.outputPath = 'public/dist';
        this.plugins = [];
        this.buildOptions = {};
        this.base = '/dist';
        this.root = '/';
        this.watchedPaths = [];
        this.env = env;
        this.splitEntries = true;
        this.useVersioning = false;
        this.minfiy = false;
        this.entrypoints = new Map();
        this.rollupOptions = [];
    }
    setBase(base) {
        this.base = base;
    }
    setRoot(root) {
        this.root = root;
    }
    setOutputPath(path) {
        this.outputPath = path;
    }
    usePlugins(plugins = []) {
        if (!Array.isArray(plugins)) {
            plugins = [plugins];
        }
        this.plugins.push(...plugins);
    }
    watch(paths) {
        this.watchedPaths = paths;
    }
    addBuildOptions(options) {
        this.buildOptions = options;
    }
    addRollupOptions(options) {
        this.rollupOptions = options;
    }
    addEntry(name, entry) {
        this.entrypoints.set(name, entry);
    }
    splitEntryChunks(split = true) {
        this.splitEntries = split;
    }
    enableVersioning(enable = true) {
        this.useVersioning = enable;
    }
    minify(minify = true) {
        this.minfiy = minify;
    }
    provideVariables(variables) {
        this.providedVariables = variables;
    }
    isDev() {
        return this.env === "dev";
    }
    isProduction() {
        return this.env === "production";
    }
    getEnv() {
        return this.env;
    }
    setServerOptions(options) {
        this.serverOptions = options;
    }
    getOutputFilename(type) {
        let output = `[name]${this.useVersioning ? '.[hash]' : ''}`;
        if (type == 'asset') {
            output += '[extname]';
        }
        else {
            output += '.js';
        }
        return output;
    }
    handleHMR() {
        const watchedPaths = this.watchedPaths;
        return {
            name: 'vite-plugin-user-hmr',
            configureServer(devServer) {
                const { watcher, ws } = devServer;
                watcher.add(watchedPaths);
                watcher.on("change", () => ws.send({ type: "full-reload" }));
            },
        };
    }
    getPlugins() {
        const plugins = [];
        if (this.watchedPaths.length) {
            plugins.push(this.handleHMR());
        }
        plugins.push(...this.plugins);
        return plugins;
    }
    getViteConfig() {
        return (0, vite_1.defineConfig)(({ command }) => ({
            base: command == 'build' ? this.base : '',
            root: command == 'build' ? undefined : this.root,
            publicDir: false,
            server: {
                strictPort: true,
                cors: true,
                ...this.serverOptions
            },
            emitManifest: true,
            define: this.providedVariables,
            build: {
                assetsDir: '',
                minify: this.minfiy,
                outDir: path_1.default.join(this.root, this.outputPath),
                rollupOptions: {
                    output: {
                        ...(!this.splitEntries && { manualChunks: undefined }),
                        assetFileNames: this.getOutputFilename('asset'),
                        chunkFileNames: this.getOutputFilename('chunck'),
                        entryFileNames: this.getOutputFilename('entry'),
                    },
                    input: Object.fromEntries(this.entrypoints),
                    ...this.rollupOptions,
                },
                ...this.buildOptions,
                manifest: true,
            },
            plugins: this.getPlugins()
        }));
    }
}
exports.ViteConfig = ViteConfig;
