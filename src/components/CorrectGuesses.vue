<script setup lang="ts">
import { computed, ref } from "vue";
import { useMainStore } from "../store";
import { gridify } from "../utils";

import { useI18n } from "vue-i18n";
import en from "../locales/en.json";

const { t } = useI18n({
  inheritLocale: true,
  messages: {
    en,
  },
});

const store = useMainStore();
const showWords = ref([false]);
const numCorrectMessage = computed(() => {
  return t("foundWords", store.correctGuesses.length);
});
const collapseTitle = computed(() => {
  // showWords el-collapse has 2 elems when expanded, 1 when collapsed.
  const numGuessesToShow = Math.min(store.correctGuesses.length, 5);
  const lastFiveGuesses = store.correctGuesses
    .reverse()
    .slice(0, numGuessesToShow);
  const guessEllipses = lastFiveGuesses.length === 5 ? "..." : "";
  const title =
    showWords.value.length == 2
      ? numCorrectMessage.value
      : `${lastFiveGuesses.join(", ")}${guessEllipses}`;
  return title.length ? title : `${t("Your words")}...`;
});

// alphabetical when expanded, in order found when collapsed (in collapseTitle)
const gridData = computed(
  () => gridify({ arr: Array.from(store.correctGuesses).sort(), size: 3 })
  // gridify({ arr: Array.from(Array(100).keys()), size: 3 })
);

</script>

<template>
  <el-collapse
    v-model="showWords"
    @change="showWords.length == 2 ? $emit('open') : $emit('close')">
    <el-collapse-item :title="collapseTitle">
      <el-table :data="gridData" class="correct-guesses-table" :cell-class-name="store.cellClassName">
        <el-table-column property="1" label="" />
        <el-table-column property="2" label="" />
        <el-table-column property="3" label="" />
      </el-table>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss">
@import "../assets/styles/_variables";

.pangram div.cell {
  font-weight: bold;
  text-shadow: 0 0 10px $bl-yellow;
}

.correct-guesses-table {
  min-height: 50vh;
}

html.dark .el-collapse {
  background-color: $bl-el-plus-dark-bg;
}
</style>
