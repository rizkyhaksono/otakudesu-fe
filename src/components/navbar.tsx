import { FaBolt } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";
import { FaRegMoon } from "react-icons/fa";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Navbar() {
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
            <a className="mr-6 flex items-center space-x-2" href="/">
              <FaBolt />
              <span className="hidden font-bold sm:inline-block">RH</span>
            </a>
            <nav className="flex items-center gap-6 text-sm">
              <a className="transition-colors hover:text-foreground text-gray-400" href="/about">
                About
              </a>
              <a className="transition-colors hover:text-foreground text-gray-400" href="/genres">
                Genres
              </a>
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
            <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M3 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M3 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="sr-only">Toggle Menu</span>
            <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerClose onClick={toggleDrawer} />
                  <DrawerTitle>Menu</DrawerTitle>
                  <DrawerDescription>Additional menu options</DrawerDescription>
                </DrawerHeader>
                <nav className="flex flex-col gap-4">
                  <a className="transition-colors hover:text-foreground text-gray-400" href="/about">
                    About
                  </a>
                  <a className="transition-colors hover:text-foreground text-gray-400" href="/genres">
                    Genres
                  </a>
                </nav>
                <DrawerFooter>
                  <button onClick={toggleTheme}>
                    {theme === "light" ? <FiSun className="h-[1.2rem] w-[1.2rem]" /> : <FaRegMoon className="h-[1.2rem] w-[1.2rem]" />}
                    <span className="sr-only">Toggle theme</span>
                  </button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end sm:justify-end lg:justify-end xl:justify-end max-[640px]:justify-end">
            <nav className="flex items-center">
              <a target="_blank" rel="noreferrer" href="https://github.com/shadcn-ui/ui">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                  <FaGithub />
                  <span className="sr-only">GitHub</span>
                </div>
              </a>
              <a target="_blank" rel="noreferrer" href="https://twitter.com/shadcn">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                  <FaXTwitter />
                  <span className="sr-only">Twitter</span>
                </div>
              </a>

              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
                onClick={toggleTheme}
              >
                {theme === "light" ? <FiSun className="h-[1.2rem] w-[1.2rem]" /> : <FaRegMoon className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Toggle theme</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
