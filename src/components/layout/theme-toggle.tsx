"use client";

import { useTheme } from "@/components/layout/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={!mounted ? "Ganti tema" : isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      onClick={() => {
        if (mounted) {
          setTheme(isDark ? "light" : "dark");
        }
      }}
      disabled={!mounted}
      className="size-9"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden />
        ) : (
          <Moon className="size-4" aria-hidden />
        )
      ) : (
        <span className="size-4" aria-hidden />
      )}
    </Button>
  );
}
