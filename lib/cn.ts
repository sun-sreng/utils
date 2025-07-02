import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "./clsx.ts";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(...inputs));
};
