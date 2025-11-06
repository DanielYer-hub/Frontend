import React, { useEffect, useState } from "react";
import { getMyAvailability, updateMyAvailability, type Availability } from "../services/availabilityService";
import { toast } from "react-toastify";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const AvailabilityEdit: React.FC = () => {
  const [av, setAv] = useState<Availability>({ busyAllWeek:false, days:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const a = await getMyAvailability();
        setAv(a);
      } catch(e:any) {
        toast.error(e?.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleDay = (day: number) => {
    const exists = av.days.find(d => d.day === day);
    const days = exists
      ? av.days.filter(d => d.day !== day)
      : [...av.days, { day, ranges:[{ from:"18:00", to:"22:00" }] }];
    setAv({ ...av, days });
  };

  const setRange = (day: number, idx: number, key: "from"|"to", val: string) => {
    const days = av.days.map(d => {
      if (d.day !== day) return d;
      const ranges = d.ranges.map((r,i) => i===idx ? { ...r, [key]: val } : r);
      return { ...d, ranges };
    });
    setAv({ ...av, days });
  };

  const addRange = (day:number) => {
    const days = av.days.map(d => d.day===day ? ({ ...d, ranges:[...d.ranges, { from:"18:00", to:"22:00" }] }) : d);
    setAv({ ...av, days });
  };

  const removeRange = (day:number, idx:number) => {
    const days = av.days.map(d => {
      if (d.day !== day) return d;
      const ranges = d.ranges.filter((_,i)=>i!==idx);
      return { ...d, ranges };
    });
    setAv({ ...av, days });
  };

  const save = async () => {
    try {
      await updateMyAvailability(av);
      toast.success("Availability saved");
    } catch(e:any) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  if (loading) return <div className="container py-3">Loading…</div>;

  return (
    <div className="container py-3">
      <h2>Weekly availability</h2>
      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox"
               checked={av.busyAllWeek}
               onChange={e=>setAv({ ...av, busyAllWeek: e.target.checked })}/>
        <label className="form-check-label">Busy all week</label>
      </div>

      {!av.busyAllWeek && (
        <div className="row g-3">
          {DAYS.map((label, day)=> {
            const d = av.days.find(x => x.day===day);
            const on = !!d;
            return (
              <div key={day} className="col-12 col-md-6">
                <div className="card">
                  <div className="card-body">
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox"
                             checked={on} onChange={()=>toggleDay(day)} id={`day-${day}`}/>
                      <label className="form-check-label" htmlFor={`day-${day}`}>{label}</label>
                    </div>
                    {on && (
                      <>
                        {(d?.ranges||[]).map((r, i)=>(
                          <div key={i} className="d-flex align-items-center gap-2 mb-2">
                            <input type="time" value={r.from} onChange={e=>setRange(day,i,"from",e.target.value)}/>
                            <span>–</span>
                            <input type="time" value={r.to} onChange={e=>setRange(day,i,"to",e.target.value)}/>
                            <button className="btn btn-sm btn-outline-danger" onClick={()=>removeRange(day,i)}>×</button>
                          </div>
                        ))}
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>addRange(day)}>+ Add time</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3">
        <button className="btn btn-success" onClick={save}>Save</button>
      </div>
    </div>
  );
};

export default AvailabilityEdit;
