import { type FormikValues, useFormik } from "formik";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { sucessMassage } from "../services/feedbackService";
import { useAuth } from "../context/AuthContext";
import "./css/Register.css";
import { contactsSchema } from "../validation/contactsValidation";
import { useState } from "react";

const Register: FunctionComponent = () => {
  const navigate = useNavigate();
  const { registerAndLogin } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  const step1Schema = yup.object({
    first: yup.string().min(2).max(256).required(),
    last: yup.string().min(2).max(256).required(),
    email: yup.string().email().min(5).required(),
    password: yup
      .string()
      .min(8).max(50)
      .required()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
      ),
  });

  const step2Schema = yup.object({
    contacts: contactsSchema.required(),
  });

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      first: "",
      last: "",
      email: "",
      password: "",
      contacts: {
        phoneE164: "",
        telegramUsername: "",
      },
    },

    validationSchema: step === 1 ? step1Schema : step2Schema,

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (step === 1) {
          setStep(2);
          return;
        }
        const payload = {
          name: { first: values.first, last: values.last },
          email: values.email,
          password: values.password,
          contacts: {
            phoneE164: values.contacts?.phoneE164 || "",
            telegramUsername: values.contacts?.telegramUsername || "",
          },
        };

        await registerAndLogin(payload);
        sucessMassage(`${payload.email} registered successfully`);
        navigate("/dashboard");
        resetForm();
      } catch (e: any) {
        console.error("Registration failed:", e?.response?.data || e.message || e);
        alert(e?.response?.data?.message || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const backToStep1 = () => setStep(1);

  return (
    <div className="register-page">
      <div className="page-body">
        <div className="container">
          <main className="welcome-page-content">
            <img src="/content/gyw.png" alt="GYW logo" className="logo" />
          </main>

          <form className="row g-3" onSubmit={formik.handleSubmit}>
            <div className="register-box">
              <div className="row g-3">

                {step === 1 && (
                  <>
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
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="col-12">
                      <div className="alert alert-info">
                        Add WhatsApp or Telegram so other players can contact you after you accept an invite.
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Contacts:</label>

                      <input
                        className="form-control mb-2"
                        name="contacts.phoneE164"
                        placeholder="Your WhatsApp number."
                        value={formik.values.contacts.phoneE164}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contacts?.phoneE164 &&
                        (formik.errors.contacts as any)?.phoneE164 && (
                          <p className="text-danger">{(formik.errors.contacts as any).phoneE164}</p>
                        )}

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
                          <p className="text-danger">{(formik.errors.contacts as any).telegramUsername}</p>
                        )}

                      {formik.touched.contacts && typeof formik.errors.contacts === "string" && (
                        <p className="text-danger">{formik.errors.contacts}</p>
                      )}
                    </div>
                  </>
                )}

              </div>

              <div className="col-12 register-btn mt-3 d-flex gap-2">
                {step === 2 && (
                  <button type="button" className="btn btn-outline-secondary" onClick={backToStep1}>
                    Back
                  </button>
                )}

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!formik.isValid}
                >
                  {step === 1 ? "NEXT" : "FINISH"}
                </button>
              </div>

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
  );
};

export default Register;
