import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [{
    // ESM2015 bundle
    input: 'lib/main.js',
    output: [{
        file: 'dist/jszip-esm2015.js',
        format: 'esm'
    }],
    external: ['@progress/pako-esm']
}, {
    // ESM5 bundle
    input: 'lib/main.js',
    output: [{
        file: 'dist/jszip-esm5.js',
        format: 'esm'
    }],
    plugins: [ buble() ],
    external: ['@progress/pako-esm']
}, {
    // UMD bundles
    input: 'lib/main.js',
    output: [{
        file: 'dist/jszip.js',
        format: 'umd',
        name: 'JSZip'
    }, {
        file: 'dist/jszip.min.js',
        format: 'umd',
        name: 'JSZip',
        plugins: [ terser() ]
    }],
    plugins: [ resolve(), buble() ]
}, {
    // SystemJS bundle
    input: 'lib/main.js',
    output: [{
        file: 'dist/jszip-system.js',
        format: 'systemjs'
    }],
    plugins: [ buble() ],
    external: ['@progress/pako-esm']
}];
