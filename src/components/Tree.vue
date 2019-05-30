<template lang="pug">
  ul.tree-list
    tree-item.tree-item(
      v-for="(folder, index) in folders",
      v-bind="folder",
      :key="folder.key"
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
    },
    onError: {
      type: Function,
      default: null
    }
  }
};
</script>
