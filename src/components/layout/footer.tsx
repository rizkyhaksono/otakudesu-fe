import Link from "next/link";

export default function Footer() {
  return (
    <footer className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
      <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
        Built by&nbsp;
        <Link
          href="https://github.com/rizkyhaksono"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          rizkyhaksono
        </Link>
        .&nbsp;The source code is available on&nbsp;
        <Link
          href="https://github.com/rizkyhaksono/otakudesu-fe"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          GitHub
        </Link>
      </p>
    </footer>
  );
}
