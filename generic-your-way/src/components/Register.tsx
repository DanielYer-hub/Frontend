import { type FormikValues, useFormik } from "formik";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import type { unnormalizedUser } from "../interface/user/unnormalizedUser";
import { normalizeUser } from "../interface/user/normalizeUser";
import { sucessMassage } from "../services/feedbackService";
import { useAuth } from "../context/AuthContext"; 
import "./css/Register.css";
import { contactsSchema } from "../validation/contactsValidation";

const SETTINGS = [
  "Warhammer 40k",
  "Age of Sigmar",
  "The Horus Heresy",
  "Kill Team",
  "Necromunda",
  "The Old World",
  "Underworlds",
  "Warcry",
  "Blood Bowl",
  "Legions Imperialis",
  "Warhammer Quest",
  "Middle-Earth",
];

const Register: FunctionComponent = () => {
  const navigate = useNavigate();
  const { registerAndLogin } = useAuth(); 
  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      first: "", last: "", email: "", password: "",
      region: "", country: "", city: "", 
      settings: [] as string[],
     contacts: {
     phoneE164: "",
     telegramUsername: ""
   }
    },
    validationSchema: yup.object({
      first: yup.string().min(2).max(256).required(),
      last: yup.string().min(2).max(256).required(),
      email: yup.string().email().min(5).required(),
      password: yup
        .string()
        .min(8).max(50)
        .required()
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/, 
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'),
      region: yup.string().oneOf([
      "North America",
      "Caribbean",
      "Central America",
      "South America",
      "Africa",
      "Middle East",
      "Europe",
      "Asia",
      "Australia and Oceania"
      ]).required("Region is required"),
      country: yup.string().min(2).max(256).required(),
      city: yup.string().min(2).max(256).required(),
      settings: yup
        .array()
        .of(yup.string().oneOf(SETTINGS))
        .min(1, "Select at least one setting")
        .required("Settings is required"),
     contacts: contactsSchema.required(),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const normalized = normalizeUser(values as unknown as unnormalizedUser);

        await registerAndLogin(normalized); 
        sucessMassage(`${normalized.email} registered successfully`);
        navigate("/dashboard");
      } catch (e: any) {
        console.error("Registration failed:", e?.response?.data || e.message || e);
        alert(e?.response?.data?.message || "Registration failed");
      } finally {
        setSubmitting(false);
        resetForm();
      }
    }
  });

   const toggleSetting = (s: string) => {
    const current = formik.values.settings as string[];
    const next = current.includes(s) ? current.filter((x) => x !== s) : [...current, s];
    formik.setFieldValue("settings", next);
  };

return ( 
<>
<div className="register-page">
  <div className="page-body">
<div className="container">
   <main className="welcome-page-content">
        <img src="/content/gyw.png" alt="GYW logo" className="logo" />
  </main>
<form className="row g-3" onSubmit={formik.handleSubmit}>
   <div className="col-md-6">
    <label htmlFor="first" className="form-label">First Name:</label>
    <input 
    name="first"
    type="text" 
    className="form-control" 
    id="first"
    value={formik.values.first}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

   <div className="col-md-6">
    <label htmlFor="last" className="form-label">Last Name:</label>
    <input 
    name="last"
    type="text" 
    className="form-control" 
    id="last"
    value={formik.values.last}  
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="email" className="form-label">Email:</label>
    {formik.touched.email && formik.errors.email && (
    <p className="text-danger">{formik.errors.email}</p>
    )}
    <input 
    name="email"
    type="email" 
    className="form-control" 
    id="email"
    value={formik.values.email} 
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="password" className="form-label">Password:</label>
     {formik.touched.password && formik.errors.password && (
      <p className="text-danger">{formik.errors.password}</p>
      )}
    <input 
    name="password"
    type="password" 
    className="form-control" 
    id="password"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
  <label htmlFor="region" className="form-label">Region:</label>
  {formik.touched.region && formik.errors.region && (
    <p className="text-danger">{formik.errors.region}</p>
  )}
  <select
    name="region"
    id="region"
    className="form-control"
    value={formik.values.region}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
  >
    <option value="" disabled>Select region</option>
    <option value="North America">North America</option>
    <option value="Caribbean">Caribbean</option>
    <option value="Central America">Central America</option>
    <option value="South America">South America</option>
    <option value="Africa">Africa</option>
    <option value="Middle East">Middle East</option>
    <option value="Europe">Europe</option>
    <option value="Asia">Asia</option>
    <option value="Australia and Oceania">Australia and Oceania</option>
  </select>
</div>

 <div className="col-md-6">
    <label htmlFor="country" className="form-label">Country:</label>
    {formik.touched.country && formik.errors. country && (
    <p className="text-danger">{formik.errors. country}</p>
    )}
    <input 
    name="country"
    type="text" 
    className="form-control" 
    id="country"
    autoComplete="on"
    value={formik.values.country}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="city" className="form-label">City:</label>
    {formik.touched.city && formik.errors.city && (
    <p className="text-danger">{formik.errors.city}</p>
    )}
    <input 
    name="city"
    type="text" 
    className="form-control" 
    id="city"
    autoComplete="on"
    value={formik.values.city}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

 <div className="col-md-6">
  <label className="form-label">Contacts:</label>
  <div className="row g-2">
    <div className="col-md-12">
      <input
        className="form-control"
        name="contacts.phoneE164"
        placeholder="Your WhatsApp number."
        value={formik.values.contacts.phoneE164}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.contacts?.phoneE164 &&
        (formik.errors.contacts as any)?.phoneE164 && (
          <p className="text-danger">
            {(formik.errors.contacts as any).phoneE164}
          </p>
      )}
    </div>

    <div className="col-md-12">
      <input
        className="form-control"
        name="contacts.telegramUsername"
        placeholder="Telegram username (e.g. my_nick)"
        value={formik.values.contacts.telegramUsername}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.contacts?.telegramUsername &&
        (formik.errors.contacts as any)?.telegramUsername && (
          <p className="text-danger">
            {(formik.errors.contacts as any).telegramUsername}
          </p>
      )}
    </div>
  </div>
  {formik.touched.contacts && typeof formik.errors.contacts === "string" && (
    <p className="text-danger">{formik.errors.contacts}</p>
  )}
</div>

   <div className="col-12">
    <label className="form-label">Settings:</label>
    {formik.touched.settings && formik.errors.settings && (
      <p className="text-danger">
      {typeof formik.errors.settings === "string"
      ? formik.errors.settings
      : "Please select at least one setting"}
      </p>
      )}
      <div className="settings-grid">
      {SETTINGS.map((s) => {
      const checked = (formik.values.settings as string[]).includes(s);
      return (
        <div
        key={s}
        className={`setting-card ${checked ? "selected" : ""}`}
        onClick={() => toggleSetting(s)}
        >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleSetting(s)}
          />
          <span>{s}</span>
           </div>
          );
         })}
        </div>
    </div>
  
  <div className="col-12">
    <button 
    disabled={!formik.dirty || !formik.isValid }
    type="submit" 
    className="btn btn-success">
    REGISTER
    </button>
  </div>
</form>
</div>
</div>
 <footer className="login-footer border-top">
        <div className="container py-3 text-center small">
          © {new Date().getFullYear()} Generic Your Way by Daniel Yerema.
        </div>
  </footer>
</div>
</>
);
}
 
export default Register;