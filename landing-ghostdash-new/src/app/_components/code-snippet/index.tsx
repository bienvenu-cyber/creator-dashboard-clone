import { type Language, CodeBlock, createCssVariablesTheme } from "@/lib/static-code-block";

import { CopyButton } from "./copy-button";
import { languagesIcons } from "./language";
import { FileIcon } from "@radix-ui/react-icons";
import s from "./code-snippet.module.scss";

export type CodeSnippetFragment = {
  _id: string;
  code: {
    code: string;
    language: string;
  };
  _title: string;
};

export const codeSnippetFragment = {} as any; // kept for compatibility

export function CodeSnippet({ code, _id, _title = "Untitled" }: CodeSnippetFragment) {
  return (
    <div className={s["code-snippet"]}>
      <CodeBlock
        childrenTop={
          <header className={s.header}>
            <div className="flex items-center">
              <span className="mr-2 size-4">
                {languagesIcons[code.language as Language] ?? <FileIcon />}
              </span>
              <span className="text-text-secondary dark:text-dark-text-secondary">{_title}</span>
            </div>
            <CopyButton />
          </header>
        }
        components={{
          div: ({ children, ...rest }) => (
            <div className={s.content} {...rest}>
              {children}
            </div>
          ),
        }}
        lineNumbers={{ className: "line-indicator" }}
        snippets={[{ code: code.code, language: code.language as Language, id: _id }]}
        theme={theme}
      />
    </div>
  );
}

const theme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});
