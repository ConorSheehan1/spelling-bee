import { setActivePinia, createPinia, defineStore } from "pinia";
import { useMainStore } from "../src/store";
import { beforeEach, describe, it, expect, vi } from "vitest";
import answers from "../data/allAnswers.json";

describe("Store", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  describe("getMaxScore", () => {
    it("gets the max score for a given set of words", () => {
      const store = useMainStore();
      // test: 1, these: 5, three: 5, total: 11
      store.answers = ["test", "these", "three"];
      store.availableLetters = "dehorst";
      store.middleLetter = "t";
      expect(store.getMaxScore).to.equal(11);
    });
  });

  describe("getMinScore", () => {
    it("gets the static min score", () => {
      const store = useMainStore();
      expect(store.getMinScore).to.equal(33);
    });
  });

  describe("startGame", () => {
    const allAnswers = [
      {
        answers: ["error", "ooze", "otter"],
        middleLetter: "o",
        availableLetters: "eioprtz",
      },
      {
        answers: ["eels", "elegies", "elite"],
        middleLetter: "e",
        availableLetters: "egilrst",
      },
      {
        answers: ["felt", "feat", "feet"],
        middleLetter: "l",
        availableLetters: "aeflrst",
      },
    ];
    describe("when today is the first of the month and a new game", () => {
      // had issue with incorrect state of yesterdays answers in the past.
      // converting date to int will cause yesterdays answers to be too far in the past.
      //  e.g. 2022-01-01 -> 20220101 but yesterdays answers should be 2021-12-31, but would be 20220100
      beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2023-01-01"));
      });
      it("should get todays and yesterdays answers correctly", () => {
        const store = useMainStore();
        store.startGame({ allAnswers });
        expect(store.correctGuesses).toEqual([]);
        expect(store.answers).toEqual(["felt", "feat", "feet"]);
        expect(store.yesterdaysAnswers).toEqual(["eels", "elegies", "elite"]);
        expect(store.availableLetters).toEqual("aeflrst");
        expect(store.middleLetter).toEqual("l");
        expect(store.yesterdaysAvailableLetters).toEqual("egilrst");
        expect(store.yesterdaysMiddleLetter).toEqual("e");
      });
    });
    describe("when today is not a new game", () => {
      let gameDate;
      beforeEach(() => {
        gameDate = new Date("2023-02-23");
        vi.useFakeTimers();
        vi.setSystemTime(gameDate);
      });
      it("should exit early without setting up a new game", () => {
        const store = useMainStore();
        store.gameDate = gameDate;
        store.correctGuesses = ["test"];
        // should exit early
        expect(store.startGame({ allAnswers })).toEqual(false);
        // answers should not be reset to []
        expect(store.correctGuesses).toEqual(["test"]);
      });
    });
  });

  // describe('getScoreLevels', () => {
  //   it('should get unique scores', () => {
  //     const store = useMainStore()
  //     const longestPuzzle = answers.reduce((prev, curr) => {
  //       return curr.answers.length > prev.answers.length ? curr : prev;
  //     })
  //     store.answers = longestPuzzle.answers
  //     const maxScore = store.getMaxScore;
  //     console.log(maxScore);
  //     for (let i = store.getMinScore; i < maxScore; i++) {
  //       // store.$patch({ getMaxScore: i });
  //       // store.getMaxScore = i;
  //       const useStore = defineStore('mainStore', {
  //         getters: {
  //           getMaxScore: () => i
  //         }
  //       })
  //       const pinia = createPinia()
  //       const store = useStore(pinia)

  //       const uniqueScoreLevels = new Set(store.getScoreLevels);

  //       if (i === 55) {
  //         console.log({ uniqueScoreLevels, getScoreLevels: store.getScoreLevels, getMaxScore: store.getMaxScore })
  //       }
  //       expect(store.getScoreLevels.length).to.equal(uniqueScoreLevels.size);
  //     }
  //   });
  // })
});
