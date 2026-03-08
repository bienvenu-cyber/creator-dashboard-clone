// Static replacement for basehub/react-code-block
import * as React from "react";

export type Language = string;

export function createCssVariablesTheme(opts: any) {
  return opts;
}

export function CodeBlock({
  snippets,
  childrenTop,
  components,
  lineNumbers,
  theme,
}: {
  snippets: { code: string; language: string; id: string }[];
  childrenTop?: React.ReactNode;
  components?: Record<string, React.ComponentType<any>>;
  lineNumbers?: { className: string };
  theme?: any;
}) {
  const Wrapper = components?.div ?? "div";
  const snippet = snippets[0];

  return (
    <div>
      {childrenTop}
      <Wrapper>
        <pre>
          <code>{snippet?.code ?? ""}</code>
        </pre>
      </Wrapper>
    </div>
  );
}
