import { FaBolt, FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Navbar() {
  const pathName = usePathname();
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <FaBolt />
            <span className="hidden font-bold sm:inline-block">RH</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {siteConfig.navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <div
                  className={`${pathName === item.href ? "bg-gradient-to-br from-[#5ea9ef] to-[#0087f5] bg-clip-text font-extrabold text-transparent hover:text-current" : "text-gray-400 hover:text-foreground"}`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger className="min-[770px]:hidden">
            <GiHamburgerMenu />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Otakudesu</SheetTitle>
              <SheetDescription>
                {siteConfig.navMenuItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div
                      className={`${pathName === item.href ? "bg-gradient-to-br from-[#5ea9ef] to-[#0087f5] bg-clip-text font-extrabold text-transparent" : "text-gray-400 hover:text-foreground"}`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 max-[640px]:justify-end sm:justify-end md:justify-end lg:justify-end xl:justify-end">
          <div className="flex items-center">
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://github.com/rizkyhaksono/otakudesu-fe"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <FaGithub />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/rizkyhaksono"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <FaXTwitter />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <button
              className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <IoSunny className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <FiMoon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
