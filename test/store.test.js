import { setActivePinia, createPinia, defineStore } from "pinia";
import { useMainStore } from "../src/store";
import { beforeEach, describe, it, expect } from "vitest";
import answers from "../data/allAnswers.js";

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
