<template lang="pug">
  div.overlay(
    @click.self="$emit('overlay-click')",
    @touchmove="onScroll",
    @mousewheel="onScroll",
    :style="{'z-index': zIndex}"
  )
    div.popup(
      :class="{'middle': middle}",
      :style="{'margin-top': `${marginTop}px`}"
    )
      slot
</template>

<script>
export default {
  name: "Popup",
  props: {
    zIndex: {
      type: Number,
      default: 10
    },
    middle: {
      type: Boolean,
      default: false
    },
    marginTop: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onScroll(evt) {
      // https://github.com/rhyek/vue-prevent-parent-scroll
      // https://github.com/zpfled/scroll-parent
      const el = evt.target;
      const { overflow, overflowY, overflowX } = window.getComputedStyle(el);
      if (
        !/(auto|scroll)/.test(overflow + overflowX + overflowY) || // overflow is auto of scroll
        ((el.scrollTop === 0 && evt.deltaY < 0) ||
          (Math.abs(el.scrollTop - (el.scrollHeight - el.clientHeight)) <= 1 &&
            evt.deltaY > 0)) // scroll at top or bottom
      ) {
        evt.preventDefault();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.overlay
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  text-align: center
  background-color: rgba(0, 0, 0, .3)
  &:after
    content: ""
    display: inline-block
    height: 100%
    width: 0
    vertical-align: middle
  .popup
    display: inline-block
    background-color: #fff
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1)
    text-align: left
    overflow: hidden
    backface-visibility: hidden
    border: 1px solid #247
    padding: 2px
    &.middle
      vertical-align: middle
</style>
