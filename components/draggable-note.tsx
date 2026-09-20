"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { internetStatus } from "@/data/status";
import { useIsTouchDevice } from "@/hooks/use-media-query";

/**
 * A small draggable, desktop-style sticky note. Purely decorative —
 * drag it around, it snaps back to nothing, there's no "correct" place
 * for it to live. Hidden on small screens where it'd just get in the way,
 * and rendered as a plain static note on touch devices, where free-drag
 * fights with page scrolling.
 */
export function DraggableNote() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();

  return (
    <div
      ref={constraintsRef}
      className="pointer-events-none absolute inset-0 -z-0 hidden overflow-visible lg:block"
    >
      <motion.div
        drag={!isTouch}
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
        whileDrag={{ scale: 1.04, rotate: 0, cursor: "grabbing" }}
        initial={{ rotate: -4 }}
        className={`pointer-events-auto absolute right-[6%] top-[16%] w-52 select-none rounded-sm bg-[#F3E9B8] p-4 shadow-md ${
          isTouch ? "" : "cursor-grab"
        }`}
        style={{ rotate: -4 }}
        role="note"
        aria-label="Draggable sticky note — obsessed with lately"
      >
        <p className="label mb-1 text-ink/60">obsessed with, lately</p>
        <p className="font-display text-sm font-medium leading-snug text-ink">
          {internetStatus.obsessedWith}
        </p>
        {!isTouch && <p className="label mt-3 text-[11px] text-ink/40">(drag me)</p>}
      </motion.div>
    </div>
  );
}
