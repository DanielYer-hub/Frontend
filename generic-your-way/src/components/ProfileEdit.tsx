import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../services/userService";
import { uploadMyPhoto } from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/ProfileEdit.css";
import DeleteAccountModal from "../components/DeleteAccountBlock";
import { track } from "../utils/analytics";
import { listCitiesByCountry, listCountries } from "../services/locationService";


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

type SearchableSelectProps = {
  value: string;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  errorLabel?: string | null;
  emptyLabel: string;
  onChange: (value: string) => void;
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  options,
  placeholder,
  disabled,
  errorLabel,
  emptyLabel,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) return options;
    return options.filter((opt) => opt.toLowerCase().startsWith(q));
  }, [options, query]);

  return (
    <div className="position-relative" ref={containerRef}>
      <input
        className="form-control"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && !disabled && (
        <div
          className="list-group position-absolute w-100"
          style={{ zIndex: 5, maxHeight: 220, overflowY: "auto" }}
        >
          <button
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => {
              setQuery("");
              onChange("");
              setOpen(false);
            }}
          >
            {emptyLabel}
          </button>
          {errorLabel && (
            <div className="list-group-item text-danger">{errorLabel}</div>
          )}
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`list-group-item list-group-item-action${
                opt === value ? " active" : ""
              }`}
              onClick={() => {
                setQuery(opt);
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
          {!errorLabel && filtered.length === 0 && (
            <div className="list-group-item text-muted">No matches</div>
          )}
        </div>
      )}
    </div>
  );
};

const ProfileEdit: React.FC = () => {
  const { user, refreshMe } = useAuth(); 
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const prevCountryRef = useRef<string | null>(null);
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
        phoneE164:
          user?.contacts?.phoneE164 === "+"
            ? ""
            : user?.contacts?.phoneE164 || "",
        telegramUsername: user?.contacts?.telegramUsername || ""
      }
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const tg = (values.contacts.telegramUsername || "")
          .replace(/^@/, "")
          .trim();

        
        const rawPhone = (values.contacts.phoneE164 || "").trim();
        const digits = rawPhone.replace(/\D/g, "");
        const phoneE164 = digits ? `+${digits}` : "";

        const patch = {
          name: values.name,
          region: values.region,
          address: values.address,
          settings: values.settings,
          bio: values.bio,
          contacts: {
            phoneE164,
            telegramUsername: tg,
          },
        };
        await updateMe(patch);
        track("Profile: Updated");
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
  const countryOptions = useMemo(() => {
    const current = formik.values.address.country;
    if (current && !countries.includes(current)) {
      return [current, ...countries];
    }
    return countries;
  }, [countries, formik.values.address.country]);
  const cityOptions = useMemo(() => {
    const current = formik.values.address.city;
    if (current && !cities.includes(current)) {
      return [current, ...cities];
    }
    return cities;
  }, [cities, formik.values.address.city]);

  useEffect(() => {
    let active = true;
    setCountriesLoading(true);
    setCountriesError(null);
    listCountries()
      .then((list) => {
        if (active) setCountries(list);
      })
      .catch((err: any) => {
        if (!active) return;
        setCountriesError(err?.message || "Failed to load countries");
        toast.error("Failed to load countries");
      })
      .finally(() => {
        if (active) setCountriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const country = formik.values.address.country;
    const prev = prevCountryRef.current;
    if (prev && prev !== country) {
      formik.setFieldValue("address.city", "");
    }
    prevCountryRef.current = country;
  }, [formik.values.address.country]);

  useEffect(() => {
    const country = formik.values.address.country;
    if (!country) {
      setCities([]);
      setCitiesError(null);
      return;
    }
    let active = true;
    setCitiesLoading(true);
    setCitiesError(null);
    listCitiesByCountry(country)
      .then((list) => {
        if (active) setCities(list);
      })
      .catch((err: any) => {
        if (!active) return;
        setCitiesError(err?.message || "Failed to load cities");
        toast.error("Failed to load cities");
      })
      .finally(() => {
        if (active) setCitiesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [formik.values.address.country]);

  return (
    <div className="container py-3 edit-page">
      <h2>Edit Profile</h2>
      {missingMine.length > 0 && (
      <div className="alert alert-info mb-4">
        <b>Almost done!</b>
        <div className="mt-1">
          To send invites, please complete:
          <ul className="mb-2 mt-2">
            {missingMine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          This helps other players find and contact you.
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
          track("Profile: Photo Uploaded");
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
      <SearchableSelect
        value={formik.values.address.country}
        options={countryOptions}
        placeholder={countriesLoading ? "Loading countries..." : "Select country"}
        disabled={countriesLoading}
        errorLabel={countriesError}
        emptyLabel="Select country"
        onChange={(value) => formik.setFieldValue("address.country", value)}
      />
    </div>

    <div>
      <label className="form-label">City:</label>
      <SearchableSelect
        value={formik.values.address.city}
        options={cityOptions}
        placeholder={citiesLoading ? "Loading cities..." : "Select city"}
        disabled={!formik.values.address.country || citiesLoading}
        errorLabel={citiesError}
        emptyLabel="Select city"
        onChange={(value) => formik.setFieldValue("address.city", value)}
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

 <div className="card mt-4 dzone">
  <div className="card-body dzone-row">
    <div className="dzone-text">
      <h5 className="mb-0">Danger zone:</h5>
    </div>

    <div className="dzone-actions">
      <DeleteAccountModal buttonClassName="btn btn-outline-danger" />
    </div>
  </div>
</div>


    </div>
  );
};

export default ProfileEdit;
