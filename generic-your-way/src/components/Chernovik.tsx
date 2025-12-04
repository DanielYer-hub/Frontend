{/*    *front Register narrative*
    faction: yup.string().oneOf([
          "Space Marines", "Dark Angels", "Blood Angels", "Space Wolves",
          "Grey Knights", "Black Templars", "Deathwatch", "Adeptus Mechanicus",
          "Imperial Knights", "Astra Militarum", "Adeptus Custodes",
          "Adepta Sororitas", "Imperial Agents", "Chaos Space Marines",
          "Chaos Daemons", "Thousand Sons", "Death Guard", "World Eaters",
          "Emperor’s Children", "Chaos Knights", "Aeldari", "Drukhari",
          "Necrons", "Orks", "T’au Empire", "Tyranids",
          "Genestealer Cults", "Leagues of Votann"
        ]).required(),
  
  <div className="col-md-4">
    <label htmlFor="street" className="form-label">Faction</label>
    {formik.touched.faction && formik.errors.faction && (
    <p className="text-danger">{formik.errors.faction}</p>
    )}
    <select
    name="faction" 
    className="form-control" 
    id="faction"
    value={formik.values.faction}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    >
     <option value="" disabled>Select your faction</option>
    <option value="Space Marines">Space Marines</option>
    <option value="Dark Angels">Dark Angels</option>
    <option value="Blood Angels">Blood Angels</option>
    <option value="Space Wolves">Space Wolves</option>
    <option value="Grey Knights">Grey Knights</option>
    <option value="Black Templars">Black Templars</option>
    <option value="Deathwatch">Deathwatch</option>
    <option value="Adeptus Mechanicus">Adeptus Mechanicus</option>
    <option value="Imperial Knights">Imperial Knights</option>
    <option value="Astra Militarum">Astra Militarum</option>
    <option value="Adeptus Custodes">Adeptus Custodes</option>
    <option value="Adepta Sororitas">Adepta Sororitas</option>
    <option value="Imperial Agents">Imperial Agents</option>
    <option value="Chaos Space Marines">Chaos Space Marines</option>
    <option value="Chaos Daemons">Chaos Daemons</option>
    <option value="Thousand Sons">Thousand Sons</option>
    <option value="Death Guard">Death Guard</option>
    <option value="World Eaters">World Eaters</option>
    <option value="Emperor’s Children">Emperor’s Children</option>
    <option value="Chaos Knights">Chaos Knights</option>
    <option value="Aeldari">Aeldari</option>
    <option value="Drukhari">Drukhari</option>
    <option value="Necrons">Necrons</option>
    <option value="Orks">Orks</option>
    <option value="T’au Empire">T’au Empire</option>
    <option value="Tyranids">Tyranids</option>
    <option value="Genestealer Cults">Genestealer Cults</option>
    <option value="Leagues of Votann">Leagues of Votann</option>
    </select>
  </div> */}

  /*   *front Register*
  <div className="col-12">
      <label className="form-label">Settings:</label>
        {formik.touched.settings && formik.errors.settings && (
          <p className="text-danger">
            {typeof formik.errors.settings === "string"
            ? formik.errors.settings
            : "Please select at least one setting"}
          </p>
        )}
    <div className="row g-2">
      {SETTINGS.map((s) => {
       const checked = (formik.values.settings as string[]).includes(s);
        return (
        <div className="col-12 col-sm-6 col-lg-4" key={s}>
          <label className="form-check-label d-flex align-items-center gap-2">
            <input
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={() => toggleSetting(s)}
            />
            <span>{s}</span>
        </label>
     </div>
    );
  })}
  </div>
</div>*/ 


/*  *front Dashbort narrative*

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
      await confirmBattle(b._id);
      toast.success("Accepted");
      navigate(`/match/${b._id}`);
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
                   <div className="d-flex gap-2 align-items-center">
                   <span className="badge text-dark" style={{ background: "#ffd000" }}>
                    pending
                   </span>
                   <button className="btn btn-sm btn-accent-outline" onClick={()=>navigate(`/match/${m._id}`)}>
                    Open
                   </button>
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

export default Dashboard;*/ 

