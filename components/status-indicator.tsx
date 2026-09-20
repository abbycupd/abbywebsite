"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { currentStatus } from "@/data/status";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function StatusIndicator() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % currentStatus.length);
    }, 2600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="label flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-roast/50 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-roast" />
      </span>
      <span>currently:</span>
      <span className="relative inline-grid" aria-live="polite">
        {reduced ? (
          <span className="text-ink">{currentStatus[0]}</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStatus[index]}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="col-start-1 row-start-1 text-ink"
            >
              {currentStatus[index]}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </div>
  );
}
