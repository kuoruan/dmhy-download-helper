<template lang="pug">
  ul.tree-list
    tree-item(
      v-for="(folder, index) in folders",
      v-bind="folder",
      :key="folder.key",
      :is-last="index === folders.length - 1"
    )
</template>

<script>
import TreeItem from "@/components/TreeItem.vue";

export default {
  name: "Tree",
  components: {
    TreeItem
  },
  props: {
    folders: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="stylus">
.tree-list
  padding: 0
  margin: 0
  list-style: none
  ul
    @extend .tree-list
    background-color: white
    margin-top: 4px
  li
    margin: 0
    padding: 2px 0 2px 16px
    background: url("/assets/img/treeview-default-line.gif") 0 0 no-repeat
    &.collapsable
    &.expandable
      background-position: 0 -176px
    &.last
      background-position: 0 -1766px
    .title
      padding-left: 16px
      line-height: 16px
      &.folder
        background: url("/assets/img/folder.gif") 0 0 no-repeat
      &.file
        background: url("/assets/img/file.gif") 0 0 no-repeat
      .size
        float: right
        color: grey
  .hitarea
    background: url("/assets/img/treeview-default.gif") -64px -24px no-repeat
    height: 16px
    width: 16px
    margin-left: -16px
    float: left
    cursor: pointer
    &.last-hitarea
      background-position: 0
    &.collapsable-hitarea
      background-position: -80px -2px
      &.last-hitarea
        background-position: 0
</style>
