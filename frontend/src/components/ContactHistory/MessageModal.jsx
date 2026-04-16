const MessageModal = ({ message, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded p-5 w-100">

        <h2 className="text-lg font-semibold mb-3">Message</h2>

        <p className="text-sm mb-2">
          <b>Name:</b> {message.name}
        </p>

        <p className="text-sm mb-2">
          <b>Email:</b> {message.email}
        </p>

        <div className="border p-3 rounded bg-gray-50 text-sm">
          {message.message}
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default MessageModal;