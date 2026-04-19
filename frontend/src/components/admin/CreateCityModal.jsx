import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const CreateCityModal = ({ onClose, refresh }) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${API_URL}${API_ADMIN_ROUTE}/create-city`,
        data,
        { withCredentials: true }
      );

      toast.success("City created");
      onClose();
      refresh();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-5 rounded w-100">

        <h2 className="text-lg font-semibold mb-3">Create City</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          <input
            placeholder="City Name"
            {...register("name", { required: "Required" })}
            className="border w-full p-2 rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            placeholder="Province"
            {...register("province", { required: "Required" })}
            className="border w-full p-2 rounded"
          />
          {errors.province && <p className="text-red-500">{errors.province.message}</p>}

          <button className="bg-blue-600 text-white w-full py-2 rounded">
            Create
          </button>

        </form>

        <button onClick={onClose} className="mt-2 text-red-500">Close</button>
      </div>
    </div>
  );
};

export default CreateCityModal;