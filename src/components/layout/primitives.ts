import { tv } from "tailwind-variants";

export const title = tv({
  base: "font-semibold xl:text-xl lg:text-lg md:text-base sm:text-sm max-[640px]:text-sm",
  variants: {
    color: {
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-sm sm:text-sm lg:text-lg md:text-base xl:text-sm max-[640px]:text-sm",
      md: "text-base sm:text-base lg:text-lg md:text-base xl:text-base max-[640px]:text-base",
      lg: "text-lg sm:text-lg lg:text-lg md:text-lg xl:text-lg max-[640px]:text-lg",
      xl: "text-base sm:text-base lg:text-lg md:text-lg xl:text-2xl max-[640px]:text-xl",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: ["foreground"],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "text-foreground dark:text-gray-400 font-normal xl:text-sm lg:text-sm md:text-xs sm:text-xs max-[640px]:text-xs",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
    color: {
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-sm lg:text-4xl",
      md: "text-base",
      lg: "text-lg lg:text-6xl",
      xl: "text-xl lg:text-xl leading-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: ["foreground"],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});
