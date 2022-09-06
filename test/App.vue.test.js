import { config, shallowMount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, it, expect, vi } from "vitest";
import App from "./src/App.vue";

config.global.mocks.$t = (v) => v;

describe("App.vue", () => {
  let testDate = "2023-02-03";
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.setSystemTime(new Date(testDate));
  });
  it("should render the date in the title", () => {
    const testMessage = `Spelling Bee ${testDate}`;
    const wrapper = shallowMount(App);
    expect(wrapper.get("#title-header").text()).toBe(testMessage);
  });
});
