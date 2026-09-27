import { useState } from "react";
import "./Avatar.css";

function AvatarImage({ picture, label, initials, color, className }) {
  const [failed, setFailed] = useState(false);
  const classes = "user-avatar " + className;
  if (picture && !failed) {
    return <img className={classes} src={picture} alt={label} onError={() => setFailed(true)} />;
  }
  return <span className={classes} role="img" aria-label={label}
    style={{ backgroundColor: color }}>{initials}</span>;
}

export default function Avatar({ user, label, className = "" }) {
  const name = [user?.name, user?.surname].filter(Boolean).join(" ").trim();
  const initials = [user?.name, user?.surname]
    .map((part) => Array.from(part?.trim() || "")[0] || "").join("").toLocaleUpperCase() || "?";
  const identity = user?._id || name;
  const hash = Array.from(identity).reduce((value, character) => (value * 31 + character.codePointAt(0)) >>> 0, 0);
  const colors = ["#3b5963", "#72505a", "#49664a", "#6c507c", "#865a30"];
  return <AvatarImage key={identity + ":" + (user?.picture || "")} picture={user?.picture}
    initials={initials} color={colors[hash % colors.length]} className={className}
    label={label || (name ? name + "'s avatar" : "User avatar")} />;
}
