import "@/assets/css/common.styl";
import { createList, createToolbar, createToast, createLinksPopup } from "@/vm";
import { magnetLinksToText } from "@/utils";

const list = createList("#topic_list");

if (list.$el && list.$el.parentNode) {
  const toast = createToast();

  let popupIndex = 10;

  const onCopyClick = function(opts) {
    const content = magnetLinksToText(list.links, opts);

    if (content) {
      try {
        GM_setClipboard(content, "{ type: 'text', mimetype: 'text/plain'}");
        toast.display("复制成功！");
      } catch (e) {
        toast.display("复制失败，请重试。");
      }
    }
  };

  const onShowClick = function(opts) {
    const content = magnetLinksToText(list.links, opts);
    if (content) {
      const popup = createLinksPopup({
        zIndex: popupIndex++,
        links: content
      });
      popup.$on("close", function() {
        popup.$off("close");
        try {
          popup.$el.remove();
        } catch (e) {
          document.body.removeChild(popup.$el);
        }
      });
      document.body.appendChild(popup.$el);
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
