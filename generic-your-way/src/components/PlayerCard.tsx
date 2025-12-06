import type { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import {  useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAvailability, updateMyAvailability, type Availability, } from "../services/availabilityService";
import { toast } from "react-toastify";
import "./css/PlayerCard.css";

type UserLike = {
  id: string;
  name: { first: string; last: string };
  email: string;
  region: string;
  address: {
    city: string;
    country: string;
  };
  settings?: string[];
  image?: { url?: string | null } | null;
  bio?: string | null;
  
};
const AVATAR_FALLBACK = "/content/avatar.webp";
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface PlayerCardProps {}
const PlayerCard: FunctionComponent<PlayerCardProps> = () => {
  const auth = useAuth() as any;
  const u: UserLike | null = useMemo(() => {
    if (auth?.user) return auth.user as UserLike;
    try {
      return JSON.parse(localStorage.getItem("user") || "null") as UserLike | null;
    } catch {
      return null;
    }
  }, [auth?.user]);

  const [av, setAv] = useState<Availability>({ busyAllWeek:false, days:[] });
  const [loadingAv, setLoadingAv] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        setLoadingAv(true);
        const a = await getMyAvailability();
        setAv(a || { busyAllWeek:false, days:[] });
      } catch (e:any) {
        toast.error(e?.response?.data?.message || "Failed to load availability");
      } finally { setLoadingAv(false); }
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
  const saveAvailability = async () => {
    try {
      await updateMyAvailability(av);
      toast.success("Availability saved");
    } catch (e:any) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  if (!u) return <div className="container py-4">Not authenticated</div>;

  return (
<div className="container py-4">
  <div className="card shadow-sm">
    <div className="card-header">
      <strong>Player Card</strong>
    </div>

    <div className="card-body">
      <div className="row gy-3 pc-layout">
        <div className="col-md-3 pc-left">
          <img
            src={u.image?.url || AVATAR_FALLBACK}
            alt="profile"
            className="pc-avatar"
          />
          <Link
            to="/profile-edit"
            className="btn btn-accent-outline pc-edit-btn"
          >
            Edit Profile
          </Link>
        </div>

        <div className="col-md-9 pc-right">
          <div className="pc-about box">
            <div className="pc-about-title">About me:</div>
            <div className="pc-about-text">
              {u.bio && u.bio.trim() ? u.bio : "No description yet."}
            </div>
          </div>

  <div className="pc-info box">
  <div className="pc-info-row">
    <div className="pc-info-label">Name:</div>
    <div className="pc-info-value">
      <span className="pc-pill">
        {u.name?.first} {u.name?.last}
      </span>
    </div>
  </div>

  <div className="pc-info-row">
    <div className="pc-info-label">Region:</div>
    <div className="pc-info-value">
      <span className="pc-pill">
        {u.region || "-"}
      </span>
    </div>
  </div>

  <div className="pc-info-row">
    <div className="pc-info-label">Country:</div>
    <div className="pc-info-value">
      <span className="pc-pill">
        {u.address?.country || "-"}
      </span>
    </div>
  </div>

  <div className="pc-info-row">
    <div className="pc-info-label">City:</div>
    <div className="pc-info-value">
      <span className="pc-pill">
        {u.address?.city || "-"}
      </span>
    </div>
  </div>

  <div className="pc-info-row pc-info-row-last">
    <div className="pc-info-label">Settings:</div>
    <div className="pc-info-value pc-info-settings-list">
      {u.settings?.length ? (
        u.settings.map((s: string) => (
          <span key={s} className="pc-pill pc-pill-setting">
            {s}
          </span>
        ))
      ) : (
        <span className="pc-pill">-</span>
      )}
    </div>
  </div>
</div>
</div>
</div>

         <hr className="mt-4" />
          <div className="pc-weekly-header mb-2">
           <h5 className="mb-0">Weekly availability:</h5>
            <div className="form-check form-switch mb-0 pc-busy-switch">
             <input className="form-check-input" type="checkbox"
              checked={av.busyAllWeek}
              onChange={e=>setAv({ ...av, busyAllWeek: e.target.checked })} />
              <label className="form-check-label" htmlFor="busyAllWeek">
             Busy all week
            </label>
           </div>
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
                            checked={on} onChange={()=>toggleDay(day)} id={`day-${day}`} />
                          <label className="form-check-label" htmlFor={`day-${day}`}>{label}</label>
                        </div>
                        {on && (
                          <>
                            {(d?.ranges||[]).map((r, i)=>(
                              <div key={i} className="d-flex align-items-center gap-2 mb-2">
                                <input type="time" value={r.from} onChange={e=>setRange(day,i,"from",e.target.value)} />
                                <span>–</span>
                                <input type="time" value={r.to} onChange={e=>setRange(day,i,"to",e.target.value)} />
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

          <div className="av-time mt-3">
            <button className="btn btn-success" onClick={saveAvailability} disabled={loadingAv}>
              Save availability
            </button>
          </div>
         </div>
        </div>
      </div>
  );
};

export default PlayerCard;