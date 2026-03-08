import type { AuthorFragment, OptimizedImageFragment } from "@/lib/basehub/fragments";

export type ChangelogListFragment = {
  _id: string;
  _title: string;
  image: OptimizedImageFragment;
  authors: AuthorFragment[];
  excerpt: string;
  _slug: string;
  publishedAt: string;
};
