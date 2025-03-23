/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*": "prettier --ignore-unknown --write",
  "*.{jsx,tsx,js,ts,md}": "cspell --no-must-find-files",
  "package.json": "sort-package-json",
  "dictionary.txt": "sort -o dictionary.txt",
};
