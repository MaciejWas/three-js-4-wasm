import { defineConfig } from 'vite';

const lib = {
    entry: './example/index.html',
    name: 'ThreeJS4Wasm',
    fileName: (format: string) => `three-js.${format}.js`,
};

if (process.env.LIB) {
    lib.entry = "./index.ts";
}

export default defineConfig({
    test: {
        environment: 'jsdom',
    },
    build: {
        lib,
        rollupOptions: {
            output: {
                globals: {}, // Add global variables for external dependencies here
            },
        },
    },
});
