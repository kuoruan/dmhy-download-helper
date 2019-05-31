<template lang="pug">
  li(:class="clazz")
    div.hitarea(
      v-if="isFolder",
      :class="[{ 'collapsable-hitarea': isOpen, 'last-hitarea': isLast }]"
    )
    div(
      @click="isOpen = !isOpen",
      :class="['title', itemType]"
    )
      span {{ name }}
      span.size {{ totalSize }}
    ul(
      v-show="isOpen",
      v-if="isFolder"
    )
      tree-item(
        class="item",
        v-for="(child, index) in children"
        :key="index",
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
      default: 0
    },
    parentKey: {
      type: Number,
      default: 0
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
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    isFolder() {
      return this.children && this.children.length > 0;
    },
    clazz() {
      return {
        collapsable: this.isFolder && this.isOpen,
        expandable: this.isFolder && !this.isOpen,
        last: this.isLast
      };
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
    itemType() {
      if (this.isFolder) {
        return "folder";
      }
      return "file";
    }
  },
  methods: {
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
