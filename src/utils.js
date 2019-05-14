export function magnetLinksToText(magnetLinks, opts) {
  if (magnetLinks.length <= 0) return "";

  let content;
  if (opts.clean) {
    content = magnetLinks
      .map(l => l.substring(0, l.indexOf("&")))
      .join(opts.linebreak);
  } else {
    content = magnetLinks.join(opts.linebreak);
  }

  return content;
}
