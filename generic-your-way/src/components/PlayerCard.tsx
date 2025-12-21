import type { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyAvailability,
  updateMyAvailability,
  type Availability,
  type AvSlot,
} from "../services/availabilityService";
import { toast } from "react-toastify";
import "./css/PlayerCard.css";

type UserLike = {
  id: string;
  name: { first: string; last: string };
  email: string;
  region: string;
  address: { city: string; country: string };
  settings?: string[];
  image?: { url?: string | null } | null;
  bio?: string | null;
};

const AVATAR_FALLBACK = "/content/avatar.webp";
const MAX_SLOTS = 6;

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

  const [av, setAv] = useState<Availability>({ busyAllWeek: false, slots: [] });
  const [loadingAv, setLoadingAv] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoadingAv(true);
        const a = await getMyAvailability();
        setAv(a || { busyAllWeek: false, slots: [] });
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load availability");
      } finally {
        setLoadingAv(false);
      }
    })();
  }, []);

  const addSlot = () => {
    if (av.slots.length >= MAX_SLOTS) {
      toast.info(`Max ${MAX_SLOTS} dates`);
      return;
    }
    setAv((prev) => ({
      ...prev,
      slots: [
        ...prev.slots,
        { date: "", ranges: [{ from: "18:00", to: "22:00" }] },
      ],
    }));
  };

  const removeSlot = (idx: number) => {
    setAv((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== idx),
    }));
  };

  const setSlotDate = (idx: number, date: string) => {
    setAv((prev) => ({
      ...prev,
      slots: prev.slots.map((s, i) => (i === idx ? { ...s, date } : s)),
    }));
  };

  const addRange = (slotIdx: number) => {
    setAv((prev) => ({
      ...prev,
      slots: prev.slots.map((s, i) =>
        i === slotIdx
          ? { ...s, ranges: [...s.ranges, { from: "18:00", to: "22:00" }] }
          : s
      ),
    }));
  };

  const setRange = (
    slotIdx: number,
    rangeIdx: number,
    key: "from" | "to",
    val: string
  ) => {
    setAv((prev) => ({
      ...prev,
      slots: prev.slots.map((s, i) =>
        i !== slotIdx
          ? s
          : {
              ...s,
              ranges: s.ranges.map((r, j) =>
                j === rangeIdx ? { ...r, [key]: val } : r
              ),
            }
      ),
    }));
  };

  const removeRange = (slotIdx: number, rangeIdx: number) => {
    setAv((prev) => ({
      ...prev,
      slots: prev.slots.map((s, i) =>
        i !== slotIdx
          ? s
          : { ...s, ranges: s.ranges.filter((_, j) => j !== rangeIdx) }
      ),
    }));
  };

  const saveAvailability = async () => {
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

  if (!u) return <div className="container py-4">Not authenticated</div>;

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <strong>Player Card</strong>
        </div>

        <div className="card-body">
          <div className="pc-layout">
            <div className="pc-avatar-area">
              <img
                src={u.image?.url || AVATAR_FALLBACK}
                alt="profile"
                className="pc-avatar"
              />
            </div>

            <div className="pc-edit-area">
              <Link to="/profile-edit" className="btn btn-accent-outline pc-edit-btn">
                Edit Profile
              </Link>
            </div>

            <div className="pc-about-area">
              <div className="pc-about box">
                <div className="pc-about-title">About me:</div>
                <div className="pc-about-text">
                  {u.bio && u.bio.trim() ? u.bio : "No description yet."}
                </div>
              </div>
            </div>

            <div className="pc-info-area">
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
                    <span className="pc-pill">{u.region || "-"}</span>
                  </div>
                </div>

                <div className="pc-info-row">
                  <div className="pc-info-label">Country:</div>
                  <div className="pc-info-value">
                    <span className="pc-pill">{u.address?.country || "-"}</span>
                  </div>
                </div>

                <div className="pc-info-row">
                  <div className="pc-info-label">City:</div>
                  <div className="pc-info-value">
                    <span className="pc-pill">{u.address?.city || "-"}</span>
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
            <h5 className="mb-0">Availability:</h5>
            <div className="form-check form-switch mb-0 pc-busy-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={av.busyAllWeek}
                onChange={(e) => setAv({ ...av, busyAllWeek: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="busyAllWeek">
                Busy all week
              </label>
            </div>
          </div>

          {!av.busyAllWeek && (
            <>
              <div className="row g-3">
                {av.slots.map((s: AvSlot, slotIdx: number) => (
                  <div key={slotIdx} className="col-12 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="small fw-bold">Date:</div>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeSlot(slotIdx)}
                          >
                            Remove
                          </button>
                        </div>

                        <input
                          type="date"
                          className="form-control mb-2"
                          value={s.date || ""}
                          onChange={(e) => setSlotDate(slotIdx, e.target.value)}
                        />

                        {(s.ranges || []).map((r, rangeIdx) => (
                          <div
                            key={rangeIdx}
                            className="d-flex align-items-center gap-2 mb-2"
                          >
                            <input
                              type="time"
                              value={r.from}
                              onChange={(e) =>
                              setRange(slotIdx, rangeIdx, "from", e.target.value)
                              }
                            />
                            <span>–</span>
                            <input
                              type="time"
                              value={r.to}
                              onChange={(e) =>
                                setRange(slotIdx, rangeIdx, "to", e.target.value)
                              }
                            />
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeRange(slotIdx, rangeIdx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => addRange(slotIdx)}
                        >
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

          <div className="av-time mt-3">
            <button
              className="btn btn-success"
              onClick={saveAvailability}
              disabled={loadingAv}
            >
              Save availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
