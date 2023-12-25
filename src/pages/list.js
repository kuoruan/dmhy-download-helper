import Vue from "vue";

import CheckboxHeader from "@/components/CheckboxHeader.vue";
import CheckboxItem from "@/components/CheckboxItem.vue";
import LinksPopup from "@/components/LinksPopup.vue";
import ToolBar from "@/components/ToolBar.vue";
import TorrentDownloadHeader from "@/components/TorrentDownloadHeader.vue";
import TorrentDownloadItem from "@/components/TorrentDownloadItem.vue";
import { magnetLinksWithOptions } from "@/utils/misc";

const CheckboxHeaderVM = Vue.extend(CheckboxHeader);
const CheckboxItemVM = Vue.extend(CheckboxItem);

const TorrentDownloadHeaderVM = Vue.extend(TorrentDownloadHeader);
const TorrentDownloadItemVM = Vue.extend(TorrentDownloadItem);

const ToolBarVM = Vue.extend(ToolBar);
const LinksPopupVM = Vue.extend(LinksPopup);

export function mountListElement(el) {
  const list = new Vue({
    data() {
      return {
        header: null,
        all: [],
        selected: [],
        popupIndex: 10,
        toolbars: [],
      };
    },
    computed: {
      links() {
        return this.selected.map((item) => item.magnet).filter((m) => !!m);
      },
    },
    watch: {
      links(val) {
        const isEmpty = !val || val.length <= 0;
        this.toolbars.forEach((t) => {
          t.visible = !isEmpty;
        });
      },
    },
    mounted() {
      this.$nextTick(function () {
        const table = this.$el;
        let tableContainer;
        if (
          !table.parentNode ||
          ((tableContainer = table.parentNode.parentNode),
          !tableContainer || tableContainer.className.indexOf("table") < 0)
        ) {
          // Not in list page or list not in table container .table
          return;
        }

        if (table.tHead && table.tBodies) {
          if (table.tHead.rows && table.tHead.rows.length > 0) {
            this.insertHeaderToRow(table.tHead.rows[0]);
          }

          let index = 0;
          for (let i = 0, len = table.tBodies.length; i < len; i++) {
            let body = table.tBodies[i];

            for (let j = 0, rowLen = body.rows.length; j < rowLen; j++) {
              this.insertItemToRow(body.rows[j], index++);
            }
          }
        } else {
          if (table.rows) {
            for (let i = 0, len = table.rows.length; i < len; i++) {
              let row = table.rows[i];
              if (i === 0) {
                this.insertHeaderToRow(row);
              } else {
                this.insertItemToRow(row, i - 1);
              }
            }
          }
        }

        this.initToolBars(tableContainer);
      });
    },
    beforeDestroy() {
      if (this.header) {
        this.header.$off("change");
        this.header = null;
      }

      this.all.forEach((item) => {
        item.$off("change");
      });
      this.toolbars.forEach((t) => {
        t.$off("copy");
        t.$off("show");
      });

      this.all.splice(0, this.all.length);
      this.selected.splice(0, this.selected.length);
      this.toolbars.splice(0, this.toolbars.length);
    },
    methods: {
      initToolBars(tableContainer) {
        const headerToolbar = new ToolBarVM({
          propsData: {
            position: "top",
          },
        }).$mount();

        headerToolbar.$on("copy", this.onCopyLinks);
        headerToolbar.$on("show", this.onShowLinks);

        const bottomToobar = new ToolBarVM({
          propsData: {
            position: "bottom",
          },
        }).$mount();
        bottomToobar.$on("copy", this.onCopyLinks);
        bottomToobar.$on("show", this.onShowLinks);

        tableContainer.insertBefore(
          headerToolbar.$el,
          tableContainer.firstChild,
        );
        tableContainer.appendChild(bottomToobar.$el);

        this.toolbars.push(headerToolbar, bottomToobar);
      },
      insertHeaderToRow(row) {
        if (row.cells.length <= 0) return;

        const firstCell = row.cells[0];
        let sizeCell;
        if (row.cells.length >= 5) {
          sizeCell = row.cells[4];
        }

        const checkboxTH = new CheckboxHeaderVM().$mount();
        checkboxTH.$on("change", this.onSelectAllChange);

        row.insertBefore(checkboxTH.$el, firstCell);
        this.header = checkboxTH;

        if (sizeCell) {
          const bittorrentDownloadTH = new TorrentDownloadHeaderVM().$mount();
          row.insertBefore(bittorrentDownloadTH.$el, sizeCell);
        }
      },
      insertItemToRow(row, index) {
        if (row.cells.length <= 0) return;

        const firstCell = row.cells[0];
        let sizeCell;
        if (row.cells.length >= 5) {
          sizeCell = row.cells[4];
        }

        const magnetLinkDOM = row.querySelector("td > .arrow-magnet");

        const checkboxTD = new CheckboxItemVM({
          propsData: {
            index: index,
            magnet: magnetLinkDOM ? magnetLinkDOM.href : "",
          },
        }).$mount();

        const _self = this;
        checkboxTD.$on("change", function (checked) {
          _self.onItemSelectChange(checkboxTD, checked);
        });
        row.insertBefore(checkboxTD.$el, firstCell);

        this.all.push(checkboxTD);

        if (sizeCell) {
          const detailLinkDom = row.querySelector("td.title > a");

          const bittorrentDownloadTD = new TorrentDownloadItemVM({
            propsData: {
              index: index,
              detailLink: detailLinkDom ? detailLinkDom.href : "",
              title: detailLinkDom ? detailLinkDom.innerText : "",
            },
          }).$mount();
          row.insertBefore(bittorrentDownloadTD.$el, sizeCell);
        }
      },
      onSelectAllChange(checked) {
        this.all.forEach(function (item) {
          item.checked = checked;
        });
        if (checked) {
          this.selected = [...this.all];
        } else {
          this.selected.splice(0, this.selected.length);
        }
      },
      onItemSelectChange(item, checked) {
        const selectedIndex = this.selected.indexOf(item);
        if (checked && selectedIndex < 0) {
          this.selected.push(item);
        } else if (!checked && selectedIndex > -1) {
          this.selected.splice(selectedIndex, 1);
        }

        if (this.header) {
          this.header.checked = this.all.length === this.selected.length;
        }
      },
      onCopyLinks(opts) {
        const links = magnetLinksWithOptions(this.links, opts);

        if (links.length > 0) {
          try {
            const content = links.join(opts.separator);
            GM_setClipboard(content, "{ type: 'text', mimetype: 'text/plain'}");
            this.$toast.display("复制成功！");
          } catch (e) {
            this.$toast.display("复制失败，请重试。");
          }
        }
      },
      onShowLinks(opts) {
        const links = magnetLinksWithOptions(this.links, opts);
        if (links.length > 0) {
          const popup = new LinksPopupVM({
            propsData: {
              zIndex: this.popupIndex++,
              links: links,
              options: opts,
            },
          }).$mount();
          popup.$on("close", function () {
            popup.$off("close");
            try {
              popup.$el.remove();
            } catch (e) {
              document.body.removeChild(popup.$el);
            }
          });
          document.body.appendChild(popup.$el);
        }
      },
    },
  });

  list.$mount(el);
}
