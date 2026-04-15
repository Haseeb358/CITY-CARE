const ConfirmDeleteModal = ({ onConfirm, onCancel, message }) => {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-5 w-87.5 shadow">

        <h2 className="text-lg font-semibold mb-3 text-red-600">
          ⚠️ Warning
        </h2>

        <p className="text-sm text-gray-700 mb-4">
          {message || "Are you sure you want to delete this?"}
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;