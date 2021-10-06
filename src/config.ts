import path from 'path';
import { RollupOptions } from 'rollup';
import { BuildOptions, defineConfig, ServerOptions, UserConfigExport, Plugin as VitePlugin } from 'vite';
import { MinfiyOption } from './types';

export type VariableOptions = Record<string, any> | undefined;

export class Config {

    private splitEntries: boolean;
    private useVersioning: boolean;
    private minfiy: MinfiyOption;
    private entrypoints: Map<string, string>;
    private outputPath = 'public/dist';
    private plugins: VitePlugin[] = [];
    private buildOptions: BuildOptions = {};
    private rollupOptions: RollupOptions | RollupOptions[];
    private serverOptions: ServerOptions | undefined;
    private providedVariables: VariableOptions;
    private base = '/dist';
    private root = '/';
    private watchedPaths: string | string[] = [];

    constructor(private env: "dev" | "development" | "production") {
        this.env = env;
        this.splitEntries = true;
        this.useVersioning = false;
        this.minfiy = false;
        this.entrypoints = new Map<string, string>();
        this.rollupOptions = [];
    }

    setBase(base: string): void {
        this.base = base;
    }

    setRoot(root: string): void {
        this.root = root;
    }

    setOutputPath(path: string): void {
        this.outputPath = path;
    }

    usePlugins(plugins: VitePlugin | VitePlugin[] = []): void {
        if(!Array.isArray(plugins)) {
            plugins = [plugins]
        }
        this.plugins.push(...plugins);
    }

    watch(paths: string | string[]): void {
        this.watchedPaths = paths;
    }

    addBuildOptions(options: BuildOptions): void {
        this.buildOptions = options;
    }

    addRollupOptions(options: RollupOptions | RollupOptions[]): void {
        this.rollupOptions = options;
    }

    addEntry(name: string, entry: string): void {
        this.entrypoints.set(name, entry);
    }

    splitEntryChunks(split = true): void {
        this.splitEntries = split;
    }

    enableVersioning(enable = true): void {
        this.useVersioning = enable;
    }

    minify(minify: MinfiyOption = true): void {
        this.minfiy = minify;
    }

    provideVariables(variables: VariableOptions): void {
        this.providedVariables = variables;
    }

    isDev(): boolean {
        return this.env === "dev";
    }

    isProduction(): boolean {
        return this.env === "production";
    }

    getEnv(): string {
        return this.env;
    }

    setServerOptions(options: ServerOptions): void {
        this.serverOptions = options;
    }

    private getOutputFilename(type: 'asset' | 'chunck' | 'entry'): string {
        let output = `[name]${this.useVersioning ? '.[hash]' : ''}`;

        if (type == 'asset') {
            output += '[extname]';
        } else {
            output += '.js';
        }

        return output;
    }

    handleHMR(): VitePlugin {
        const watchedPaths = this.watchedPaths;
        return {
            name: 'vite-plugin-user-hmr',
            configureServer(devServer) {
                const { watcher, ws } = devServer;
                watcher.add(watchedPaths);
                watcher.on("change", () => ws.send({ type: "full-reload" }));
            },
        }
    }

    getPlugins(): VitePlugin[] {
        const plugins: VitePlugin[] = [];

        if(this.watchedPaths.length) {
            plugins.push(this.handleHMR());
        }

        plugins.push(...this.plugins);

        return plugins;
    }

    getViteConfig(): UserConfigExport {
        return defineConfig(({ command }) => ({
            base: this.base,
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
                outDir: path.join(this.root, this.outputPath),
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
