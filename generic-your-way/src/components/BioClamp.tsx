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
  const short = useMemo(() => (isLong ? safe.slice(0, maxChars) + "…" : safe), [safe, maxChars, isLong]);

  if (!safe) return null;

  return (
    <div className={className}>
      <div className="bio-text mb-1">{open ? safe : short}</div>
      {isLong && (
        <button type="button" className="btn btn-link p-0 small" onClick={() => setOpen(v => !v)}>
          {open ? "Read Less ▲" : "Read More ▼"}
        </button>
      )}
    </div>
  );
};

export default BioClamp;