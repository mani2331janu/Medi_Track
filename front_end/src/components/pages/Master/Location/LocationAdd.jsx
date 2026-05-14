import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { notifySuccess, notifyError } from '../../../../utils/notify';

const LocationAdd = () => {
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL

    const handleBack = () => {
        navigate("/master/location/list");
    }

    // Validation schema
    const schema = Yup.object().shape({
        location_name: Yup.string().required("Location is required"),
    });

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const handleSave = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!token || !user) {
                notifyError("You must be logged in");
                return;
            }

            const payload = { location_name: data.location_name };

            const res = await axios.post(`${api_url}api/master/location/add`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            notifySuccess(res.data.message || "Location created successfully!");
            reset();
            navigate("/master/location/list")

        } catch (error) {
            console.error(error.response?.data || error.message);

            if (error.response?.status === 400 && error.response.data.message) {
                setError("location_name", {
                    type: "server",
                    message: error.response.data.message
                });
            } else {
                notifyError(error.response?.data?.message || "Something went wrong!");
                navigate("/master/location/list")
            }
        }
    };

    return (
        <div className='p-4'>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Location Add</h3>
                <button
                    onClick={handleBack}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Back
                </button>
            </div>

            <hr className='mt-3 mb-3 border-gray-200' />

            {/* Form */}
            <form onSubmit={handleSubmit(handleSave)}>
                <div className='flex flex-wrap -mx-2'>
                    <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
                        <label htmlFor="location_name" className="block mb-1 font-medium text-gray-700">Location</label>
                        <input
                            {...register("location_name")}
                            id="location_name"
                            type="text"
                            placeholder="Type here..."
                            className={`w-full text-sm border rounded-md px-3 py-2 mt-2 transition 
                                ${errors.location_name ? 'border-red-500' : 'border-slate-300'} 
                                focus:outline-none focus:border-gray-600`}
                        />
                        {errors.location_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.location_name.message}</p>
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

export default LocationAdd;
