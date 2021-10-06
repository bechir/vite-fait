import { RollupOptions } from 'rollup'
import { BuildOptions, ServerOptions, UserConfigExport, Plugin as VitePlugin } from 'vite'
import { MinfiyOption } from './types';
import { VariableOptions, Config } from './config';

const config = new Config((process.env.NODE_ENV as any) || 'dev');

class Api {

    setBase(base: string): this {
        config.setBase(base);

        return this;
    }

    setRoot(root: string): this {
        config.setRoot(root);

        return this;
    }

    setOutputPath(path: string): this {
        config.setOutputPath(path);

        return this;
    }

    usePlugins(plugins: VitePlugin | VitePlugin[] = []): this {
        config.usePlugins(plugins);

        return this;
    }

    watch(paths: string | string[]): this {
        config.watch(paths);

        return this;
    }

    addBuildOptions(options: BuildOptions): this {
        config.addBuildOptions(options);

        return this;
    }

    addRollupOptions(options: RollupOptions | RollupOptions[]): this {
        config.addRollupOptions(options);

        return this;
    }

    addEntry(name: string, entry: string): this {
        config.addEntry(name, entry);

        return this;
    }

    splitEntryChunks(split: boolean): this {
        config.splitEntryChunks(split);

        return this;
    }

    enableVersioning(enable = true): this {
        config.enableVersioning(enable);

        return this;
    }

    /**
     * Set to false to disable minification, or specify the minifier to use.
     * 
     * @param {boolean | "terser" | "esbuild"}
     */
    minify(minify: MinfiyOption = true): this {
        config.minify(minify);

        return this;
    }

    provideVariables(variables: VariableOptions): this {
        config.provideVariables(variables);

        return this;
    }

    getViteConfig(): UserConfigExport {
        return config.getViteConfig();
    }

    isDev(): boolean {
        return config.isDev();
    }

    isProduction(): boolean {
        return config.isProduction();
    }

    getEnv(): string {
        return config.getEnv();
    }

    setServerOptions(options: ServerOptions): this {
        config.setServerOptions(options);

        return this;
    }
}

module.exports = new Api()
