<template lang="pug">
  td(
    nowrap="nowrap",
    align="center"
  )
    a(
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
  methods: {
    getAndDownloadTorrent() {
      if (!this.detailLink) {
        this.$toast.display("无法获取下载链接。");
        return;
      }

      const _self = this;

      GM_xmlhttpRequest({
        method: "GET",
        url: this.detailLink,
        timeout: 5000,
        context: { title: this.title },
        ontimeout: function () {
          _self.$toast.display("下载超时，请重试！");
        },
        onerror: function () {
          _self.$toast.display(`下载失败，请重试！`);
        },
        onload: function ({ context: { title = "" } = {}, responseText = "" }) {
          let matches;
          if (
            responseText &&
            (matches = responseText.match(
              /<a href="((?:https?)?\/\/dl\.dmhy\.org\/[^"]+\.torrent)">(.+)?<\/a>/,
            )) &&
            matches.length >= 3
          ) {
            _self.downloadTorrent(matches[1], `${matches[2] || title}.torrent`);
          } else {
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
          _self.$toast.display(`下载失败，请重试！`);
        },
        ontimeout: function () {
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
        },
      });
    },
  },
};
</script>
