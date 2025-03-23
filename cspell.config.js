/**
 * @type { import("@cspell/cspell-types").CSpellUserSettings }
 */
export default {
  version: "0.2",
  language: "en,pl",
  dictionaries: ["blog"],
  dictionaryDefinitions: [
    {
      name: "blog",
      path: "./dictionary.txt",
      addWords: true,
    },
  ],
};
