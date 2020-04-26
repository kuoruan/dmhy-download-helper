<template lang="pug">
  ul(style="padding: 0; margin: 0; list-style: none;")
    tree-item(
      v-for="(folder, index) in folders",
      v-bind="folder",
      :key="folder.key",
      :is-last="index === folders.length - 1",
      :expand="true"
    )
</template>

<script>
import TreeItem from "@/components/TreeItem.vue";

export default {
  name: "Tree",
  components: {
    TreeItem,
  },
  props: {
    folders: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
