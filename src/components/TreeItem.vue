<template lang="pug">
  li
    div(
      @click="toggle"
    ) {{ name }}
    ul(
      v-show="isOpen",
      v-if="isFolder"
    )
      tree-item(
        class="item",
        v-for="(child, index) in children"
        :key="index",
        v-bind="child"
      )
</template>

<script>
export default {
  name: "TreeItem",
  props: {
    name: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    children: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    isFolder() {
      return !this.size && (this.children && this.children.length > 0);
    }
  },
  methods: {
    toggle() {}
  }
};
</script>
