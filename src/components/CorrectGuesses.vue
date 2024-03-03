<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { computed, ref } from "vue";
import { useMainStore } from "../store";
import { gridify } from "../utils";

import { useI18n } from "vue-i18n";
import en from "../locales/en.json";

const { width: windowWidth } = useWindowSize();

const { t } = useI18n({
  inheritLocale: true,
  messages: {
    en,
  },
});

const store = useMainStore();
// showWords el-collapse has 2 elems when expanded, 1 when collapsed.
const showWords = ref([false]);
const numCorrectMessage = computed(() => {
  return t("foundWords", store.getCorrectGuesses.length);
});

const guessPreview = computed(() => {
  // show max 10 words as preview
  const numGuessesToShow = Math.min(store.getCorrectGuesses.length, 10);
  const numCharsToShow = windowWidth.value / 10;
  let correctGuesses = store.getCorrectGuesses
    .reverse()
    .slice(0, numGuessesToShow);
  // while total character count of correctGuesses >= numCharsToShow, pop last entry
  while (
    correctGuesses.reduce((acc, cg) => acc + cg.length, 0) >= numCharsToShow
  ) {
    correctGuesses.pop();
  }
  return correctGuesses;
});

// alphabetical when expanded, in order found when collapsed.
const gridData = computed(
  () => gridify({ arr: Array.from(store.getCorrectGuesses).sort(), size: 3 })
  // gridify({ arr: Array.from(Array(100).keys()), size: 3 })
);
</script>

<template>
  <el-collapse
    v-model="showWords"
    @change="showWords.length == 2 ? $emit('open') : $emit('close')">
    <el-collapse-item>
      <template #title>
        <template v-if="showWords.length === 2">
          {{ numCorrectMessage }}
        </template>
        <template v-else-if="guessPreview.length === 0">
          {{ t("Your words") }}...
        </template>
        <template v-else>
          <span
            v-for="(guess, index) in guessPreview"
            :key="guess"
            :class="store.cellClassName({ row: [guess], columnIndex: -1 })">
            {{ guess }}{{ index === guessPreview.length - 1 ? "" : ", " }}
          </span>
          <span v-if="store.getCorrectGuesses.length > guessPreview.length">
            ...
          </span>
        </template>
      </template>
      <el-table
        :data="gridData"
        class="correct-guesses-table"
        :cell-class-name="store.cellClassName">
        <el-table-column property="1" label="" />
        <el-table-column property="2" label="" />
        <el-table-column property="3" label="" />
      </el-table>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss">
@import "../assets/styles/_variables";

.correct-guesses-table {
  min-height: 50vh;
}

html.dark .el-collapse {
  background-color: $bl-el-plus-dark-bg;
}
</style>
