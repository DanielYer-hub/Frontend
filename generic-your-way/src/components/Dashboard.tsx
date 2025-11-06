import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getIncomingInvites,
  getOutgoingInvites,
  acceptInvite,
  declineInvite,
  cancelInvite
} from "../services/inviteService";

export type ContactLink = { kind: "whatsapp" | "telegram"; url: string };
export type ChatInfo = { links?: ContactLink[] };

type MiniUser = {
  name?: { first?: string; last?: string };
  region?: string;
  address?: { city?: string };
  contacts?: any;
};

type Invite = {
  _id: string;
  setting?: string;
  fromUser?: MiniUser;
  toUser?: MiniUser;
  createdAt: string;
  opponentContact?: { kind: "whatsapp"|"telegram"; url: string } | null;
  slot?: { day?: number; from?: string | null; to?: string | null } | null;
};

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const Dashboard: React.FC = () => {
  const [incoming, setIncoming] = useState<Invite[]>([]);
  const [outgoing, setOutgoing] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  const refresh = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [inc, out] = await Promise.all([
        getIncomingInvites(),
        getOutgoingInvites()
      ]);
      setIncoming(inc || []);
      setOutgoing(out || []);
    } catch (e: any) {
      if (!silent) toast.error(e?.response?.data?.message || "Failed to load invites");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    timerRef.current = window.setInterval(() => refresh(true), 10000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const renderSlot = (inv: Invite) => {
    const d = inv.slot?.day;
    if (typeof d !== "number" || d < 0 || d > 6) return <span className="text-muted">No day selected</span>;
    const dayLabel = DAY_NAMES[d];
    const from = inv.slot?.from || "";
    const to   = inv.slot?.to || "";
    const time = from && to ? `${from}–${to}` : (from || to || "");
    return (
      <span>
        <b>📅 {dayLabel}</b>{time ? ` · ${time}` : ""}
      </span>
    );
  };

  const onAccept = async (m: Invite) => {
    try {
      const { chat } = (await acceptInvite(m._id)) as { chat?: { links?: ContactLink[] } };
      const links: ContactLink[] = chat?.links ?? [];

      if (!links.length) {
        toast.info("Opponent has no contact set");
        return;
      }
      if (links.length === 1) {
        window.open(links[0].url, "_blank", "noopener,noreferrer");
      } else {
        const pickTelegram = window.confirm("Open Telegram? (Cancel = WhatsApp)");
        const chosen = pickTelegram
          ? links.find((l) => l.kind === "telegram")
          : links.find((l) => l.kind === "whatsapp") || links[0];
        if (chosen) window.open(chosen.url, "_blank", "noopener,noreferrer");
      }
      toast.success("Invite accepted");
      refresh(true);
    } catch (e:any) {
      toast.error(e?.response?.data?.message || "Failed to accept");
    }
  };

  const onDecline = async (inv: Invite) => {
    try {
      await declineInvite(inv._id);
      toast.success("Declined");
      refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to decline");
    }
  };

  const onCancel = async (inv: Invite) => {
    try {
      await cancelInvite(inv._id);
      toast.success("Canceled");
      refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to cancel");
    }
  };

  const openOpponentContact = (inv: Invite) => {
    const url = inv.opponentContact?.url;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container py-3">
      <h2 className="mb-3">Dashboard</h2>
      {loading && <div className="mb-2">Loading...</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5>Incoming invites</h5>
              {!incoming.length && <div className="text-muted">No incoming.</div>}
              <ul className="list-group list-group-flush mt-2">
                {incoming.map(inv => (
                  <li
                    key={inv._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ background: "#1a1b1e", color: "#fff" }}
                  >
                    <div>
                      <div className="fw-bold">
                        {inv.fromUser?.name?.first} {inv.fromUser?.name?.last}
                      </div>
                      <div className="small">
                        {inv.setting} · {inv.fromUser?.region || "-"} · {inv.fromUser?.address?.city || "-"}
                      </div>
                      <div className="small mt-1">
                        {renderSlot(inv)}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-accent" onClick={() => onAccept(inv)}>Accept</button>
                      <button className="btn btn-accent-outline" onClick={() => onDecline(inv)}>Decline</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5>Outgoing (pending)</h5>
              {!outgoing.length && <div className="text-muted">No outgoing.</div>}
              <ul className="list-group list-group-flush mt-2">
                {outgoing.map(inv => (
                  <li
                    key={inv._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ background: "#1a1b1e", color: "#fff" }}
                  >
                    <div>
                      <div className="fw-bold">
                        {inv.toUser?.name?.first} {inv.toUser?.name?.last}
                      </div>
                      <div className="small">
                        {inv.setting} · {inv.toUser?.region || "-"} · {inv.toUser?.address?.city || "-"}
                      </div>
                      <div className="small mt-1">
                        {renderSlot(inv)}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {inv.opponentContact?.url && (
                        <button className="btn btn-outline-light" onClick={() => openOpponentContact(inv)}>
                          Message
                        </button>
                      )}
                      <button className="btn btn-accent-outline" onClick={() => onCancel(inv)}>Cancel</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
