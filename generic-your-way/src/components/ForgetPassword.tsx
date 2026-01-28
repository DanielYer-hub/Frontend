import { type FormikValues, useFormik } from "formik";
import type { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useState } from "react";
import { authService } from "../services/authService";
import "./css/Login.css";
import { sucessMassage } from "../services/feedbackService";

interface ForgetPasswordProps {}

const ForgetPassword: FunctionComponent<ForgetPasswordProps> = () => {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");

  const emailSchema = yup.object({
    email: yup.string().email().min(5).required(),
  });

  const passwordSchema = yup.object({
    newPassword: yup
      .string()
      .min(8)
      .max(50)
      .required()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const emailFormik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await authService.requestPasswordReset(values.email);
        setEmail(values.email);
        setEmailVerified(true);
        sucessMassage("Email verified. Please enter your new password.");
      } catch (error: any) {
        console.error("Email verification failed:", error);
        alert(error?.response?.data?.message || "Email not found. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordFormik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await authService.resetPassword(email, values.newPassword);
        sucessMassage("Password updated successfully!");
        navigate("/login");
        resetForm();
      } catch (error: any) {
        console.error("Password reset failed:", error);
        alert(error?.response?.data?.message || "Failed to reset password. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="login-page">
        <div className="page-body">
          <div className="container">
            <main className="welcome-page-content">
              <img src="/content/Forge.jpg" alt="Forge logo" className="logo" />
            </main>

            {!emailVerified ? (
              <form onSubmit={emailFormik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  {emailFormik.touched.email && emailFormik.errors.email && (
                    <p className="text-danger">{emailFormik.errors.email}</p>
                  )}
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="email"
                    autoComplete="on"
                    placeholder="Email"
                    onChange={emailFormik.handleChange}
                    onBlur={emailFormik.handleBlur}
                    value={emailFormik.values.email}
                    required
                  />
                </div>
                <button
                  disabled={!emailFormik.dirty || !emailFormik.isValid || emailFormik.isSubmitting}
                  type="submit"
                  className="btn btn-success"
                >
                  Verify Email
                </button>
              </form>
            ) : (
              <form onSubmit={passwordFormik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password:</label>
                  {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                    <p className="text-danger">{passwordFormik.errors.newPassword}</p>
                  )}
                  <input
                    name="newPassword"
                    type="password"
                    className="form-control"
                    id="newPassword"
                    autoComplete="off"
                    placeholder="New Password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.newPassword}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                  {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                    <p className="text-danger">{passwordFormik.errors.confirmPassword}</p>
                  )}
                  <input
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    autoComplete="off"
                    placeholder="Confirm Password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.confirmPassword}
                    required
                  />
                </div>
                <button
                  disabled={!passwordFormik.dirty || !passwordFormik.isValid || passwordFormik.isSubmitting}
                  type="submit"
                  className="btn btn-success"
                >
                  Save
                </button>
              </form>
            )}

            <span className="span-text">
              Remember your password? <Link to="/login">Login</Link>
            </span>
          </div>
        </div>

        <footer className="login-footer border-top">
          <div className="container py-3 text-center small">
            © {new Date().getFullYear()} Forge Your Path by Daniel Yerema.
          </div>
        </footer>
      </div>
    </>
  );
};

export default ForgetPassword;
