<template lang="pug">
  div.tool-bar(
    :class="[position, {'visible': visible}]"
  )
    div.wrapper
      span.title 下载助手
      input.checkbox(
        :id="`clean-${position}`",
        type="checkbox",
        v-model="opts.clean"
      )
      label(:for="`clean-${position}`") 清理链接
      button.btn(
        @click="$emit('copy', opts)"
      ) 复制
      button.btn(
        @click="$emit('show', opts)"
      ) 显示
</template>

<script>
export default {
  name: "ToolBar",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "top"
    }
  },
  data() {
    let linebreak = "\n";
    if (navigator.userAgent.indexOf("Windows") > -1) {
      linebreak = "\r\n";
    }
    return {
      opts: {
        clean: false,
        linebreak: linebreak
      }
    };
  }
};
</script>

<style lang="stylus" scoped>
.tool-bar
  background-color: #247
  color: white
  display: none
  &.top
    border-bottom: 1px solid white;
  &.bottom
    border-top: 1px solid white;
  &.visible
    display: block
.wrapper
  display: flex
  align-items: center
  .title
    padding: 8px 15px
    border-right: 2px solid white
  .checkbox
    width: 14px
    height: 14px
    margin-left: 10px
  .btn
    padding: 2px 5px
    color: #247
    background-color: white
    border: 1px solid #247
    margin-left: 10px
</style>
