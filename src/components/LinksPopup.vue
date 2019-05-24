<template lang="pug">
  popup(
    :z-index="zIndex",
    @overlay-click="$emit('close')",
    :middle="false",
    :margin-top="100",
  )
    div.popup-header
      h4 查看链接
      button.btn(@click="$emit('close')") 关闭
    div.popup-body
      textarea.links-box(
        v-model="content",
        rows="10",
        cols="80",
        :style="textStyle",
        ref="textarea"
      )
    div.popup-footer
      button.btn(@click="resetContent") 重置

      button.btn(@click="selectAll") 全选
      button.btn(@click="copySelected") 复制选中
      button.btn(@click="copyAll") 复制全部

      p 共 {{ links.length }} 条链接
</template>

<script>
import Popup from "@/components/Popup.vue";
import { getDefaultLinebreak } from "@/utils";

export default {
  name: "LinksPopup",
  components: {
    Popup
  },
  props: {
    zIndex: {
      type: Number,
      default: 10
    },
    links: {
      type: Array,
      default() {
        return [];
      }
    },
    options: {
      type: Object,
      default() {
        const linebreak = getDefaultLinebreak();
        return {
          separator: linebreak
        };
      }
    }
  },
  data() {
    return {
      content: ""
    };
  },
  created() {
    this.resetContent();
  },
  watch: {
    links() {
      this.resetContent();
    }
  },
  computed: {
    textStyle() {
      if (
        ["\n", "\r\n"].indexOf(this.options.separator) > -1 &&
        this.links.length > 1
      ) {
        return {
          "white-space": "nowrap",
          "word-wrap": "normal"
        };
      } else {
        return {
          "white-space": "pre-wrap",
          "word-wrap": "break-all"
        };
      }
    }
  },
  methods: {
    resetContent() {
      this.content = this.links.join(this.options.separator);
    },
    copySelected() {
      const target = this.$refs["textarea"];
      if (target) {
        const start = target.selectionStart;
        const finish = target.selectionEnd;
        if (start < 0 || finish <= start) {
          this.$toast.display("所选内容为空！");
          return;
        }
        try {
          const text = this.content.substring(start, finish);
          GM_setClipboard(text, "{ type: 'text', mimetype: 'text/plain'}");
          this.$toast.display("复制成功");
        } catch (e) {
          this.$toast.display("复制失败");
        }
      } else {
        this.$toast.display("获取文本框失败");
      }
    },
    copyAll() {
      if (!this.content) {
        this.$toast.display("文本框内容为空");
        return;
      }

      try {
        GM_setClipboard(
          this.content,
          "{ type: 'text', mimetype: 'text/plain'}"
        );
        this.$toast.display("复制成功");
      } catch (e) {
        this.$toast.display("复制失败");
      }
    },
    selectAll() {
      const target = this.$refs["textarea"];
      if (target) {
        target.select();
      } else {
        this.$toast.display("获取文本框失败");
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.btn
  padding: 2px 5px
  color: #247
  background-color: white
  border: 1px solid #247
  outline: none
.popup-header
  background-color: #247
  padding: 5px
  display: flex
  flex-direction: row
  align-items: center
  h4
    font-size: 14px
    text-align: left
    font-weight: normal
    line-height: 1.5
    color: #fff
    flex: 1 1 0
.popup-body
  padding: 5px
  background-color: #fff
  .links-box
    background-color: #eef
    background-image: none
    border: 1px solid #247
    color: #333
    padding: 4px 8px
    font-size: 12px
    line-height: 1.5
    overflow: auto
    resize: none
    cursor: text
.popup-footer
  padding: 5px
  background-color: #cdf
  display: flex
  flex-direction: row
  align-items: center
  .btn:not(:first-child)
    margin-left: 10px
  p
    text-align: right
    flex: 1 1 0
    margin: 0
</style>
