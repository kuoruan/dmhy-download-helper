<template lang="pug">
  popup(
    :z-index="zIndex",
    @overlay-click="$emit('close')",
    :middle="false",
    :margin-top="100"
  )
    h4 查看链接
    div.popup-body
      pre.links-box
        code(v-text="links")
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "LinksPopup",
  components: {
    Popup
  },
  props: {
    zIndex: {
      type: Number,
      default: 10
    },
    links: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="stylus" scoped>
.popup-body
  margin: 10px 0
  .links-box
    width: 600px
    max-height: 500px
    overflow: auto
    background-color: #fff
    background-image: none
    border: 1px solid #ccc
    color: #333
    border-radius: 4px
    padding: 6px 12px
    font-size: 14px
    line-height: 1.4
</style>
