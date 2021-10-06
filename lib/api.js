"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const config = new config_1.Config(process.env.NODE_ENV || 'dev');
class Api {
    setBase(base) {
        config.setBase(base);
        return this;
    }
    setRoot(root) {
        config.setRoot(root);
        return this;
    }
    setOutputPath(path) {
        config.setOutputPath(path);
        return this;
    }
    usePlugins(plugins = []) {
        config.usePlugins(plugins);
        return this;
    }
    watch(paths) {
        config.watch(paths);
        return this;
    }
    addBuildOptions(options) {
        config.addBuildOptions(options);
        return this;
    }
    addRollupOptions(options) {
        config.addRollupOptions(options);
        return this;
    }
    addEntry(name, entry) {
        config.addEntry(name, entry);
        return this;
    }
    splitEntryChunks(split) {
        config.splitEntryChunks(split);
        return this;
    }
    enableVersioning(enable = true) {
        config.enableVersioning(enable);
        return this;
    }
    /**
     * Set to false to disable minification, or specify the minifier to use.
     *
     * @param {boolean | "terser" | "esbuild"}
     */
    minify(minify = true) {
        config.minify(minify);
        return this;
    }
    provideVariables(variables) {
        config.provideVariables(variables);
        return this;
    }
    getViteConfig() {
        return config.getViteConfig();
    }
    isDev() {
        return config.isDev();
    }
    isProduction() {
        return config.isProduction();
    }
    getEnv() {
        return config.getEnv();
    }
    setServerOptions(options) {
        config.setServerOptions(options);
        return this;
    }
}
module.exports = new Api();
