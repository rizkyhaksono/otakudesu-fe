"use client"

import React from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { FaBolt, FaBook, FaFilm, FaCat } from "react-icons/fa6"
import { IoSunny } from "react-icons/io5"
import { FaGithub } from "react-icons/fa"
import { FiMoon } from "react-icons/fi"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const ListItem = React.forwardRef<React.ComponentRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem";

export default function Navbar() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="flex sticky top-0 z-50 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="container flex w-full max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <FaBolt />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle({
                      className: "bg-transparent mr-4",
                    })}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Anime</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/10 to-blue-500/30 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <FaCat className="size-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">Otakudesu Natee</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            The best place to watch anime online.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/anime" title="Search Anime">
                      Find your favorite anime
                    </ListItem>
                    <ListItem href="/genres" title="Genres List">
                      Find anime by genre
                    </ListItem>
                    <ListItem href="/schedules" title="Schedules List">
                      Check the anime schedule
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Comic</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-red-500/10 to-red-500/30 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <FaBook className="size-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">Nateegami</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            The best place to read comics online.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/comic" title="Home">
                      All the comics you love
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Movie</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500/10 to-green-500/30 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <FaFilm className="size-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">Nateeflix</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            The best place to watch local, western, and korean movies online.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/movie" title="Home">
                      All the movies you love
                    </ListItem>
                    <ListItem href="/movie/search" title="Searh Movie">
                      Find your favorite movies
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 max-[640px]:justify-between sm:justify-between md:justify-end lg:justify-end xl:justify-end">
          <div className="flex items-center space-x-2 sm:hidden">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Link className="flex items-center space-x-2" href="/">
              <FaBolt />
            </Link>
          </div>
          <div className="flex items-center max-[640px]:justify-end sm:justify-end space-x-2">
            <Link target="_blank" rel="noreferrer" href="https://github.com/rizkyhaksono/otakudesu-fe">
              <FaGithub />
            </Link>
            <Button onClick={toggleTheme} variant="ghost">
              {theme === "light" ? <IoSunny /> : <FiMoon />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

