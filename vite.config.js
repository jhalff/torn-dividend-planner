import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';

const userscriptHeader = `// ==UserScript==
// @name         TORN Dividend Planner
// @namespace    https://github.com/jhalff/torn-dividend-planner
// @version      1.1.3
// @description  Build and manage TORN stock dividend combinations
// @author       Draxeth
// @match        https://www.torn.com/page.php*
// @include      https://www.torn.com/page.php?sid=stocks*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/jhalff/torn-dividend-planner/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/jhalff/torn-dividend-planner/main/script.user.js
// @supportURL   https://github.com/jhalff/torn-dividend-planner/issues
// @grant        none
// ==/UserScript==`

export default defineConfig({
    plugins: [
        banner(userscriptHeader)
    ],
    build: {
        outDir: '.',
        emptyOutDir: false,

        rollupOptions: {
            input: 'src/main.js',

            output: {
                format: 'iife',
                entryFileNames: 'script.user.js',
            }
        }
    }
});