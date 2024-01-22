<template lang="pug">
th(width="40" class="{sorter: false}")
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
      checked: false,
    };
  },
};
</script>

<style lang="stylus" scoped>
.select-all
  cursor: pointer
  width: 14px
  height: 14px
</style>
