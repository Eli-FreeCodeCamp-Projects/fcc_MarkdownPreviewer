import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
        outDir: './docs',
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: './test/setup.js'
    }
})
