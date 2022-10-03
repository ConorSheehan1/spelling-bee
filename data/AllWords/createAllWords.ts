// This script adds missing words and removes offensive words from the original wordlist
// https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt

import { readFileSync, writeFileSync }  from "fs";

const fileToLowerCaseArray = (filePath: string): Array<any> => {
  const data = readFileSync(filePath);
  return data
    .toString()
    .split("\n")
    .map((s: string) => s.toLowerCase());
}

const originalWords = fileToLowerCaseArray("./data/AllWords/2of4brif.txt");
const removedWordsSet = new Set(fileToLowerCaseArray("./data/AllWords/wordsRemoved.txt"));
const addedWords = fileToLowerCaseArray("./data/AllWords/wordsAdded.txt");

const allWords = originalWords
  .concat(addedWords)
  .filter(word => !removedWordsSet.has(word))
  .sort();

writeFileSync("./data/AllWords.txt", allWords.join("\n"));