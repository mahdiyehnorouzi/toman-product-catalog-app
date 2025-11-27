import { useEffect, type RefObject } from "react";

export function useInfiniteScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onIntersect: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    if (typeof IntersectionObserver === "undefined") return;

    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onIntersect, ref]);
}
