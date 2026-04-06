// Your complaint has been successfully registered. We will review it and take appropriate action. Thank you for helping us improve our city
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//  cross icon
// import { faXmark } from "@fortawesome/free-solid-svg-icons";
const SuccessMessage = ({ resetForm, msg, status }) => {
  console.log("Status in SuccessMessage:", status);
  console.log("type of status:", typeof status);


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {status == 201 || status == 200 || status == 409 ? (<div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
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
          {msg}
        </h2>
        {status == 201 && <p className="text-gray-600 mb-6">
          Your complaint has been successfully registered. We will review it and take appropriate action. Thank you for helping us improve our city
        </p>}
        {status == 200 && <p className="text-gray-600 mb-6">
          Duplicate complaint detected. Your vote has been counted. We will review the complaint and take appropriate action. Thank you for helping us improve our city
        </p>}
        {status == 409 && <p className="text-gray-600 mb-6">
          Duplicate complaint detected. You have already voted for this complaint. We will review the complaint and take appropriate action. Thank you for helping us improve our city
        </p>}
        <button
          onClick={() => resetForm()}
          className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Submit Another Complaint
        </button>
      </div>):(<div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {/* cross svg  */}
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {msg}
        </h2>
        {status == 404 && <p className="text-gray-600 mb-6">
          City is not serviceable. Please check the city name and try again.
        </p>}
        {status == 400 && <p className="text-gray-600 mb-6">
          Sorry.. This Location is out of service zone. Please select a different location within the serviceable area.
        </p>}
        { status == 403 && <p className="text-gray-600 mb-6">
          You are not authorized to submit a complaint. Please log in to your account and try again.
        </p>}
        {status == 500 && <p className="text-gray-600 mb-6">
          An error occurred while submitting your complaint. Please try again later.
        </p>}
        <button

          onClick={() => resetForm()}
          className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Submit Another Complaint
        </button>
      </div>)}
    </div>
  );
};

export default SuccessMessage;

