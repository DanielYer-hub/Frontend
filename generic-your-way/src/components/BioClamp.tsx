import React, { useState, useMemo } from "react";

type BioClampProps = {
  text?: string | null;
  maxChars?: number;
  className?: string;
};

const BioClamp: React.FC<BioClampProps> = ({ text, maxChars = 140, className }) => {
  const [open, setOpen] = useState(false);
  const safe = text?.trim() || "";
  const isLong = safe.length > maxChars;
  const short = useMemo(
    () => (isLong ? safe.slice(0, maxChars): safe),
    [safe, maxChars, isLong]
  );

  if (!safe) return null;
const rootClass = ["bio-clamp", className].filter(Boolean).join(" ");

  return (
    <span className={rootClass}>
      <span className="bio-text">{open ? safe : short}</span>

      {isLong && (
        <button
          type="button"
          className="bio-toggle-pill"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse text" : "Expand text"}
        >
          <span className="bio-toggle-dots">...</span>
        </button>
      )}
    </span>
  );
};

export default BioClamp;
