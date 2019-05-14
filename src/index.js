import "@/assets/css/common.styl";
import { createList } from "@/list";
import { createToolbar } from "@/toolbar";

const list = createList("#topic_list");

if (list.$el) {
  const tableContainer = list.$el.parentNode.parentNode;

  if (tableContainer.className.indexOf("table") > -1) {
    const headerToolbar = createToolbar({
      position: "top"
    });
    tableContainer.insertBefore(headerToolbar.$el, tableContainer.firstChild);

    const bottomToobar = createToolbar({
      position: "bottom"
    });
    tableContainer.appendChild(bottomToobar.$el);

    list.$on("change", function(values) {
      const isEmpty = values.length <= 0;
      headerToolbar.visible = !isEmpty;
      bottomToobar.visible = !isEmpty;
    });
  }
}
