import "@/assets/css/common.styl";
import { createList } from "@/list";
import { createToolbar } from "@/toolbar";
import { magnetLinksToText } from "@/utils";

const list = createList("#topic_list");

if (list.$el && list.$el.parentNode) {
  const onCopyClick = function(opts) {
    const content = magnetLinksToText(list.links, opts);

    if (content) {
      GM_setClipboard(content, "{ type: 'text', mimetype: 'text/plain'}");
    }
  };

  const onShowClick = function(opts) {
    const content = magnetLinksToText(list.links, opts);
    if (content) {
      alert(content);
    }
  };

  const tableContainer = list.$el.parentNode.parentNode;

  if (tableContainer.className.indexOf("table") > -1) {
    const headerToolbar = createToolbar({
      position: "top"
    });

    headerToolbar.$on("copy", onCopyClick);
    headerToolbar.$on("show", onShowClick);

    const bottomToobar = createToolbar({
      position: "bottom"
    });
    bottomToobar.$on("copy", onCopyClick);
    bottomToobar.$on("show", onShowClick);

    tableContainer.insertBefore(headerToolbar.$el, tableContainer.firstChild);
    tableContainer.appendChild(bottomToobar.$el);

    list.$on("change", function(values) {
      const isEmpty = values.length <= 0;
      headerToolbar.visible = !isEmpty;
      bottomToobar.visible = !isEmpty;
    });
  }
}
