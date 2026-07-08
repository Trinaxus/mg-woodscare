import { useRef, useEffect, type ImgHTMLAttributes } from "react";

interface ParallaxImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  speed?: number;
}

export function ParallaxImage({ speed = 0.15, className = "", alt = "", ...props }: ParallaxImageProps) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;

    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const update = () => {
      const rect = img.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const offset = rect.top * speed;
      img.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        lastScrollY = window.scrollY;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [speed]);

  return (
    <img
      ref={ref}
      alt={alt}
      className={`${className} will-change-transform`}
      style={{ transform: "translate3d(0, 0, 0)" }}
      {...props}
    />
  );
}
