<script setup>
import { ref, computed, onMounted } from "vue";
import Hive from "./components/Hive.vue";
import CorrectGuesses from "./components/CorrectGuesses.vue";
import Progress from "./components/Progress.vue";
import YesterdaysAnswers from "./components/YesterdaysAnswers.vue";
import Help from "./components/Help.vue";
import allAnswers from "../data/allAnswers";
import { useMainStore } from "./store.js";
import { Sunny, Moon } from "@element-plus/icons-vue";

const store = useMainStore();
const showYesterdaysAnswers = ref(false);
const showHelp = ref(false);
const zindex = ref(0);

const darkmode = ref(store.theme === "dark");

const onToggleDarkMode = () => {
  if (darkmode.value === true) {
    store.theme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    store.theme = "light";
    document.documentElement.classList.remove("dark");
  }
};

onMounted(onToggleDarkMode);

// _ctx.setTimeout is not a function. forward on to vue instance instead.
const wait2Seconds = (func) => setTimeout(func, 2000);

// current date yyyy-mm-dd
const dateString = new Date().toISOString().split("T")[0];
// current date as int yyyymmdd
const dateInt = parseInt(dateString.replaceAll("-", ""), 10);
// pick next puzzle input, % len puzzles to restart if out of index
const todaysAnswerObj = allAnswers[dateInt % allAnswers.length];
const yesterdaysAnswerObj = allAnswers[(dateInt - 1) % allAnswers.length];
// reset old answers if necessary, make answers available in all components
store.startGame({
  todaysAnswerObj,
  yesterdaysAnswerObj,
  gameDate: dateString,
});
// TODO: favicon
// TODO: extra not in spellingbee: track scores across days
// TODO: add shake animation on incorrect submition?
// https://www.reddit.com/r/webdev/comments/su6y4r/what_animations_are_used_in_wordle/
// need setTimeout to wait for animation before removing guess
</script>

<template>
  <el-dialog v-model="showYesterdaysAnswers" :title="$t('Yesterdays Answers')">
    <YesterdaysAnswers />
  </el-dialog>
  <el-dialog v-model="showHelp" :title="$t('How to play')">
    <Help />
  </el-dialog>
  <div class="common-layout">
    <el-header height="2em" id="title-header">
      <h2>
        <strong> Beach Litríochta </strong>
        <span> {{ dateString }} </span>
      </h2>
    </el-header>
    <el-menu mode="horizontal" :ellipsis="false">
      <el-menu-item index="1" @click="showHelp = true">{{
        $t("Help")
      }}</el-menu-item>
      <el-menu-item index="2" @click="showYesterdaysAnswers = true">
        {{ $t("Yesterdays Answers") }}
      </el-menu-item>
      <el-menu-item index="3">
        <el-select-v2
          style="margin-top: 10px; width: 6em"
          v-model="$i18n.locale"
          :options="['ga', 'en'].map((v) => ({ value: v, label: v }))"
          placeholder="Please select" />
      </el-menu-item>
      <el-menu-item index="4">
        <el-switch
          v-model="darkmode"
          @change="onToggleDarkMode"
          class="darkmode-switch"
          style="--el-switch-on-color: $bl-green"
          inline-prompt
          size="large"
          :active-icon="Sunny"
          :inactive-icon="Moon" />
      </el-menu-item>
    </el-menu>
    <Progress />
    <CorrectGuesses
      @open="zindex = -1"
      @close="wait2Seconds(() => (zindex = 0))" />
    <Hive :ZIndex="zindex" />
  </div>
</template>

<style lang="scss">
@import "element-plus/dist/index.css";
@import "element-plus/theme-chalk/dark/css-vars.css";
@import "./assets/styles/_variables.scss";

* {
  // stop double tap zoom on safari. often double tap keys in game.
  // TODO: register multiple click events when holding down button?
  // https://stackoverflow.com/a/53236027/6305204
  touch-action: manipulation;
  // https://stackoverflow.com/a/66103439/6305204
  -webkit-tap-highlight-color: transparent;
}

html {
  box-sizing: border-box;
  --el-color-success: $bl-green;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

// don't allow words to be split. split on space between words
div {
  white-space: pre-wrap;
  word-break: break-word;
}

.darkmode-switch {
  margin-top: 5px;
}

h2 span {
  color: #bebebe;
  font-weight: lighter;
}

.main-container {
  padding-top: 3em;
}

.common-layout {
  max-width: 1000px;
  margin: auto;
}

.el-header h2 {
  padding: 0;
  margin: 0;
}
.el-menu--horizontal {
  border-top: solid 1px var(--el-menu-border-color);
  justify-content: space-between;
  .el-menu-item {
    padding: 0;
  }
  .el-menu-item.is-active {
    color: $bl-green !important;
    border-bottom-color: currentcolor;
  }
}
.is-focused {
  border-color: $bl-green !important;
}
.is-selected {
  color: $bl-green !important;
  &::after {
    color: $bl-green;
  }
}
.el-dialog {
  width: 80%;
}
.el-table {
  --el-table-header-bg-color: unset;
}
.el-message--success {
  --el-message-bg-color: unset;
  --el-message-text-color: unset;
  background-color: lighten($bl-green, 50) !important;
  color: $bl-green !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  padding: 0 10px;

  // account for 10px padding on either side of #app
  max-width: calc(100% - 20px);
  max-height: 100vh;
  #title-header {
    margin: 0;
    padding: 0;
  }
}

.toast-message {
  max-width: 80%;
  margin: 0, 1em;
}

html.dark {
  header strong {
    color: $bl-green;
  }
}

@media only screen and (max-width: 700px) {
  #app {
    margin-top: 10px;
  }
}
</style>
