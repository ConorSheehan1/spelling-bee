import { config, shallowMount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, it, expect, vi } from "vitest";
import App from "./src/App.vue";

config.global.mocks.$t = (v) => v;

describe("App.vue", () => {
  const testDate = new Date("2023-02-03");
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.setSystemTime(testDate);
  });
  it("should render the local date in the title", () => {
    const testMessage = `Spelling Bee ${testDate.toLocaleDateString("sv")}`;
    const wrapper = shallowMount(App);
    expect(wrapper.get("#title-header").text()).toBe(testMessage);
  });
});
