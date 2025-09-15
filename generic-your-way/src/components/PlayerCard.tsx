// import type { FunctionComponent } from "react";
// import { useAuth } from "../context/AuthContext";
// import { updateMe } from "../services/userService";
// import { useMemo, useState } from "react";

// type UserLike ={
//   id: string;
//   name: { first: string; last: string };
//   email: string;
//   region: string;
//   points: number;
//   faction: string;
//   address:{
//     city: string;
//     street: string;
//     house: string;
//   };
//   homeland: string;
//   planets: string[];
//   factionText?: string;
// }

// interface PlayerCardProps {}
 
// const PlayerCard: FunctionComponent<PlayerCardProps> = () => {
//   const { user } = useAuth();
//   const u: UserLike | null = useMemo(() => {
//     if (user) return user as UserLike;
//     try {
//       return JSON.parse(localStorage.getItem("user") || "null") as UserLike | null;
//     } catch {
//       return null;
//     }
//   }, [user]);

//   const [factionText, setFactionText] = useState<string>(u?.factionText || "");
//   const [saving, setSaving] = useState(false);
//   const [savedOnce, setSavedOnce] = useState(false);

//   if (!u) return <div className="container py-4">Not authenticated</div>;

//   const canSave = factionText !== (u.factionText || "") && !saving;

//   const onSave = async () => {
//     try {
//       setSaving(true);
//       const updated = await updateMe({ factionText }); 
//       localStorage.setItem("user", JSON.stringify(updated));
//       setSavedOnce(true);
//     } catch (e: any) {
//       console.error(e);
//       alert(e?.response?.data?.message || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//     return ( <>
//    <div className="container py-4">
//       <div className="card shadow-sm">
//         <div className="card-header">
//           <strong>Player Card</strong>
//         </div>

//         <div className="card-body">
//           <div className="row gy-3">
//             <div className="col-md-6">
//               <table className="table table-sm mb-0">
//                 <tbody>
//                   <tr>
//                     <th style={{ width: 160 }}>Name</th>
//                     <td>{u.name?.first} {u.name?.last}</td>
//                   </tr>              
//                   <tr>
//                     <th>Region</th>
//                     <td>{u.region || "-"}</td>
//                   </tr>
//                   <tr>
//                     <th>City</th>
//                     <td>{u.address?.city || "-"}</td>
//                   </tr>
//                   <tr>
//                     <th>Faction</th>
//                     <td>{u.faction || "-"}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             <div className="col-md-6">
//               <table className="table table-sm mb-0">
//                 <tbody>
//                   <tr>
//                     <th style={{ width: 160 }}>Points</th>
//                     <td>{u.points ?? 0}</td>
//                   </tr>
//                   <tr>
//                     <th>Homeland</th>
//                     <td>{u.homeland || "-"}</td>
//                   </tr>
//                   <tr>
//                     <th>Planets</th>
//                     <td>
//                       {u.planets && u.planets.length > 0 ? (
//                         <ul className="mb-0">
//                           {u.planets.map((p: string, i: number) => (
//                             <li key={i}>{p}</li>
//                           ))}
//                         </ul>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <hr />
//           <div className="mb-2"><b>Faction Notes</b></div>
//           <textarea
//             className="form-control"
//             rows={6}
//             value={factionText}
//             onChange={(e) => setFactionText(e.target.value)}
//             placeholder="Put your notes about your faction here..."
//           />
//           <div className="mt-2 d-flex align-items-center gap-2">
//             <button className="btn btn-primary" onClick={onSave} disabled={!canSave}>
//               {saving ? "Saving..." : "Save"}
//             </button>
//             {savedOnce && !saving && <span className="text-success">Saved ✓</span>}
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//     );
// }
 
// export default PlayerCard;

import type { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../services/userService";
import { useEffect, useMemo, useState } from "react";

type UserLike = {
  id: string;
  name: { first: string; last: string };
  email: string;
  region: string;
  points: number;
  faction: string;
  address: {
    city: string;
    street: string;
    house: string;
  };
  homeland: string;
  planets: string[];
  factionText?: string;
};

interface PlayerCardProps {}

const PlayerCard: FunctionComponent<PlayerCardProps> = () => {
  // ожидаем, что в useAuth, помимо user, есть (или будет) refreshMe
  const auth = useAuth() as any;
  const u: UserLike | null = useMemo(() => {
    if (auth?.user) return auth.user as UserLike;
    try {
      return JSON.parse(localStorage.getItem("user") || "null") as UserLike | null;
    } catch {
      return null;
    }
  }, [auth?.user]);

  const [factionText, setFactionText] = useState<string>(u?.factionText || "");
  const [saving, setSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);

  // когда юзер обновился в контексте — синхронизируем текстовое поле
  useEffect(() => {
    setFactionText(u?.factionText || "");
    setSavedOnce(false);
  }, [u?.factionText]);

  if (!u) return <div className="container py-4">Not authenticated</div>;

  const canSave = factionText.trim() !== (u.factionText || "").trim() && !saving;

  const onSave = async () => {
    try {
      setSaving(true);
      const updated = await updateMe({ factionText }); // ожидаем, что вернёт {user} или user

      // 1) если в контексте есть refreshMe — обновим из API (предпочтительно)
      if (typeof auth?.refreshMe === "function") {
        await auth.refreshMe();
      } else {
        // 2) fallback: если refreshMe нет — синхронно положим в localStorage,
        // чтобы последующие чтения подхватили новое значение
        try {
          // updated может быть либо user, либо { user }
          const userObj = (updated && updated.name && updated) || updated?.user || null;
          if (userObj) {
            localStorage.setItem("user", JSON.stringify(userObj));
          }
        } catch {}
      }

      setSavedOnce(true);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <strong>Player Card</strong>
        </div>

        <div className="card-body">
          <div className="row gy-3">
            <div className="col-md-6">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: 160 }}>Name</th>
                    <td>
                      {u.name?.first} {u.name?.last}
                    </td>
                  </tr>
                  <tr>
                    <th>Region</th>
                    <td>{u.region || "-"}</td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td>{u.address?.city || "-"}</td>
                  </tr>
                  <tr>
                    <th>Faction</th>
                    <td>{u.faction || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: 160 }}>Points</th>
                    <td>{u.points ?? 0}</td>
                  </tr>
                  <tr>
                    <th>Homeland</th>
                    <td>{u.homeland || "-"}</td>
                  </tr>
                  <tr>
                    <th>Planets</th>
                    <td>
                      {u.planets && u.planets.length > 0 ? (
                        <ul className="mb-0">
                          {u.planets.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr />
          <div className="mb-2">
            <b>Faction Notes</b>
          </div>
          <textarea
            className="form-control"
            rows={6}
            value={factionText}
            onChange={(e) => setFactionText(e.target.value)}
            placeholder="Put your notes about your faction here..."
          />
          <div className="mt-2 d-flex align-items-center gap-2">
            <button className="btn btn-primary" onClick={onSave} disabled={!canSave}>
              {saving ? "Saving..." : "Save"}
            </button>
            {savedOnce && !saving && <span className="text-success">Saved ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;