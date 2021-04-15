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

let topicListEl, fileListEl;

if ((topicListEl = document.querySelector("#topic_list"))) {
  mountListElement(topicListEl);

  if (
    typeof jQuery !== "undefined" &&
    typeof jQuery.tablesorter !== "undefined"
  ) {
    jQuery("#topic_list").tablesorter({ widgets: ["zebra"] });
    jQuery("#topic_list")
      .bind("sortStart", function () {
        jQuery("#overlay").show();
      })
      .bind("sortEnd", function () {
        jQuery("#overlay").hide();
      });
  }
}

if ((fileListEl = document.querySelector("#resource-tabs .file_list"))) {
  let title = "";

  let titleEl;
  if ((titleEl = document.querySelector(".topic-title h3"))) {
    title = titleEl.innerText.trim();
  }
  mountFileListElement(fileListEl, title);
}
