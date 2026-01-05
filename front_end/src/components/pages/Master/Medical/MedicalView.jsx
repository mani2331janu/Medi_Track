import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../../utils/api';
import { notifyError } from '../../../../utils/notify';
import { displayDateFormat } from '../../../../utils/helper';

const MedicalView = () => {
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL
    const { id } = useParams();
    const [locationData, setLocationData] = useState([]);
    console.log(id);

    const fetchData = async () => {
        try {
            const res = await api.get(`${api_url}api/master/medical/view/${id}`)
            console.log(res.data);
            setLocationData(res.data.data);

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => { fetchData() })

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black dark:text-white">Medical Details</h2>
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
                    <label className="block text-black-900 dark:text-white font-bold text-l mb-2">Location Name</label>
                    <p className="text-gray-800 dark:text-white">{locationData.location_id?.location_name}</p>
                </div>

                 <div>
                    <label className="block text-black-900 dark:text-white font-bold text-l mb-2">Medical Name</label>
                    <p className="text-gray-800 dark:text-white">{locationData.medical_name}</p>
                </div>

                 <div>
                    <label className="block text-black-900 dark:text-white font-bold text-l mb-2">Created By</label>
                    <p className="text-gray-800 dark:text-white">{locationData.created_by?.first_name}</p>
                </div>

                 <div>
                    <label className="block text-black-900 dark:text-white font-bold text-l mb-2">Created At</label>
                    <p className="text-gray-800 dark:text-white">{displayDateFormat(locationData.createdAt)}</p>
                </div>

               
            </div>

            <hr className="my-4 border border-gray-400 dark:border-white" />




        </div>
    )
}

export default MedicalView
