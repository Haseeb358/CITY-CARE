// frontend/src/components/Payment/PaymentFailure.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const reason = params.get('reason');

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-rose-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">❌</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-500 mb-6">
          Unfortunately, your payment could not be completed.
        </p>

        {/* Failure Reason */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 mb-6">
          <p className="font-medium mb-1">Reason</p>
          <p className="text-red-600">
            {reason || 'The payment was canceled or an error occurred.'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/payment')}
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailure;
