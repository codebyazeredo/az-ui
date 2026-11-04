import breakpoints from "./breakpoints.json";

export const BREAKPOINTS: Readonly<Record<"sm" | "md" | "lg" | "xl", number>> = breakpoints;

export type Breakpoint = keyof typeof BREAKPOINTS;
