<template lang="pug">
  td(
    nowrap="nowrap",
    align="center"
  )
    span(
      v-if="loading",
      class="loading"
    )
    a(
      v-else,
      title="Torrent 下载",
      href="javascript:void(0);",
      class="download-arrow arrow-torrent",
      :data-index="index",
      @click="getAndDownloadTorrent"
    )
</template>

<script>
export default {
  name: "TorrentDownloadItem",
  props: {
    index: {
      type: Number,
      default: 0,
    },
    detailLink: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    getAndDownloadTorrent() {
      if (!this.detailLink) {
        this.$toast.display("无法获取下载链接。");
        return;
      }

      this.loading = true;

      const _self = this;

      GM_xmlhttpRequest({
        method: "GET",
        url: this.detailLink,
        timeout: 5000,
        context: { title: this.title },
        ontimeout: function () {
          _self.loading = false;
          _self.$toast.display("下载超时，请重试！");
        },
        onerror: function () {
          _self.loading = false;
          _self.$toast.display(`下载失败，请重试！`);
        },
        onload: function ({ context: { title = "" } = {}, responseText = "" }) {
          let matches;
          if (
            responseText &&
            (matches = responseText.match(
              /<a(?:.+)href="((?:https?:)?\/\/dl\.dmhy\.org\/[^"]+\.torrent)"(?:.*)>(.+)?<\/a>/,
            )) &&
            matches.length >= 3
          ) {
            let url = matches[1];
            if (url.indexOf("//") === 0) {
              url = window.location.protocol + url;
            }

            _self.downloadTorrent(url, `${matches[2] || title}.torrent`);
          } else {
            _self.loading = false;
            _self.$toast.display("获取下载链接失败！");
          }
        },
      });
    },
    downloadTorrent(url, name) {
      const _self = this;

      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        timeout: 5000,
        onerror: function () {
          _self.loading = false;
          _self.$toast.display(`下载失败，请重试！`);
        },
        ontimeout: function () {
          _self.loading = false;
          _self.$toast.display("下载超时，请重试！");
        },
        onload: function ({ response }) {
          const b = new Blob([response], { type: "application/octet-stream" });
          const herf = URL.createObjectURL(b);

          const anchor = document.createElement("a");
          anchor.href = herf;
          anchor.style.display = "none";
          anchor.download = name;

          _self.$el.appendChild(anchor);
          anchor.click();

          setTimeout(() => {
            _self.$el.removeChild(anchor);
            URL.revokeObjectURL(herf);
          }, 0);

          _self.loading = false;
        },
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.loading
  display: inline-block
  border: 2px solid #DBDFE4
  border-radius: 50%
  border-top: 2px solid #075EA4
  width: 12px
  height: 12px
  animation: spinner 2s linear infinite

@keyframes spinner
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>
