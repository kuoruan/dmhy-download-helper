<template lang="pug">
div.toast(:class="{'show': show}")
  span.text {{ text }}
</template>

<script>
export default {
  name: "ToastItem",
  data() {
    return {
      text: "",
      show: false,
      timer: 0,
    };
  },
  methods: {
    display(text) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = 0;
      }

      this.text = text;
      this.show = true;

      const _self = this;
      this.timer = window.setTimeout(function () {
        _self.show = false;
        _self.text = "";
        _self.timer = 0;
      }, 3000);
    },
  },
};
</script>

<style lang="stylus" scoped>
.toast
  position: fixed
  bottom: 30px
  left: 50%
  z-index: 99
  display: none
  padding: 10px 20px
  border-radius: 2px
  background-color: #333
  transform: translateX(-50%)

  &.show
    display: block
    animation: fadein 0.5s, fadeout 0.5s 2.5s

  .text
    color: #fff
    font-size: 14px
    line-height: 1.5

@keyframes fadein
  from
    bottom: 0
    opacity: 0

  to
    bottom: 30px
    opacity: 1

@keyframes fadeout
  from
    bottom: 30px
    opacity: 1

  to
    bottom: 0
    opacity: 0
</style>
