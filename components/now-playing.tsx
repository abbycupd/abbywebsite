import { nowPlaying } from "@/data/status";

/**
 * A stylized "currently listening to" detail — not a live Spotify
 * connection, just a hand-updated line with a little equalizer animation.
 * Update the track/artist in data/status.ts whenever you like.
 */
export function NowPlaying() {
  return (
    <div className="label inline-flex items-center gap-2.5 rounded-full border border-mist bg-paper px-3 py-1.5">
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        <span className="eq-bar eq-bar-1" />
        <span className="eq-bar eq-bar-2" />
        <span className="eq-bar eq-bar-3" />
      </span>
      <span>
        {nowPlaying.track} <span className="text-graphite">— {nowPlaying.artist}</span>
      </span>

      <style>{`
        .eq-bar {
          width: 2px;
          background: #6b4423;
          border-radius: 1px;
          animation: eq 0.9s ease-in-out infinite;
        }
        .eq-bar-1 { height: 40%; animation-delay: 0s; }
        .eq-bar-2 { height: 100%; animation-delay: 0.2s; }
        .eq-bar-3 { height: 65%; animation-delay: 0.4s; }
        @keyframes eq {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
