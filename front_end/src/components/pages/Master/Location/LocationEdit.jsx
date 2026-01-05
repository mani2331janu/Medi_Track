import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../../utils/api';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notifyError, notifySuccess } from '../../../../utils/notify';
const LocationEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const api_url = import.meta.env.VITE_API_URL
    const handleBack = () => {
        navigate("/master/location/list");
    }
    const fetchLocation = async () => {
        try {
            const res = await api.get(`${api_url}api/master/location/edit/${id}`);
            setValue("location_name", res.data.location_name);
            setValue("id", res.data._id);
        } catch (err) {
            console.error("Error fetching location:", err);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [id]);

    const schema = Yup.object().shape({
        location_name: Yup.string().required("Location Name is Required")
    })

    const { register, handleSubmit, setValue, formState: { errors }, reset, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const handleUpdate = async (data) => {
        try {
            const res = await api.put(`${api_url}api/master/location/update`, data);
            console.log(res.data);
            notifySuccess(res.data.message);
            navigate("/master/location/list");

        } catch (error) {
            console.error(error.response?.data || error.message);
            if (error.response?.status === 404) {
                setError("location_name", {
                    type: "server",
                    message: error.response.data.message
                });
            } else {
                notifyError(error.response?.data?.message || "Something went wrong!");
                navigate("/master/location/list");
            }
        }
    };


    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black dark:text-white">Location Edit</h3>
                <button
                    onClick={handleBack}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Back
                </button>
            </div>
            <hr className='mt-3 mb-3 border-gray-200' />
            <form onSubmit={handleSubmit(handleUpdate)} >
                <input type="hidden" {...register("id")} />
                <div className='flex flex-wrap -mx-2'>
                    <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
                        <label htmlFor="location_name" className="block mb-1 text-medium font-bold text-black dark:text-white">Location</label>
                        <input
                            {...register("location_name")}
                            id="location_name"
                            type="text"
                            placeholder="Type here..."
                            className="border border-gray-400 dark:border-gray-600 
                            bg-white dark:bg-gray-800 
                            text-gray-900 dark:text-gray-200
                            rounded w-full p-2 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.location_name && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.location_name.message}</p>
                        )}
                    </div>
                </div>

                <hr className='mt-3 mb-3 border-gray-200' />

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </form>

        </div>
    )
}

export default LocationEdit
