export default function FileUpload({ files, onFilesChange }) {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024,
    );
    if (files.length + validFiles.length <= 5) {
      onFilesChange([...files, ...validFiles]);
    } else {
      alert("Maximum 5 files allowed");
    }
  };

  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Supporting Documents
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <svg
          className="mx-auto h-10 w-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Upload supporting documents (images, PDFs, etc.)
        </p>
        <label className="mt-3 inline-block cursor-pointer">
          <span className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
            Choose Files
          </span>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">Maximum 5 files, 10MB each</p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
            >
              <span className="text-sm text-gray-700 truncate">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}