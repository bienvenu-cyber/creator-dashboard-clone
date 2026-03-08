"use client";
import * as React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

// Simplified search component - no basehub dependency
export function SearchContent({ _searchKey }: { _searchKey?: string }) {
  const [query, setQuery] = React.useState("");

  return (
    <label
      className={clsx(
        "ml-auto flex w-full cursor-text items-center gap-x-1 rounded-full border border-border px-3.5 py-2.5 ring-accent-500! focus-within:ring-3 dark:border-dark-border md:max-w-[280px]",
      )}
    >
      <MagnifyingGlassIcon
        className="pointer-events-none size-5 shrink-0 text-text-secondary transition-colors duration-75 dark:text-dark-text-secondary"
        color="currentColor"
      />
      <input
        className="grow bg-transparent outline-hidden! placeholder:text-text-tertiary focus-visible:outline-hidden dark:placeholder:text-dark-text-tertiary"
        placeholder="Search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </label>
  );
}
