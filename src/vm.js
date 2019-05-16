import Vue from "vue";
import ToolBar from "@/components/ToolBar.vue";
import CheckboxHeader from "@/components/CheckboxHeader.vue";
import CheckboxItem from "@/components/CheckboxItem.vue";
import Toast from "@/components/Toast.vue";
import LinksPopup from "@/components/LinksPopup.vue";

export function createList(selector) {
  const HeaderVM = Vue.extend(CheckboxHeader);
  const ItemVM = Vue.extend(CheckboxItem);
  return new Vue({
    el: selector,
    data() {
      return {
        header: null,
        all: [],
        selected: []
      };
    },
    mounted() {
      this.$nextTick(function() {
        const table = this.$el;

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
      this.all.splice(0, this.all.length);
      this.selected.splice(0, this.selected.length);
    },
    computed: {
      links() {
        return this.selected.map(item => item.magnet).filter(m => !!m);
      }
    },
    watch: {
      links(val) {
        this.$emit("change", val);
      }
    },
    methods: {
      insertHeaderToRow(row) {
        const th = new HeaderVM();
        th.$on("change", this.onSelectAllChange);
        th.$mount();
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
        });

        const _self = this;
        td.$on("change", function(checked) {
          _self.onItemSelectChange(td, checked);
        });
        td.$mount(tdDOM);
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
      }
    }
  });
}

export function createToolbar(propsData) {
  const ToolBarVM = Vue.extend(ToolBar);
  return new ToolBarVM({
    propsData: propsData
  }).$mount();
}

export function createToast() {
  const ToastVM = Vue.extend(Toast);

  const toast = new ToastVM().$mount();
  document.body.appendChild(toast.$el);

  Object.defineProperty(Vue.prototype, "$toast", { value: toast });
  return toast;
}

export function createLinksPopup(propsData) {
  const LinksPopupVM = Vue.extend(LinksPopup);

  return new LinksPopupVM({
    propsData: propsData
  }).$mount();
}
