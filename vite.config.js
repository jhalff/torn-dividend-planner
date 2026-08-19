import { defineConfig } from 'vite';

const userscriptHeader = `// ==UserScript==
// @name         TORN Dividend Planner
// @namespace    https://github.com/jhalff/torn-dividend-planner
// @version      1.2.2
// @description  Build and manage TORN stock dividend combinations
// @author       Draxeth
// @match        https://www.torn.com/page.php*
// @include      https://www.torn.com/page.php?sid=stocks*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/jhalff/torn-dividend-planner/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/jhalff/torn-dividend-planner/main/script.user.js
// @supportURL   https://github.com/jhalff/torn-dividend-planner/issues
// @grant        none
// ==/UserScript==`;

const userscriptHeaderPlugin = {
    name: 'userscript-header',

    generateBundle(options, bundle) {
        for (const file of Object.values(bundle)) {
            if (file.type !== 'chunk') {
                continue;
            }

            file.code = `${userscriptHeader}\n\n${file.code}`;
        }
    }
};

export default defineConfig({
    plugins: [
        userscriptHeaderPlugin
    ],

    build: {
        outDir: '.',
        emptyOutDir: false,

        rollupOptions: {
            input: 'src/main.js',

            output: {
                format: 'iife',
                entryFileNames: 'script.user.js'
            }
        }
    }
});