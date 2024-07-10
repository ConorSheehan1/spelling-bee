<script setup lang="ts">
import { computed } from "vue";
import { useMainStore } from "../store";
import { gridify } from "../utils";

const store = useMainStore();
const gridData = computed(() =>
  gridify({ arr: Array.from(store.yesterdaysAnswers.sort()), size: 3 })
);
</script>

<template>
  <strong>
    <span
      v-for="letter in store.yesterdaysAvailableLetters"
      :key="`ydayLetter${letter}`"
      :class="{ 'middle-letter': letter === store.yesterdaysMiddleLetter }">
      {{ letter }}
    </span>
  </strong>
  <el-table :data="gridData" :cell-class-name="store.cellClassName">
    <el-table-column property="1" label="" />
    <el-table-column property="2" label="" />
    <el-table-column property="3" label="" />
  </el-table>
</template>

<style scoped lang="scss">
@import "../assets/styles/_variables";

.middle-letter {
  font-weight: bold;
  color: $bl-yellow;
}

.guessed-yesterday {
  background-color: #d4e7d4;
}

html.dark .guessed-yesterday {
  background-color: #1e321e;
}
</style>
