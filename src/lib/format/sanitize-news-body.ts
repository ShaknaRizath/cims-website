import sanitizeHtml from "sanitize-html";

// sanitize-html's own defaults deliberately exclude <img> (a caller has to opt in),
// which silently stripped every image the admin inserted into a news body. Extends
// the same defaults rather than replacing them, so headings/links/lists/etc. keep
// working exactly as before.
export function sanitizeNewsBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat("img"),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
  });
}
