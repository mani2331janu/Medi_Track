import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import api from "../../../../utils/api";
import { notifySuccess, notifyError } from "../../../../utils/notify";

const MedicalEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const [locations, setLocations] = useState([]);
  const [fetchedData, setFetchedData] = useState(null);


  const schema = Yup.object().shape({
    medical_name: Yup.string().required("Medical name is required"),
    location_id: Yup.object().required("Location is required"),
  });


  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      medical_name: "",
      location_id: null,
    },
  });


  const fetchLocations = async () => {
    try {
      const res = await api.get(`${api_url}api/master/location/getLocation`);
      const options = res.data.map((m) => ({
        value: m._id,
        label: m.location_name,
      }));
      setLocations(options);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };


  const fetchMedical = async () => {
    try {
      const res = await api.get(`${api_url}api/master/medical/edit/${id}`);
      const data = res.data.data;

      const defaultValues = {
        medical_name: data.medical_name || "",
        location_id: {
          value: data.location_id?._id,
          label: data.location_id?.location_name,
        },
      };

      setFetchedData(defaultValues);
      reset(defaultValues);
    } catch (err) {
      console.error("Error fetching medical:", err);
    }
  };

  const onSubmitEdit = async (data) => {
    try {
      const payload = {
        medical_name: data.medical_name,
        location_id: data.location_id.value,
      };

      const res = await api.put(
        `${api_url}api/master/medical/update/${id}`,
        payload
      );

      // Success response (200)
      if (res.data.success) {
        notifySuccess(res.data.message);
        navigate(-1);
      } else {
        setError("medical_name", {
          type: "manual",
          message: res.data.message || "Something went wrong",
        });
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError("medical_name", {
          type: "manual",
          message: err.response.data.message,
        });
      } else {
        notifyError("Failed to update medical");
      }
    }
  };


  const handleReset = () => {
    if (fetchedData) reset(fetchedData);
  };

  useEffect(() => {
    fetchLocations();
    fetchMedical();
  }, [id]);

  return (
    <div className="">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black dark:text-white">Medical Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-3 text-white py-1 bg-blue-500 rounded transition-transform duration-400 hover:scale-110 hover:bg-blue-700"
        >
          Back
        </button>
      </div>
      <hr className="mt-4 border-gray-400 dark:border-gray-600" />

      <form onSubmit={handleSubmit(onSubmitEdit)}>
        <div className="flex flex-wrap">

          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="block text-gray-700 dark:text-white font-medium mb-2">
              Select Location
            </label>
            <Controller
              name="location_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={locations}
                  placeholder="Select Location..."
                  classNamePrefix="react-select"
                  value={field.value}
                  onChange={(selected) => field.onChange(selected)}
                />
              )}
            />
            {errors.location_id && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.location_id.message}
              </p>
            )}
          </div>


          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="block text-gray-700 dark:text-white font-medium mb-2">
              Medical Name
            </label>
            <input
              type="text"
              {...register("medical_name")}
              className="border border-gray-400 dark:border-gray-600 
            bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-200
               rounded w-full p-2 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Medical Name"
            />
            {errors.medical_name && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.medical_name?.message}
              </p>
            )}
          </div>
        </div>

        <hr className="mt-4 border-gray-400 dark:border-gray-600" />


        <div className="mt-4 flex justify-end px-2 space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded font-bold transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-bold transition-colors"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalEdit;
