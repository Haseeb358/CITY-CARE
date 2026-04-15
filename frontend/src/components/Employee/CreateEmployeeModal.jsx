import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

 // 🔥 MOVE THIS OUTSIDE COMPONENT
const Field = ({ label, name, type = "text", register, errors, validation }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">{label}</label>

    <input
      type={type}
      {...register(name, validation)}
      className="border rounded px-3 py-2 text-sm"
    />

    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">
        {errors[name].message}
      </p>
    )}
  </div>
);

const CreateEmployeeModal = ({ onClose, onCreated }) => {

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
  defaultValues: {
    isActive: true // ✅ THIS FIXES IT
   
  }
});

  const selectedCity = watch("city");

  // ✅ FETCH CITIES
  const fetchCities = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/cities`,
        { withCredentials: true }
      );
      setCities(data.cities || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH ZONES
  const fetchZones = async (cityId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/zones?cityId=${cityId}`,
        { withCredentials: true }
      );
      setZones(data.zones || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchZones(selectedCity);
      setValue("zone", "");
    } else {
      setZones([]);
    }
  }, [selectedCity]);

  // ✅ SUBMIT
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      data.skills = data.skills
        ? data.skills.split(",").map(s => s.trim())
        : [];
        if(data.zone === "") data.zone = null; // ✅ HANDLE EMPTY ZONE
     console.log("Submitting Employee Data:", data);
      const res = await axios.post(
        `${API_URL}${API_ADMIN_ROUTE}/create-employee`,
        data,
        { withCredentials: true }
      );
     toast.success("Employee created successfully!");
      console.log("Create Response:", res.data);
      onCreated && onCreated(res.data);

      reset();
      onClose();
      setLoading(false);

    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to create employee") ;
      console.error(err.response?.data || err.message);
      setLoading(false);
    }
  };

  // ✅ reusable field
 

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-187.5 max-h-[90vh] overflow-y-auto p-6">

        <h2 className="text-xl font-semibold mb-4">
          Create New Employee
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >

          {/* FULL NAME */}
          <Field
            label="Full Name"
            name="fullName"
            register={register}
            errors={errors}
            validation={{
              required: "Full name is required", maxLength: { value: 50, message: "Name cannot exceed 50 characters" }
            }}
          />

          {/* CNIC */}
          <Field
            label="CNIC without dashes"
            name="CNIC"
            register={register}
            errors={errors}

            validation={{
              required: "CNIC is required",
              pattern: {
                value: /^[0-9]{13}$/,
                message: "CNIC must be 13 digits"
              }
            }}
          />

          {/* CONTACT */}
          <Field
            label="Contact Number"
            name="contactNumber"
            register={register}
            errors={errors}
            validation={{
              required: "Contact number is required",
              pattern: {
                value: /^03[0-9]{9}$/,
                message: "Invalid phone number use format 03XXXXXXXXX"
              }
            }}
          />

          {/* ROLE */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Role</label>

            <select
              {...register("role", {
                required: "Role is required"
              })}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Role</option>
              <option value="teamLead">Team Lead</option>
              <option value="worker">Worker</option>
              <option value="cityManager">City Manager</option>
              <option value="admin">Admin</option>
            </select>

            {errors.role && (
              <p className="text-red-500 text-xs mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* CITY */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">City</label>

            <select
              {...register("city", {
                required: "City is required"
              })}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select City</option>

              {cities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {errors.city && (
              <p className="text-red-500 text-xs mt-1">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* ZONE */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Zone</label>

            <select
              {...register("zone", {
                
              })}
              disabled={!selectedCity}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Zone</option>

              {zones.map((z) => (
                <option key={z._id} value={z._id}>
                  {z.name}
                </option>
              ))}
            </select>

            {errors.zone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.zone.message}
              </p>
            )}
          </div>

          {/* ADDRESS */}
          <Field
            label="Address"
            name="address"
            register={register}
            errors={errors}
            validation={{
              required: "Address is required", maxLength: { value: 100, message: "Address cannot exceed 100 characters" }
            }}
          />

          {/* SKILLS */}
          <Field
            label="Skills (comma separated)"
            name="skills"
            register={register}
            errors={errors}
            validation={{
              required: "At least one skill is required", pattern: { value: /^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/, message: "Skills must be comma separated without spaces" }
            }}
          />

          {/* EDUCATION */}
          <Field
            label="Education"
            name="education"
            register={register}
            errors={errors}
            validation={{
               maxLength: { value: 100, message: "Education cannot exceed 100 characters" }
            }}
          />

          {/* DOB must be less than today */}
          <Field
            label="Date of Birth"
            name="DOB"
            type="date"
            register={register}
            errors={errors}
            validation={{
              required: "Date of birth is required" ,validate: value => {
                const today = new Date();
                const dob = new Date(value);
                return dob < today || "Date of birth cannot be in the future";
              }
            }}
          />

          {/* JOIN DATE */}
          <Field
            label="Join Date"
            name="joinedDate"
            type="date"
            register={register}
            errors={errors}
            validation={{
              required: "Join date is required", validate: value => {
                const today = new Date();
                const joinDate = new Date(value);
                return joinDate <= today || "Join date cannot be in the future";
              }
            }}
          />

          {/* STATUS c */}
          {/* i want checkbox default vaule to be ticked SO do it below*/}
          <div className="flex items-center gap-2 mt-4">
            <input
  type="checkbox"
  defaultChecked
  {...register("isActive")}
/>
            <label className="text-sm">Active</label>
          </div>

          {/* BUTTONS */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;