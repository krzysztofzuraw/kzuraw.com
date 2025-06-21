/**
 * @type { import("@cspell/cspell-types").CSpellUserSettings }
 */
export default {
  version: "0.2",
  language: "en,pl",
  dictionaries: ["pl_PL", "blog"],
  dictionaryDefinitions: [
    {
      name: "blog",
      path: "./dictionary.txt",
      addWords: true,
    },
  ],
  overrides: [
    {
      filename: "**/*.md",
      ignoreRegExpList: [
        // Ignore code blocks
        "/^```[\\s\\S]*?^```/gm",
        // Ignore inline code
        "/`[^`]*`/g",
        // Ignore slug values in frontmatter
        "/^slug:\\s*[^\\n]+$/gm",
      ],
    },
  ],
};
