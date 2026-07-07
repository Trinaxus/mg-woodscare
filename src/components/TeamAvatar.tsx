interface TeamAvatarProps {
  name: string;
  image?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
};

function getInitial(name: string) {
  // Versuche den Nachnamen zu ermitteln (alles nach dem letzten Leerzeichen oder nach dem Punkt)
  const cleaned = name.trim();
  if (!cleaned) return "?";

  // z.B. "H. Merkel" -> "Merkel" -> "M"
  const parts = cleaned.split(/\s+/);
  if (parts.length > 1) {
    return parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return cleaned.charAt(0).toUpperCase();
}

export function TeamAvatar({ name, image, size = "md" }: TeamAvatarProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-border shadow-glow`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} grid place-items-center rounded-full bg-primary/10 text-primary font-semibold border border-primary/20`}
    >
      {getInitial(name)}
    </div>
  );
}
