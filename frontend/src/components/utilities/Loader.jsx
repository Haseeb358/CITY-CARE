const Loader = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim Background */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Spinner */}
      <div className="relative z-10">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;