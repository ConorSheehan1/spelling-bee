<script setup lang="ts">
import Support from "./Support.vue";
const email = "conor.sheehan.dev@gmail.com";
</script>

<template>
  <div class="info-dialog">
    <h3>{{ $t("helpCreateWords") }}</h3>

    <ul>
      <li>{{ $t("helpWordRule1") }}.</li>
      <li>{{ $t("helpWordRule2") }}.</li>
      <li>{{ $t("helpWordRule3") }}.</li>
    </ul>

    <h3>{{ $t("helpScorePoints") }}</h3>

    <ul>
      <li>{{ $t("helpPointsRule1") }}.</li>
      <li>{{ $t("helpPointsRule2") }}.</li>
      <li>{{ $t("helpPointsRule3A") }}. {{ $t("helpPointsRule3B") }}!</li>
    </ul>

    <h3>Support</h3>
    <Support />

    <h3>{{ $t("AboutGame") }}</h3>
    <ul>
      <li>
        {{ $t("AboutGameText") }}
      </li>
      <li>
        {{ $t("InspirationSpellingBee") }}
        <el-link
          type="primary"
          href="https://www.nytimes.com/puzzles/spelling-bee"
          target="_blank">
          New York Times Spelling Bee
        </el-link>
      </li>
      <li>
        {{ $t("WordlistSource") }}
        <el-link
          type="primary"
          href="https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt"
          target="_blank">
          Wordlist
        </el-link>
      </li>
    </ul>

    <h3>{{ $t("Bugs") }}</h3>
    <ul>
      <li>
        {{ $t("BugText") }}
        <el-link
          type="primary"
          href="https://github.com/ConorSheehan1/spelling-bee/issues"
          target="_blank"
          >GitHub</el-link
        >
        {{ $t("BugTextEmail") }}
        <el-link type="primary" :href="`mailto:${email}`" target="_blank">{{
          email
        }}</el-link>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.info-dialog {
  text-align: left;
}

html.dark {
  .github-icon {
    filter: invert(0.8);
  }
}
</style>
