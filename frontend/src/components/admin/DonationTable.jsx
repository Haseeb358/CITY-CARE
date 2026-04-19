const DonationTable = ({ donations }) => {

  return (
    <div className="bg-white shadow rounded overflow-hidden">

      <table className="w-full table-fixed">

        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="px-4 py-3 w-[25%] text-left">Amount</th>
            <th className="px-4 py-3 w-[45%] text-left">Donar ID</th>
            <th className="px-4 py-3 w-[30%] text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {donations.length > 0 ? (
            donations.map(d => (
              <tr key={d._id} className="border-t hover:bg-gray-50">

                <td className="px-4 py-3 font-medium text-green-600">
                  Rs. {d.amount}
                </td>

                <td className="px-4 py-3 truncate">
                  {d.donarId ? d.donarId : "N/A"}
                </td>

                <td className="px-4 py-3">
                  {new Date(d.donatedAt).toLocaleString()}
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-5 text-gray-500">
                No donations found
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
};

export default DonationTable;