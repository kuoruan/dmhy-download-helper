<template lang="pug">
  td(width="40")
    input.select(
      type="checkbox",
      :checked="checked",
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
      default: 0
    },
    checked: {
      type: Boolean,
      default: false
    },
    magnet: {
      type: String,
      default: ""
    }
  },
  model: {
    prop: "checked",
    event: "change"
  }
};
</script>

<style lang="stylus" scoped>
.select
  width: 14px
  height: 14px
</style>
