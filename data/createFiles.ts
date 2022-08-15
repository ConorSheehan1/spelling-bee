const { readFileSync, writeFileSync } = require("fs");
const cliProgress = require('cli-progress');

// config
const minNumAnswers = 20;
const writeSupplementaryFiles = true;

const data = readFileSync("./data/AllWords.txt");
// each word is on a new line, first 2 lines are a comments, last line is empty
const words = data
  .toString()
  .split("\n")
  .slice(2, -1)
  .map((s: string) => s.toLowerCase());

const validWords = words.filter((word: string) => {
  if (word.length < 4) return false;
  const uniqueLetters = new Set(word);
  if (uniqueLetters.size > 7) return false;
  return true;
});

const pangrams = validWords.filter((word: string) => new Set(word).size == 7);

if (writeSupplementaryFiles) {
  writeFileSync("./data/answers.txt", validWords.join("\n"));
  writeFileSync("./data/pangrams.txt", pangrams.join("\n"));
}

const uniqueLetterCombinations = pangrams.reduce((acc: Set<string>, pangram: string) => {
  const uniqueLetters = new Set(pangram.split("").sort());
  acc.add(Array.from(uniqueLetters).join(""));
  return acc;
}, new Set());
const numPangrams = pangrams.length;
const numUniqueLetterCombinations = uniqueLetterCombinations.size;

// {numPangrams: 1047, numUniqueLetterCombinations: 931}
// console.log({ numPangrams, numUniqueLetterCombinations })

const allAnswers = [];

const createPuzzleBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
createPuzzleBar.start(numUniqueLetterCombinations * 7, 0);
let numProcessed = 0;

for (let offset = 0; offset < 7; offset++) {
  for (let i = 0; i < numUniqueLetterCombinations; i++) {
    numProcessed += 1;
    createPuzzleBar.update(numProcessed);
    const availableLetters = Array.from(uniqueLetterCombinations)[i] as string;
    // for each unique letter combination, choose middle letter in sequence
    // e.g. [0,1,2,3,4,5,6,0,1,2,3...], [1,2,3,4,5,6,0,1,2,3...]
    const middleLetter = availableLetters[(i + offset) % 7];
    const answers = validWords.filter((word: string) => {
      if (!word.includes(middleLetter)) return false;
      return word.split("").every((char: string) => availableLetters.includes(char));
    });
    if (answers.length >= minNumAnswers) {
      allAnswers.push({ answers, middleLetter, availableLetters });
    } // else {
    //   console.log({ availableLetters, middleLetter, len: answers.length })
    // }
  }
}

createPuzzleBar.stop();

writeFileSync(
  "./data/allAnswers.json",
  `${JSON.stringify(allAnswers, null, 2)}`
);
