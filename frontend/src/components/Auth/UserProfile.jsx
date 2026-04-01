import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const apiUrl = import.meta.env.VITE_API_URL;
const userRoute = import.meta.env.VITE_API_USER_ROUTE;
import axios from "axios";
import tost from "react-hot-toast";
import { Link } from "react-router-dom";


const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);

  // Profile form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors : passwordErrors},
  } = useForm();

  // 🔹 Fetch user data (API call)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 👉 Replace with your API
       let link = `${apiUrl}${userRoute}/profile`;
        const response = await axios.get(link, { withCredentials: true });
        console.log("API Response:", response);
        const data = response.data.user;
        console.log("--User Data:", data);
       
        

        setUserData(data);
        reset({
          fullName: data.fullName,
          contactNumber: data.contactNumber,
          city: data.city || "",
        });
      } catch (error) {
        // log error message comminmg from backend
        console.error("Error fetching user data:", error.response?.data?.message || error.message);
      }
    };

    fetchUser();
  }, [reset]);

  // 🔹 Update profile
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      // 👉 API CALL
      // await updateProfile(formData)
      let link = `${apiUrl}${userRoute}/update-profile`;
      const response = await axios.put(link, formData, { withCredentials: true });
      let data = response.data;
      
      setUserData(data.user);
      reset({
        fullName: data.user.fullName,
        contactNumber: data.user.contactNumber,
        city: data.user.city || "",
      });

      tost.success("Profile updated successfully");

    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update password
  const onPasswordSubmit = async (data) => {
    try {
      setPasswordLoading(true);

      console.log("Password Data:", data);

      // 👉 API CALL
      // await updatePassword(data)
      
        let link = `${apiUrl}${userRoute}/change-password`;
        let response = await axios.post(link, data, { withCredentials: true });
        if (response.data.success) {
          tost.success("Password updated successfully");
        }

      resetPassword();
    } catch (error) {
      tost.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // 🔹 Update Location
  const handleLocationUpdate = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // console.log("New Location:", location);
        setLocationLoaded(true);
        // 👉 API CALL
        // await updateLocation(location)

        try {

          let link = `${apiUrl}${userRoute}/update-profile`;
          axios.put(link, location, { withCredentials: true })
            .then((response) => {
              // let data = response.data;
              // console.log("Location Update Response:", data);
             
              
            })
            .catch((error) => {
              console.error("Location update failed", error);
              tost.error(error.response?.data?.message || "Failed to update location");
              
            });
           
          
          
        } catch (error) {
          
        }finally {
          setLoading(false);
         }
        


      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email (Read Only) */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={userData?.email || ""}
                readOnly
                className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                {...register("fullName")}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-sm text-gray-600">Contact Number</label>
              <input
                {...register("contactNumber")}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

           
            <div>
              <label className="text-sm text-gray-600 bg">City</label>
              <select
                {...register("city")}
                value={watch("city") || ""}
                className="w-full mt-1 p-2 border rounded "
              >
                <option value="">Select your city</option>
                {[
                  "Lahore",
                  "Karachi",
                  "Peshawar",
                  ,
                ].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Button */}
            <div>
              <button
                disabled={loading}
                type="button"
                onClick={handleLocationUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                {loading ? "Updating Location..." : "Update Current Location"}
              </button>
              {locationLoaded && (
        <p className="text-green-600 text-sm">
          ✅ Location Updated successfully
        </p>
      )}
            </div >

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-[70%] md:w-[40%] bg-green-600 text-white py-2 rounded flex justify-center cursor-pointer mx-auto"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">

            <input
              type="password"
              placeholder="Old Password"
              {...registerPassword("oldPassword",{
                maxLength: {
                  value: 10,
                  message: "Password must be less than 20 characters",
                },
                required: "Old password is required",
              } )}
              className="w-full p-2 border rounded"
            />
            {passwordErrors.oldPassword && (
              <p className="text-red-600 text-sm">{passwordErrors.oldPassword.message}</p>
            )}

            
              <input
              type="password"
              placeholder="New Password"
              {...registerPassword("newPassword" ,{
                minLength: {
                  value: 5,
                  message: "New Password must be at least 5 characters",
                },
                maxLength: {
                  value: 10,
                  message: "New Password must be less than 10 characters",
                },
              })}
              className="w-full p-2 border rounded"
            />
            {passwordErrors.newPassword && (
              <p className="text-red-600 text-sm ">{passwordErrors.newPassword.message}</p>
            )}
           

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-[70%] md:w-[40%] bg-purple-600 text-white py-2 rounded flex justify-center cursor-pointer mx-auto"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {/* Forget Password */}
          <p className="text-sm mt-4 text-center">
            Forgot password?{' '}
            <Link to="/forget-password" className="text-blue-600 underline">
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
