import { type FormikValues, useFormik } from "formik";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import type { unnormalizedUser } from "../interface/user/unnormalizedUser";
import { normalizeUser } from "../interface/user/normalizeUser";
import { sucessMassage } from "../services/feedbackService";
import { useAuth } from "../context/AuthContext"; 

const Register: FunctionComponent = () => {
  const navigate = useNavigate();
  const { registerAndLogin } = useAuth(); 

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      first: "", last: "", email: "", password: "",
      phone: "", region: "", country: "", city: "", street: "",
      faction: "",
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
      phone: yup.string().min(9).max(15).required(),
      region: yup.string().min(2).max(256).required(),
      country: yup.string().min(2).max(256).required(),
      city: yup.string().min(2).max(256).required(),
      street: yup.string().min(2).max(256).required(),
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
    
return ( 
<>
<div className="container">
<form className="row g-3" onSubmit={formik.handleSubmit}>
   <div className="col-md-6">
    <label htmlFor="first" className="form-label">First Name</label>
    <input 
    name="first"
    type="text" 
    className="form-control" 
    id="first"
    autoComplete="on"
    value={formik.values.first}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

   <div className="col-md-6">
    <label htmlFor="last" className="form-label">Last Name</label>
    <input 
    name="last"
    type="text" 
    className="form-control" 
    id="last"
    autoComplete="on"
    value={formik.values.last}  
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="email" className="form-label">Email</label>
    {formik.touched.email && formik.errors.email && (
    <p className="text-danger">{formik.errors.email}</p>
    )}
    <input 
    name="email"
    type="email" 
    className="form-control" 
    id="email"
    autoComplete="on"
    value={formik.values.email} 
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="password" className="form-label">Password</label>
     {formik.touched.password && formik.errors.password && (
      <p className="text-danger">{formik.errors.password}</p>
      )}
    <input 
    name="password"
    type="password" 
    className="form-control" 
    id="password"
    autoComplete="on"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="phone" className="form-label">Phone</label>
    {formik.touched.phone && formik.errors.phone && (
    <p className="text-danger">{formik.errors.phone}</p>
    )}
    <input 
    name="phone"
    type="tel" 
    className="form-control"
    id="phone"
    autoComplete="on"
    value={formik.values.phone}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
     />
  </div>

  <div className="col-12">
    <label htmlFor="region" className="form-label">Region</label>
    { formik.touched.region && formik.errors.region && (
    <p className="text-danger">{formik.errors.region}</p>
    )}
    <input 
    name="region"
    type="text" 
    className="form-control" 
    id="region"
    autoComplete="on"
    value={formik.values.region}  
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required 
    />
  </div>

  <div className="col-12">
    <label htmlFor="country" className="form-label">Country</label>
    {formik.touched.country && formik.errors.country && ( 
    <p className="text-danger">{formik.errors.country}</p>
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
    <label htmlFor="city" className="form-label">City</label>
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

  <div className="col-md-4">
    <label htmlFor="street" className="form-label">Street</label>
    {formik.touched.street && formik.errors.street && (
    <p className="text-danger">{formik.errors.street}</p>
    )}
    <input
    name="street" 
    type="text" 
    className="form-control" 
    id="street"
    autoComplete="on"
    value={formik.values.street}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
    />
  </div>

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
  </div>
  
  <div className="col-12">
    <button 
    disabled={!formik.dirty || !formik.isValid}
    type="submit" 
    className="btn btn-primary">
    REGISTER
    </button>
  </div>
</form>
</div>
</>
);
}
 
export default Register;