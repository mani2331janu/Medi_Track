import React from 'react';
import { useNavigate } from 'react-router-dom';
import sampleFile from "../../../../assets/Excel/Master/LocationMaster.xlsx";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import api from '../../../../utils/api';
import { notifyError, notifySuccess } from '../../../../utils/notify';

const LocationImport = () => {
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;

    const handleBack = () => {
        navigate("/master/location/list");
    };

    const handelSampleDownload = () => {
        const link = document.createElement("a");
        link.href = sampleFile;
        link.download = "sample_location.xlsx";
        link.click();
    };

    const schema = Yup.object().shape({
        location_import: Yup.mixed()
            .required("File is required")
            .test("fileType", "Only Excel files are allowed", (value) => {
                if (!value || value.length === 0) return false;
                const allowedExtensions = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
                return allowedExtensions.includes(value[0].type);
            }),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSave = async (data) => {
        try {
            const file = data.location_import[0];
            if (!file) {
                notifyError("Please select a file first");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post(
                `${api_url}api/master/location/importSubmit`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            notifySuccess(res.data.message || "File uploaded successfully!");
            reset();
            navigate("/master/location/list");
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message || "File upload failed. Try again.";
            notifyError(message);
            reset();

        }
    };


    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Location Import</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handelSampleDownload}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Sample Download
                    </button>
                    <button
                        onClick={handleBack}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Back
                    </button>
                </div>
            </div>

            <hr className="mt-3 mb-3 border-gray-200" />

            <form onSubmit={handleSubmit(handleSave)}>
                <div className="w-1/2 px-2 mb-4">
                    <label className="block mb-1 font-medium">Upload file</label>
                    <input
                        {...register("location_import")}
                        type="file"
                        accept=".xlsx,.xls"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                            focus:outline-none file:bg-gray-800 file:text-white file:border-0 
                            file:rounded-s-lg file:px-4 file:py-2 file:cursor-pointer
                            hover:file:bg-gray-700"
                    />
                    {errors.location_import && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.location_import.message}
                        </p>
                    )}
                </div>

                <hr className="mt-3 mb-3 border-gray-200" />

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
    );
};

export default LocationImport;
