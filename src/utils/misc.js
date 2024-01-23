export function magnetLinksWithOptions(magnetLinks, opts) {
  if (!magnetLinks || magnetLinks.length <= 0) {
    return [];
  }

  if (opts.clean) {
    return magnetLinks.map((l) => l.substring(0, l.indexOf("&")));
  }
  return [...magnetLinks];
}

export function getDefaultLinebreak() {
  let linebreak = "\n";
  if (navigator.userAgent.indexOf("Windows") > -1) {
    linebreak = "\r\n";
  }

  return linebreak;
}

export function hashCode(str) {
  let hash = 0;
  if (!str || str.length <= 0) return hash;

  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return hash;
}

export const TORRENT_LINK_TAG_REGEX =
  /<a(?:.+)href="((?:https?:)?\/\/[a-zA-Z0-9.-]+\/[^"]+\.torrent)"(?:.*)>(.+)?<\/a>/;