/*   *back authController narrative*

const User = require("../users/mongodb/Users");
const { generateUserPassword, comparePassword } = require("../users/helpers/bcrypt");
const jwt = require("jsonwebtoken");
const PLANET_POOL = require("../models/planetList");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

function getRandomPlanets(pool, count = 3) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const register = async (req, res) => {
  try {
    const { name, email, password, phone, region, faction, address } = req.body;
    const shuffled = [...PLANET_POOL].sort(() => 0.5 - Math.random());
    const homeland = shuffled[0];
    const planets = shuffled.slice(0, 3);
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = generateUserPassword(password);

  const user = new User({
  name,
  email,
  password: hash,
  phone,
  region,
  address: address || undefined,  
  faction,                         
  points: 1000,
  planets,
  homeland,
  spaceports: 0,
  epicHeroes: 0,
  isStatic: false
  });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User created",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        address: user.address, 
        role: user.role,
        points: user.points,
        planets: user.planets,  
        homeland: user.homeland, 
        faction: user.faction, 
        factionText: user.factionText,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Incorrect login or password" });

    const match = comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect login or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Successfully logged in",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        role: user.role,
        points: user.points,
        planets: user.planets,  
        homeland: user.homeland, 
        faction: user.faction,
        factionText: user.factionText, 
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

module.exports = { register, login };
*/

/*  *front normalizeUser narrative*
  
import type { unnormalizedUser } from "./unnormalizedUser";
import type { User } from "./User";

export function normalizeUser(values: unnormalizedUser):User {
    return {
        name:{
            first: values.first,
            last: values.last
        },
        email: values.email,
        password: values.password,
        phone: values.phone,
        region: values.region,
        address: {
            country: values.country,
            city: values.city,
        },
        faction: values.faction 
    };
}
*/ 

/*  *front unnormalizedUser narrative*
export interface unnormalizedUser {
    first: string;
    last: string;
    email: string;
    password: string;
    phone: string;
    region: string;
    country: string;
    city: string;
    faction: string; 
}
*/

/* *front User narrative*
import type { UserAddress } from "./UserAddress";
import type { UserName } from "./UserName";

export interface User {
    name: UserName;
    email: string;
    password: string;
    phone: string;
    region: string;   
    address: UserAddress;
    faction: string; 
}
*/

/* *front AuthContext narrative*
import { createContext, useState, useContext, useEffect, type FunctionComponent, type ReactNode } from 'react';
import { getMe, loginUser, registerUser } from '../services/userService';
import { setToken } from '../services/http';

type ApiName = { first: string; last: string };
type ApiUser = {
  id: string;
  name: ApiName;
  email: string;
  region: string;
  role: 'player' | 'admin';
  points: number;
  faction: string;
  address:{
    city: string;
    country: string;
  };
  settings: string[];
  homeland: string;
  planets: string[];
};

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerAndLogin: (payload: any) => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setTok] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) {
      setTok(t);
      setToken(t);
    }
    if (u) {
      try { setUser(JSON.parse(u) as ApiUser); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password); 
    setTok(data.token);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

 

  const registerAndLogin = async (payload: any) => {
    const reg = await registerUser(payload);
    if (reg?.token && reg?.user) {
      setTok(reg.token);
      setToken(reg.token);
      setUser(reg.user);
      localStorage.setItem('token', reg.token);
      localStorage.setItem('user', JSON.stringify(reg.user));
      return;
    }
    await login(payload.email, payload.password);
  };

  const refreshMe = async () => {
    const me = await getMe();
    setUser(me);
    localStorage.setItem('user', JSON.stringify(me));
  };

  const logout = () => {
    setTok(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, registerAndLogin, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

*/

/* *front inviteService narrative setting делаем обязательным*
import { api } from "./http";
const ROOT = import.meta.env.VITE_API_ROOT;

export type InviteDTO = {
  _id: string;
  fromUser?: any;
  toUser?: any;
  setting: string;
  message?: string;
  status: "pending"|"accepted"|"declined"|"canceled";
  createdAt: string;
};

export async function createInvite(toUser: string, setting: string, message = "") {
  const { data } = await api.post(`${ROOT}/api/invites/create`, { toUser, setting, message });
  return data.invite as InviteDTO;
}

export async function getIncomingInvites() {
  const { data } = await api.get(`${ROOT}/api/invites/incoming`);
  return (data.invites || []) as InviteDTO[];
}

export async function getOutgoingInvites() {
  const { data } = await api.get(`${ROOT}/api/invites/outgoing`);
  return (data.invites || []) as InviteDTO[];
}

export async function acceptInvite(id: string) {
  const { data } = await api.post(`${ROOT}/api/invites/${id}/accept`);
  return data.invite as InviteDTO;
}

export async function declineInvite(id: string) {
  const { data } = await api.post(`${ROOT}/api/invites/${id}/decline`);
  return data.invite as InviteDTO;
}

export async function cancelInvite(id: string) {
  const { data } = await api.post(`${ROOT}/api/invites/${id}/cancel`);
  return data.invite as InviteDTO;
}


*/

