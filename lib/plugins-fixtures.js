"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'react-refresh': {
        name: '@react-refresh',
        imports: `
            import RefreshRuntime from '@react-refresh'
        `,
        inject: `
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
        `
    }
};
