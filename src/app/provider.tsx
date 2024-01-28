"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function ProviderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </Provider>
    </>
  );
}
