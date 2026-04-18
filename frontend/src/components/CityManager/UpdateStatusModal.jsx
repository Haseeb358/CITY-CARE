import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let ROUTE = import.meta.env.VITE_API_CITY_MANAGER_ROUTE;

const statuses = ["Reassigned"];

const UpdateStatusModal = ({ complaint, onClose, refresh }) => {

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: statuses[0] || "",
      remarks: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await axios.put(
        `${API_URL}${ROUTE}/complaints/${complaint._id}/update-status`,
        data,
        { withCredentials: true }
      );

      toast.success("Status updated successfully");
      onClose();
      refresh(); // ✅ refresh table

    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-125 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Complaint Status</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* STATUS */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              {...register("status", { required: "Status required" })}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select Status</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs">{errors.status.message}</p>
            )}
          </div>

          {/* REMARKS */}
          <div>
            <label className="text-sm text-gray-600">Remarks</label>
            <textarea
              {...register("remarks", {
                required: "Remarks required",
                minLength: {
                  value: 5,
                  message: "At least 5 characters required"
                }
              })}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
            />
            {errors.remarks && (
              <p className="text-red-500 text-xs">{errors.remarks.message}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;