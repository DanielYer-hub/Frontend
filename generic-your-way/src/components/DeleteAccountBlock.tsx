import React, { useId, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteMe } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { track } from "../utils/analytics";

type Props = {
  buttonClassName?: string; 
};

const DeleteAccountModal: React.FC<Props> = ({ buttonClassName }) => {
  const modalId = useId().replace(/:/g, "_"); 
  const [loading, setLoading] = useState(false);

  const auth = useAuth() as any;
  const navigate = useNavigate();

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteMe();
      track("Auth: Delete Account");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (auth?.logout) auth.logout();
      toast.success("Account deleted");
      navigate("/welcome-page"); 
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={buttonClassName || "btn btn-outline-danger"}
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
        disabled={loading}
      >
        Delete account
      </button>

      <div
        className="modal fade"
        id={modalId}
        tabIndex={-1}
        aria-hidden="true"
        aria-labelledby={`${modalId}-label`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}-label`}>
                Delete account
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={loading}
              />
            </div>

            <div className="modal-body">
              <p className="mb-2">
                Are you sure you want to delete your account?
              </p>
              <div className="text-warning small">
                This action is irreversible.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-light"
                data-bs-dismiss="modal"
                disabled={loading}
              >
                No
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirmDelete}
                disabled={loading}
                data-bs-dismiss={loading ? undefined : "modal"}
              >
                {loading ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;
