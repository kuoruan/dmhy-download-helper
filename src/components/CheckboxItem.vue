<template lang="pug">
  td(width="40")
    input.select(
      type="checkbox",
      v-model="checked",
      :data-index="index",
      @change="$emit('change', $event.target.checked)"
    )
</template>

<script>
export default {
  name: "CheckboxItem",
  props: {
    index: {
      type: Number,
      default: 0,
    },
    magnet: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      checked: false,
    };
  },
};
</script>

<style lang="stylus" scoped>
.select
  cursor: pointer
  width: 14px
  height: 14px
</style>
