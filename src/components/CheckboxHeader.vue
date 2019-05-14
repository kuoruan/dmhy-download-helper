<template lang="pug">
  th.header(width="40")
    input.select-all(
      type="checkbox",
      :checked="checked",
      @change="$emit('change', $event.target.checked)"
    )
</template>

<script>
export default {
  name: "CheckboxHeader",
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "checked",
    event: "change"
  },
  mounted() {
    if (this.$parent) {
      this.$parent.$emit("add-header", this);
    }
  },
  beforeDestroy() {
    if (this.$parent) {
      this.$parent.$emit("del-header", this);
    }
  }
};
</script>

<style lang="stylus" scoped>
.header
  cursor: default
  .select-all
    width: 14px
    height: 14px
  .title
    margin-left: 5px
</style>