/* *front PlayerCard narrative*
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
    country: string;
  };
  homeland: string;
  planets: string[];
  factionText?: string;
};

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

  const [factionText, setFactionText] = useState<string>(u?.factionText || "");
  const [saving, setSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);

 
  useEffect(() => {
    setFactionText(u?.factionText || "");
    setSavedOnce(false);
  }, [u?.factionText]);

  if (!u) return <div className="container py-4">Not authenticated</div>;

  const canSave = factionText.trim() !== (u.factionText || "").trim() && !saving;

 const onSave = async () => {
  try {
    setSaving(true);
    const updated = await updateMe({ factionText }); 
    if (typeof auth?.refreshMe === "function") {
      await auth.refreshMe();
    } else {
      try {
        const userObj = (updated && updated.name && updated) || updated?.user || null;
        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      } catch {}
    }
    if (updated?.factionText) {
      setFactionText(updated.factionText);
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
                    <th>Country</th>
                    <td>{u.address?.country || "-"}</td>
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
          <div className="mt-4">
         <div className="mb-2"><b>Faction Notes — preview</b></div>
         <div
           className="p-3 border rounded "
           style={{ whiteSpace: "pre-wrap", minHeight: 120 }}>
           {factionText.trim()
           ? factionText
           : <span className="text-muted">No notes yet…</span>}
          </div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
*/

/*
  *back userSchema narrative Users.js*
const mongoose = require("mongoose");
const Name = require("../../helpers/mongodb/Name");
const { PHONE, EMAIL } = require("../../helpers/mongodb/mongoseValidations");
const Image = require("../../helpers/mongodb/image");
const Address = require("../../helpers/mongodb/Address");
const Faction = require("../../helpers/mongodb/Faction");
const Region = require("../../helpers/mongodb/Region");

const userSchema = new mongoose.Schema({
  name: Name,
  phone: PHONE,
  email: EMAIL,
  password: {
    type: String,
    minLength: 7,
    required: true,
    trim: true,
  },
  image: Image,
  address: Address,
  region: Region,
  role: { type: String, enum: ['player', 'admin'], default: 'player' },
  region: {
    type: String,
    required: true,
    trim: true,
  },
  points: {
    type: Number,
    default: 1000,
  },
  planets: {
    type: [String], 
    default: [],
  },
  lastAttackedAt: {
  type: Date,
  default: null,
},
spaceports: {
  type: Number, 
  default: 0
},
epicHeroes: {
  type: Number, 
  default: 0
},
isStatic: {
  type: Boolean,
  default: false 
},
homeland: {
  type: String,
  default: "",
  required: false
},
blockedUntil: { 
  type: Date,
  default: null
},
defeatsOnHomeland: {
  type: Number,
  default: 0,
},
_lastHomelandDefeat: {
  type: Date,
  default: null
},
faction: Faction,
rosterText: {
  type: String,
  default: ''
},
factionText: { 
  type: String, 
  default: "" 
},
settings: {
    type: [String],
    default: [],    
  },

}, { timestamps: true });

const User = mongoose.model("user", userSchema);
module.exports = User;
*/

/**  <hr className="my-4" />
      <p className="small text-muted">
        Have feedback or found a bug? Let us know so we can improve the experience for everyone.
      </p> */

      /* updates campaighn 
       <li>Special narrative Campaign.</li>
            <li>Attack and Defend Planets.</li>
            <li>New Factions.</li>
            <li>PTS scoring protocol.</li> 
       <li>Campaign Profile.</li> 

       <li>Player levels/experience tags</li>
          <li>Game history & simple rating tools</li>
          <li>Random Warhammer quotes on Dashboard</li>
          
      */
/* publicRoutes.js old */
// router.get("/players", async (req, res) => {
//   try {
//     const { setting, region, country, city } = req.query;
//     const criteria = {};
//     if (setting) criteria.settings = setting;         
//     if (region) criteria.region = region;
//     if (country) criteria["address.country"] = country;
//     if (city) criteria["address.city"] = city;

