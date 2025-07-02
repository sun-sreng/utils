import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "./clsx.ts";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(...inputs));
};
