import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getIncomingInvites,
  getOutgoingInvites,
  acceptInvite,
  declineInvite,
  cancelInvite,
  closeInvite, 
} from "../services/inviteService";
import "./css/Dashbord.css";

export type ContactLink = { kind: "whatsapp" | "telegram"; url: string };

type MiniUser = {
  name?: { first?: string; last?: string };
  region?: string;
  address?: { city?: string };
  contacts?: any;
};

type Invite = {
  _id: string;
  setting?: string | null;
  message?: string;
  status?: "pending" | "accepted" | "declined" | "canceled";
  createdAt: string;
  fromUser?: MiniUser;
  toUser?: MiniUser;
  opponentContact?: ContactLink | null;     
  opponentContacts?: ContactLink[];         
  slot?: { day?: number; from?: string | null; to?: string | null } | null;
  slotReadable?: string | null;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Dashboard: React.FC = () => {
  const [incoming, setIncoming] = useState<Invite[]>([]);
  const [outgoing, setOutgoing] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

   const normalizeInvite = (x: any): Invite => ({
    ...x,
    status: (x?.status ?? "pending") as Invite["status"],
    message: x?.message ?? "",
    opponentContacts:
      x?.opponentContacts ??
      (x?.opponentContact ? [x.opponentContact] : []),
  });

  const normalizeInvites = (arr: any[]): Invite[] =>
    (arr || []).map(normalizeInvite);

  const refresh = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [inc, out] = await Promise.all([
        getIncomingInvites(),
        getOutgoingInvites(),
      ]);

      setIncoming(normalizeInvites(inc as any));
      setOutgoing(normalizeInvites(out as any));
    } catch (e: any) {
      if (!silent)
        toast.error(e?.response?.data?.message || "Failed to load invites");
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
    if (inv.slotReadable) return <span>{inv.slotReadable}</span>;

    const d = inv.slot?.day;
    if (typeof d !== "number" || d < 0 || d > 6) return <span className="text-muted">No day selected</span>;

    const dayLabel = DAY_NAMES[d];
    const from = inv.slot?.from || "";
    const to = inv.slot?.to || "";
    const time = from && to ? `${from}–${to}` : (from || to || "");

    return (
      <span>
        <b>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#F3F3F3"
          >
            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
          </svg>
          {dayLabel}
        </b>
        {time ? ` · ${time}` : ""}
      </span>
    );
  };

  const openChatLinks = (inv: Invite) => {
    const links = inv.opponentContacts?.length
      ? inv.opponentContacts
      : inv.opponentContact
      ? [inv.opponentContact]
      : [];
    if (!links.length) {
      toast.info("Opponent has no contact set");
      return;
    }
    if (links.length === 1) {
      window.open(links[0].url, "_blank", "noopener,noreferrer");
      return;
    }
    const hasTg = links.some((l) => l.kind === "telegram");
    const hasWa = links.some((l) => l.kind === "whatsapp");
    if (hasTg && hasWa) {
      const pickTelegram = window.confirm("Open Telegram? (Cancel = WhatsApp)");
      const chosen = pickTelegram
        ? links.find((l) => l.kind === "telegram")
        : links.find((l) => l.kind === "whatsapp");
      if (chosen) window.open(chosen.url, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(links[0].url, "_blank", "noopener,noreferrer");
  };

 

  const onAccept = async (inv: Invite) => {
    try {
      await acceptInvite(inv._id);
      toast.success("Invite accepted");
      await refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to accept");
    }
  };

  const onDecline = async (inv: Invite) => {
    try {
      await declineInvite(inv._id);
      toast.success("Declined");
      await refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to decline");
    }
  };

  const onCancel = async (inv: Invite) => {
    try {
      await cancelInvite(inv._id);
      toast.success("Canceled");
      await refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to cancel");
    }
  };

  const onClose = async (inv: Invite) => {
    try {
      await closeInvite(inv._id);
      toast.success("Session closed");
      await refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to close session");
    }
  };

  return (
    <div className="container py-3">
      <h2 className="mb-4 dashbord">Your Invites</h2>
      {loading && <div className="mb-2">Loading...</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="d-flex align-items-center gap-2 ">
                Incoming Invites
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EFEFEF">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-120H640q-30 38-71.5 59T480-240q-47 0-88.5-21T320-320H200v120Zm280-120q38 0 69-22t43-58h168v-360H200v360h168q12 36 43 58t69 22Zm0-80L320-560l56-58 64 64v-166h80v166l64-64 56 58-160 160ZM200-200h560-560Z" />
                </svg>
              </h5>
              <hr className="your-invites" />

              {!incoming.length && (
                <div className="empty-state">
                  <div className="empty-state-title">No incoming invites yet</div>
                  <div className="empty-state-text">Ask your friends to invite you for a game, or send an invite yourself.</div>
                </div>
              )}

<ul className="list-group list-group-flush mt-2">
  {incoming.map(inv => {
    const isPending = (inv.status ?? "pending") === "pending";
    const canMessage = (inv.status ?? "pending") === "accepted";
  return (
    <li
      key={inv._id}
      className="list-group-item d-flex justify-content-between align-items-center dashbord-players"
      style={{ background: "#1a1b1e", color: "#fff" }}
    >
      <div className="dashbord-players-bio">
        <div className="fw-bold dashbord-players-name">
          {inv.fromUser?.name?.first} {inv.fromUser?.name?.last}
        </div>
        <div className="small dashbord-players-info">
          {inv.setting} · {inv.fromUser?.region || "-"} · {inv.fromUser?.address?.city || "-"}
        </div>
        <div className="small mt-1 dashbord-players-slot">
          {renderSlot(inv)}
        </div>
        {inv.message && (
          <div className="small mt-2 text-muted">
            “{inv.message}”
          </div>
        )}
      </div>
      <div className="d-flex gap-2">
        {isPending ? (
          <>
            <button
              className="btn btn-accent-success"
              onClick={() => onAccept(inv)}
            >
              Accept
            </button>
            <button
              className="btn btn-accent-error"
              onClick={() => onDecline(inv)}
            >
              Decline
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-accent-outline"
              disabled={!canMessage}
              onClick={() => openChatLinks(inv)}
            >
              Message
            </button>
            <button
              className="btn btn-accent-error"
              onClick={() => onClose(inv)}
            >
              Close
            </button>
          </>
        )}
      </div>
    </li>
  );
})}
</ul>
  </div>
    </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="d-flex align-items-center gap-2">
                Outgoing Invites
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EFEFEF">
                  <path d="M440-400v-166l-64 64-56-58 160-160 160 160-56 58-64-64v166h-80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-120H640q-30 38-71.5 59T480-240q-47 0-88.5-21T320-320H200v120Zm280-120q38 0 69-22t43-58h168v-360H200v360h168q12 36 43 58t69 22ZM200-200h560-560Z" />
                </svg>
              </h5>
              <hr className="your-invites" />

              {!outgoing.length && (
                <div className="empty-state">
                  <div className="empty-state-title">You haven't invited anyone yet</div>
                  <div className="empty-state-text">Open "Find Players", choose someone and send your first invite.</div>
                </div>
              )}

  <ul className="list-group list-group-flush mt-2">
  {outgoing.map(inv => {
  const canMessage = inv.status === "accepted";
  return (
    <li
      key={inv._id}
      className="list-group-item d-flex justify-content-between align-items-center dashbord-players"
      style={{ background: "#1a1b1e", color: "#fff" }}
    >
      <div className="dashbord-players-bio">
        <div className="fw-bold dashbord-players-name">
          {inv.toUser?.name?.first} {inv.toUser?.name?.last}
        </div>
        <div className="small dashbord-players-info">
          {inv.setting} · {inv.toUser?.region || "-"} · {inv.toUser?.address?.city || "-"}
        </div>
        <div className="small mt-1 dashbord-players-slot">
          {renderSlot(inv)}
        </div>
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-accent-outline"
          disabled={!canMessage}
          title={!canMessage ? "Waiting for Accept" : ""}
          onClick={() => openChatLinks(inv)}
        >
          Message
        </button>
        {inv.status === "pending" ? (
          <button
            className="btn btn-accent-error"
            onClick={() => onCancel(inv)}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn btn-accent-error"
            onClick={() => onClose(inv)}
          >
            Close
          </button>
        )}
      </div>
    </li>
  );
})}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
