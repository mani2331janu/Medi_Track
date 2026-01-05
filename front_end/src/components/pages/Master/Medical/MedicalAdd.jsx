import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../../../../utils/api";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notifyError, notifySuccess } from "../../../../utils/notify";

const MedicalAdd = () => {
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;
  const [locations, setLocations] = useState([]);

  const schema = Yup.object().shape({
    location_id: Yup.object().required("Location is required"),
    medical_name: Yup.string().required("Medical Name is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchLocationName = async () => {
    try {
      const res = await api.get(`${api_url}api/master/location/getLocation`);
      const options = res.data.map((m) => ({
        value: m._id,
        label: m.location_name,
      }));
      setLocations(options);
    } catch (err) {
      console.log("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchLocationName();
  }, []);

  const onSubmitAdd = async (data) => {
    try {
      const payload = {
        medical_name: data.medical_name,
        location_id: data.location_id.value,
      };



      const res = await api.post(
        `${api_url}api/master/medical/add/submit`,
        payload
      );

      if (res.data.success) {
        notifySuccess(res.data.message);
        reset();
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
        notifyError("Server error");
      }
    }
  };


  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          <span>Medical / </span>
          <span>Add</span>
        </h3>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="bg-blue-500 text-white font-bold rounded px-3 py-1  hover:bg-blue-700 cursor-pointer"
        >
          Back
        </button>
      </div>

      <hr className="mt-4 border-gray-400 dark:border-gray-600" />

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmitAdd)}>
        <div className="flex flex-wrap">
          {/* Select Location */}
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

        {/* Submit Button */}
        <div className="mt-4 flex justify-end px-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-bold transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalAdd;
