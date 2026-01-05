import React, { useEffect, useRef, useState } from "react";
import {
  FiEdit,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiHash,
} from "react-icons/fi";
import api from "../../utils/api";
import { displayDateFormat, getRoleName } from "../../utils/helper";
import { notifyError, notifySuccess } from "../../utils/notify";


const Profile = () => {
  const api_url = import.meta.env.VITE_API_URL;

  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [activeTab, setActiveTab] = useState("account");

  const fetchData = async () => {
    try {
      const res = await api.get(
        `${api_url}api/administration/get-profile-data`
      );
      setProfile(res.data);
    } catch (error) {
      console.log("❌ Profile fetch error:", error);
    }
  };

  const changeImage = async () => {
    fileInputRef.current.click()
  };

  const handleFileChange = async (e) => {
    try{
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("profile_image",file)
      const data = await api.post(`${api_url}api/administration/profile-image/update`,formData,{
        headers:{"Content-type":"mulipart/form-data"}
      })
      notifySuccess(data.message)
      fetchData();

    }catch(error){
      console.log(error);
      notifyError(error);
      
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-300 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              src={profile.profile_image || "/default-user.png"}
              onClick={() => setShowModal("profile_image")}
              alt="Profile"
              className="w-40 h-40 rounded-full border-2 border-blue-500 object-cover cursor-pointer shadow-md hover:opacity-90 transition"
            />

            <button className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-110 transition cursor-pointer">
              <FiEdit
                className="text-blue-600 w-5 h-5"
                onClick={() => changeImage()}
              />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="text-center">
            <label className="block text-black-900 dark:text-white font-bold text-l mb-1">
              Role
            </label>

            <p className="text-gray-800 dark:text-white">
              {profile.role && profile.role.length > 0
                ? profile.role.map((r) => getRoleName(r)).join(", ")
                : "-"}
            </p>
          </div>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center rounded-lg items-center z-50"
            onClick={() => setShowModal(null)}
          >
            <img
              src={profile[showModal]}
              alt="Preview"
              className="w-[420px] h-[420px] object-cover rounded-lg shadow-xl border-4 border-white"
            />
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-5">
            {profile.first_name} {profile.last_name}
          </h2>

          <div className="space-y-4">
            {/* Employee ID */}
            <div className="flex items-start gap-3">
              <FiHash className="text-gray-800 dark:text-white w-5 h-5" />
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">
                  Employee ID:
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.employee_id || "N/A"}
                </p>
              </div>
            </div>

            {/* DOB */}
            <div className="flex items-start gap-3">
              <FiCalendar className="text-gray-800 dark:text-white w-5 h-5" />
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">
                  Date of Birth:
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {displayDateFormat(profile.dob) || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <FiMapPin className="text-gray-800 dark:text-white w-5 h-5" />
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">
                  Present Address:
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.address && profile.city && profile.pincode
                    ? `${profile.address}, ${profile.city}, ${profile.pincode}`
                    : "Not Provided"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <FiMail className="text-gray-800 dark:text-white w-5 h-5" />
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">
                  Email:
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.email || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <FiPhone className="text-gray-800 dark:text-white w-5 h-5" />
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">
                  Mobile Number:
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.mobile_no || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4 bg-blue-50 dark:bg-gray-800 p-3 border border-blue-200 dark:border-gray-700 rounded-xl">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-6 py-2 rounded-xl font-semibold transition 
            ${
              activeTab === "account"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
        >
          🏦 Account Details
        </button>

        <button
          onClick={() => setActiveTab("skill")}
          className={`px-6 py-2 rounded-xl font-semibold transition 
            ${
              activeTab === "skill"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
        >
          🛠 Skill Details
        </button>
      </div>

      <div className="mt-6 bg-blue-100 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-5">
        {activeTab === "account" && (
          <div className="grid md:grid-cols-4 gap-y-6 gap-x-10 text-sm">
            <div>
              <label className="font-bold text-gray-900 dark:text-white">
                Account Number
              </label>
              <p className="text-gray-800 dark:text-gray-300">
                {profile.account_number || "-"}
              </p>
            </div>

            <div>
              <label className="font-bold text-gray-900 dark:text-white">
                Bank Name
              </label>
              <p className="text-gray-800 dark:text-gray-300">
                {profile.bank_name || "-"}
              </p>
            </div>

            <div>
              <label className="font-bold text-gray-900 dark:text-white">
                IFSC Code
              </label>
              <p className="text-gray-800 dark:text-gray-300">
                {profile.ifsc_code || "-"}
              </p>
            </div>

            <div>
              <label className="font-bold text-gray-900 dark:text-white">
                UAN Number
              </label>
              <p className="text-gray-800 dark:text-gray-300">
                {profile.uan_number || "-"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "skill" && (
          <p className="text-gray-800 dark:text-gray-300">No skill Available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
