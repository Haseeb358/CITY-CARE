const ContactTable = ({ messages, onView }) => {

  return (
    <div className="bg-white shadow rounded overflow-hidden">

      <table className="w-full table-fixed">

        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="px-4 py-3 w-[30%] text-left">Name</th>
            <th className="px-4 py-3 w-[40%] text-left">Email</th>
            <th className="px-4 py-3 w-[30%] text-center">Message</th>
          </tr>
        </thead>

        <tbody>
          {messages.map(m => (
            <tr key={m._id} className="border-t hover:bg-gray-50">

              <td className="px-4 py-3">{m.name}</td>
              <td className="px-4 py-3">{m.email}</td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onView(m)}
                  className="text-blue-600 underline"
                >
                  View Message
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default ContactTable;