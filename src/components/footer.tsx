export default function Footer() {
  return (
    <footer className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
      <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
        Built by&nbsp;
        <a
          href="https://github.com/rizkyhaksono"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          rizkyhaksono
        </a>
        .&nbsp;The source code is available on&nbsp;
        <a
          href="https://github.com/rizkyhaksono/shadcn-boilerplate"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
