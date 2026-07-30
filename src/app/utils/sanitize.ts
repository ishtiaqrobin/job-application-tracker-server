import sanitizeHtmlLib from "sanitize-html";

/**
 * ─────────────────────────────────────────────────────────────
 *  XSS Sanitization Utilities
 * ─────────────────────────────────────────────────────────────
 *
 *  Use these helpers to clean any user-supplied string before
 *  it touches the database. Three profiles are exposed:
 *
 *   1. sanitizeText       — strip ALL HTML, return plain text.
 *                           Use for: names, titles, emails,
 *                           comments, chatbot messages, slugs,
 *                           meta fields, etc.
 *
 *   2. sanitizeRichContent — allow a safe subset of HTML tags.
 *                           Use for: blog `content` field that
 *                           renders Markdown/HTML to the page.
 *
 *   3. sanitizeUrl        — make sure a URL is http/https/mailto
 *                           only (blocks `javascript:` etc.).
 *
 *  All helpers are null-safe and idempotent.
 * ─────────────────────────────────────────────────────────────
 */

// ── 1. Plain text (no HTML at all) ────────────────────────
export const sanitizeText = (input?: string | null): string => {
  if (!input) return "";
  return sanitizeHtmlLib(input, {
    allowedTags: [],
    allowedAttributes: {},
    // decode entities so &amp; doesn't pile up on repeated runs
    disallowedTagsMode: "discard",
  }).trim();
};

// ── 2. Rich HTML (blog content / markdown output) ─────────
export const sanitizeRichContent = (input?: string | null): string => {
  if (!input) return "";
  return sanitizeHtmlLib(input, {
    allowedTags: [
      // headings
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      // text blocks
      "p",
      "blockquote",
      "pre",
      "code",
      "hr",
      "br",
      // inline
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "mark",
      "small",
      "sub",
      "sup",
      "span",
      // lists
      "ul",
      "ol",
      "li",
      // links & media
      "a",
      "img",
      "figure",
      "figcaption",
      // tables
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      // semantic
      "div",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      code: ["class"], // language-xxx for syntax highlight
      pre: ["class"],
      span: ["class"],
      div: ["class"],
      th: ["align", "colspan", "rowspan"],
      td: ["align", "colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"], // base64 images allowed
    },
    // Force every anchor to be safe + open externally
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
    // strip scripts/styles entirely (don't leave their text content)
    disallowedTagsMode: "discard",
    nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  }).trim();
};

// ── 3. URL safety ─────────────────────────────────────────
export const sanitizeUrl = (input?: string | null): string => {
  if (!input) return "";
  const trimmed = input.trim();
  // Block dangerous protocols
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return "";
  return trimmed;
};

// ── Bulk helper — sanitize multiple fields of an object ───
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  config: {
    text?: (keyof T)[];
    rich?: (keyof T)[];
    url?: (keyof T)[];
  },
): T => {
  const cleaned: any = { ...obj };
  config.text?.forEach((key) => {
    if (typeof cleaned[key] === "string")
      cleaned[key] = sanitizeText(cleaned[key]);
  });
  config.rich?.forEach((key) => {
    if (typeof cleaned[key] === "string")
      cleaned[key] = sanitizeRichContent(cleaned[key]);
  });
  config.url?.forEach((key) => {
    if (typeof cleaned[key] === "string")
      cleaned[key] = sanitizeUrl(cleaned[key]);
  });
  return cleaned as T;
};
