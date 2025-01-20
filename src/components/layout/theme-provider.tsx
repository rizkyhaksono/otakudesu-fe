"use client";

import * as React from "react";
import dynamic from "next/dynamic";
const NextThemesProvider = dynamic(() => import('next-themes').then((e) => e.ThemeProvider), { ssr: false });
import { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
