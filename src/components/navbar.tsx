import { FaBolt } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useTheme } from "next-themes";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Navbar() {
  const pathName = usePathname();

  const { setTheme, theme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
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
                  <div className={`${pathName === item.href ? "from-[#5ea9ef] to-[#0087f5] bg-clip-text text-transparent bg-gradient-to-br font-semibold hover:text-current" : "text-gray-400 hover:text-foreground"}`}>{item.label}</div>
                </Link>
              ))}
            </nav>
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:R96la:"
            data-state="closed"
            onClick={toggleDrawer}
          >
            <GiHamburgerMenu />
            <span className="sr-only">Toggle Menu</span>
            <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
              <DrawerContent className="mx-5">
                <DrawerHeader>
                  <DrawerClose onClick={toggleDrawer} />
                  <DrawerTitle className="flex justify-center">Menu</DrawerTitle>
                  <DrawerDescription className="mt-5 flex justify-center">
                    <button onClick={toggleTheme}>
                      {theme === "light" ? <IoSunny className="h-[1.2rem] w-[1.2rem]" /> : <FiMoon className="h-[1.2rem] w-[1.2rem]" />}
                      <span className="sr-only">Toggle theme</span>
                    </button>
                  </DrawerDescription>
                </DrawerHeader>
                {siteConfig.navMenuItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div className={`ml-10 ${pathName === item.href ? "from-[#5ea9ef] to-[#0087f5] bg-clip-text text-transparent bg-gradient-to-br" : "text-gray-400 hover:text-foreground"}`}>{item.label}</div>
                  </Link>
                ))}
                <DrawerFooter>
                  <footer className="py-6 md:px-8 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                      <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a href="https://github.com/rizkyhaksono" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 text-foreground">
                          rizkyhaksono.
                        </a>{" "}
                        The source code is available on{" "}
                        <a href="https://github.com/rizkyhaksono/shadcn-boilerplate" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 text-foreground">
                          GitHub.
                        </a>
                      </p>
                    </div>
                  </footer>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end sm:justify-end lg:justify-end xl:justify-end max-[640px]:justify-end">
            <div className="flex items-center">
              <Link target="_blank" rel="noreferrer" href="https://github.com/rizkyhaksono/otakudesu-fe">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                  <FaGithub />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
              <Link target="_blank" rel="noreferrer" href="https://twitter.com/rizkyhaksono">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                  <FaXTwitter />
                  <span className="sr-only">Twitter</span>
                </div>
              </Link>
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
                onClick={toggleTheme}
              >
                {theme === "light" ? <IoSunny className="h-[1.2rem] w-[1.2rem]" /> : <FiMoon className="h-[1.2rem] w-[1.2rem]" />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
