import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const AssignCredentialsModal = ({ employee, onClose, refresh }) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await axios.post(
        `${API_URL}${API_ADMIN_ROUTE}/users/assign`,
        {
          email: data.email,
          password: data.password,
          employeeId: employee._id
        },
        { withCredentials: true }
      );

      toast.success("Credentials assigned successfully");

      onClose();
      refresh();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl p-5 w-100 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-3">
          Assign Credentials
        </h2>

        <p className="text-sm text-gray-600 mb-3">
          Employee: <b>{employee.fullName}</b>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required" , pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address"
                }
              })}
              className="border w-full p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters"
                }
              })}
              className="border w-full p-2 rounded"
            />

            <label className="text-xs flex items-center gap-1 mt-1">
              <input
                type="checkbox"
                onChange={() => setShowPass(!showPass)}
              />
              Show Password
            </label>

            {errors.password && (
              <p className="text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AssignCredentialsModal;