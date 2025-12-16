import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../services/userService";
import { uploadMyPhoto } from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/ProfileEdit.css";

const SETTINGS = [ "Warhammer 40k","Age of Sigmar","The Horus Heresy","Kill Team","Necromunda",
  "The Old World","Underworlds","Warcry","Blood Bowl","Legions Imperialis","Adeptus Titanicus",
  "Aeronautica Imperialis","Warhammer Quest","Middle-Earth" ];
const REGIONS = [
  "North America",
  "Caribbean",
  "Central America",
  "South America",
  "Africa",
  "Middle East",
  "Europe",
  "Asia",
  "Australia and Oceania",
];
const e164 = /^\+?[1-9]\d{6,14}$/;
const tgUser = /^[a-zA-Z0-9_]{5,32}$/;
const schema = yup.object({
  name: yup.object({
    first: yup.string().min(2).max(256).required(),
    last:  yup.string().min(2).max(256).required(),
  }),
  region: yup.string().oneOf(REGIONS).required("Region is required"),
  address: yup.object({
    country: yup.string().required(),
    city:    yup.string().required(),
  }),
  settings: yup.array().of(yup.string().oneOf(SETTINGS)).min(1),
  image: yup.object({
    url: yup
      .string()
      .nullable()
      .test("url-or-path", "Invalid image path", (v) => {
        if (!v) return true;
        if (/^https?:\/\//i.test(v)) return true;
        if (v.startsWith("/uploads/")) return true;
        return false;
      })
      .optional(),
  }),
  bio: yup.string().max(1000).optional(),
  contacts: yup.object({
    phoneE164: yup.string().matches(e164, "Use +972501234567").optional().nullable(),
    telegramUsername: yup.string().matches(tgUser, "5–32, letters/digits/_").optional().nullable(),
  })
});

const ProfileEdit: React.FC = () => {
  const { user, refreshMe } = useAuth(); 



  const missingMine = useMemo(() => {
    const m: string[] = [];
    if (!user?.region) m.push("Region");
    if (!user?.address?.country) m.push("Country");
    if (!user?.address?.city) m.push("City");
    if (!user?.settings?.length) m.push("Game settings");
    return m;
  }, [user]);

  const navigate = useNavigate();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: { first: user?.name?.first || "", last: user?.name?.last || "" },
      region: user?.region || "",
      address: { country: user?.address?.country || "", city: user?.address?.city || "" },
      settings: user?.settings || [],
      bio: user?.bio || "",
      contacts: {
        phoneE164: user?.contacts?.phoneE164 || "",
        telegramUsername: user?.contacts?.telegramUsername || ""
      }
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const patch = {
          ...values,
          contacts: {
            ...values.contacts,
            phoneE164: values.contacts.phoneE164?.replace(/(?!^\+)\D/g, "") || "",
            telegramUsername: values.contacts.telegramUsername?.replace(/^@/, "") || ""
          }
        };
        await updateMe(patch);
        toast.success("Profile updated");
        await refreshMe();
        navigate("/player-card");
      } catch (e:any) {
        toast.error(e?.response?.data?.message || "Update failed");
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="container py-3 edit-page">
      <h2>Edit Profile</h2>

{missingMine.length > 0 && (
      <div className="alert alert-info mb-4">
        <b>Almost done!</b>
        <div className="mt-1">
          To send invites, please complete:
          <ul className="mb-0 mt-2">
            {missingMine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    )}

      <form className="form-row row g-3" onSubmit={formik.handleSubmit}>

 <div className="edit-page-form-photo">
  <div className="edit-photo-wrapper">
    <div className="edit-photo-frame">
      {user?.image?.url ? (
        <img
          src={user.image.url}
          alt="profile"
        />
      ) : (
        <div className="edit-photo-placeholder">
          No Photo
        </div>
      )}
    </div>

<label htmlFor="photo-input" className="edit-photo-fab">
  <svg xmlns="http://www.w3.org/2000/svg" 
  height="24px" 
  viewBox="0 -960 960 960" 
  width="24px" 
  fill="#000000">
  <path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>
</label>

    <input
      id="photo-input"
      type="file"
      accept="image/*"
      className="hidden-file-input"
      onChange={async (e) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;
        try {
          await uploadMyPhoto(file);
          toast.success("Photo uploaded");
          await refreshMe();
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Upload failed");
        }
      }}
    />
  </div>
</div>

  <div className="edit-page-form">
      <textarea
        className="form-control"
        rows={6}
        name="bio"
        value={formik.values.bio}
        onChange={formik.handleChange}
        placeholder="About me info:"
      />
</div>
  
<div className="edit-page-form">
  <div className="edit-grid">
    <div>
      <label className="form-label">First name:</label>
      <input className="form-control" name="name.first"
        value={formik.values.name.first}
        onChange={formik.handleChange}
      />
    </div>

    <div>
      <label className="form-label">Last name:</label>
      <input className="form-control" name="name.last"
        value={formik.values.name.last}
        onChange={formik.handleChange}
      />
    </div>

    <div>
      <label className="form-label">WhatsApp:</label>
      <input
        className="form-control"
        name="contacts.phoneE164"
        value={formik.values.contacts.phoneE164}
        onChange={formik.handleChange}
      />
    </div>

    <div>
      <label className="form-label">Telegram Username:</label>
      <input
        className="form-control"
        name="contacts.telegramUsername"
        value={formik.values.contacts.telegramUsername}
        onChange={formik.handleChange}
        placeholder="Without @"
      />
    </div>

    <div>
      <label className="form-label">Region:</label>
      <select
        className="form-control"
        name="region"
        value={formik.values.region}
        onChange={formik.handleChange}
      >
        <option value="">Select region</option>
        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
    </div>

    <div>
      <label className="form-label">Country:</label>
      <input className="form-control" name="address.country"
        value={formik.values.address.country}
        onChange={formik.handleChange}
      />
    </div>

    <div>
      <label className="form-label">City:</label>
      <input className="form-control" name="address.city"
        value={formik.values.address.city}
        onChange={formik.handleChange}
      />
    </div>
  </div>
</div>
    
<div className="edit-page-form">
<div className="col-12">
  <label className="form-label">Settings:</label>
  <div className="settings-grid">
    {SETTINGS.map((s) => {
      const checked = (formik.values.settings as string[]).includes(s);
      return (
        <label
          key={s}
          className={`setting-card ${checked ? "selected" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <input
            type="checkbox"
            value={s}
            checked={checked}
            onChange={() => {
              const arr = formik.values.settings as string[];
              formik.setFieldValue(
                "settings",
                checked ? arr.filter((x) => x !== s) : [...arr, s]
              );
            }}
          />
          <span>{s}</span>
        </label>
      );
    })}
  </div>
</div>

        <div className="col-12 edit-btn">
          <button 
          className=" btn btn-success"
          type="submit"
          disabled={formik.isSubmitting}>
            Save
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
