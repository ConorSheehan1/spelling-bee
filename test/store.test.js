import { setActivePinia, createPinia } from "pinia";
import { useMainStore } from "../src/store";
import { beforeEach, describe, it, expect, vi } from "vitest";
import answers from "../data/allAnswers.json";

describe("Store", () => {
  let store;
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
    store = useMainStore();
  });

  describe("getMaxScore", () => {
    it("gets the max score for a given set of words", () => {
      // test: 1, these: 5, three: 5, total: 11
      store.answers = ["test", "these", "three"];
      store.availableLetters = "dehorst";
      store.middleLetter = "t";
      expect(store.getMaxScore).to.equal(11);
    });
  });

  describe("getMinScore", () => {
    it("gets the static min score", () => {
      expect(store.getMinScore).to.equal(33);
    });
  });

  describe("getGameDate", () => {
    let testDate = "2024-12-11";
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(testDate));
    });
    it("should return a date object when gameDate is a string", () => {
      store.gameDate = testDate;
      expect(store.getGameDate).toEqual(new Date(testDate));
    });
    it("should return a date object when gameDate is a date", () => {
      store.gameDate = new Date(testDate);
      expect(store.getGameDate).toEqual(new Date(testDate));
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
      let gameDate;
      let gameDateString = "2222-02-01";
      beforeEach(() => {
        gameDate = new Date(gameDateString);
        vi.useFakeTimers();
        vi.setSystemTime(gameDate);
      });
      describe("when gameDate is a date", () => {
        it("should get todays and yesterdays answers correctly", () => {
          store.startGame({ allAnswers, gameDate });
          expect(store.correctGuesses).toEqual(new Set([]));
          expect(store.answers).toEqual(["felt", "feat", "feet"]);
          expect(store.availableLetters).toEqual("aeflrst");
          expect(store.middleLetter).toEqual("l");
          expect(store.yesterdaysAnswers).toEqual(["eels", "elegies", "elite"]);
          expect(store.yesterdaysAvailableLetters).toEqual("egilrst");
          expect(store.yesterdaysMiddleLetter).toEqual("e");
        });
      });
      describe("when gameDate is a string", () => {
        it("should get todays and yesterdays answers correctly", () => {
          store.gameDate = gameDateString;
          store.startGame({ allAnswers, gameDate });
          expect(store.correctGuesses).toEqual(new Set([]));
          expect(store.answers).toEqual(["felt", "feat", "feet"]);
          expect(store.availableLetters).toEqual("aeflrst");
          expect(store.middleLetter).toEqual("l");
          expect(store.yesterdaysAnswers).toEqual(["eels", "elegies", "elite"]);
          expect(store.yesterdaysAvailableLetters).toEqual("egilrst");
          expect(store.yesterdaysMiddleLetter).toEqual("e");
        });
      });
    });
    describe("when lastGameDate is yesterday", () => {
      let gameDate;
      let lastGameDate;
      beforeEach(() => {
        gameDate = new Date("2222-02-05");
        lastGameDate = new Date("2222-02-04");
        store.gameDate = lastGameDate;
        vi.useFakeTimers();
        vi.setSystemTime(gameDate);
      });
      it("should use the local storage cache to load yesterdaysAnswers", () => {
        store.lastGameDate = lastGameDate;
        store.answers = ["test", "use", "cache"];
        store.middleLetter = "e";
        store.availableLetters = "acehstu";
        store.startGame({ allAnswers, gameDate });
        expect(store.correctGuesses).toEqual(new Set([]));
        expect(store.answers).toEqual(["error", "ooze", "otter"]);
        expect(store.availableLetters).toEqual("eioprtz");
        expect(store.middleLetter).toEqual("o");
        expect(store.yesterdaysAnswers).toEqual(["test", "use", "cache"]);
        expect(store.yesterdaysAvailableLetters).toEqual("acehstu");
        expect(store.yesterdaysMiddleLetter).toEqual("e");
      });
    });
    describe("when lastGameDate is not yesterday", () => {
      let gameDate;
      let lastGameDate;
      beforeEach(() => {
        gameDate = new Date("2222-02-05");
        lastGameDate = new Date("2222-02-03");
        store.gameDate = lastGameDate;
        vi.useFakeTimers();
        vi.setSystemTime(gameDate);
      });
      it("should not use the local storage cache to load yesterdaysAnswers", () => {
        store.lastGameDate = lastGameDate;
        store.answers = ["test", "use", "cache"];
        store.middleLetter = "e";
        store.availableLetters = "acehstu";
        store.startGame({ allAnswers, gameDate });
        expect(store.correctGuesses).toEqual(new Set([]));
        expect(store.answers).toEqual(["error", "ooze", "otter"]);
        expect(store.availableLetters).toEqual("eioprtz");
        expect(store.middleLetter).toEqual("o");
        // even though values are cached explicitly above,
        // because lastGameDate was not 1 day ago, we pull new values for yesterdaysAnswers
        expect(store.yesterdaysAnswers).toEqual(["felt", "feat", "feet"]);
        expect(store.yesterdaysAvailableLetters).toEqual("aeflrst");
        expect(store.yesterdaysMiddleLetter).toEqual("l");
      });
    });
    describe("when today is not a new game", () => {
      let gameDate;
      let gameDateString = "2023-02-23";
      beforeEach(() => {
        gameDate = new Date(gameDateString);
        vi.useFakeTimers();
        vi.setSystemTime(gameDate);
      });
      describe("when gameDate is a date", () => {
        it("should exit early without setting up a new game", () => {
          store.gameDate = gameDate;
          store.correctGuesses = new Set(["test"]);
          // should exit early
          expect(store.startGame({ allAnswers, gameDate })).toEqual(false);
          // answers should not be reset to []
          expect(store.correctGuesses).toEqual(new Set(["test"]));
        });
      });
      describe("when gameDate is a string", () => {
        it("should exit early without setting up a new game", () => {
          store.gameDate = gameDateString;
          store.correctGuesses = new Set(["test"]);
          // should exit early
          expect(store.startGame({ allAnswers, gameDate })).toEqual(false);
          // answers should not be reset to []
          expect(store.correctGuesses).toEqual(new Set(["test"]));
        });
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
