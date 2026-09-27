type SourceLike = {
  id?: number;
  title: string;
  organization: string;
  url?: string | null;
  jurisdiction?: string | null;
  evidence_type?: string;
};

export function CitationList({
  sources,
  title = "Sources",
}: {
  sources: SourceLike[];
  title?: string;
}) {
  if (!sources?.length) {
    return (
      <p className="text-sm text-slate-500">
        No linked sources for this section yet — treat as incomplete catalog data.
      </p>
    );
  }
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </h3>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        {sources.map((s, i) => (
          <li key={s.id ?? i}>
            <span className="font-medium">{s.title}</span>
            <span className="text-slate-500"> — {s.organization}</span>
            {s.jurisdiction ? (
              <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                {s.jurisdiction}
              </span>
            ) : null}
            {s.url ? (
              <>
                {" "}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 underline-offset-2 hover:underline"
                >
                  Open source
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
