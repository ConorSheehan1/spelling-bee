// This script takes the contents of AllWords.txt
// 1. Filters out any invalid words (len < 4, unique letters > 7) and writes them to answers.txt
// 2. Finds pangrams and writes them to pangrams.txt
// 3. Creates unique puzzle starting points and writes them to various allAnswers$N.json
// 4. It will also check if today's and yesterday's puzzles have changed. If they have, it provides the option to quit the script.

import { readFileSync, writeFileSync }  from "fs";
import cliProgress from "cli-progress";
import readlineSync from "readline-sync";
import { generateAnswerObjs, shuffle } from "../src/utils";
// script will fail if allAnswers.json does not already exist. can just create empty file if running for first time.
import currentAnswers from "./allAnswers.json";

// config
const minNumAnswers = 20;
const writeSupplementaryFiles = true;
// 10 years worth of puzzles per file. avoid slow loading page and need for git-lfs with all puzzles in one file.
// need to update to use allAnswers2 10 years from now. see you in the future o_0
const numPuzzlesPerFile = 3650;

// TODO: dynamic import in app.vue and here, use variable to ensure script and app use same data
const answerFile = "allAnswers.json" // match App.vue
const gameDate = new Date();
const currentAnswerObj = generateAnswerObjs({ allAnswers: currentAnswers, gameDate });

const data = readFileSync("./data/AllWords.txt");
const words = data
  .toString()
  .split("\n")
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
const numUniqueLetterCombinations = uniqueLetterCombinations.size;
const uniqueLetterCombinationsShuffled = shuffle(Array.from(uniqueLetterCombinations))

let allAnswers = [];

const createPuzzleBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
createPuzzleBar.start(numUniqueLetterCombinations * 7, 0);
let numProcessed = 0;

for (let offset = 0; offset < 7; offset++) {
  for (let i = 0; i < numUniqueLetterCombinations; i++) {
    numProcessed += 1;
    createPuzzleBar.update(numProcessed);
    const availableLetters = uniqueLetterCombinationsShuffled[i] as string;
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
    if (numProcessed % numPuzzlesPerFile === 0) {
      let fileNum = numProcessed / numPuzzlesPerFile;

      // validation today and yesterdays puzzle hasn't changed
      const fileName = `./data/allAnswers${fileNum === 1 ? '' : fileNum}.json`;
      if (fileName.endsWith(answerFile)) {
        console.log(`\nChecking file currently in use by the game: ${fileName}`);
        const newCurrentAnswerObj = generateAnswerObjs({ allAnswers, gameDate });
        const jsonNewCurrentAnswerObj = JSON.stringify(newCurrentAnswerObj);
        const jsonCurrentAnswerObj = JSON.stringify(currentAnswerObj);
        if (jsonNewCurrentAnswerObj !== jsonCurrentAnswerObj) {
          console.log(`jsonCurrentAnswerObj: ${jsonCurrentAnswerObj.substring(0, 100)} ...`);
          console.log(`jsonNewCurrentAnswerObj: ${jsonNewCurrentAnswerObj.substring(0, 100)} ...`);
          if (!readlineSync.keyInYN("Today's and yesterday's puzzles have changed. Continue?")) {
            process.exit();
          }
        } else {
          console.log(`Checks passed. Today's and yesterday's puzzles have not changed.`);
        }
      }

      writeFileSync(
        fileName,
        `${JSON.stringify(allAnswers, null, 2)}`
      );
      allAnswers = [];
    }
  }
}

createPuzzleBar.stop();
console.log(`Processed ${numProcessed} puzzles, and ${Math.floor(numProcessed / numPuzzlesPerFile)} files.`)
console.log(`${Math.floor(numProcessed / 365)} years of puzzles.`)
// 52493 puzzle combinations
// 52493 / 365 = 143 years worth of games
