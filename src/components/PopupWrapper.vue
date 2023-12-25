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
  name: "PopupWrapper",
  props: {
    zIndex: {
      type: Number,
      default: 10,
    },
    middle: {
      type: Boolean,
      default: false,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onScroll(evt) {
      // https://github.com/rhyek/vue-prevent-parent-scroll
      // https://github.com/zpfled/scroll-parent
      const el = evt.target;
      const { overflow, overflowY, overflowX } = window.getComputedStyle(el);
      const { scrollTop, scrollHeight, clientHeight } = el;

      const isAutoOrScroll = /(auto|scroll)/.test(
        overflow + overflowX + overflowY,
      ); // overflow is auto or scroll

      const scroll =
        (scrollTop === 0 && evt.deltaY < 0) ||
        (Math.abs(scrollTop - (scrollHeight - clientHeight)) <= 1 &&
          evt.deltaY > 0); // scroll at top or bottom

      if (!isAutoOrScroll || scroll) {
        evt.preventDefault();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.overlay
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  background-color: rgba(0, 0, 0, 0.3)
  text-align: center

  &:after
    display: inline-block
    width: 0
    height: 100%
    content: ''
    vertical-align: middle

  .popup
    display: inline-block
    overflow: hidden
    padding: 2px
    border: 1px solid #247
    background-color: #fff
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    text-align: left
    backface-visibility: hidden

    &.middle
      vertical-align: middle
</style>
