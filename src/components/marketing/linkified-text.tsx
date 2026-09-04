const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

// Splitting on a capturing group puts matches at odd indices and everything else at
// even indices — this tells links apart from plain text without re-testing the regex
// (which would break here anyway, since a shared `g`-flag regex keeps state between calls).
export function LinkifiedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (index % 2 === 0) return part;

        const trailingMatch = part.match(TRAILING_PUNCTUATION);
        const trailing = trailingMatch?.[0] ?? "";
        const url = trailing ? part.slice(0, -trailing.length) : part;

        return (
          <span key={index}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-amber-700 underline underline-offset-2 hover:no-underline dark:text-amber-500"
            >
              {url}
            </a>
            {trailing}
          </span>
        );
      })}
    </span>
  );
}
