"use client";

import { Coffee } from "lucide-react";

/**
 * A small CSS-only 3D laptop that rocks gently on a turntable, screen
 * showing a little coffee scene. Pure CSS animation (no JS), so it's cheap
 * to render and automatically respects prefers-reduced-motion via the
 * global override in globals.css.
 */
export function LaptopShowcase() {
  return (
    <div className="laptop-scene" aria-hidden="true">
      <div className="laptop-rig">
        <div className="laptop-group">
          {/* screen / lid front face */}
          <div className="face screen-face">
            <div className="screen-bezel">
              <div className="screen-glass">
                <div className="menu-bar" />
                <div className="screen-content">
                  <div className="steam">
                    <span className="wisp wisp-1" />
                    <span className="wisp wisp-2" />
                    <span className="wisp wisp-3" />
                  </div>
                  <Coffee size={30} strokeWidth={1.6} className="mug" />
                  <p className="wordmark">cupd.</p>
                </div>
              </div>
            </div>
          </div>

          {/* thin hinge / spine to give the lid depth */}
          <div className="face spine-face" />

          {/* keyboard deck, laid flat behind the screen */}
          <div className="face deck-face">
            <div className="deck-surface">
              <div className="keys">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className="key" />
                ))}
              </div>
              <div className="trackpad" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .laptop-scene {
          --w: 190px;
          --h: 130px;
          width: var(--w);
          height: 260px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          perspective: 1300px;
        }

        .laptop-rig {
          transform-style: preserve-3d;
          transform: rotateX(14deg);
          animation: rock 9s ease-in-out infinite;
        }

        .laptop-group {
          position: relative;
          width: var(--w);
          height: var(--h);
          transform-style: preserve-3d;
        }

        .face {
          position: absolute;
          backface-visibility: hidden;
        }

        .screen-face {
          width: var(--w);
          height: var(--h);
          transform-origin: bottom center;
          transform: translateZ(2px);
        }

        .screen-bezel {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background: #17160f;
          padding: 8px;
          box-shadow: 0 22px 40px -18px rgba(23, 22, 15, 0.45);
        }

        .screen-glass {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background: #f6f2e9;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .menu-bar {
          height: 8px;
          background: #dcd7c9;
        }

        .screen-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: relative;
        }

        .mug {
          color: #17160f;
        }

        .wordmark {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: -0.01em;
          color: #6b4423;
          margin: 0;
        }

        .steam {
          position: absolute;
          top: 22%;
          display: flex;
          gap: 3px;
        }

        .wisp {
          width: 3px;
          height: 10px;
          border-radius: 999px;
          background: #6b6a61;
          opacity: 0;
          animation: rise 2.6s ease-in infinite;
        }
        .wisp-1 {
          animation-delay: 0s;
        }
        .wisp-2 {
          animation-delay: 0.6s;
        }
        .wisp-3 {
          animation-delay: 1.2s;
        }

        .spine-face {
          width: var(--w);
          height: 6px;
          bottom: 0;
          background: #100f0a;
          transform: rotateX(-90deg) translateZ(1px);
          transform-origin: top center;
        }

        .deck-face {
          width: var(--w);
          height: 118px;
          bottom: 0;
          transform: rotateX(-90deg) translateZ(7px);
          transform-origin: top center;
        }

        .deck-surface {
          width: 100%;
          height: 100%;
          background: #dcd7c9;
          border-radius: 0 0 12px 12px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .keys {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 3px;
          width: 100%;
        }

        .key {
          aspect-ratio: 1.3;
          background: #b8b6a4;
          border-radius: 2px;
        }

        .trackpad {
          width: 46%;
          flex: 1;
          background: #cfcbb9;
          border-radius: 4px;
        }

        @keyframes rock {
          0%,
          100% {
            transform: rotateX(14deg) rotateY(-22deg);
          }
          50% {
            transform: rotateX(14deg) rotateY(22deg);
          }
        }

        @keyframes rise {
          0% {
            opacity: 0;
            transform: translateY(0) scaleY(0.6);
          }
          30% {
            opacity: 0.55;
          }
          100% {
            opacity: 0;
            transform: translateY(-14px) scaleY(1.1);
          }
        }
      `}</style>
    </div>
  );
}
