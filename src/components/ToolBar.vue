<template lang="pug">
  div.tool-bar(
    :class="[position, {'visible': visible}]"
  )
    div.wrapper
      span.title 下载助手
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
  }
};
</script>

<style lang="stylus" scoped>
.tool-bar
  background-color: #247;
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
    padding: 5px 10px
    border-right: 1px solid white
</style>
