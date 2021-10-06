const api = require('../lib/api');

expect.extend({
    toBeBoolean(received) {
        return typeof received === 'boolean' ? {
            message: () => `expected ${received} to be boolean`,
            pass: true
        } : {
            message: () => `expected ${received} to be boolean`,
            pass: false
        };
    }
});

describe('Vite API Wrapper', () => {
    describe('isDev', () => {
        it('Must return dev environment', () => {
            const isDev = api.isDev();
            // @ts-ignore
            expect(isDev).toBeBoolean();
        })
    })

    describe('setBase', () => {
        it('Must return api object', () => {
            const returnedValue = api.setBase('/dist/');
            expect(returnedValue).toBe(api)
        })
    })

    describe('setRoot', () => {
        it('Must return api object', () => {
            const returnedValue = api.setRoot('/');
            expect(returnedValue).toBe(api)
        })
    })

    describe('setOutputPath', () => {
        it('Must return api object', () => {
            const returnedValue = api.setOutputPath('/');
            expect(returnedValue).toBe(api)
        })
    })

    describe('usePlugins', () => {
        it('Must return api object', () => {
            const returnedValue = api.usePlugins([]);
            expect(returnedValue).toBe(api)
        })
    })

    describe('watch', () => {
        it('Must return api object', () => {
            const returnedValue = api.watch([]);
            expect(returnedValue).toBe(api)
        })
    })

    describe('addBuildOptions', () => {
        it('Must return api object', () => {
            const returnedValue = api.addBuildOptions({base: '/'});
            expect(returnedValue).toBe(api)
        })
    })

    describe('addRollupOptions', () => {
        it('Must return api object', () => {
            const returnedValue = api.addRollupOptions({output: '../public'});
            expect(returnedValue).toBe(api)
        })
    })
});
