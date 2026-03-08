import type { HeadingFragment } from "@/lib/basehub/fragments";

export type PlanFragment = {
  _id: string;
  _title: string;
  price: string;
  isMostPopular?: boolean;
};

export type ValueFragment = {
  _id: string;
  plan: PlanFragment;
  value?: {
    __typename: string;
    boolean?: boolean;
    text?: string;
  } | null;
};

export type PricingTableFragment = {
  heading: HeadingFragment;
  categories: {
    items: {
      _id: string;
      _title: string;
      features: {
        items: {
          _id: string;
          _title: string;
          tooltip?: string | null;
          values: {
            items: ValueFragment[];
          };
        }[];
      };
    }[];
  };
};
