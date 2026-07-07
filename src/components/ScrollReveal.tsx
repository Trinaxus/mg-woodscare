import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const hidden: Record<string, string> = {
    up: "opacity-0 translate-y-8 scale-[0.985]",
    down: "opacity-0 -translate-y-8 scale-[0.985]",
    left: "opacity-0 translate-x-8 scale-[0.985]",
    right: "opacity-0 -translate-x-8 scale-[0.985]",
    fade: "opacity-0 scale-[0.985]",
  };
  const shown = "opacity-100 translate-x-0 translate-y-0 scale-100";

  return (
    <div
      ref={ref}
      className={`will-change-transform ${visible ? shown : hidden[direction]} ${className}`}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

export function HeroReveal({
  children,
  className = "",
  delay = 0,
}: Omit<ScrollRevealProps, "direction" | "duration">) {
  return (
    <ScrollReveal
      direction="down"
      duration={900}
      delay={delay}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}
