// import React, { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { getIncoming, getOutgoing, confirmBattle, cancelBattle } from "../services/battleLogService";
// import { useNavigate } from "react-router-dom";

// type MiniUser = {
//   name?: { first?: string; last?: string };
//   faction?: string;
//   region?: string;
//   address?: { city?: string };
// };

// type Battle = {
//   _id: string;
//   attackerId?: MiniUser; 
//   defenderId?: MiniUser; 
//   confirmedByAttacker?: boolean;
//   confirmedByDefender?: boolean;
//   createdAt: string;
// };

// const Dashboard: React.FC = () => {
//   const [incoming, setIncoming] = useState<Battle[]>([]);
//   const [outgoing, setOutgoing] = useState<Battle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const timerRef = useRef<number | null>(null);
//   const navigate = useNavigate();

//   const refresh = async (silent = false) => {
//     if (!silent) setLoading(true);
//     try {
//       const [inc, out] = await Promise.all([
//         getIncoming(),
//         getOutgoing()
//       ]);
//       setIncoming(inc);
//       setOutgoing(out);
//     } catch (e:any) {
//       if (!silent) toast.error(e?.response?.data?.message || "Failed to load battles");
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refresh();
//     timerRef.current = window.setInterval(() => {
//       refresh(true);
//     }, 10000);
//     return () => {
//       if (timerRef.current) window.clearInterval(timerRef.current);
//     };
//   }, []);

//   const onAccept = async (b: Battle) => {
//     try {
//       await confirmBattle(b._id); 
//       toast.success("Accepted");
//       refresh(true);
//     } catch (e:any) {
//       toast.error(e?.response?.data?.message || "Failed to accept");
//     }
//   };

//   const onDecline = async (b: Battle) => {
//     try {
//       await cancelBattle(b._id);
//       toast.success("Declined");
//       refresh(true);
//     } catch (e:any) {
//       toast.error(e?.response?.data?.message || "Failed to decline");
//     }
//   };

//   return (
//     <div className="container py-3">
//       <h2 className="mb-3">Dashboard</h2>
//       {loading && <div className="mb-2">Loading...</div>}

//       <div className="row g-3">
//         <div className="col-md-6">
//           <div className="card h-100">
//             <div className="card-body d-flex flex-column">
//               <h5>Incoming challenges</h5>
//               {!incoming.length && <div className="text-muted">No incoming.</div>}
//               <ul className="list-group list-group-flush mt-2">
//                 {incoming.map(m => (
//                   <li key={m._id} className="list-group-item d-flex justify-content-between align-items-center"
//                       style={{ background: "#1a1b1e", color: "#fff" }}>
//                     <div>
//                       <div className="fw-bold">
//                         {m.attackerId?.name?.first} {m.attackerId?.name?.last}
//                       </div>
//                       <div className="small">
//                         {m.attackerId?.faction || "-"} · {m.attackerId?.region || "-"} · {m.attackerId?.address?.city || "-"}
//                       </div>
//                     </div>
//                     <div className="d-flex gap-2">
//                       <button className="btn btn-accent" onClick={()=>onAccept(m)}>Accept</button>
//                       <button className="btn btn-accent-outline" onClick={()=>onDecline(m)}>Decline</button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card h-100">
//             <div className="card-body d-flex flex-column">
//               <h5>Outgoing (pending)</h5>
//               {!outgoing.length && <div className="text-muted">No outgoing.</div>}
//               <ul className="list-group list-group-flush mt-2">
//                 {outgoing.map(m => (
//                   <li key={m._id} className="list-group-item d-flex justify-content-between align-items-center"
//                       style={{ background: "#1a1b1e", color: "#fff" }}>
//                     <div>
//                       <div className="fw-bold">
//                         {m.defenderId?.name?.first} {m.defenderId?.name?.last}
//                       </div>
//                       <div className="small">
//                         {m.defenderId?.faction || "-"} · {m.defenderId?.region || "-"} · {m.defenderId?.address?.city || "-"}
//                       </div>
//                     </div>
//                     <span className="badge text-dark" style={{ background: "#ffd000" }}>
//                       pending
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getIncoming, getOutgoing, confirmBattle, cancelBattle } from "../services/battleLogService";
import { useNavigate } from "react-router-dom";

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
  confirmedByAttacker?: boolean;
  confirmedByDefender?: boolean;
  createdAt: string;
};

const Dashboard: React.FC = () => {
  const [incoming, setIncoming] = useState<Battle[]>([]);
  const [outgoing, setOutgoing] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const refresh = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [inc, out] = await Promise.all([getIncoming(), getOutgoing()]);
      setIncoming(inc);
      setOutgoing(out);
    } catch (e: any) {
      if (!silent) toast.error(e?.response?.data?.message || "Failed to load battles");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    timerRef.current = window.setInterval(() => {
      refresh(true);
    }, 10000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const onAccept = async (b: Battle) => {
    try {
      // Подтверждаем участие (со стороны защитника)
      await confirmBattle(b._id);
      toast.success("Accepted");
      // Переходим в комнату матча
      navigate(`/match/${b._id}`);
      // refresh(true); // уже не обязательно — мы уходим со страницы
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to accept");
    }
  };

  const onDecline = async (b: Battle) => {
    try {
      await cancelBattle(b._id);
      toast.success("Declined");
      refresh(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to decline");
    }
  };

  return (
    <div className="container py-3">
      <h2 className="mb-3">Dashboard</h2>
      {loading && <div className="mb-2">Loading...</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5>Incoming challenges</h5>
              {!incoming.length && <div className="text-muted">No incoming.</div>}
              <ul className="list-group list-group-flush mt-2">
                {incoming.map((m) => (
                  <li
                    key={m._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ background: "#1a1b1e", color: "#fff" }}
                  >
                    <div>
                      <div className="fw-bold">
                        {m.attackerId?.name?.first} {m.attackerId?.name?.last}
                      </div>
                      <div className="small">
                        {m.attackerId?.faction || "-"} · {m.attackerId?.region || "-"} ·{" "}
                        {m.attackerId?.address?.city || "-"}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-accent" onClick={() => onAccept(m)}>
                        Accept
                      </button>
                      <button className="btn btn-accent-outline" onClick={() => onDecline(m)}>
                        Decline
                      </button>
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
                {outgoing.map((m) => (
                  <li
                    key={m._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ background: "#1a1b1e", color: "#fff" }}
                  >
                    <div>
                      <div className="fw-bold">
                        {m.defenderId?.name?.first} {m.defenderId?.name?.last}
                      </div>
                      <div className="small">
                        {m.defenderId?.faction || "-"} · {m.defenderId?.region || "-"} ·{" "}
                        {m.defenderId?.address?.city || "-"}
                      </div>
                    </div>
                    <span className="badge text-dark" style={{ background: "#ffd000" }}>
                      pending
                    </span>
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