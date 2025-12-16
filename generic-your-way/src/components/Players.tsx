import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { listPublicPlayers, type PublicPlayer } from "../services/playerService";
import { createInvite } from "../services/inviteService";
import BioClamp from "./BioClamp";
import { imgUrl } from "../utils/imgUrl";
import { getPublicAvailability, type Availability } from "../services/availabilityService";
import "./css/Players.css";

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
  setting?: string;
};

const Players: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PublicPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useSearchParams();
  const [panel, setPanel] = useState<InvitePanelState>({ open:false });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const filters = useMemo(() => ({
    setting: search.get("setting") ?? "",
    region:  search.get("region")  || "",
    country: search.get("country") || "",
    city:    search.get("city")    || "",
    day:     search.get("day") ? Number(search.get("day")) : undefined,
    from:    search.get("from") || ""
  }), [search, user?.settings]);

    const missingMine = useMemo(() => {
    const m: string[] = [];
    if (!user?.region) m.push("region");
    if (!user?.address?.country) m.push("country");
    if (!user?.address?.city) m.push("city");
    if (!user?.settings?.length) m.push("settings");
    const phone = user?.contacts?.phoneE164?.trim?.();
    const tg = user?.contacts?.telegramUsername?.trim?.();
    if (!phone && !tg) m.push("contacts");
    return m;
  }, [user]);

  const canInvite = missingMine.length === 0;

  const goFixProfile = () => {
  const labelMap: Record<string, string> = {
    region: "Region",
    country: "Country",
    city: "City",
    settings: "Game settings",
  };

  const missingNice = missingMine.map(k => labelMap[k] || k);

  toast.info(
    <>
      <b>Complete your profile to send invites</b>
      <br />
      Missing: {missingNice.join(", ")}
      <br />
      <span style={{ fontSize: "0.85em", opacity: 0.8 }}>
        This helps other players find and contact you.
      </span>
    </>
  );

  navigate("/profile-edit"); 
};



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
  }, [filters.setting, filters.region, filters.country, filters.city, filters.day, filters.from, user]);

  const updateFilter = (k: "setting"|"region"|"country"|"city"|"day"|"from", v: string) => {
    const next = new URLSearchParams(search);
    if (v) next.set(k, v); else next.delete(k);
    setSearch(next, { replace: true });
  };

  const openInvite = async (toUserId: string, name: string, player: PublicPlayer) => {
  const chosenSetting = pickSettingForInvite(player, filters.setting);
  if (!chosenSetting) {
    toast.info("No setting selected");
    return;
  }
  try {
    setPanel({ open:true, userId: toUserId, name, loading: true, setting: chosenSetting });
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

  function pickSettingForInvite(player: PublicPlayer, currentFilterSetting?: string): string | null {
  const avail = (player.settings || []);
  if (!avail.length) return null;
  if (currentFilterSetting && avail.includes(currentFilterSetting)) return currentFilterSetting;

  const choice = window.prompt(`Pick setting:\n${avail.map((s,i)=>`${i+1}. ${s}`).join("\n")}\nType number`, "1");
  if (choice == null) return null;
  const idx = Number(choice) - 1;
  if (idx < 0 || idx >= avail.length) return null;
  return avail[idx];
}

  const submitInvite = async () => {
  if (!panel.userId || !panel.availability) return;
  if (!canInvite) {
  goFixProfile();
  return;
  }
  if (panel.availability.busyAllWeek) {
    toast.info("Player is busy this week");
    return;
  }
  const d = panel.day;
  if (typeof d !== "number") {
    toast.error("Choose day");
    return;
  }
  const dayConf = panel.availability.days.find((x) => x.day === d);
  if (!dayConf) {
    toast.error("Day not available");
    return;
  }
  const rIdx = panel.rangeIdx ?? 0;
  const r = dayConf.ranges?.[rIdx];
  try {
    await createInvite(panel.userId, { day: d, from: r?.from, to: r?.to }, panel.setting);
    toast.success("Invite sent");
    setPanel({ open: false });
  } catch (e: any) {
    const status = e?.response?.status;
    const code = e?.response?.data?.code;
    const missing = e?.response?.data?.missing as string[] | undefined;
    if (status === 409 && code === "PROFILE_INCOMPLETE") {
      const missingText = missing?.length ? missing.join(", ") : "required fields";
      toast.info(`Finish your profile to send invites: ${missingText}`);
      return;
    }
    if (status === 409) {
      toast.info(e?.response?.data?.message || "Day already booked");
      return;
    }
    const msg = e?.response?.data?.message || "Failed to send invite";
    toast.error(msg);
  }
};

  const cancelInvite = () => setPanel({ open:false });

  return (
    <div className="container py-4 players-page">
        <button
          type="button"
          className="btn btn-accent-outline d-md-none mb-2"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>
      
      <div
        className={
          "card mb-3 players-filters-wrapper " +
          (filtersOpen ? "players-filters-open" : "players-filters-closed")
        }
      >
        <div className="card-body">
          <div className="row g-3 players-filters-grid">
            <div className="col-12 col-md-4">
              <label className="form-label">Setting:</label>
              <select
                className="form-select"
                value={filters.setting}
                onChange={(e) => updateFilter("setting", e.target.value)}
              >
                <option value="">All</option>
                {SETTINGS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Region:</label>
              <select
                className="form-select"
                value={filters.region}
                onChange={(e) => updateFilter("region", e.target.value)}
              >
                <option value="">All</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Country:</label>
              <input
                className="form-control"
                value={filters.country}
                onChange={(e) => updateFilter("country", e.target.value)}
                placeholder="e.g. England"
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">City:</label>
              <input
                className="form-control"
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
                placeholder="e.g. London"
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Day:</label>
              <select
                className="form-select"
                value={
                  typeof filters.day === "number" ? String(filters.day) : ""
                }
                onChange={(e) =>
                  updateFilter("day", e.target.value ? e.target.value : "")
                }
              >
                <option value="">Any</option>
                {DAY_NAMES.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">From:</label>
              <input
                type="time"
                className="form-control"
                value={filters.from}
                onChange={(e) => updateFilter("from", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row g-3">
          {players.map((p) => {
            const isOpen = panel.open && panel.userId === p._id;
            const av = isOpen ? panel.availability : undefined;
            const day = isOpen ? panel.day : undefined;
            const dayObj =
              isOpen && av && typeof day === "number"
                ? av.days.find((x) => x.day === day)
                : undefined;

            return (
              <div className="col-12 col-md-6 col-lg-4 player-card-col" key={p._id}>
                <div className="card player-card">
                  <div className="card-body d-flex flex-column">
                    <div className="player-card-main">
                      
                      <div className="player-card-left">
                        <div className="player-card-photo">
                          <img src={imgUrl(p.image?.url)} alt="" />
                        </div>
                        <div className="player-card-name">
                          {p.name?.first} {p.name?.last}
                        </div>
                      </div>

                      <div className="player-card-right">
                        {filters.setting && p.settings?.includes(filters.setting) && (
                        <div className="player-card-setting">
                          {filters.setting.toUpperCase()}
                        </div>
                        )}

                        {!!p.bio && (
                        <div className="player-card-bio small">
                        <BioClamp text={p.bio} maxChars={20} />
                        </div>
                        )}

                        <div className="player-card-meta small">
                          <div>
                            <b>Region:</b> {p.region || "-"}
                          </div>
                          <div>
                            <b>Country:</b> {p.address?.country || "-"}
                          </div>
                          <div>
                            <b>City:</b> {p.address?.city || "-"}
                          </div>

                          {!filters.setting && (
                          <div className="player-card-settings">
                          <b>Settings:</b>{" "}
                          {p.settings?.length ? (
                          <BioClamp text={p.settings.join(", ")} maxChars={0} />
                          ) : ("-")}
                         </div>
                           )}
                        </div>

                        {isOpen && (
                          <div className="mt-3 p-2 border rounded player-card-invite-panel">
                            {panel.loading ? (
                              <div className="small text-muted">
                                Loading availability…
                              </div>
                            ) : av?.busyAllWeek ? (
                              <div className="text-danger small">
                                Player is busy this week
                              </div>
                            ) : !av?.days?.length ? (
                              <div className="small text-muted">
                                No available days
                              </div>
                            ) : (
                              <>
                                <div className="mb-2 small">
                                  <b>Setting:</b> {panel.setting}
                                </div>

                                <div className="mb-2">
                                  <label className="form-label mb-1">
                                    Day
                                  </label>
                                  <select
                                    className="form-select form-select-sm"
                                    value={
                                      typeof day === "number"
                                        ? String(day)
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const dNum = Number(e.target.value);
                                      setPanel((m) => ({
                                        ...m,
                                        day: isNaN(dNum) ? undefined : dNum,
                                        rangeIdx: 0,
                                      }));
                                    }}
                                  >
                                    <option value="">Choose…</option>
                                    {av.days.map((dObj) => (
                                      <option
                                        key={dObj.day}
                                        value={dObj.day}
                                      >
                                        {DAY_NAMES[dObj.day]}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {!!dayObj && !!dayObj.ranges?.length && (
                                  <div className="mb-2">
                                    <label className="form-label mb-1">
                                      Time
                                    </label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={String(panel.rangeIdx ?? 0)}
                                      onChange={(e) => {
                                        const idx = Number(e.target.value);
                                        setPanel((m) => ({
                                          ...m,
                                          rangeIdx: isNaN(idx) ? 0 : idx,
                                        }));
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

                                <div className="d-flex gap-2 invite-panel-c">
                                  <button
                                    className="btn btn-accent-success btn-sm"
                                    onClick={submitInvite}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    className="btn btn-accent-error btn-sm"
                                    onClick={cancelInvite}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                   <div className="mt-3 d-grid">
                   <button
                   className="btn btn-accent-outline w-100"
                   onClick={() => {
                   if (!canInvite) {
                   goFixProfile();
                  return;
                   }
                   openInvite(p._id,`${p.name?.first || ""} ${p.name?.last || ""}`.trim(),p);
                  }}
                   >
                 {isOpen ? "Change day/time" : "Invite"}
                 </button>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!players.length && (
          <div className="empty-state">
          <div className="empty-state-title">No players found</div>
          <div className="empty-state-text">
          Try changing filters.
          </div>
          </div>
         )}
        </div>
      )}
    </div>
  );
};

export default Players;

