// Static type definitions - replaces BaseHub fragmentOn

/* -------------------------------------------------------------------------- */
/*                                   Heading                                  */
/* -------------------------------------------------------------------------- */

export type HeadingFragment = {
  title: string;
  subtitle?: string | null;
  tag?: string | null;
  align?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                                   Avatar                                   */
/* -------------------------------------------------------------------------- */

export type AvatarFragment = {
  url: string;
  alt?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                                   Author                                   */
/* -------------------------------------------------------------------------- */

export type AuthorFragment = {
  _id: string;
  _title: string;
  image: AvatarFragment & { height: number; width: number };
};

/* -------------------------------------------------------------------------- */
/*                                    Image                                   */
/* -------------------------------------------------------------------------- */

export type OptimizedImageFragment = {
  url: string;
  blurDataURL?: string;
  aspectRatio?: string;
  width: number;
  height: number;
  alt?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                                    Quote                                   */
/* -------------------------------------------------------------------------- */

export type QuoteFragment = {
  _id: string;
  author: {
    _id: string;
    _title: string;
    image: {
      url: string;
      alt?: string | null;
    };
    company: {
      _title: string;
      image?: {
        url: string;
        alt?: string | null;
      } | null;
    };
    role?: string;
  };
  quote: string;
};

/* -------------------------------------------------------------------------- */
/*                                   Button                                   */
/* -------------------------------------------------------------------------- */

export type ButtonFragment = {
  _id: string;
  label: string;
  href: string;
  type: "primary" | "secondary" | "tertiary";
  icon?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                              Dark Light Image                              */
/* -------------------------------------------------------------------------- */

export type DarkLightImageFragment = {
  dark: OptimizedImageFragment;
  light: OptimizedImageFragment;
};
