"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'react-refresh': {
        name: '@react-refresh',
        code: `
            import RefreshRuntime from '@react-refresh'
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
        `
    }
};
