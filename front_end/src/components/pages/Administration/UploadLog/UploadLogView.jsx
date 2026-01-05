import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { getUploadLogStatus } from "../../../../utils/helper";

const UploadLogView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUploadLog = async () => {
        try {
            const res = await api.get(`${api_url}api/administration/uploadlog/view/${id}`);
            console.log(res);

            setLog(res.data || res);
        } catch (error) {
            console.error("Error fetching upload log:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadLog();
    }, [id]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading...</div>;
    }

    if (!log) {
        return <div className="p-6 text-center text-red-500">Log not found</div>;
    }

    let parsedErrors = [];
    try {
        parsedErrors = log.errors_reason ? JSON.parse(log.errors_reason) : [];
    } catch {
        parsedErrors = [];
    }


    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black dark:text-white">Upload Log Details</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-3 text-white py-1 bg-blue-500 rounded transition-transform duration-400 hover:scale-110 hover:bg-blue-700"
                >
                    Back
                </button>
            </div>
            <hr className="my-4 border border-gray-400 dark:border-white" />


            <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm">
                <div>
                    <label className="block text-black-900 dark:text-white font-semibold text-l mb-2">File Name</label>
                    <p className="text-gray-800 dark:text-white">{log.file_name || "-"}</p>
                </div>

                <div>
                    <label className="block text-black-900 dark:text-white font-semibold text-l  mb-2">Status</label>
                    <p className="text-gray-800 dark:text-white">{getUploadLogStatus(log.status)}</p>
                </div>

                <div>
                    <label className="block text-black-900 dark:text-white font-semibold text-l  mb-2">Created By</label>
                    <p className="text-gray-800 dark:text-white">
                        {log.created_by?.first_name || "-"}
                    </p>
                </div>

                <div>
                    <label className="block text-black-900 dark:text-white font-semibold text-l  mb-2">Updated At</label>
                    <p className="text-gray-800 dark:text-white">
                        {new Date(log.updatedAt).toLocaleString()}
                    </p>
                </div>
            </div>

           <hr className="my-4 border border-gray-400 dark:border-white" />

            <div className="">
                <label className="block text-black-900 font-bold dark:text-white text-l mb-2">Errors</label>
                {parsedErrors && parsedErrors.length > 0 ? (
                    <div className="space-y-2 text-sm">
                        {parsedErrors.map((e, index) => (
                            <div key={index} className="border border-red-200 rounded p-3 bg-red-50  dark:bg-gray-800/70">
                                <p className="font-medium text-red-700 mb-2 dark:text-white">Row {e.row}</p>
                                {Object.entries(e.errors || {}).map(([key, val]) => (
                                    <p key={key} className="text-red-600 ml-2 dark:text-white">
                                        <span className="font-semibold">{key}:</span> {val}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm dark:text-white">No errors recorded.</p>
                )}
            </div>


        </div>
    );
};

export default UploadLogView;
