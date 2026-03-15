import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

export default function GreetingLayout() {
  return (
    <section className="relative overflow-hidden pt-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mx-auto w-full animate-in fade-in zoom-in duration-700 rounded-3xl border border-border/70 bg-card/70 p-7 text-left shadow-sm backdrop-blur-sm md:w-11/12 md:p-10 md:text-center xl:w-9/12">
          <h1 className="mb-6 text-5xl leading-none tracking-wide text-foreground md:text-7xl">
            <span>Begin an exciting journey&nbsp;</span>
            <span className="text-primary block py-2 lg:inline">into the world of anime!</span>
          </h1>

          <p className="mb-8 px-0 text-base font-medium leading-relaxed text-foreground md:text-xl lg:px-24">
            Start watching an anime without ads! From the{" "}
            <span className="text-primary py-2 font-bold">community</span>
            , for the{" "}
            <span className="text-primary py-2 font-bold">community</span>
            , by the{" "}
            <span className="text-primary py-2 font-bold">community</span>.
          </p>

          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start md:mb-0 md:w-full md:justify-center">
            <Link
              href="#started"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto"
            >
              <span>Get Started</span>
              <FaArrowRight />
            </Link>

            <Link
              href="/anime"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-6 py-3 text-lg font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/80 hover:bg-secondary/70 sm:w-auto"
            >
              <span>Search Anime</span>
              <FaSearch />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
