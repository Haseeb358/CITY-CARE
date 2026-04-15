import ZoneStatusToggle from "./ZoneStatusToggle";

const ZoneTable = ({ zones, user, refresh }) => {

  return (
    <div className="mt-4 bg-white rounded-xl shadow overflow-x-auto">

      <table className="w-full border-collapse">

        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="px-4 py-3">Zone Name</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Status</th>
            {user?.roleUser === "admin" && (
              <th className="px-4 py-3 text-center">Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {zones.map(zone => (
            <tr key={zone._id} className="border-t hover:bg-gray-50">

              <td className="px-4 py-3">{zone.name}</td>
              <td className="px-4 py-3">{zone.city?.name}</td>

              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  zone.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {zone.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              {user?.roleUser === "admin" && (
                <td className="px-4 py-3 text-center">
                  <ZoneStatusToggle zone={zone} refresh={refresh} />
                </td>
              )}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneTable;