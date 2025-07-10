import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        environment: 'jsdom',
    },
    build: {
        lib: {
            entry: './index.ts',
            name: 'ThreeJS4Wasm',
            fileName: (format) => `three-js.${format}.js`,
        },
        rollupOptions: {
            output: {
                globals: {}, // Add global variables for external dependencies here
            },
        },
    },
});