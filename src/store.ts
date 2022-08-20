// https://stephanlangeveld.medium.com/simple-local-storage-implementation-using-vue-3-vueuse-and-pinia-with-zero-extra-lines-of-code-cb9ed2cce42a
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { incrementDups } from "./utils";
import { Answer } from "./models/answer";

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    // todays puzzle
    correctGuesses: useStorage("correctGuesses", [] as Array<string>),
    answers: useStorage("answers", [] as Array<string>),
    availableLetters: useStorage("availableLetters", "" as string),
    middleLetter: useStorage("middleLetter", "" as string),
    gameDate: useStorage("gameDate", "" as string),
    // yesterdays puzzle
    yesterdaysAnswers: useStorage("yesterdaysAnswers", [] as Array<string>),
    yesterdaysAvailableLetters: useStorage(
      "yesterdaysAvailableLetters",
      "" as string
    ),
    yesterdaysMiddleLetter: useStorage("yesterdaysMiddleLetter", "" as string),
    // theme
    theme: useStorage("theme", "light" as string),
    // don't need to be in local storage because they doesn't change
    pointsMessages: {
      1: "good",
      5: "nice",
      6: "great",
      7: "excellent",
      8: "amazing",
    } as { [key: number]: string },
  }),
  getters: {
    // TODO: move getMaxScore, getScoreLevels to state? compute once at startGame
    getMaxScore(): number {
      return this.answers.reduce((acc: number, word: string): number => {
        // @ts-ignore issue with this ref? says .getPoints is undefined here but not outside arrow funcs
        return acc + this.getPoints({ word });
      }, 0);
    },
    getMinScore(): number {
      // 19 4-letter words @ 1 point each, 1 pangram @ min 14 points.
      const minNumWords = 20;
      return minNumWords - 1 + 14; // 33
    },
    getScoreLevels(): Array<number> {
      // TODO: fix tests, getMaxScore 50 should produce dups
      // difficulty levels
      const levels = [
        // return [
        0,
        5,
        Math.floor(this.getMaxScore * 0.1),
        Math.floor(this.getMaxScore * 0.2),
        Math.floor(this.getMaxScore * 0.3),
        Math.floor(this.getMaxScore * 0.4),
        Math.floor(this.getMaxScore * 0.5),
        Math.floor(this.getMaxScore * 0.55),
        Math.floor(this.getMaxScore * 0.6),
      ].sort((a, b) => a - b);
      const uniqueLevels = incrementDups(levels);
      const minUniqueLevel = Math.min(...uniqueLevels);
      // ensure there are never any 2 levels with the same points requirements.
      // ensure the first level is 0.
      return uniqueLevels.map((l: number) => l - minUniqueLevel);
    },
    getProgressIndex(): number {
      return (
        this.getScoreLevels.filter((v) => v <= this.getUserScore).length - 1
      );
    },
    getProgressPercentage(): number {
      const progressPercentages = [0, 20, 40, 50, 60, 70, 80, 90, 100];
      return progressPercentages[this.getProgressIndex];
    },
    getUserScore(): number {
      return this.correctGuesses.reduce((acc: number, word: string): number => {
        // @ts-ignore issue with this ref? says .getPoints is undefined here but not outside arrow funcs
        return acc + this.getPoints({ word });
      }, 0);
    },
    getColor(): string {
      return this.theme === "light" ? "white" : "#1c1b22";
    },
  },
  actions: {
    showMessage(args: object) {
      return ElMessage({
        duration: 2000,
        // change width? seems too wide in inspector but looks ok on device
        appendTo: "#app",
        customClass: "toast-message",
        grouping: true,
        showClose: true,
        ...args,
      });
    },
    submitGuess({ $t, guess }: { $t: Function; guess: string }) {
      if (guess.length < 4) {
        return this.showMessage({
          message: $t("too short"),
        });
      }
      if (!guess.split("").includes(this.middleLetter)) {
        return this.showMessage({
          message: $t("missing middle letter"),
        });
      }
      if (!this.answers.includes(guess)) {
        return this.showMessage({
          message: $t("not in word list"),
        });
      }
      if (this.correctGuesses.includes(guess)) {
        return this.showMessage({
          message: $t("already found"),
        });
      }

      this.correctGuesses.push(guess);
      const points = this.getPoints({ word: guess });
      if (this.isPangram({ word: guess })) {
        this.showMessage({
          type: "success",
          message: `Pangram! +${points}`,
        });
      } else {
        this.showMessage({
          type: "success",
          message: this.getPointsMessage({ $t, points }),
        });
      }
    },
    startGame({
      todaysAnswerObj,
      yesterdaysAnswerObj,
      gameDate,
    }: {
      todaysAnswerObj: Answer;
      yesterdaysAnswerObj: Answer;
      gameDate: string;
    }) {
      // set yesterday and todays answers and letters
      // clear yesterdays guesses if present
      // set gameDate to clear guesses tomorrow
      const { answers, availableLetters, middleLetter } = todaysAnswerObj;
      const {
        answers: yesterdaysAnswers,
        availableLetters: yesterdaysAvailableLetters,
        middleLetter: yesterdaysMiddleLetter,
      } = yesterdaysAnswerObj;

      this.answers = answers;
      this.availableLetters = availableLetters;
      this.middleLetter = middleLetter;
      this.yesterdaysAnswers = yesterdaysAnswers;
      this.yesterdaysAvailableLetters = yesterdaysAvailableLetters;
      this.yesterdaysMiddleLetter = yesterdaysMiddleLetter;

      if (gameDate !== this.gameDate) {
        this.correctGuesses = [];
      }
      this.gameDate = gameDate;
    },
    getPoints({ word }: { word: string }): number {
      if (word.length === 4) return 1;
      if (this.isPangram({ word })) return word.length + 7;
      return word.length;
    },
    isPangram({ word }: { word: string }): boolean {
      return this.availableLetters.split("").every((l) => word.includes(l));
    },
    // points per word, score is total of points.
    getPointsMessage({ $t, points }: { $t: Function; points: number }): string {
      const message = this.pointsMessages[points] || "awesome";
      return `${$t(`points.${message}`)}! +${points}`;
    },
  },
});
