import { useState, useRef } from "react";
import Loader from "./Loader";
import axios from "axios";

import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const userRoute = import.meta.env.VITE_API_USER_ROUTE;
const OTPInput = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    newOtp.forEach((_, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = newOtp[i];
      }
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      alert("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      // 👉 YOUR API CALL HERE
      console.log("Entered OTP:", finalOtp);

         let response = await axios.post(`${apiUrl}${userRoute}/verify-otp`, {
            email: user?.email || "", // Use user's email from Redux store, fallback to empty string
            otp: finalOtp,
         }, {
            headers: {
                "Content-Type": "application/json"
            },
            });
           console.log("OTP verification response:", response.data);
           if(response.data.success){
            toast.success("OTP verified successfully!");
            navigate("/login");

           } 
       

      // Example:
      // await verifyOtpAPI(finalOtp);

    } catch (error) {
      
      toast.error(error?.response?.data?.message || "OTP verification failed");
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Loader isOpen={loading} />
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Enter the 6-digit code sent to your email
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          
          {/* OTP Inputs */}
          <div
            className="flex justify-between gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* Resend */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Didn’t receive code?{" "}
          <button className="text-blue-600 hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPInput;