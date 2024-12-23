import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
      files: ["*/*.js"],
      languageOptions: {
        sourceType: "module"
      }
    },
    {
      languageOptions: {
        globals: globals.browser
      }
    },
    {
      ignores: ["dist/", "documentation/"]
    }
];
