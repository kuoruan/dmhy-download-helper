export function magnetLinksWithOptions(magnetLinks, opts) {
  if (!magnetLinks || magnetLinks.length <= 0) {
    return [];
  }

  if (opts.clean) {
    return magnetLinks.map(l => l.substring(0, l.indexOf("&")));
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
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return hash;
}
