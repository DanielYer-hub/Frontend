import { useFormik } from "formik";
import * as yup from "yup";
import { sendFeedback, type FeedbackType } from "../services/feedback";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const schema = yup.object({
  type: yup.mixed<FeedbackType>().oneOf(["problem", "suggestion"]).required(),
  title: yup.string().trim().max(80).optional(),
  description: yup.string().trim().min(10).max(3000).required(),
});

export default function FeedbackModal({ isOpen, onClose }: Props) {
  const formik = useFormik({
    initialValues: {
      type: "problem" as FeedbackType,
      title: "",
      description: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await sendFeedback({
          type: values.type,
          title: values.title || undefined,
          description: values.description,
        });
        toast.success("Thanks! Feedback sent.");
        resetForm();
        onClose();
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to send feedback");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Feedback</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <label className="form-label">Type</label>
          <select
            className="form-select mb-2"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            <option value="problem">Problem</option>
            <option value="suggestion">Suggestion</option>
          </select>

          <label className="form-label">Title (optional)</label>
          <input
            className="form-control mb-2"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="Short title…"
          />

          <label className="form-label">Description</label>
          <textarea
            className="form-control mb-2"
            name="description"
            rows={6}
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder="Describe the issue or your idea…"
          />

          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}