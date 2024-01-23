import { it } from "vitest";
import { expect } from "vitest";

import { getTorrentLinkFromHTML } from "@/utils/misc";

describe("Torrent", () => {
  it("should match dmhy torrent link tag", () => {
    const torrentLinkTag =
      '<a href="//dl.dmhy.org/2024/01/23/66e247e9ed66b639a46f2472a2f9fd46f2025fec.torrent">[2024.01.24] プロジェクトセカイ カラフルステージ！ feat.初音ミク ワンダーランズ×ショウタイム SEKAI ALBUM Vol.2 [MP3 320K]</a>';
    const torrentLinkTag2 =
      '<strong>會員專用連接:</strong>&nbsp;<a href="http://dl.dmhy.org/2024/01/23/06abefc6121c0428b6abdddf1b24744fba6f3738.torrent">[MagicStar] SHUT UP EP07 [WEBDL] [1080p]【生】</a>';
    const torrentLinkTag3 =
      '<a href="https://dl.dmhy.org/2024/01/23/7731c887aeb285ca0373a595c520b3b0cef448e1.torrent">【ASMR】舔耳朵♪[WAV/MP3/MP4]</a>';
    const torrentLinkTag4 =
      '<a title="【ASMR】舔耳朵♪[WAV/MP3/MP4]" href="https://dl.dmhy.org/2024/01/23/7731c887aeb285ca0373a595c520b3b0cef448e1.torrent" target="_blank">【ASMR】舔耳朵♪[WAV/MP3/MP4]</a>';

    expect(getTorrentLinkFromHTML(torrentLinkTag)).toEqual({
      href: "//dl.dmhy.org/2024/01/23/66e247e9ed66b639a46f2472a2f9fd46f2025fec.torrent",
      title:
        "[2024.01.24] プロジェクトセカイ カラフルステージ！ feat.初音ミク ワンダーランズ×ショウタイム SEKAI ALBUM Vol.2 [MP3 320K]",
    });
    expect(getTorrentLinkFromHTML(torrentLinkTag2)).toEqual({
      href: "http://dl.dmhy.org/2024/01/23/06abefc6121c0428b6abdddf1b24744fba6f3738.torrent",
      title: "[MagicStar] SHUT UP EP07 [WEBDL] [1080p]【生】",
    });
    expect(getTorrentLinkFromHTML(torrentLinkTag3)).toEqual({
      href: "https://dl.dmhy.org/2024/01/23/7731c887aeb285ca0373a595c520b3b0cef448e1.torrent",
      title: "【ASMR】舔耳朵♪[WAV/MP3/MP4]",
    });
    expect(getTorrentLinkFromHTML(torrentLinkTag4)).toEqual({
      href: "https://dl.dmhy.org/2024/01/23/7731c887aeb285ca0373a595c520b3b0cef448e1.torrent",
      title: "【ASMR】舔耳朵♪[WAV/MP3/MP4]",
    });
  });

  it("should match mirror site torrent link tag", () => {
    const link1 =
      '<strong>會員專用連接:</strong>&nbsp;<a href="//dmhytorrents.b168.net\n/2023/12/11/61e671afe573d1de89dfbfc24e1cea86c2efac04.torrent">【喵萌奶茶屋】★10月新番★[腼腆英雄 / SHY][10][1080p][简日双语][招募翻译]</a>';

    const link2 =
      '<strong>會員專用連接:</strong>&nbsp;<a href="https://dmhytorrents.b168.net\n/2023/12/11/61e671afe573d1de89dfbfc24e1cea86c2efac04.torrent">【喵萌奶茶屋】★10月新番★[腼腆英雄 / SHY][10][1080p][简日双语][招募翻译]</a>';

    expect(getTorrentLinkFromHTML(link1)).toEqual({
      href: "//dmhytorrents.b168.net/2023/12/11/61e671afe573d1de89dfbfc24e1cea86c2efac04.torrent",
      title:
        "【喵萌奶茶屋】★10月新番★[腼腆英雄 / SHY][10][1080p][简日双语][招募翻译]",
    });
    expect(getTorrentLinkFromHTML(link2)).toEqual({
      href: "https://dmhytorrents.b168.net/2023/12/11/61e671afe573d1de89dfbfc24e1cea86c2efac04.torrent",
      title:
        "【喵萌奶茶屋】★10月新番★[腼腆英雄 / SHY][10][1080p][简日双语][招募翻译]",
    });
  });

  it("should not match other link tag", () => {
    const link1 =
      '<a href="https://www.dmhy.org/topics/list?keyword=123">123</a>';
    const link2 = '<a href="https://example.com"></a>';

    expect(getTorrentLinkFromHTML(link1)).toBeNull();
    expect(getTorrentLinkFromHTML(link2)).toBeNull();
  });
});
