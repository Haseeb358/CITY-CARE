const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 gap-2">

      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded"
      >
        Prev
      </button>

      <span className="px-3 py-1">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded"
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;