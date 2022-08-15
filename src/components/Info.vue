<script setup lang="ts">
import { useMainStore } from "../store";

const store = useMainStore();
const email = "conor.sheehan.dev@gmail.com";
</script>

<template>
  <div class="info-dialog">
    <h3>{{ $t("helpCreateWords") }}.</h3>

    <ul>
      <li>{{ $t("helpWordRule1") }}.</li>
      <li>{{ $t("helpWordRule2") }}.</li>
      <li>{{ $t("helpWordRule3") }}.</li>
    </ul>

    <h3>{{ $t("helpScorePoints") }}.</h3>

    <ul>
      <li>{{ $t("helpPointsRule1") }}.</li>
      <li>{{ $t("helpPointsRule2") }}.</li>
      <li>{{ $t("helpPointsRule3A") }}. {{ $t("helpPointsRule3B") }}!</li>
    </ul>

    <h3>{{ $t("AboutGame") }}</h3>
    <ul>
      <li>
        {{ $t("AboutGameText") }}
      </li>
      <li>
        {{ $t("OpenSourceText") }}
        <el-link
          type="primary"
          href="https://github.com/ConorSheehan1/spelling-bee"
          target="_blank">
          GitHub
          <img
            height="36"
            src="../assets/github.svg"
            alt="github"
            class="github-icon" />
        </el-link>
      </li>
      <li>
        {{ $t("KoFiText") }}
        <el-link
          type="primary"
          href="https://ko-fi.com/A0A1DOQQD"
          target="_blank">
          <img
            height="36"
            style="border: 0px; height: 36px"
            src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com" />
        </el-link>
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
