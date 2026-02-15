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
    () => (isLong ? safe.slice(0, maxChars) : safe),
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
          <span className="bio-toggle-dots">
            <svg xmlns="http://www.w3.org/2000/svg"
              height="15px"
              viewBox="0 -960 960 960"
              width="15px"
              fill="#EFEFEF">
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
            </svg>
          </span>
        </button>
      )}
    </span>
  );
};

export default BioClamp;
