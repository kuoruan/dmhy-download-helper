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
