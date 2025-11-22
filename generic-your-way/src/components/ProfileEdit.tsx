import React from "react";
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
      <form className="row g-3 edit-page-form" onSubmit={formik.handleSubmit}>

 
        <div className="col-12">
          <label className="form-label">Profile Photo:</label>
          {user?.image?.url && (
            <div className="mt-2">
              <img
                src={user.image.url}
                alt="profile"
                style={{ maxWidth: 180, borderRadius: 100 }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={async (e) => {
              const file = e.currentTarget.files?.[0];
              if (!file) return;
              try {
                await uploadMyPhoto(file);
                toast.success("Photo uploaded");
                await refreshMe(); 
              } catch (err:any) {
                toast.error(err?.response?.data?.message || "Upload failed");
              }
            }}
          />
        </div>
        
        <div className="col-12">
          <label className="form-label">About me:</label>
          <textarea className="form-control" rows={4} name="bio"
          value={formik.values.bio} onChange={formik.handleChange}/>
        </div>

        <div className="col-md-6">
          <label className="form-label">First name:</label>
          <input className="form-control" name="name.first"
          value={formik.values.name.first} onChange={formik.handleChange}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Last name:</label>
          <input className="form-control" name="name.last"
          value={formik.values.name.last} onChange={formik.handleChange}/>
        </div>

        <div className="col-md-6">
          <label className="form-label">WhatsApp:</label>
          <input className="form-control" name="contacts.phoneE164"
                 placeholder="Your WhatsApp number."
                 value={formik.values.contacts.phoneE164}
                 onChange={formik.handleChange}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Telegram Username:</label>
          <input className="form-control" name="contacts.telegramUsername"
                 placeholder="my_nick (Without @)"
                 value={formik.values.contacts.telegramUsername}
                 onChange={formik.handleChange}/>
        </div>

  <div className="col-md-4">
  <label className="form-label">Region:</label>
  <select
    className="form-control"
    name="region"
    value={formik.values.region}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
  >
    <option value="" disabled>Select region:</option>
    {REGIONS.map(r => (
      <option key={r} value={r}>{r}</option>
    ))}
  </select>
  {formik.touched.region && formik.errors.region && (
    <p className="text-danger">{formik.errors.region as string}</p>
  )}
 </div>
        <div className="col-md-4">
          <label className="form-label">Country:</label>
          <input className="form-control" name="address.country"
                 value={formik.values.address.country} onChange={formik.handleChange}/>
        </div>
        <div className="col-md-4">
          <label className="form-label">City:</label>
          <input className="form-control" name="address.city"
                 value={formik.values.address.city} onChange={formik.handleChange}/>
        </div>

        
       

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

        <div className="col-12">
          <button className="btn btn-success" type="submit" disabled={formik.isSubmitting}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
