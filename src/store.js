// https://stephanlangeveld.medium.com/simple-local-storage-implementation-using-vue-3-vueuse-and-pinia-with-zero-extra-lines-of-code-cb9ed2cce42a
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { incrementDups } from "./utils.js";

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    // todays puzzle
    correctGuesses: useStorage("correctGuesses", []),
    answers: useStorage("answers", []),
    availableLetters: useStorage("availableLetters", ""),
    middleLetter: useStorage("middleLetter", ""),
    gameDate: useStorage("gameDate", ""),
    // yesterdays puzzle
    yesterdaysAnswers: useStorage("yesterdaysAnswers", []),
    yesterdaysAvailableLetters: useStorage("yesterdaysAvailableLetters", ""),
    yesterdaysMiddleLetter: useStorage("yesterdaysMiddleLetter", ""),
    // theme
    theme: useStorage("theme", "light"),
    // don't need to be in local storage because they doesn't change
    pointsMessages: {
      1: "good",
      5: "nice",
      6: "great",
      7: "excellent",
      8: "amazing",
    },
  }),
  getters: {
    // TODO: move getMaxScore, getScoreLevels to state? compute once at startGame
    getMaxScore() {
      return this.answers.reduce((acc, word) => {
        return acc + this.getPoints({ word });
      }, 0);
    },
    getMinScore() {
      // 19 4-letter words @ 1 point each, 1 pangram @ min 14 points.
      const minNumWords = 20;
      return (minNumWords - 1) + (14); // 33
    },
    getScoreLevels() {
      // const levels = [
      return [
        0,
        5,
        Math.floor(this.getMaxScore * 0.1),
        Math.floor(this.getMaxScore * 0.2),
        Math.floor(this.getMaxScore * 0.3),
        Math.floor(this.getMaxScore * 0.4),
        Math.floor(this.getMaxScore * 0.5),
        Math.floor(this.getMaxScore * 0.6),
        Math.floor(this.getMaxScore * 0.7),
      ].sort((a, b) => a - b);
      // const uniqueLevels = incrementDups(levels);
      // const minUniqueLevel = Math.min(...uniqueLevels);
      // // ensure there are never any 2 levels with the same points requirements.
      // // ensure the first level is 0.
      // return uniqueLevels.map(l => l - minUniqueLevel);
    },
    getProgressIndex() {
      return (
        this.getScoreLevels.filter((v) => v <= this.getUserScore).length - 1
      );
    },
    getProgressPercentage() {
      const progressPercentages = [0, 20, 40, 50, 60, 70, 80, 90, 100];
      return progressPercentages[this.getProgressIndex];
    },
    getUserScore() {
      return this.correctGuesses.reduce((acc, word) => {
        return acc + this.getPoints({ word });
      }, 0);
    },
    getColor() {
      const ret = this.theme === "light" ? "white" : "#1c1b22";
      return ret;
    },
  },
  actions: {
    // args: Object
    showMessage(args) {
      return ElMessage({
        duration: 2000,
        // change width? seems too wide in inspector but looks ok on device
        appendTo: '#app',
        customClass: 'toast-message',
        grouping: true,
        showClose: true,
        ...args,
      });
    },
    // $t: function
    // guess: string
    submitGuess({ $t, guess }) {
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
    startGame({ todaysAnswerObj, yesterdaysAnswerObj, gameDate }) {
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
    getPoints({ word }) {
      if (word.length === 4) return 1;
      if (this.isPangram({ word })) return word.length + 7;
      return word.length;
    },
    isPangram({ word }) {
      return this.availableLetters.split("").every((l) => word.includes(l));
    },
    // points per word, score is total of points.
    // $t: function
    // points: Number
    getPointsMessage({ $t, points }) {
      const message = this.pointsMessages[points] || "awesome";
      return `${$t(`points.${message}`)}! +${points}`;
    },
  },
});
