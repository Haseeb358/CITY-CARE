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
import Contactus from "./pages/ContactUs.jsx";
import Layout from "./components/Layout/Layout.jsx";
import ScrollToTop from "./components/Scroll/ScrollToTop.jsx";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <LandingPage />,
  //   },
  //   {
  //     path: "/forget-password",
  //     element: <ForgetPasswordPage />,
  //   },
  //   {
  //     path: "/reset-password/:token",
  //     element: <ResetPasswordPage />,
  //   },
  //   {
  //     path: "/signup",
  //     element: <SignupPage />,
  //   },
  //   {
  //     path: "/register-complaint",
  //     element: <ComplaintPage />,
  //   },
  //   {
  //     path: "/payment",
  //     children: [
  //       {
  //         index: true,
  //         element: <PaymentPage />,
  //       },
  //       {
  //         path: "success",
  //         element: <PaymentSuccess />,
  //       },
  //       {
  //         path: "failure",
  //         element: <PaymentFailure />,
  //       },
  //     ],
  //   },
  // ]);

  // return <RouterProvider router={router} />;

  return(
    <div>
  <BrowserRouter>
  <ScrollToTop/>
     <Routes>
    
    <Route path="/" element={<Layout />}>
      <Route path="" element={<LandingPage />} />
      <Route path="forget-password" element={<ForgetPasswordPage />} />
      <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="about-us" element={<AboutUs />} />
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
