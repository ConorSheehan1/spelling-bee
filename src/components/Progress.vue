<script setup>
import { ref } from "vue";
import { useMainStore } from "../store.js";
import { zip } from "../utils.js";

const store = useMainStore();
const showRanking = ref(false);
</script>

<template>
  <el-dialog v-model="showRanking" :title="$t('Ranking')">
    <div class="ranking-dialog">
      <p>{{ $t("RankMSG") }}:</p>
      <ul>
        <li
          v-for="(scoreLevel, index) in store.getScoreLevels"
          :key="`ranking${index}`">
          {{ $t(`rank.${index}`) }} ({{ scoreLevel }})
        </li>
      </ul>
    </div>
  </el-dialog>
  <div class="row" @click="showRanking = true">
    <strong class="rank-level">
      {{ $t(`rank.${store.getProgressIndex}`) }}
    </strong>
    <el-progress
      :percentage="store.getProgressPercentage"
      :stroke-width="20"
      color="#20a866"
      :format="() => store.getUserScore" />
  </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/_variables";

.row {
  margin: 20px;
}

.ranking-dialog {
  text-align: left;
}

html.dark .row strong {
  color: $bl-grey;
}

@media only screen and (max-width: 700px) {
  .row {
    margin: 10px;
  }
}
</style>
