const DonationStats = ({ totalAmount, filter }) => {
  return (
    <div className="bg-white shadow rounded p-4 mb-4">

      <h2 className="text-sm text-gray-500">
        Total Donations ({filter})
      </h2>

      <p className="text-2xl font-bold text-green-600">
        Rs. {totalAmount}
      </p>

    </div>
  );
};

export default DonationStats;