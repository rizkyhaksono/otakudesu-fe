/**
 * Sandboxed iframe for third-party players.
 *
 * `sandbox` withholds top-level navigation and popups, so a player cannot
 * redirect the page or spawn ad windows; `referrerPolicy` keeps the full URL
 * from leaking. Both matter because these embeds are not ours.
 */
export default function VideoFrame({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`bg-muted relative aspect-video w-full border ${className}`}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 size-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
      />
    </div>
  );
}
