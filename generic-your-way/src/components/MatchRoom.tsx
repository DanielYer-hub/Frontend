import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getBattle, setBattleResult, confirmBattle } from "../services/battleLogService";

type Battle = {
  _id: string;
  planets: string;
  result: "win"|"lose"|"draw";
  attackerId: { _id: string; name?: { first?: string; last?: string } };
  defenderId: { _id: string; name?: { first?: string; last?: string } };
};

const MatchRoom: React.FC = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [choice, setChoice] = useState<"attacker" | "defender" | "draw">("draw");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      if (!battleId) return;
      const b = await getBattle(battleId);
      setBattle(b);

      // Преобразуем текущее значение result в "радиокнопку"
      if (b.result === "win") setChoice("attacker");
      else if (b.result === "lose") setChoice("defender");
      else setChoice("draw");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load match");
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [battleId]);

  const save = async () => {
    if (!battleId) return;
    setSaving(true);
    try {
      const result = choice === "attacker" ? "win" : choice === "defender" ? "lose" : "draw";
      await setBattleResult(battleId, result);
      toast.success("Result saved");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save result");
    } finally {
      setSaving(false);
    }
  };

  const confirm = async () => {
    if (!battleId) return;
    try {
      await confirmBattle(battleId);
      toast.success("Confirmed");
      // по желанию — назад на дэшборд:
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to confirm");
    }
  };

  if (!battle) return <div className="container py-3">Loading...</div>;

  const aName = `${battle.attackerId?.name?.first || ""} ${battle.attackerId?.name?.last || ""}`.trim();
  const dName = `${battle.defenderId?.name?.first || ""} ${battle.defenderId?.name?.last || ""}`.trim();

  return (
    <div className="container py-3">
      <h3 className="mb-3">Match</h3>

      <div className="card mb-3">
        <div className="card-body d-flex justify-content-between">
          <div className="text-center flex-fill">
            <div className="fw-bold mb-1">Attacker</div>
            <div>{aName || battle.attackerId._id}</div>
          </div>
          <div className="text-center flex-fill">
            <div className="fw-bold mb-1">Defender</div>
            <div>{dName || battle.defenderId._id}</div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="mb-2">
            <b>Planet:</b> {battle.planets || "-"}
          </div>
          <div className="mb-2">
            <b>Result:</b>
          </div>
          <div className="d-flex gap-3">
            <label className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={choice === "attacker"}
                onChange={() => setChoice("attacker")}
              />
              <span className="ms-2">Attacker Win</span>
            </label>

            <label className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={choice === "defender"}
                onChange={() => setChoice("defender")}
              />
              <span className="ms-2">Defender Win</span>
            </label>

            <label className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={choice === "draw"}
                onChange={() => setChoice("draw")}
              />
              <span className="ms-2">Draw</span>
            </label>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" disabled={saving} onClick={save}>
              Save Result
            </button>
            <button className="btn btn-success" onClick={confirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>

      <div className="text-muted small">
        Оба игрока должны нажать <b>Confirm</b>. После этого система начислит очки и, если указана планета,
        выполнит её перенос при победе атакера.
      </div>
    </div>
  );
};

export default MatchRoom;