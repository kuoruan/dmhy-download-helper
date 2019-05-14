import Vue from "vue";
import ToolBar from "@/components/ToolBar.vue";

export function createToolbar(propsData) {
  const ToolBarVM = Vue.extend(ToolBar);
  return new ToolBarVM({
    propsData: propsData
  }).$mount();
}
