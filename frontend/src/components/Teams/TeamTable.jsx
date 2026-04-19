const TeamTable = ({ teams, onView, onUpdate }) => {

  return (
    <div className="bg-white rounded shadow overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3 text-left">Team</th>
            <th className="p-3 text-left">Zone</th>
            <th className="p-3 text-left">Leader</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {teams.map(t => (
            <tr key={t._id} className="border-t hover:bg-gray-50">

              <td className="p-3 font-medium">{t.name}</td>
              <td className="p-3">{t.zone?.name}</td>
              <td className="p-3">{t.leader?.fullName}</td>

              <td className="p-3 text-center space-x-3">
                <button
                  onClick={() => onView(t)}
                  className="text-blue-600"
                >
                  View
                </button>

                <button
                  onClick={() => onUpdate(t)}
                  className="text-green-600"
                >
                  Update
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default TeamTable;