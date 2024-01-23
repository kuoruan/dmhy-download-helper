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
    getTorrentUrl(pageLink, pageTitle) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: pageLink,
          timeout: 5000,
          context: { pageTitle },
          ontimeout: function () {
            reject(new Error("下载超时，请重试！"));
          },
          onerror: function () {
            reject(new Error("下载失败，请重试！"));
          },
          onload: function ({ context = {}, responseText = "" }) {
            let matches;
            if (
              responseText &&
              (matches = responseText.match(
                /<a(?:.+)href="((?:https?:)?\/\/[a-zA-Z0-9.-]+\/[^"]+\.torrent)"(?:.*)>(.+)?<\/a>/,
              )) &&
              matches.length >= 3
            ) {
              let url = matches[1];
              if (url.indexOf("//") === 0) {
                url = window.location.protocol + url;
              }

              resolve({
                url,
                filename: `${matches[2] || context.pageTitle}.torrent`,
              });
            } else {
              reject(new Error("获取下载链接失败！"));
            }
          },
        });
      });
    },
    downloadTorrent(url, name) {
      return new Promise((resolve, reject) => {
        GM_download({
          url,
          name,
          saveAs: true,
          conflictAction: "prompt",
          onload: function () {
            resolve();
          },
          ontimeout: function () {
            reject(new Error("下载超时，请重试！"));
          },
          onerror: function () {
            reject(new Error("下载失败，请重试！"));
          },
        });
      });
    },
    async getAndDownloadTorrent() {
      if (!this.detailLink) {
        this.$toast.display("无法获取下载链接。");
        return;
      }

      try {
        this.loading = true;

        const { url, filename } = await this.getTorrentUrl(
          this.detailLink,
          this.title,
        );

        await this.downloadTorrent(url, filename);
      } catch (e) {
        this.$toast.display(e.message);
      } finally {
        this.loading = false;
      }
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
