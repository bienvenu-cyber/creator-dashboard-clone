import { Section } from "@/common/layout";
import { richTextClasses } from "@/app/_components/rich-text";

export type FreeformText = {
  body: { json: { content: any } };
};

export function FreeformText(freeformText: FreeformText) {
  return (
    <Section>
      <div className={richTextClasses}>
        {typeof freeformText.body.json.content === "string" 
          ? <p>{freeformText.body.json.content}</p>
          : <div>{JSON.stringify(freeformText.body.json.content)}</div>
        }
      </div>
    </Section>
  );
}
