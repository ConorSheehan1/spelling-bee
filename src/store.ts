import { create } from "zustand";
import { persist } from "zustand/middleware";
import { differenceInDays, isSameDay } from "date-fns";
import { epoch, generateAnswerObjs, incrementDups } from "./utils";
import { Answer } from "./models/answer";

interface MainStore {
  // State
  correctGuesses: Set<string>;
  answers: string[];
  availableLetters: string;
  middleLetter: string;
  gameDate: Date;
  lastGameDate: Date;
  yesterdaysAnswers: string[];
  yesterdaysAvailableLetters: string;
  yesterdaysMiddleLetter: string;
  theme: "light" | "dark";
  pointsMessages: { [key: number]: string };
  showMessage: (args: {
    message: string;
    type?: "success" | "error" | "info";
  }) => void;

  // Actions
  setShowMessage: (fn: (args: any) => void) => void;
  setTheme: (theme: "light" | "dark") => void;
  submitGuess: (args: { guess: string; t: (key: string) => string }) => void;
  startGame: (args: { allAnswers: Answer[] }) => void;
  calculatePoints: (args: { word: string }) => number;
  isPangram: (args: { word: string }) => boolean;
  generatePointsMessage: (args: {
    t: (key: string) => string;
    points: number;
  }) => string;
  cellClassName: (args: { row: any; columnIndex: number }) => string;
  setYesterdaysAnswersAndLastGameDate: (args: {
    yesterdaysAnswerObj: Answer;
  }) => string;

  // Computed getters
  getMaxScore: () => number;
  getMinScore: () => number;
  getScoreLevels: () => number[];
  getCorrectGuesses: () => string[];
  getProgressIndex: () => number;
  getProgressPercentage: () => number;
  getUserScore: () => number;
  getColor: () => string;
  getGameDate: () => Date;
  getGameDateString: () => string;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      // Initial state
      correctGuesses: new Set<string>(),
      answers: [],
      availableLetters: "",
      middleLetter: "",
      gameDate: epoch,
      lastGameDate: new Date(),
      yesterdaysAnswers: [],
      yesterdaysAvailableLetters: "",
      yesterdaysMiddleLetter: "",
      theme: "light" as "light" | "dark",
      pointsMessages: {
        1: "good",
        5: "nice",
        6: "great",
        7: "excellent",
        8: "amazing",
      },
      showMessage: () => {},

      // Actions
      setShowMessage: (fn: any) => set({ showMessage: fn }),

      setTheme: (theme: "light" | "dark") => set({ theme }),

      submitGuess: ({
        guess,
        t,
      }: {
        guess: string;
        t: (key: string) => string;
      }) => {
        const state = get();

        if (guess.length < 4) {
          return state.showMessage({
            message: t("too short"),
          });
        }
        if (!guess.split("").includes(state.middleLetter)) {
          return state.showMessage({
            message: t("missing middle letter"),
          });
        }
        if (!state.answers.includes(guess)) {
          return state.showMessage({
            message: t("not in word list"),
          });
        }
        if (state.correctGuesses.has(guess)) {
          return state.showMessage({
            message: t("already found"),
          });
        }

        const newGuesses = new Set(state.correctGuesses);
        newGuesses.add(guess);
        set({ correctGuesses: newGuesses });

        const points = state.calculatePoints({ word: guess });
        if (state.isPangram({ word: guess })) {
          state.showMessage({
            type: "success",
            message: `Pangram! +${points}`,
          });
        } else {
          state.showMessage({
            type: "success",
            message: state.generatePointsMessage({ t, points }),
          });
        }
      },

      startGame: ({ allAnswers }: { allAnswers: Answer[] }) => {
        const state = get();
        const now = new Date();

        if (isSameDay(state.getGameDate(), now)) return;

        set({ gameDate: now, correctGuesses: new Set<string>() });

        const { todaysAnswerObj, yesterdaysAnswerObj } = generateAnswerObjs({
          allAnswers,
          gameDate: now,
        });

        get().setYesterdaysAnswersAndLastGameDate({ yesterdaysAnswerObj });

        const { answers, availableLetters, middleLetter } = todaysAnswerObj;
        set({ answers, availableLetters, middleLetter });
      },

