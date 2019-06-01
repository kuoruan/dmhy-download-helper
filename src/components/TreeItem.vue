<template lang="pug">
  li.tree-item(:class="{ 'collection': this.isFolder, 'last': this.isLast }")
    div.hitarea(
      v-if="isFolder",
      :class="{ 'collapsable-hitarea': isOpen, 'last-hitarea': isLast }",
      @click="toggle"
    )
    div(
      @click="isFolder && toggle()",
      :class="['title', icon]"
    )
      h5 {{ name }}
      span.size {{ totalSize }}
    ul(
      v-if="isFolder",
      v-show="isOpen"
    )
      tree-item(
        class="item",
        v-for="(child, index) in children"
        :key="child.key",
        v-bind="child",
        :is-last="index === children.length -1"
      )
</template>

<script>
import Bytes from "bytes";

export default {
  name: "TreeItem",
  props: {
    key: {
      type: Number,
      default: -1
    },
    parentKey: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ""
    },
    level: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 0
    },
    children: {
      type: Array,
      default() {
        return [];
      }
    },
    isLast: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.expand
    };
  },
  computed: {
    isFolder() {
      return this.children && this.children.length > 0;
    },
    totalSize() {
      let sum;

      if (this.size > 0) {
        sum = this.size;
      } else {
        const sizeList = this.sizeListWithItem({
          size: this.size,
          children: this.children
        });

        sum = sizeList.reduce((a, b) => a + b, 0);
      }

      return Bytes(sum, {
        decimalPlaces: 2,
        unitSeparator: " "
      });
    },
    icon() {
      if (this.isFolder) {
        return this.isOpen ? "folder-open" : "folder-close";
      }
      const ext = this.name.split(".").pop();
      switch (ext.toLowerCase()) {
        case "mp4":
        case "rmvb":
        case "avi":
        case "mkv":
        case "wmv":
        case "flv":
        case "ts":
          return "video";
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "bmp":
        case "pdf":
        case "webp":
          return "image";
        case "rar":
        case "zip":
        case "7z":
        case "tar":
        case "gz":
        case "xz":
          return "archive";
        case "mp3":
        case "ogg":
        case "wma":
        case "wav":
        case "aac":
        case "flac":
        case "mka":
        case "cue":
          return "audio";
        case "txt":
        case "log":
        case "md":
          return "text";
        case "sub":
        case "idx":
        case "sst":
        case "srt":
        case "ssa":
        case "ass":
        case "tts":
          return "subtitle";
        default:
          return "unknown";
      }
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    sizeListWithItem(item) {
      const children = item.children;

      if (!children || children.length <= 0) {
        return item.size ? [item.size] : [];
      }
      let list = [];

      for (let i = 0, len = children.length; i < len; i++) {
        let cList = this.sizeListWithItem(children[i]);
        list.push(...cList);
      }

      return list;
    }
  }
};
</script>

<style lang="stylus" scoped>
li.tree-item
  margin: 0
  padding: 2px 0 2px 16px
  background: url("/assets/img/treeview-default-line.gif") 0 0 no-repeat
  &.collection
    background-position: 0 -176px
  &.last
    background-position: 0 -1766px
  .hitarea
    background: url("/assets/img/treeview-default.gif") -48px -47px no-repeat
    height: 16px
    width: 16px
    margin-left: -16px
    float: left
    cursor: pointer
    &.last-hitarea
      background-color: #fff
      background-position: -32px -69px
    &.collapsable-hitarea
      background-position: -16px -91px
      &.last-hitarea
        background-position: 0 -113px
  .title
    padding-left: 18px
    line-height: 16px
    height: 16px
    position: relative
    display: flex
    flex-direction: row
    box-sizing: border-box
    width: 100%
    h5
      flex: 1 1 0
      font-weight: normal
      font-size: 12px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    &:before
      position: absolute
      left: 0
      top: 0
      content: ""
      display: block
      width: 16px
      height: 16px
      background-color: #fff
      background-repeat: no-repeat
    &.folder-close:before
      background-image: url("/assets/img/folder-closed.gif")
    &.folder-open:before
      background-image: url("/assets/img/folder.gif")
    &.text:before
      background-image: url("/assets/img/file.gif")
    &.video:before
      background-image: url("https://share.dmhy.org/images/icon/mkv.gif")
    &.audio:before
      background-image: url("https://share.dmhy.org/images/icon/mp3.gif")
    &.image:before
      background-image: url("https://share.dmhy.org/images/icon/jpg.gif")
    &.archive:before
      background-image: url("https://share.dmhy.org/images/icon/rar.gif")
    &.subtitle:before
      background-image: url("https://share.dmhy.org/images/icon/txt.gif")
    &.unknown:before
      background-image: url("https://share.dmhy.org/images/icon/unknown.gif")
    .size
      display: block
      flex: 0
      color: grey
      white-space: nowrap
  &:nth-child(even) > .title
    background-color: #cdf
  &::nth-child(odd) > .title
    background-color: #fff
  ul
    padding: 0
    margin: 4px 0 0
    list-style: none
</style>
