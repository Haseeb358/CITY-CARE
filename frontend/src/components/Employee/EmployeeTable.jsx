import { useState } from "react";
import EmployeeModal from "./EmployeeModal";
import AssignCredentialsModal from "./AssignCredentialsModal";
const EmployeeTable = ({ employees, user , setEmployees,refreshEmployees}) => {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");
  const [assignModal, setAssignModal] = useState(null);
  console.log("EmployeeTable Props:", { employees});
  return (
    <div className="overflow-x-auto mt-4 bg-white rounded-xl shadow">

      <table className="w-full table-auto border-collapse">

        {/* HEADER */}
        <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Zone</th>
            <th className="px-4 py-3">Roles</th>
            <th className="px-4 py-3 text-center">Actions</th>
            <th className="px-4 py-3 text-center">Logins</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="text-sm text-gray-700">
          {employees.map((emp) => (
            <tr
              key={emp._id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium">
                {emp.fullName}
              </td>

              <td className="px-4 py-3">
                {emp.city?.name || "N/A"}
              </td>

              <td className="px-4 py-3">
                {emp.zone?.name || "Null"}
              </td>
             {/* Show role of each employee */}
              <td className="px-4 py-3">
                {emp?.role || "N/A"}
              </td>
              {/* ✅ FIXED ACTIONS */}
              <td className="px-4 py-3">
                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => {
                      setSelected(emp);
                      setMode("view");
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>

                  {user?.roleUser === "admin" && (
                    <button
                      onClick={() => {
                        setSelected(emp);
                        setMode("update");
                      }}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Update
                    </button>
                  )}

                </div>
              </td>
              <td className="px-4 py-3 text-center">
  {!emp.userID && emp.role !== "worker" ? (
    <button
      onClick={() => setAssignModal(emp)}
      className="text-green-600 font-medium hover:underline cursor-pointer"
    >
      Assign Credentials
    </button>
  ) : (
    //  if role not worker give span with text "Assigned" otherwise show "N/A"
    <span className={`font-medium ${emp.role !== "worker" ? "text-red-600" : "text-gray-500"}`}>
      {emp.role !== "worker" ? "Already Assigned" : "N/A"}
    </span>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selected && (
        <EmployeeModal
          employee={selected}
          mode={mode}
          onClose={() => setSelected(null)}
          setEmployees={setEmployees}
          AllEmployees={employees}
          refreshEmployees={refreshEmployees}
        />
      )}
      {assignModal && (
  <AssignCredentialsModal
    employee={assignModal}
    onClose={() => setAssignModal(null)}
    refresh={refreshEmployees}
  />
)}
    </div>
  );
};

export default EmployeeTable;