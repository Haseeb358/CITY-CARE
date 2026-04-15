import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const EmployeeModal = ({ employee, mode, onClose, refreshEmployees }) => {
  
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: employee.fullName || "",
      CNIC: employee.CNIC || "",
      contactNumber: employee.contactNumber || "",
      role: employee.role || "",
      city: employee.city?._id || "",
      zone: employee.zone?._id || "",
      skills: employee.skills?.join(", ") || "",
      address: employee.address || "",
      education: employee.education || "",
      DOB: employee.DOB?.split("T")[0] || "",
      joinedDate: employee.joinedDate?.split("T")[0] || "",
      leftDate: employee.leftDate?.split("T")[0] || "",
      isActive: employee.isActive ?? true
    }
  });

  const selectedCity = watch("city");

  // 🔥 FETCH DATA
  const fetchCities = async () => {
    const { data } = await axios.get(
      `${API_URL}${API_ADMIN_ROUTE}/cities`,
      { withCredentials: true }
    );
    setCities(data.cities || []);
  };

  const fetchZones = async (cityId) => {
    const { data } = await axios.get(
      `${API_URL}${API_ADMIN_ROUTE}/zones?cityId=${cityId}`,
      { withCredentials: true }
    );
    setZones(data.zones || []);
  };
  useEffect(() => {
  if (zones.length && employee.zone?._id) {
    setValue("zone", employee.zone._id);
  }
}, [zones]);

  useEffect(() => {
    fetchCities();
    if (employee.city?._id) {
      fetchZones(employee.city._id);
    }
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchZones(selectedCity);
      setValue("zone", "");
    }
  }, [selectedCity]);
  useEffect(() => {
  if (cities.length && employee.city?._id) {
    setValue("city", employee.city._id);
  }
}, [cities]);

  // ✅ SUBMIT
  const onSubmit = async (data) => {
    try {
      data.skills = data.skills
        ? data.skills.split(",").map(s => s.trim())
        : [];
     console.log("zn: ", data.zone);
      if (!data.zone) data.zone = null;
       console.log("submit data:", data);
      await axios.put(
        `${API_URL}${API_ADMIN_ROUTE}/employees/${employee._id}`,
        data,
        { withCredentials: true }
      );

      toast.success("Employee updated successfully");
      onClose();
      refreshEmployees();

    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ✅ REUSABLE FIELD
  const Field = ({ label, name, type = "text", rules = {} }) => (
    <div>
      <label className="text-xs text-gray-600">{label}</label>

      <input
        type={type}
        {...register(name, rules)}
        disabled={mode === "view"}
        className={`w-full border rounded px-3 py-2 text-sm mt-1
          ${errors[name] ? "border-red-500" : ""}
          ${mode === "view" ? "bg-gray-100" : ""}
        `}
      />

      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-200 max-h-[90vh] overflow-y-auto p-6">

        <h2 className="text-xl font-semibold mb-4">
          {mode === "view" ? "Employee Details" : "Update Employee"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >

          {/* BASIC */}
          <Field
            label="Full Name"
            name="fullName"
            rules={{ required: "Full name is required" }}
          />

          <Field
            label="CNIC"
            name="CNIC"
            rules={{
              required: "CNIC is required",
              minLength: { value: 13, message: "CNIC must be 13 digits" }
            }}
          />

          <Field
            label="Contact Number"
            name="contactNumber"
            rules={{ required: "Contact is required" }}
          />

          {/* ROLE */}
          <div>
            <label className="text-xs text-gray-600">Role</label>

            {mode === "view" ? (
              <div className="border px-3 py-2 bg-gray-100 text-sm mt-1">
                {employee.role}
              </div>
            ) : (
              <select
                {...register("role", { required: "Role required" })}
                className="w-full border rounded px-3 py-2 text-sm mt-1"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="cityManager">City Manager</option>
                <option value="worker">Worker</option>
                <option value="teamLead">Team Lead</option>
              </select>
            )}

            {errors.role && (
              <p className="text-red-500 text-xs">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* CITY */}
          <div>
            <label className="text-xs text-gray-600">City</label>

            {mode === "view" ? (
              <div className="border px-3 py-2 bg-gray-100 text-sm mt-1">
                {employee.city?.name || "N/A"}
              </div>
            ) : (
              <select
  {...register("city", { required: "City required" })}
  className="w-full border rounded px-3 py-2 text-sm mt-1"
>
  <option value="">Select City</option>
  {cities.map(c => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>
            )}
            {errors.city && (
              <p className="text-red-500 text-xs">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* ZONE */}
          <div>
            <label className="text-xs text-gray-600">Zone</label>

            {mode === "view" ? (
              <div className="border px-3 py-2 bg-gray-100 text-sm mt-1">
                {employee.zone?.name || "Null"}
              </div>
            ) : (
              <select
  {...register("zone")}
  className="w-full border rounded px-3 py-2 text-sm mt-1"
>
  <option value="">Select Zone</option>
  {zones.map(z => (
    <option key={z._id} value={z._id}>
      {z.name}
    </option>
  ))}
</select>
            )}
          </div>

          {/* OTHER */}
          <Field label="Address" name="address" />
          <Field label="Skills" name="skills" />
          <Field label="Education" name="education" />
          <Field label="DOB" name="DOB" type="date"
           rules={{ required: "Full name is required" }}
          />
          <Field label="Join Date" name="joinedDate" type="date" 
          rules={{ required: "Join Date is required" }}
          />
          <Field label="Left Date" name="leftDate" type="date" 
          
          />

          {/* STATUS */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isActive")}
              disabled={mode === "view"}
            />
            <label className="text-sm">Active</label>
          </div>

          {/* ACTIONS */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>

            {mode === "update" && (
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Save Changes
              </button>
            )}

          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;