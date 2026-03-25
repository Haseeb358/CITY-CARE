// frontend/src/components/Payment/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/payment/verify-payment/${sessionId}`
        );
        setPaymentDetails(response.data);
        await axios.post('http://localhost:5000/api/payment/save', {
          sessionId,
          ...response.data,
        });
      } catch (error) {
        console.error('Verification failed:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  },[]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-6">
          Thank you for your support 💚
        </p>

        {/* Loading State */}
        {loading && (
          <p className="text-gray-500 animate-pulse mb-3">
            Verifying your payment…
          </p>
        )}

        {/* Payment Details */}
        {paymentDetails && (
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-700 space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="font-medium">Amount</span>
              <span>${paymentDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Purpose</span>
              <span>{paymentDetails.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="text-green-600 font-semibold capitalize">
                {paymentDetails.status}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};

export default PaymentSuccess;
