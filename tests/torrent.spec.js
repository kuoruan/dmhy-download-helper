import { TORRENT_LINK_TAG_REGEX } from "@/utils/misc";

describe("Torrent", () => {
  it("should match torrent link tag", () => {
    const torrentLinkTag =
      '<a href="//dl.dmhy.org/2024/01/23/66e247e9ed66b639a46f2472a2f9fd46f2025fec.torrent">[2024.01.24] プロジェクトセカイ カラフルステージ！ feat.初音ミク ワンダーランズ×ショウタイム SEKAI ALBUM Vol.2 [MP3 320K]</a>';

    expect(torrentLinkTag.match(TORRENT_LINK_TAG_REGEX)).toBeTruthy();
  });
});
