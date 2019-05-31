import Vue from "vue";
import ToolBar from "@/components/ToolBar.vue";
import CheckboxHeader from "@/components/CheckboxHeader.vue";
import CheckboxItem from "@/components/CheckboxItem.vue";
import LinksPopup from "@/components/LinksPopup.vue";
import { magnetLinksWithOptions } from "@/utils/misc";

const HeaderVM = Vue.extend(CheckboxHeader);
const ItemVM = Vue.extend(CheckboxItem);

const ToolBarVM = Vue.extend(ToolBar);
const LinksPopupVM = Vue.extend(LinksPopup);

export function mountListElement(el, onError) {
  const list = new Vue({
    data() {
      return {
        header: null,
        all: [],
        selected: [],
        popupIndex: 10,
        toolbars: []
      };
    },
    mounted() {
      this.$nextTick(function() {
        const table = this.$el;
        let tableContainer;
        if (
          !table.parentNode ||
          ((tableContainer = table.parentNode.parentNode),
          !tableContainer || tableContainer.className.indexOf("table") < 0)
        ) {
          // Not in list page or list not in table container .table
          onError(this);
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
              this.insertCheckBoxToRow(body.rows[j], index++);
            }
          }
        } else {
          if (table.rows) {
            for (let i = 0, len = table.rows.length; i < len; i++) {
              let row = table.rows[i];
              if (i === 0) {
                this.insertHeaderToRow(row);
              } else {
                this.insertCheckBoxToRow(row, i - 1);
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

      this.all.forEach(item => {
        item.$off("change");
      });
      this.toolbars.forEach(t => {
        t.$off("copy");
        t.$off("show");
      });

      this.all.splice(0, this.all.length);
      this.selected.splice(0, this.selected.length);
      this.toolbars.splice(0, this.toolbars.length);
    },
    computed: {
      links() {
        return this.selected.map(item => item.magnet).filter(m => !!m);
      }
    },
    watch: {
      links(val) {
        const isEmpty = !val || val.length <= 0;
        this.toolbars.forEach(t => {
          t.visible = !isEmpty;
        });
      }
    },
    methods: {
      initToolBars(tableContainer) {
        const headerToolbar = new ToolBarVM({
          propsData: {
            position: "top"
          }
        }).$mount();

        headerToolbar.$on("copy", this.onCopyLinks);
        headerToolbar.$on("show", this.onShowLinks);

        const bottomToobar = new ToolBarVM({
          propsData: {
            position: "bottom"
          }
        }).$mount();
        bottomToobar.$on("copy", this.onCopyLinks);
        bottomToobar.$on("show", this.onShowLinks);

        tableContainer.insertBefore(
          headerToolbar.$el,
          tableContainer.firstChild
        );
        tableContainer.appendChild(bottomToobar.$el);

        this.toolbars.push(headerToolbar, bottomToobar);
      },
      insertHeaderToRow(row) {
        const th = new HeaderVM().$mount();
        th.$on("change", this.onSelectAllChange);

        row.insertBefore(th.$el, row.cells[0]);
        this.header = th;
      },
      insertCheckBoxToRow(row, index) {
        const linkDOM = row.querySelector(".arrow-magnet");

        const tdDOM = row.insertCell(0);
        const td = new ItemVM({
          propsData: {
            index: index,
            magnet: linkDOM ? linkDOM.href : ""
          }
        }).$mount(tdDOM);

        const _self = this;
        td.$on("change", function(checked) {
          _self.onItemSelectChange(td, checked);
        });
        this.all.push(td);
      },
      onSelectAllChange(checked) {
        this.all.forEach(function(item) {
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
              options: opts
            }
          }).$mount();
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
      }
    }
  });

  list.$mount(el);
}
