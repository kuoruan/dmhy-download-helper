<template lang="pug">
  th.header(
    width="4%", 
    nowrap="nowrap", 
    class="{sorter: false}"
  )
    span(class="title") Torrent
</template>

<script>
export default {
  name: "TorrentDownloadHeader",
};
</script>
