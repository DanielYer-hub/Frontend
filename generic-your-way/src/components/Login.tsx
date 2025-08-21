import { type FormikValues, useFormik } from "formik";
import type { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../services/http";
import { loginUser } from "../services/userService";
import * as yup from "yup";


interface LoginProps {}
 
const Login: FunctionComponent<LoginProps> = () => {
const navigate = useNavigate();

const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
        email: "",
        password: "",
    },
    validationSchema: yup.object({
        email: yup
        .string()
        .email()
        .min(5)
        .required(),
        password: yup
        .string()
        .min(8)
        .max(50)
        .required()
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
        ),
    }),
  
onSubmit: async (values, { resetForm, setSubmitting }) => {
  try {
    const login = await loginUser(values.email, values.password); 
    if (!login?.token) throw new Error("No token returned by login");
    setToken(login.token);
    if (login?.user?.id) localStorage.setItem("userId", login.user.id);
    navigate("/dashboard");
    resetForm();
  } catch (error: any) {
    console.error("Login failed:", error);
    alert(error?.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
}


})

return (
<>
<div className="container">
  <form onSubmit={formik.handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email:</label>
    {formik.touched.email && formik.errors.email && (
      <p className="text-danger">{formik.errors.email}</p>
    )}
    <input 
    name="email"
    type="email" 
    className="form-control" 
    id="email" 
    autoComplete="on"
    placeholder="Email"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.email}
    required
    />
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password:</label>
    {formik.touched.password && formik.errors.password && (
      <p className="text-danger">{formik.errors.password}</p>
    )}
    <input 
    name="password"
    type="password" 
    className="form-control" 
    id="password"
    autoComplete="off"
    placeholder="Password"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.password}
    required
    />
  </div>
  <button 
  disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
  type="submit" 
  className="btn btn-primary"
  >
    Submit
  </button>
</form>
<span>
New Acolyte? Please <Link to="/register">register</Link> first.
</span>
</div>    
</>
);
}
 
export default Login;