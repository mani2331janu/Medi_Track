import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../utils/api'; // your axios instance

const LocationView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [locationName, setLocationName] = useState('');
    const api_url = import.meta.env.VITE_API_URL;

    // Fetch location details
    const fetchLocation = async () => {
        try {
            const res = await api.get(`${api_url}api/master/location/view/${id}`);
            setLocationName(res.data.location_name);
        } catch (err) {
            console.error('Error fetching location:', err);
            alert('Failed to load location data.');
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [id]);

    const handleBack = () => {
        navigate('/master/location/list');
    };

    return (
        <div className='p-4'>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black dark:text-white">Location View</h3>
                <button
                    onClick={handleBack}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Back
                </button>
            </div>

            <hr className='mt-3 mb-3 border-gray-200' />

            {/* Form */}
            <div className='flex flex-wrap -mx-2'>
                <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
                    <label htmlFor="location_name" className="block mb-1 font-medium text-gray-700 dark:text-white">
                        Location
                    </label>
                    <input
                        id="location_name"
                        type="text"
                        value={locationName}
                        readOnly
                        className="border border-gray-400 dark:border-gray-600 
                            bg-white dark:bg-gray-800 
                            text-gray-900 dark:text-gray-200
                            rounded w-full p-2 
                            cursor-not-allowed"
                    />
                </div>
            </div>

            <hr className='mt-3 mb-3 border-gray-200' />
        </div>
    );
};

export default LocationView;
