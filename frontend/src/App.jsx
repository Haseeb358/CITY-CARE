import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import PaymentPage from "./components/Payment/PaymentPage.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import PaymentFailure from "./components/Payment/PaymentFailure.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgetPasswordPage from "./pages/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ComplaintPage from "./pages/ComplaintPage.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/forget-password",
      element: <ForgetPasswordPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/register-complaint",
      element: <ComplaintPage />,
    },
    {
      path: "/payment",
      children: [
        {
          index: true,
          element: <PaymentPage />,
        },
        {
          path: "success",
          element: <PaymentSuccess />,
        },
        {
          path: "failure",
          element: <PaymentFailure />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
