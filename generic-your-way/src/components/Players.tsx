import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { listPublicPlayers, type PublicPlayer } from "../services/playerService";
import { createInvite } from "../services/inviteService";
import BioClamp from "./BioClamp";
import { imgUrl } from "../utils/imgUrl";
import { getPublicAvailability, type Availability } from "../services/availabilityService";

const SETTINGS = [
  "Warhammer 40k","Age of Sigmar","The Horus Heresy","Kill Team","Necromunda",
  "The Old World","Underworlds","Warcry","Blood Bowl","Legions Imperialis",
  "Adeptus Titanicus","Aeronautica Imperialis","Warhammer Quest","Middle-Earth",
];

const regions = [
  "North America","Caribbean","Central America","South America",
  "Africa","Middle East","Europe","Asia","Australia and Oceania"
];

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

type InvitePanelState = {
  open: boolean;
  userId?: string;
  name?: string;
  availability?: Availability;
  day?: number;
  rangeIdx?: number;
  loading?: boolean;
};

const Players: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PublicPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useSearchParams();
  const [panel, setPanel] = useState<InvitePanelState>({ open:false });
  const filters = useMemo(() => ({
    setting: search.get("setting") || (user?.settings?.[0] ?? ""),
    region:  search.get("region")  || "",
    country: search.get("country") || "",
    city:    search.get("city")    || ""
  }), [search, user?.settings]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listPublicPlayers(filters);
        const meId = (user as any)?.id || (user as any)?._id;
        setPlayers(meId ? data.filter(p => String(p._id) !== String(meId)) : data);
      } catch (e:any) {
        toast.error(e?.response?.data?.message || "Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.setting, filters.region, filters.country, filters.city, user]);

  const updateFilter = (k: "setting"|"region"|"country"|"city", v: string) => {
    const next = new URLSearchParams(search);
    if (v) next.set(k, v); else next.delete(k);
    setSearch(next, { replace: true });
  };

  const openInvite = async (toUserId: string, name: string) => {
    try {
      setPanel({ open:true, userId: toUserId, name, loading: true });
      const av = await getPublicAvailability(toUserId);
      const firstDay = av?.busyAllWeek ? undefined : av?.days?.[0]?.day;
      setPanel(m => ({
        ...m,
        availability: av,
        day: typeof firstDay === "number" ? firstDay : undefined,
        rangeIdx: 0,
        loading:false
      }));
    } catch (e:any) {
      setPanel(m => ({ ...m, loading:false }));
      toast.error(e?.response?.data?.message || "Failed to load availability");
    }
  };

  const submitInvite = async () => {
    if (!panel.userId || !panel.availability) return;
    if (panel.availability.busyAllWeek) {
      toast.info("Player is busy this week"); return;
    }
    const d = panel.day;
    if (typeof d !== "number") {
      toast.error("Choose day"); return;
    }
    const dayConf = panel.availability.days.find(x => x.day===d);
    if (!dayConf) { toast.error("Day not available"); return; }

    const rIdx = panel.rangeIdx ?? 0;
    const r = dayConf.ranges?.[rIdx];
    try {
      await createInvite(panel.userId, { day: d, from: r?.from, to: r?.to });
      toast.success("Invite sent");
      setPanel({ open:false });
    } catch (e:any) {
      const msg = e?.response?.data?.message || "Failed to send invite";
      if (e?.response?.status === 409) {
        toast.info("Day already booked");
      } else {
        toast.error(msg);
      }
    }
  };

  const cancelInvite = () => setPanel({ open:false });

  return (
    <div className="container py-3">
      <h2 className="mb-3">Find Players</h2>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-3">
              <label className="form-label">Setting:</label>
              <select
                className="form-select"
                value={filters.setting}
                onChange={(e)=>updateFilter("setting", e.target.value)}
              >
                <option value="">All</option>
                {SETTINGS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Region:</label>
              <select
                className="form-select"
                value={filters.region}
                onChange={(e)=>updateFilter("region", e.target.value)}
              >
                <option value="">All</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Country:</label>
              <input
                className="form-control"
                value={filters.country}
                onChange={(e)=>updateFilter("country", e.target.value)}
                placeholder="e.g. Israel"
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">City:</label>
              <input
                className="form-control"
                value={filters.city}
                onChange={(e)=>updateFilter("city", e.target.value)}
                placeholder="e.g. Haifa"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row g-3">
          {players.map(p => {
            const isOpen = panel.open && panel.userId === p._id;
            const av = isOpen ? panel.availability : undefined;
            const day = isOpen ? panel.day : undefined;
            const dayObj = (isOpen && av && typeof day === "number")
              ? av.days.find(x => x.day === day)
              : undefined;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={p._id}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={imgUrl(p.image?.url)}
                        alt=""
                        style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div className="fw-bold">
                        {p.name?.first} {p.name?.last}
                      </div>
                    </div>
                    {!!p.bio && <BioClamp text={p.bio} className="mt-2" maxChars={20} />}
                    <div className="mt-2 small">
                      <div><b>Region:</b> {p.region || "-"}</div>
                      <div><b>Country:</b> {p.address?.country || "-"}</div>
                      <div><b>City:</b> {p.address?.city || "-"}</div>
                      <div><b>Settings:</b> {p.settings?.length ? p.settings.join(", ") : "-"}</div>
                    </div>

                    {!isOpen && (
                      <div className="mt-2 small text-muted">
                        <b>Availability:</b> <i>tap “Invite” to view days</i>
                      </div>
                    )}
                    {isOpen && (
                      <div className="mt-3 p-2 border rounded">
                        {panel.loading ? (
                          <div className="small text-muted">Loading availability…</div>
                        ) : av?.busyAllWeek ? (
                          <div className="text-danger small">Player is busy this week</div>
                        ) : !av?.days?.length ? (
                          <div className="small text-muted">No available days</div>
                        ) : (
                          <>
                            <div className="mb-2">
                              <label className="form-label mb-1">Day</label>
                              <select
                                className="form-select form-select-sm"
                                value={typeof day === "number" ? String(day) : ""}
                                onChange={(e)=>{
                                  const d = Number(e.target.value);
                                  setPanel(m => ({ ...m, day: isNaN(d) ? undefined : d, rangeIdx: 0 }));
                                }}
                              >
                                <option value="">Choose…</option>
                                {av.days.map(d => (
                                  <option key={d.day} value={d.day}>
                                    {DAY_NAMES[d.day]}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {!!dayObj && !!dayObj.ranges?.length && (
                              <div className="mb-2">
                                <label className="form-label mb-1">Time</label>
                                <select
                                  className="form-select form-select-sm"
                                  value={String(panel.rangeIdx ?? 0)}
                                  onChange={(e)=>{
                                    const idx = Number(e.target.value);
                                    setPanel(m => ({ ...m, rangeIdx: isNaN(idx) ? 0 : idx }));
                                  }}
                                >
                                  {dayObj.ranges.map((r, i) => (
                                    <option key={i} value={i}>
                                      {r.from} – {r.to}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div className="d-flex gap-2">
                              <button className="btn btn-primary btn-sm" onClick={submitInvite}>
                                Confirm
                              </button>
                              <button className="btn btn-outline-secondary btn-sm" onClick={cancelInvite}>
                                Cancel
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="mt-auto d-grid">
                      <button
                        className="btn btn-accent-outline"
                        onClick={()=>openInvite(p._id, `${p.name?.first||""} ${p.name?.last||""}`.trim())}
                      >
                        {isOpen ? "Change day/time" : "Invite"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!players.length && <div className="text-muted">No players found.</div>}
        </div>
      )}
    </div>
  );
};

export default Players;

