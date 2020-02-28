import "@/assets/css/common.styl";

import Toast from "@/components/Toast.vue";
import Vue from "vue";
import { mountFileListElement } from "@/pages/view";
import { mountListElement } from "@/pages/list";

// Init toast item
const ToastVM = Vue.extend(Toast);

const toast = new ToastVM().$mount();
document.body.appendChild(toast.$el);

Object.defineProperty(Vue.prototype, "$toast", { value: toast });

const topicListEl = document.querySelector("#topic_list");
if (topicListEl) {
  mountListElement(topicListEl);
}

const fileListEl = document.querySelector("#resource-tabs .file_list");
if (fileListEl) {
  let title = "";
  const titleEl = document.querySelector(".topic-title h3");
  if (titleEl) {
    title = titleEl.innerText.trim();
  }
  mountFileListElement(fileListEl, title);
}
