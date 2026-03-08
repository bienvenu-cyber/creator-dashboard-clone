// Static replacement for basehub/react-rich-text RichText component
import * as React from "react";

export type RichTextProps = {
  children?: any;
  content?: any;
  blocks?: any;
  components?: Record<string, React.ComponentType<any>>;
};

export function RichText({ children, content }: RichTextProps) {
  // Simple rich text renderer for static content
  if (typeof children === "string") return <>{children}</>;
  if (typeof content === "string") return <>{content}</>;
  
  // If it's an array of nodes, render them
  if (Array.isArray(children)) {
    return <>{children.map((child: any, i: number) => {
      if (typeof child === "string") return <span key={i}>{child}</span>;
      return <span key={i}>{JSON.stringify(child)}</span>;
    })}</>;
  }
  
  return <>{children ?? content ?? null}</>;
}