//     const players = await User.find(criteria)
//       .select("name email region address settings image bio")
//       .lean();

//     res.json({ players });
//   } catch (e) {
//     res.status(500).json({ message: "Failed to load players", error: e.message });
//   }
// }); 


/* inviteController.js old*/
// exports.createInvite = async (req, res) => {
//   try {
//     const fromUser = req.user?.id;
//     const { targetUserId, message, slot } = req.body;
//     if (!fromUser) return res.status(401).json({ message: "Not authenticated" });
//     if (!targetUserId) return res.status(400).json({ message: "targetUserId is required" });
//     if (!slot || typeof slot.day !== "number" || slot.day < 0 || slot.day > 6) {
//       return res.status(400).json({ message: "slot.day must be 0..6" });
//     }
//     if (String(fromUser) === String(targetUserId)) {
//       return res.status(400).json({ message: "You cannot invite yourself" });
//     }
//     const target = await User.findById(targetUserId).select("availability");
//     if (!target) return res.status(404).json({ message: "Target not found" });
//     const av = target.availability || { busyAllWeek:false, days:[] };
//     if (av.busyAllWeek) return res.status(400).json({ message: "Target is busy all week" });
//     const dayCfg = (av.days || []).find(d => d.day === slot.day);
//     if (!dayCfg) return res.status(400).json({ message: "Day is not available" });
//     const conflict = await Invite.findOne({
//       toUser: targetUserId,
//       "slot.day": slot.day,
//       status: { $in: ["pending", "accepted"] }
//     });
//     if (conflict) return res.status(409).json({ message: "Day already booked" });
//     const invite = await Invite.create({
//       fromUser,
//       toUser: targetUserId,
//       message: message || "",
//       slot: { day: slot.day, from: slot.from || null, to: slot.to || null }
//     });
//     res.status(201).json({ invite });
//   } catch (e) {
//     console.error("createInvite error:", e);
//     res.status(500).json({ message: "Failed to create invite" });
//   }
// };

/** * front inviteService old
 // export async function createInvite(targetUserId: string, slot: { day:number; from?:string; to?:string }, message?: string) {
//   const { data } = await api.post(`/api/invites/create`, { targetUserId, slot, ...(message ? { message } : {}) });
//   return data.invite;
// }

 */

/*  *front players old invite code*
 // const openInvite = async (toUserId: string, name: string) => {
  //   try {
  //     setPanel({ open:true, userId: toUserId, name, loading: true });
  //     const av = await getPublicAvailability(toUserId);
  //     const firstDay = av?.busyAllWeek ? undefined : av?.days?.[0]?.day;
  //     setPanel(m => ({
  //       ...m,
  //       availability: av,
  //       day: typeof firstDay === "number" ? firstDay : undefined,
  //       rangeIdx: 0,
  //       loading:false
  //     }));
  //   } catch (e:any) {
  //     setPanel(m => ({ ...m, loading:false }));
  //     toast.error(e?.response?.data?.message || "Failed to load availability");
  //   }
  // };
*/


/*
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
                placeholder="e.g. England"
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">City:</label>
              <input
                className="form-control"
                value={filters.city}
                onChange={(e)=>updateFilter("city", e.target.value)}
                placeholder="e.g. London"
              />
            </div>
            <div className="col-12 col-md-2">
            <label className="form-label">Day:</label>
       <select
         className="form-select"
         value={typeof filters.day === "number" ? String(filters.day) : ""}
         onChange={(e)=>updateFilter("day", e.target.value ? e.target.value : "")}
        >
       <option value="">Any</option>
    {DAY_NAMES.map((d, i)=> <option key={i} value={i}>{d}</option>)}
  </select>
</div>
<div className="col-12 col-md-2">
  <label className="form-label">From:</label>
  <input
    type="time"
    className="form-control"
    value={filters.from}
    onChange={(e)=>updateFilter("from", e.target.value)}
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
                      <div>
                        <b>Setting:</b>{" "}
                        {filters.setting
                        ? (p.settings?.includes(filters.setting) ? filters.setting : "-")
                        : (p.settings?.length ? p.settings.join(", ") : "-")}
                     </div>
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
                          <div className="small"><b>Setting:</b> {panel.setting}</div>
                          </div>

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
                      onClick={()=>openInvite(
                      p._id,
                      `${p.name?.first||""} ${p.name?.last||""}`.trim(),
                      p                                  
                      )}
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
*/ 