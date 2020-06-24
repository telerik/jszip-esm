# JSZip-ESM

This is a fork of [JSZip](https://github.com/Stuk/jszip) v3.2.2 with bundler-friendly packaging.

It is used by the Excel Export module of [Progress Kendo UI](https://www.telerik.com/kendo-ui).

* Includes ES2015, UMD and CommonJS bundles.
* Built-in TypeScript definitions.
* Targets modern browsers and IE11.
* Subject to [tree-shaking](https://webpack.js.org/guides/tree-shaking/).
* [Side-effect free](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free).

## Notes

* Should not be used in NodeJS environment. Use the original JSZip library instead.
* Not compatible with legacy browsers.
