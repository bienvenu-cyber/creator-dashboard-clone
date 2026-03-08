"use client";

import * as React from "react";
import { Button } from "@/common/button";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";

export function CopyButton() {
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button unstyled className="relative -mx-2 p-2" onClick={onCopy}>
      <span className="sr-only">Copy</span>
      {copied ? <CheckIcon /> : <ClipboardCopyIcon />}
    </Button>
  );
}
