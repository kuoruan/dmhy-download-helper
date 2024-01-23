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
import XBytes from "xbytes";

const Videos = ["mp4", "rmvb", "avi", "mkv", "wmv", "flv", "ts"];
const Audios = ["mp3", "ogg", "wma", "wav", "aac", "flac", "mka", "cue"];
const Subtitles = ["sub", "idx", "sup", "sst", "srt", "ssa", "ass", "tts"];
const Images = ["jpg", "jpeg", "png", "gif", "bmp", "pdf", "webp"];
const Archives = ["rar", "rar5", "zip", "7z", "tar", "gz", "xz"];
const Documents = [
  "txt",
  "log",
  "md",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "md5",
];

export default {
  name: "TreeItem",
  props: {
    parentKey: {
      type: Number,
      default: -1,
    },
    name: {
      type: String,
      default: "",
    },
    level: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 0,
    },
    children: {
      type: Array,
      default() {
        return [];
      },
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: this.expand,
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
          children: this.children,
        });

        sum = sizeList.reduce((a, b) => a + b, 0);
      }

      return XBytes(sum, { iec: true, fixed: 1 });
    },
    icon() {
      if (this.isFolder) {
        return this.isOpen ? "folder-open" : "folder-close";
      }
      const ext = this.name.split(".").pop().toLowerCase();
      switch (true) {
        case Videos.indexOf(ext) > -1:
          return "video";
        case Images.indexOf(ext) > -1:
          return "image";
        case Archives.indexOf(ext) > -1:
          return "archive";
        case Audios.indexOf(ext) > -1:
          return "audio";
        case Documents.indexOf(ext) > -1:
          return "document";
        case Subtitles.indexOf(ext) > -1:
          return "subtitle";
        default:
          return "unknown";
      }
    },
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
    },
  },
};
</script>

<style lang="stylus" scoped>
li.tree-item
  margin: 0
  padding: 2px 0 2px 16px
  background: url('@/assets/img/treeview-default-line.gif') 0 0 no-repeat

  &.collection
    background-position: 0 -176px

  &.last
    background-position: 0 -1766px

  .hitarea
    float: left
    margin-left: -16px
    width: 16px
    height: 16px
    background: url('@/assets/img/treeview-default.gif') -48px -47px no-repeat
    cursor: pointer

    &.last-hitarea
      background-color: #fff
      background-position: -32px -69px

    &.collapsable-hitarea
      background-position: -16px -91px

      &.last-hitarea
        background-position: 0 -113px

  .title
    position: relative
    display: flex
    flex-direction: row
    box-sizing: border-box
    padding-left: 18px
    width: 100%
    height: 16px
    line-height: 16px

    h5
      flex: 1 1 0
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      font-weight: normal
      font-size: 12px

    &:before
      position: absolute
      top: 0
      left: 0
      display: block
      width: 16px
      height: 16px
      background-color: #fff
      background-repeat: no-repeat
      content: ''

    &.folder-close:before
      background-image: url('@/assets/img/folder-closed.gif')

    &.folder-open:before
      background-image: url('@/assets/img/folder.gif')

    &.document:before
      background-image: url('@/assets/img/file.gif')

    &.video:before
      background-image: url('///images/icon/mkv.gif')

    &.audio:before
      background-image: url('///images/icon/mp3.gif')

    &.image:before
      background-image: url('///images/icon/jpg.gif')

    &.archive:before
      background-image: url('///images/icon/rar.gif')

    &.subtitle:before
      background-image: url('///images/icon/txt.gif')

    &.unknown:before
      background-image: url('///images/icon/unknown.gif')

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
    margin: 4px 0 0
    padding: 0
    list-style: none
</style>
