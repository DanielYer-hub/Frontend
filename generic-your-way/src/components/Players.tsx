import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createChallenge } from "../services/battleLogService";
import { listPlayers, type PlayerDTO } from "../services/playerService";

const regions = [
  "North America","Caribbean","Central America","South America",
  "Africa","Middle East","Europe","Asia","Australia and Oceania"
];

const Players: React.FC = () => {
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useSearchParams();

  const filters = useMemo(
    () => ({
      region:  search.get("region")  || "",
      country: search.get("country") || "",
      city:    search.get("city")    || "",
    }),
    [search]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPlayers(filters);
      setPlayers(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.region, filters.country, filters.city]);

  const updateFilter = (k: "region" | "country" | "city", v: string) => {
    const next = new URLSearchParams(search);
    if (v) next.set(k, v);
    else next.delete(k);
    setSearch(next, { replace: true });
  };

  const attack = async (defenderId: string) => {
    const planetName = prompt("Enter planet to attack (exact name):")?.trim();
    if (!planetName) return;
    try {
      await createChallenge(defenderId, planetName, "win"); 
      toast.success("Challenge sent");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to send challenge");
    }
  };

  return (
    <div className="container py-3">
      <h2 className="mb-3">Find Players</h2>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label">Region</label>
              <select
                className="form-select"
                value={filters.region}
                onChange={(e) => updateFilter("region", e.target.value)}
              >
                <option value="">All</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Country</label>
              <input
                className="form-control"
                value={filters.country}
                onChange={(e) => updateFilter("country", e.target.value)}
                placeholder="e.g. Israel"
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">City</label>
              <input
                className="form-control"
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
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
          {players.map((p) => (
            <div className="col-12 col-md-6 col-lg-4" key={p._id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">
                        {p.name?.first} {p.name?.last}
                      </div>
                      <div className="small text-muted">{p.email}</div>
                    </div>
                    <span className="badge text-dark" style={{ background: "#ffd000" }}>
                      {p.faction || "—"}
                    </span>
                  </div>

                  <div className="mt-2 small">
                    <div><b>Region:</b> {p.region}</div>
                    <div><b>Country:</b> {p.address?.country || "-"}</div>
                    <div><b>City:</b> {p.address?.city || "-"}</div>
                    <div><b>Points:</b> {p.points ?? 0}</div>
                    <div><b>Homeland:</b> {p.homeland || "-"}</div>
                    <div><b>Planets:</b> {p.planets?.length ? p.planets.join(", ") : "-"}</div>
                  </div>

                  <div className="mt-auto d-grid">
                    <button
                      className="btn btn-accent-outline"
                      onClick={() => attack(p._id)}
                    >
                      Attack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!players.length && <div className="text-muted">No players found.</div>}
        </div>
      )}
    </div>
  );
};

export default Players;

