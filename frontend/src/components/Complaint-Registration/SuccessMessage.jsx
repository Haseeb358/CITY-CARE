
const SuccessMessage = ({ resetForm }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Complaint Submitted!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your submission. We will review your complaint and get
          back to you soon.
        </p>
        <button
          onClick={() => resetForm()}
          className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Submit Another Complaint
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