      setYesterdaysAnswersAndLastGameDate: ({
        yesterdaysAnswerObj,
      }: {
        yesterdaysAnswerObj: Answer;
      }) => {
        const state = get();

        if (differenceInDays(state.gameDate, state.lastGameDate) === 1) {
          set({
            yesterdaysAnswers: state.answers,
            yesterdaysAvailableLetters: state.availableLetters,
            yesterdaysMiddleLetter: state.middleLetter,
          });
          return "local-storage-cache";
        } else {
          const {
            answers: yesterdaysAnswers,
            availableLetters: yesterdaysAvailableLetters,
            middleLetter: yesterdaysMiddleLetter,
          } = yesterdaysAnswerObj;
          set({
            yesterdaysAnswers,
            yesterdaysAvailableLetters,
            yesterdaysMiddleLetter,
            lastGameDate: state.gameDate,
          });
          return "cache-bust";
        }
      },

      calculatePoints: ({ word }: { word: string }) => {
        const state = get();
        if (word.length === 4) return 1;
        if (state.isPangram({ word })) return word.length + 7;
        return word.length;
      },

      isPangram: ({ word }: { word: string }) => {
        return new Set(word).size === 7;
      },

      generatePointsMessage: ({
        t,
        points,
      }: {
        t: (key: string) => string;
        points: number;
      }) => {
        const state = get();
        const message = state.pointsMessages[points] || "awesome";
        return `${t(`points.${message}`)}! +${points}`;
      },

      cellClassName: ({
        row,
        columnIndex,
      }: {
        row: any;
        columnIndex: number;
      }) => {
        const state = get();
        const word = row[columnIndex + 1];
        if (word && state.isPangram({ word })) {
          return "pangram";
        }
        return "";
      },

      // Getters
      getMaxScore: () => {
        const state = get();
        return state.answers.reduce((acc: number, word: string): number => {
          return acc + state.calculatePoints({ word });
        }, 0);
      },

      getMinScore: () => {
        const minNumWords = 20;
        return minNumWords - 1 + 14;
      },

      getScoreLevels: () => {
        const state = get();
        const maxScore = state.getMaxScore();
        const levels = [
          0,
          5,
          Math.floor(maxScore * 0.1),
          Math.floor(maxScore * 0.2),
          Math.floor(maxScore * 0.3),
          Math.floor(maxScore * 0.4),
          Math.floor(maxScore * 0.5),
          Math.floor(maxScore * 0.55),
          Math.floor(maxScore * 0.6),
        ].sort((a, b) => a - b);
        const uniqueLevels = incrementDups(levels);
        const minUniqueLevel = Math.min(...uniqueLevels);
        return uniqueLevels.map((l: number) => l - minUniqueLevel);
      },

      getCorrectGuesses: () => {
        return Array.from(get().correctGuesses);
      },

      getProgressIndex: () => {
        const state = get();
        const scoreLevels = state.getScoreLevels();
        const userScore = state.getUserScore();
        return scoreLevels.filter((v: number) => v <= userScore).length - 1;
      },

      getProgressPercentage: () => {
        const progressPercentages = [0, 20, 40, 50, 60, 70, 80, 90, 100];
        return progressPercentages[get().getProgressIndex()];
      },

      getUserScore: () => {
        const state = get();
        return state
          .getCorrectGuesses()
          .reduce((acc: number, word: string): number => {
            return acc + state.calculatePoints({ word });
          }, 0);
      },

      getColor: () => {
        return get().theme === "light" ? "white" : "#1c1b22";
      },

      getGameDate: () => {
        const gameDate = get().gameDate;
        return typeof gameDate === "string" ? new Date(gameDate) : gameDate;
      },

      getGameDateString: () => {
        return get().getGameDate().toISOString().split("T")[0];
      },
    }),
    {
      name: "spelling-bee-storage",
      partialize: (state: any) => ({
        correctGuesses: Array.from(state.correctGuesses),
        answers: state.answers,
        availableLetters: state.availableLetters,
        middleLetter: state.middleLetter,
        gameDate: state.gameDate,
        lastGameDate: state.lastGameDate,
        yesterdaysAnswers: state.yesterdaysAnswers,
        yesterdaysAvailableLetters: state.yesterdaysAvailableLetters,
        yesterdaysMiddleLetter: state.yesterdaysMiddleLetter,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state: any) => {
        if (state && Array.isArray(state.correctGuesses)) {
          state.correctGuesses = new Set(state.correctGuesses);
        }
      },
    }
  )
);
