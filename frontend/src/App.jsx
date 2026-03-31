// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import PaymentPage from "./components/Payment/PaymentPage.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import PaymentFailure from "./components/Payment/PaymentFailure.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgetPasswordPage from "./pages/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ComplaintPage from "./pages/ComplaintPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs.jsx";
import Userprofile from "./pages/Userprofile.jsx";
import Contactus from "./pages/ContactUs.jsx";
import Layout from "./components/Layout/Layout.jsx";
import ScrollToTop from "./components/Scroll/ScrollToTop.jsx";
import { Toaster, toast } from "react-hot-toast";
import OTPInput from "./components/utilities/OTPinput.jsx";
import { useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
const userRoute = import.meta.env.VITE_API_USER_ROUTE;
import { useDispatch } from "react-redux";
import { setUser } from "./feature/user/userSlice.js";
import axios from "axios";
import ComplaintHistory from "./pages/ComplaintHistory.jsx";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
     let checkLoginStatus = async () => {
      try {
        let link = `${apiUrl}${userRoute}/check-login`
        let response = await axios.get(link, { 
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true, // Include cookies in the request
            
         });
          console.log("Login status response: ", response.data);
         if(response.data.success){
          dispatch(setUser(response.data?.user));
         }
     }
      catch (error) {
        // console.log("Error checking login status--: ", error.response?.data || "An error occurred while checking login status.");
        
      }
      };
      checkLoginStatus();
  }, [])


  return(
    <div>
    <Toaster position="top-right" reverseOrder={false} toastOptions={
     {
      duration: 5000,
      style: {
        fontSize: "26px",
      },
     }
    } />  
  <BrowserRouter>
  <ScrollToTop/>
     <Routes>
    
    <Route path="/" element={<Layout />}>
      <Route path="" element={<LandingPage />} />
      <Route path="forget-password" element={<ForgetPasswordPage />} />
      <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="otp" element={<OTPInput />} />
      <Route path="about-us" element={<AboutUs />} />
      <Route path="complaint-history" element={<ComplaintHistory />} />
      <Route path="user-profile" element={<Userprofile />} />
      <Route path="contact-us" element={<Contactus />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="register-complaint" element={<ComplaintPage />} />
      <Route path="payment">
        <Route index element={<PaymentPage />} />
        <Route path="success" element={<PaymentSuccess />} />
        <Route path="failure" element={<PaymentFailure />} />
      </Route>
    </Route>
    
    
  </Routes>
  
  </BrowserRouter>
  </div>
  )

}

export default App;
