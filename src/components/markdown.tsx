import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p: (props) => <p className="leading-relaxed [&:not(:first-child)]:mt-3" {...props} />,
        strong: (props) => <strong className="font-semibold" {...props} />,
        em: (props) => <em className="italic" {...props} />,
        a: (props) => (
          <a className="underline underline-offset-2 hover:no-underline" {...props} />
        ),
        code: (props) => (
          <code
            className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]"
            {...props}
          />
        ),
        ul: (props) => <ul className="mt-3 list-disc space-y-1 pl-5" {...props} />,
        ol: (props) => <ol className="mt-3 list-decimal space-y-1 pl-5" {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        h1: (props) => <h3 className="mt-4 font-semibold" {...props} />,
        h2: (props) => <h3 className="mt-4 font-semibold" {...props} />,
        h3: (props) => <h3 className="mt-4 font-semibold" {...props} />,
        blockquote: (props) => (
          <blockquote className="mt-3 border-l-2 pl-3 text-muted-foreground" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
