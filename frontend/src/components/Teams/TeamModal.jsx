const TeamModal = ({ team, mode, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-6 rounded w-125">

        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">
            {mode === "view" ? "Team Details" : "Update Team"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {mode === "view" && (
          <div className="space-y-3 text-sm">

            <div><b>Name:</b> {team.name}</div>
            <div><b>Zone:</b> {team.zone?.name}</div>
            <div><b>Leader:</b> {team.leader?.fullName}</div>

            <div>
              <b>Members:</b>
              <ul className="list-disc ml-5">
                {team.members?.map(m => (
                  <li key={m._id}>{m.fullName}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {mode === "update" && (
          <div className="text-center text-gray-500">
            Update UI coming soon...
          </div>
        )}

      </div>
    </div>
  );
};

export default TeamModal;