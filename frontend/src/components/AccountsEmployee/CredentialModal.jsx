import { useState } from "react";
import axios from "axios";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { toast } from "react-hot-toast";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const CredentialModal = ({ employee, onClose, refresh }) => {

  const [email, setEmail] = useState(employee.userID?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  // ✅ UPDATE USER
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      if (!email) {
        return setError("Email is required");
      }
      if(!password){
        return setError("Password is required");
      }
      if (password && password.length < 6) {
        return setError("Password must be at least 6 characters");
      }
      await axios.put(
        `${API_URL}${API_ADMIN_ROUTE}/users/${employee?.userID?._id}`,
        {
          email,
          password: password
        },
        { withCredentials: true }
      );
      toast.success("Credentials updated successfully");
      refresh();
      onClose();

    } catch (err) {
      console.log(err.response?.data?.message || "Update failed")
      setError(err.response?.data?.message || "Update failed");
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE USER
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await axios.delete(
        `${API_URL}${API_ADMIN_ROUTE}/del-users-acc/${employee?.userID?._id}`,
        { withCredentials: true }
      );
        toast.success("User account deleted");
      setShowConfirm(false);
      onClose();
     setTimeout(() => {
        refresh();    // then refetch
     }, 0);
      

    } catch (err) {
      setError("Delete failed");
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-xl shadow-lg w-105 p-5 relative">

          {/* ❌ CLOSE ICON */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold mb-4">
            Manage Credentials
          </h2>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-full p-2 rounded mt-1"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="text-sm font-medium">
              New Password (optional)
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full p-2 rounded mt-1"
            />

            <label className="text-xs mt-1 flex items-center gap-1">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </label>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-between items-center mt-4">

            {/* DELETE */}
            <button
              onClick={() => setShowConfirm(true)}
              className="text-red-800 font-semibold text-sm"
            >
              Delete User Account
            </button>

            {/* SAVE */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </div>
      </div>

      {/* ✅ CONFIRM DELETE MODAL */}
      {showConfirm && (
        <ConfirmDeleteModal
          message="This will permanently remove login credentials for this employee."
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default CredentialModal;