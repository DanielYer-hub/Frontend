import React, { useEffect, useState } from "react";
import { getMyAvailability, updateMyAvailability, type Availability } from "../services/availabilityService";
import { toast } from "react-toastify";

const AvailabilityEdit: React.FC = () => {
  const [av, setAv] = useState<Availability>({ busyAllWeek:false, slots:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const a = await getMyAvailability();
        setAv(a || { busyAllWeek: false, slots: [] });
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

const MAX_SLOTS = 6;

const addSlot = () => {
  if (av.slots.length >= MAX_SLOTS) {
    toast.info(`Max ${MAX_SLOTS} dates`);
    return;
  }
  setAv(prev => ({
    ...prev,
    slots: [...prev.slots, { date: "", ranges: [{ from: "18:00", to: "22:00" }] }]
  }));
};

  const removeSlot = (idx:number) => {
  setAv(prev => ({ ...prev, slots: prev.slots.filter((_,i)=>i!==idx) }));
 };

 const setSlotDate = (idx:number, date:string) => {
  setAv(prev => ({
    ...prev,
    slots: prev.slots.map((s,i)=> i===idx ? ({ ...s, date }) : s)
  }));
};

  const setRange = (slotIdx:number, rangeIdx:number, key:"from"|"to", val:string) => {
  setAv(prev => ({
    ...prev,
    slots: prev.slots.map((s,i)=> i!==slotIdx ? s : ({
      ...s,
      ranges: s.ranges.map((r,j)=> j===rangeIdx ? ({ ...r, [key]: val }) : r)
    }))
  }));
};

const addRange = (slotIdx:number) => {
  setAv(prev => ({
    ...prev,
    slots: prev.slots.map((s,i)=> i===slotIdx
      ? ({ ...s, ranges: [...s.ranges, { from:"18:00", to:"22:00" }] })
      : s
    )
  }));
};

  const removeRange = (slotIdx:number, rangeIdx:number) => {
  setAv(prev => ({
    ...prev,
    slots: prev.slots.map((s,i)=> i!==slotIdx ? s : ({
      ...s,
      ranges: s.ranges.filter((_,j)=> j!==rangeIdx)
    }))
  }));
};

  const save = async () => {
    try {
     const payload: Availability = {
        busyAllWeek: av.busyAllWeek,
        slots: (av.slots || []).filter((s) => !!s.date),
      };
      await updateMyAvailability(payload);
      toast.success("Availability saved");
      setAv(payload);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  if (loading) return <div className="container py-3">Loading…</div>;

  return (
 <div className="container py-3">
      <h2>Availability</h2>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={av.busyAllWeek}
          onChange={(e) => setAv({ ...av, busyAllWeek: e.target.checked })}
        />
        <label className="form-check-label">Busy all week</label>
      </div>

{!av.busyAllWeek && (
  <>
    <div className="row g-3">
      {av.slots.map((s, slotIdx) => (
        <div key={slotIdx} className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="small fw-bold">Date</div>
                <button className="btn btn-sm btn-outline-danger" onClick={()=>removeSlot(slotIdx)}>Remove</button>
              </div>

              <input
                type="date"
                className="form-control mb-2"
                value={s.date || ""}
                onChange={(e)=>setSlotDate(slotIdx, e.target.value)}
              />

              {(s.ranges || []).map((r, rangeIdx) => (
                <div key={rangeIdx} className="d-flex align-items-center gap-2 mb-2">
                  <input type="time" value={r.from} onChange={e=>setRange(slotIdx, rangeIdx, "from", e.target.value)} />
                  <span>–</span>
                  <input type="time" value={r.to} onChange={e=>setRange(slotIdx, rangeIdx, "to", e.target.value)} />
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>removeRange(slotIdx, rangeIdx)}>×</button>
                </div>
              ))}

              <button className="btn btn-sm btn-outline-secondary" onClick={()=>addRange(slotIdx)}>
                + Add time
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-3 d-flex gap-2">
      <button className="btn btn-outline-secondary" onClick={addSlot}>
        + Add date
      </button>
    </div>
  </>
)}
      <div className="mt-3">
        <button className="btn btn-success" onClick={save}>Save</button>
      </div>
    </div>
  );
};

export default AvailabilityEdit;
