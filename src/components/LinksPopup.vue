<template lang="pug">
  popup-wrapper(
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
import PopupWrapper from "@/components/PopupWrapper.vue";
import { getDefaultLinebreak } from "@/utils/misc";

export default {
  name: "LinksPopup",
  components: {
    PopupWrapper,
  },
  props: {
    zIndex: {
      type: Number,
      default: 10,
    },
    links: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      default() {
        const linebreak = getDefaultLinebreak();
        return {
          separator: linebreak,
        };
      },
    },
  },
  data() {
    return {
      content: "",
    };
  },
  computed: {
    textStyle() {
      if (
        ["\n", "\r\n"].indexOf(this.options.separator) > -1 &&
        this.links.length > 1
      ) {
        return {
          "white-space": "nowrap",
          "word-break": "normal",
        };
      } else {
        return {
          "white-space": "pre-line",
          "word-break": "break-all",
        };
      }
    },
  },
  watch: {
    links() {
      this.resetContent();
    },
  },
  created() {
    this.resetContent();
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
          this.$toast.display("复制成功！");
        } catch (e) {
          this.$toast.display("复制失败。");
        }
      } else {
        this.$toast.display("获取文本框失败！");
      }
    },
    copyAll() {
      if (!this.content) {
        this.$toast.display("文本框内容为空！");
        return;
      }

      try {
        GM_setClipboard(
          this.content,
          "{ type: 'text', mimetype: 'text/plain'}",
        );
        this.$toast.display("复制成功！");
      } catch (e) {
        this.$toast.display("复制失败。");
      }
    },
    selectAll() {
      const target = this.$refs["textarea"];
      if (target) {
        target.select();
      } else {
        this.$toast.display("获取文本框失败！");
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn
  padding: 2px 5px
  outline: none
  border: 1px solid #247
  background-color: white
  color: #247

.popup-header
  display: flex
  flex-direction: row
  align-items: center
  padding: 5px
  background-color: #247

  h4
    flex: 1 1 0
    color: #fff
    text-align: left
    font-weight: normal
    font-size: 14px
    line-height: 1.5

.popup-body
  padding: 5px
  background-color: #fff

  .links-box
    overflow: auto
    padding: 4px 8px
    border: 1px solid #247
    background-color: #eef
    background-image: none
    color: #333
    font-size: 12px
    line-height: 1.5
    resize: none
    cursor: text

.popup-footer
  display: flex
  flex-direction: row
  align-items: center
  padding: 5px
  background-color: #cdf

  .btn:not(:first-child)
    margin-left: 10px

  p
    flex: 1 1 0
    margin: 0
    text-align: right
</style>
