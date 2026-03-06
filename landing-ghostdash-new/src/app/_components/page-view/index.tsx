"use client";

import * as React from "react";

export function PageView({ ingestKey }: { ingestKey: string }) {
  React.useEffect(() => {
    // Track page view - integrate with your analytics service
    console.log("Page view:", ingestKey);
  }, [ingestKey]);

  return null;
}
