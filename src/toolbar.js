import Vue from "vue";
import ToolBar from "@/components/ToolBar.vue";

const ToolBarVM = Vue.extend(ToolBar);

export function createToolbar(propsData) {
  return new ToolBarVM({
    propsData: propsData
  }).$mount();
}
