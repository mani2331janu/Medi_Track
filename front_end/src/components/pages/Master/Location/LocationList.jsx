import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { notifySuccess } from "../../../../utils/notify";
import Swal from "sweetalert2";
import { TbEdit } from "react-icons/tb";
import { TbEyeDotted } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";

const LocationList = () => {
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;
  const [locations, setLocations] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterLocation, setFilterLocation] = useState([])


  const getAllList = async () => {
    try {
      const res = await api.get(`${api_url}api/master/location/list`);
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  useEffect(() => {
    getAllList();
  }, []);

  const handleAdd = () => {
    navigate("/master/location/add");
  };
  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });
      if (result.isConfirmed) {

        const res = await api.delete(`${api_url}api/master/location/delete/${id}`)
        notifySuccess(res.data.message);
        setLocations((pre) => pre.filter(p => p._id !== id))
      }

    } catch (error) {
      notifyError(error.response?.data?.message || "Something went wrong!");
    }
  }

  const statusChange = async (id, status) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${status == 1 ? 'Deactivate' : 'Activate'} this Location`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Change it!"
      });
      if (result.isConfirmed) {

        const res = await api.put(`${api_url}api/master/location/statusChange/${id}`, {
          status: status === 1 ? 0 : 1
        });
        notifySuccess(res.data.message);
        setLocations((prev) =>
          prev.map((loc) =>
            loc._id === id ? { ...loc, status: status === 1 ? 0 : 1 } : loc
          )
        )
      }

    } catch (error) {
      notifyError(error.response?.data?.message || "Something went wrong!");
    }
  }

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!filterLocation) {
        getAllList();
      }
      const res = await api.post(`${api_url}api/master/location/filterData`, {
        location_name: filterLocation,
      });
      console.log("Filtered data:", res.data);
      setLocations(res.data);
    } catch (err) {
      notifyError(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleReset = () => {
    setFilterLocation("");
    getAllList();
  }


  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold dark:text-white">Location List</h3>

        <div className="flex space-x-2">
          <button
            onClick={()=>{navigate("/master/location/importLocation")}}
            className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-700">
            Import
          </button>
          <button onClick={handleFilter}
            className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-700">
            Filter
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {showFilter && (
        <form
          onSubmit={handleFilterSubmit}
          className="overflow-hidden transition-all duration-300 opacity-100 mt-4 mb-3 bg-gray-100 p-4 rounded border border-gray-300"
        >
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <label htmlFor="location_name" className="block mb-1 font-medium text-gray-700">
                Location
              </label>
              <input
                id="location_name"
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="Type here..."
                className="w-full text-sm border rounded-md px-3 py-2 mt-2 transition focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            type="submit"
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2"
          >
            Reset
          </button>
        </form>

      )}


      <div className="overflow-x-auto">
        <table className="border border-gray-300 rounded min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">S.No</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>

            </tr>
          </thead>

          <tbody>
            {locations.map((loc, index) => (
              <tr key={loc._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border dark:text-white dark:hover:text-black text-center">{index + 1}</td>
                <td className="px-4 py-2 border dark:text-white dark:hover:text-black text-center">{loc.location_name}</td>
                <td className="px-4 py-2 border dark:text-white dark:hover:text-black text-center">
                  <button onClick={() => { statusChange(loc._id, loc.status) }} className="cursor-pointer text-blue-600 p-1">
                    {loc.status == 1 ? "Active" : "In-Active"}
                  </button>
                </td>

                <td className="px-4 dark:text-white dark:hover:text-black py-2 border text-center">
                  <button
                    onClick={() => { navigate(`/master/location/edit/${loc._id}`) }}
                    className="cursor-pointer text-blue-600 p-1 hover:text-black hover:scale-125 transition-transform duration-200"
                  >
                    <TbEdit />
                  </button>

                  <button
                    onClick={() => { navigate(`/master/location/view/${loc._id}`) }}
                    className="cursor-pointer text-blue-600 p-1 hover:text-black hover:scale-125 transition-transform duration-200"
                  >
                    <TbEyeDotted />
                  </button>

                  <button
                    onClick={() => { handleDelete(loc._id) }}
                    className=" cursor-pointer text-blue-600 p-1 hover:text-black hover:scale-125 transition-transform duration-200"
                  >
                    <MdDeleteForever />
                  </button>

                </td>
              </tr>
            ))}

            {locations.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-3 text-gray-500">
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationList;
