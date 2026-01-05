import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/api";
import { useEffect } from "react";
import { useState } from "react";
import {
  displayDateFormat,
  displayStatus,
  getBloodGroup,
  getGender,
  getRoleName,
} from "../../../../utils/helper";

const EmployeeView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const api_url = import.meta.env.VITE_API_URL;
  const [employee, setEmployee] = useState({});
  const [showModal, setShowModal] = useState(null);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(
        `${api_url}api/administration/employee/view/${id}`
      );
      console.log(res.data);

      setEmployee(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Employee Details
        </h2>
        <button
          onClick={() => navigate("/administration/employee/list")}
          className="px-3 text-white py-1 bg-blue-500 rounded transition-transform duration-400 hover:scale-110 hover:bg-blue-700"
        >
          Back
        </button>
      </div>
      <hr className="my-4 border border-gray-400 dark:border-white" />

      <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
        Basic Information
      </div>
      <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm p-4">
        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Employee ID
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.employee_id || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Employee Name
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {`${employee.first_name} ${employee.last_name}` || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Gender
          </label>
          <p className="text-gray-800 dark:text-white">
            {getGender(employee.gender) || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Blood Group
          </label>
          <p className="text-gray-800 dark:text-white">
            {getBloodGroup(employee.blood_group) || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Date of Birth
          </label>
          <p className="text-gray-800 dark:text-white">
            {displayDateFormat(employee.dob)}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Profile Image
          </label>
          <img
            src={employee.profile_image}
            onClick={() => setShowModal("profile_image")}
            alt="Profile"
            className="w-10 h-10 object-cover cursor rounded-full"
          />
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
              onClick={() => setShowModal(null)}
            >
              <img
                src={employee[showModal]}
                alt="Full Preview"
                className="w-[400px] h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Role
          </label>

          <p className="text-gray-800 dark:text-white">
            {employee.role && employee.role.length > 0
              ? employee.role.map((r) => getRoleName(r)).join(", ")
              : "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Created By
          </label>
          <p className="text-gray-800 dark:text-white">
            {employee.created_by?.first_name || ""}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Created At
          </label>
          <p className="text-gray-800 dark:text-white">
            {displayDateFormat(employee.createdAt)}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Status
          </label>
          <p className="text-gray-800 dark:text-white">
            {displayStatus(employee.status)}
          </p>
        </div>
      </div>

      <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
        Contact Information
      </div>

      <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm p-4">
        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Email
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.email || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Mobile No
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.mobile_no || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Emergency Contact No
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.emg_mobile_no || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            City
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.city || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Pincode
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.pincode || "-"}
          </p>
        </div>
      </div>

      <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
        Bank Details
      </div>

      <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm p-4">
        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Bank Name
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.bank_name || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Account Number
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.account_number || "-"}
          </p>
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            IFSC Code
          </label>
          <p className="text-gray-800 dark:text-white">
            {" "}
            {employee.ifsc_code || "-"}
          </p>
        </div>
      </div>

      <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
        Documents
      </div>

      <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm p-4">
        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            ID Proof
          </label>
          <img
            src={employee.id_proof}
            onClick={() => setShowModal("id_proof")}
            alt="ID Proof"
            className="w-10 h-10 object-cover cursor rounded-full"
          />
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
              onClick={() => setShowModal(null)}
            >
              <img
                src={employee[showModal]}
                alt="Full Preview"
                className="w-[400px] h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            Degree Certificate
          </label>
          <img
            src={employee.degree_certificate}
            onClick={() => setShowModal("degree_certificate")}
            alt="Degree Certificate"
            className="w-10 h-10 object-cover cursor rounded-full"
          />
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
              onClick={() => setShowModal(null)}
            >
              <img
                src={employee[showModal]}
                alt="Full Preview"
                className="w-[400px] h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-black-900 dark:text-white font-bold text-l mb-2">
            {" "}
            Experience Certificate
          </label>
          <img
            src={employee.experience_certificate}
            onClick={() => setShowModal("experience_certificate")}
            alt=" Experience Certificate"
            className="w-10 h-10 object-cover cursor rounded-full"
          />
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
              onClick={() => setShowModal(null)}
            >
              <img
                src={employee[showModal]}
                alt="Full Preview"
                className="w-[400px] h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
      <hr className="my-4 border border-gray-400 dark:border-white" />
    </div>
  );
};

export default EmployeeView;
