import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getBattle, setBattleResult, confirmBattle } from "../services/battleLogService";

type MiniUser = {
  name?: { first?: string; last?: string };
  faction?: string;
  region?: string;
  address?: { city?: string };
};

type Battle = {
  _id: string;
  attackerId?: MiniUser;
  defenderId?: MiniUser;
  result?: "win" | "draw" | "lose";
  confirmedByAttacker?: boolean;
  confirmedByDefender?: boolean;
  createdAt: string;
};

const MatchRoom: React.FC = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const [b, setB] = useState<Battle | null>(null);
  const [saving, setSaving] = useState(false);
  const [res, setRes] = useState<"win" | "draw" | "lose" | "">("");

 const load = async () => {
    try {
      if (!battleId) return;
      const battle = await getBattle(battleId);
      setB(battle);
      setRes((battle.result as any) || "");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load match");
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [battleId]);

 const saveResult = async () => {
    if (!battleId || !res) {
      toast.warn("Select result: win / draw / lose");
      return;
    }
    setSaving(true);
    try {
      const updated = await setBattleResult(battleId, res as any);
      setB(updated);
      toast.success("Result saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save result");
    } finally {
      setSaving(false);
    }
  };

 const doConfirm = async () => {
    if (!battleId) return;
    setSaving(true);
    try {
      await confirmBattle(battleId);
      toast.success("Confirmed");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to confirm");
    } finally {
      setSaving(false);
    }
  };

  if (!b) return <div className="container py-3">Loading...</div>;

  return (
    <div className="container py-3">
      <h3>Match Room</h3>
      <div className="card p-3 mb-3" style={{ background: "#1a1b1e", color: "#fff" }}>
        <div className="row">
          <div className="col-md-6">
            <h5>Attacker</h5>
            <div className="fw-bold">
              {b.attackerId?.name?.first} {b.attackerId?.name?.last}
            </div>
            <div className="small">
              {b.attackerId?.faction || "-"} · {b.attackerId?.region || "-"} · {b.attackerId?.address?.city || "-"}
            </div>
          </div>
          <div className="col-md-6">
            <h5>Defender</h5>
            <div className="fw-bold">
              {b.defenderId?.name?.first} {b.defenderId?.name?.last}
            </div>
            <div className="small">
              {b.defenderId?.faction || "-"} · {b.defenderId?.region || "-"} · {b.defenderId?.address?.city || "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3" style={{ background: "#1a1b1e", color: "#fff" }}>
        <h5>Result</h5>
        <div className="d-flex gap-3 align-items-center">
          <label className="d-flex align-items-center gap-1">
            <input type="radio" name="res" value="win"  checked={res==="win"}  onChange={()=>setRes("win")}  /> Win
          </label>
          <label className="d-flex align-items-center gap-1">
            <input type="radio" name="res" value="draw" checked={res==="draw"} onChange={()=>setRes("draw")} /> Draw
          </label>
          <label className="d-flex align-items-center gap-1">
            <input type="radio" name="res" value="lose" checked={res==="lose"} onChange={()=>setRes("lose")} /> Lose
          </label>

          <button className="btn btn-accent" disabled={saving} onClick={saveResult}>
            Save result
          </button>

          <button className="btn btn-accent-outline" disabled={saving} onClick={doConfirm}>
            Confirm
          </button>
        </div>

        <div className="mt-3 small">
          Attacker confirmed: {b.confirmedByAttacker ? "Yes" : "No"} · Defender confirmed: {b.confirmedByDefender ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};

export default MatchRoom;