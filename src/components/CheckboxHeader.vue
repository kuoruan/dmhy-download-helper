<template lang="pug">
  th.header(width="40")
    input.select-all(
      type="checkbox",
      v-model="checked",
      @change="$emit('change', $event.target.checked)"
    )
</template>

<script>
export default {
  name: "CheckboxHeader",
  data() {
    return {
      checked: false
    };
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
