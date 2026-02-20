import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import PaymentPage from "./components/Payment/PaymentPage.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import PaymentFailure from "./components/Payment/PaymentFailure.jsx";
import LoginPage from "./pages/LoginPage.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
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
