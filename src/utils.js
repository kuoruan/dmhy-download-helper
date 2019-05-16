export function magnetLinksToText(magnetLinks, opts) {
  if (!magnetLinks || magnetLinks.length <= 0) {
    return "";
  }

  if (opts.clean) {
    return magnetLinks
      .map(l => l.substring(0, l.indexOf("&")))
      .join(opts.linebreak);
  }

  return magnetLinks.join(opts.linebreak);
}
