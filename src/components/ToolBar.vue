<template lang="pug">
  div.tool-bar(
    :class="[position, {'visible': visible}]"
  )
    div.wrapper
      span.title 下载助手
      label(:for="`clean-${position}`") 清理链接：
      input.checkbox(
        :id="`clean-${position}`",
        type="checkbox",
        v-model="opts.clean"
      )
      label(:for="`separator-${position}`") 分隔符：
      select(
        v-model="opts.separator",
        :id="`separator-${position}`"
      )
        option(value="\n") \n
        option(value="\r\n") \r\n
        option(value="\t") \t
        option(value=" ") 空格
        option(value=",") ,
      .btn-wrapper
        button.btn(
          @click="$emit('copy', opts)"
        ) 复制
        button.btn(
          @click="$emit('show', opts)"
        ) 显示
</template>

<script>
import { getDefaultLinebreak } from "@/utils/misc";
export default {
  name: "ToolBar",
  props: {
    position: {
      type: String,
      default: "top"
    }
  },
  data() {
    let linebreak = getDefaultLinebreak();
    return {
      visible: false,
      opts: {
        clean: true,
        separator: linebreak
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
  height: auto
  flex-direction: row
  align-items: center
  label
    margin-left: 10px
  .title
    padding: 8px 15px
    border-right: 2px solid white
  .checkbox
    width: 14px
    height: 14px
    vertical-align: middle

  .btn-wrapper
    margin-left: 10px
    .btn
      padding: 2px 5px
      color: #247
      background-color: white
      border: 1px solid #247
      margin: 0 5px
      outline: none
</style>
