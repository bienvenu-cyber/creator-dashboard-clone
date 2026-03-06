// Static replacement for Pump component from basehub/react-pump
import { ReactNode } from "react";

type Query = Record<string, any>;

interface PumpProps<T extends Query[]> {
  queries: T;
  children: (data: T) => ReactNode | Promise<ReactNode>;
}

/**
 * Static replacement for BaseHub's Pump component
 * Instead of fetching from BaseHub, it passes the queries directly to children
 */
export async function Pump<T extends Query[]>({ queries, children }: PumpProps<T>) {
  // Simply pass the queries as-is to the children function
  // The queries now contain static data instead of GraphQL queries
  return await children(queries as T);
}
