import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "./clsx.ts";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(...inputs));
};
