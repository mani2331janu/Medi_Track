import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import api from "../../../../utils/api";
import { notifySuccess } from "../../../../utils/notify";
import { useEffect } from "react";
import { BLOOD_GROUP, Gender, ROLE } from "../../../../constant/constant";

const EmployeeAdd = () => {
  const api_url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [dob, setDob] = useState(null);
  const [previews, setPreviews] = useState({
    profile_image: null,
    id_proof: null,
    degree_certificate: null,
    experience_certificate: null,
  });
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  const genderOption = [
    { value: Gender.MALE, label: "Male" },
    { value: Gender.FEMALE, label: "Female" },
    { value: Gender.OTHERS, label: "Others" },
  ];

  const bloodGroupOption = [
    { value: BLOOD_GROUP.A_POS, label: "A+" },
    { value: BLOOD_GROUP.A_NEG, label: "A-" },
    { value: BLOOD_GROUP.B_POS, label: "B+" },
    { value: BLOOD_GROUP.B_NEG, label: "B-" },
    { value: BLOOD_GROUP.AB_POS, label: "AB+" },
    { value: BLOOD_GROUP.AB_NEG, label: "AB-" },
    { value: BLOOD_GROUP.O_POS, label: "O+" },
    { value: BLOOD_GROUP.O_NEG, label: "O-" },
  ];

  const roles = [
    { value: ROLE.SUPER_ADMIN, label: "Super Admin" },
    { value: ROLE.NORMAL_USER, label: "Normal User" },
    { value: ROLE.SUPERVISOR, label: "Supervisor" },
  ];

  const defaultValues = {
    first_name: "",
    last_name: "",
    gender: null,
    blood_group: null,
    employee_id: "",
    mobile_no: "",
    profile_image: [],
    email: "",
    emg_mobile_no: "",
    address: "",
    city: "",
    pincode: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    id_proof: [],
    degree_certificate: [],
    experience_certificate: [],
  };

  const schema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("last Name is required"),
    gender: Yup.object().required("Gender is required"),
    role: Yup.array().min(1, "Role is required").required("Role is required"),
    blood_group: Yup.object().required("Blood group is required"),
    mobile_no: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter valid 10-digit mobile number")
      .required("Mobile number is required"),

    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required")
      .test("email-unique", "Email Already Exists", async function (value) {
        if (!value) return true;

        try {
          const data = { model: "Employee", field: "email", value, id: "" };
          const res = await api.post(
            `${api_url}api/administration/employee/unique-check`,
            data
          );
          return !res.data.exists;
        } catch (err) {
          console.error("Error checking unique email:", err);
          return true;
        }
      }),

    emg_mobile_no: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter valid 10-digit mobile number")
      .required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is Required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Enter valid 6-digit pincode")
      .required("Pincode is required"),

    bank_name: Yup.string().required("Bank Name is required"),
    account_number: Yup.string().required("Account Number is required"),
    ifsc_code: Yup.string().required("IFSC Code is required"),
    id_proof: Yup.mixed()
      .required("Id proof is required")
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          value &&
          value[0] &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
    degree_certificate: Yup.mixed()
      .required("Id proof is required")
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          value &&
          value[0] &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
    experience_certificate: Yup.mixed()
      .required("Id proof is required")
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          value &&
          value[0] &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
    profile_image: Yup.mixed()
      .required("Profile image is required")
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          value &&
          value[0] &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
    dob: Yup.date()
      .nullable()
      .required("Date of birth is required")
      .max(new Date(), "DOB cannot be in the future"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {

      setLoading(true);
      const formData = new FormData();
      const dobFormatted = data.dob
        ? new Date(data.dob).toISOString().split("T")[0]
        : null;

      formData.append("dob", dobFormatted);

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("gender", data.gender?.value);
      formData.append("blood_group", data.blood_group?.value);
      formData.append("employee_id", data.employee_id);
      formData.append("email", data.email);
      formData.append("mobile_no", data.mobile_no);
      formData.append("emg_mobile_no", data.emg_mobile_no);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("pincode", data.pincode);
      formData.append("bank_name", data.bank_name);
      formData.append("account_number", data.account_number);
      formData.append("ifsc_code", data.ifsc_code);

      if (data.role) {
        const roleValues = data.role.map((r) => r.value);
        formData.append("role", JSON.stringify(roleValues));
      }
      if (data.profile_image?.[0])
        formData.append("profile_image", data.profile_image[0]);
      if (data.id_proof?.[0]) formData.append("id_proof", data.id_proof[0]);
      if (data.degree_certificate?.[0])
        formData.append("degree_certificate", data.degree_certificate[0]);
      if (data.experience_certificate?.[0])
        formData.append(
          "experience_certificate",
          data.experience_certificate[0]
        );

      const res = await api.post(
        `${api_url}api/administration/employee/store`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      notifySuccess(res.data.message);
      navigate(-1);
    } catch (error) {
      console.error("❌ Error uploading employee:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ File Change Handler
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: previewURL,
      }));
    }
  };

  const handleSaveDraft = () => {
    const data = getValues(); // ✅ get all current field values (even if invalid)
    console.log("Draft data:", data);
    alert("Saved as draft without validation!");
  };

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const res = await api.get(
          `${api_url}api/administration/employee/generate-id`
        );
        setEmployeeId(res.data.employee_id);
      } catch (error) {
        console.error("Error generating employee ID", error);
      }
    };
    fetchEmployeeId();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          <span>Employee / </span>
          <span>Add</span>
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white cursor-pointer font-bold rounded px-3 py-1 hover:bg-blue-700"
        >
          Back
        </button>
      </div>

      <hr className="mt-4 border-gray-400 dark:border-gray-600" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap">
          <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
            Basic Information
          </div>

          {/* Employee ID */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Employee ID
            </label>
            <input
              type="text"
              {...register("employee_id")}
              value={employeeId}
              className="border border-gray-400 dark:border-gray-600 
               bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-200
               rounded w-full p-2 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Name */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className=" required block text-gray-700 dark:text-white font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              {...register("first_name")}
              placeholder="Enter First Name..."
              className="border border-gray-400 dark:border-gray-600 
               bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-200
               rounded w-full p-2 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.first_name && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* last name */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              {...register("last_name")}
              placeholder="Enter Last Name..."
              className="border border-gray-400 dark:border-gray-600 
               bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-200
               rounded w-full p-2 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.last_name && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Gender
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={genderOption}
                  placeholder="Select Gender"
                />
              )}
            />
            {errors.gender && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Blood Group
            </label>
            <Controller
              name="blood_group"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={bloodGroupOption}
                  placeholder="Select Blood Group"
                />
              )}
            />
            {errors.blood_group && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.blood_group.message}
              </p>
            )}
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Date of Birth
            </label>

            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  maxDate={new Date()}
                  placeholderText="Select Date of Birth"
                  dateFormat="dd-MM-yyyy"
                  className="border border-gray-400 dark:border-gray-600 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-200
                   rounded w-full p-2 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />

            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
            )}
          </div>

          {/* Profile Image */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className=" required block text-gray-700 dark:text-white font-medium mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("profile_image")}
              onChange={(e) => {
                handleFileChange(e, "profile_image");
                register("profile_image").onChange(e);
              }}
              className="border border-gray-400 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
          rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profile_image && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.profile_image.message}
              </p>
            )}
            {previews.profile_image && (
              <div className="mt-2">
                <img
                  src={previews.profile_image}
                  alt="Profile Preview"
                  className="h-16 w-16 object-cover rounded border dark:border-white"
                />
              </div>
            )}
          </div>
          {/* role */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Role
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={roles}
                  value={field.value}
                  onChange={(selected) => field.onChange(selected)}
                  placeholder="Select Roles"
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                />
              )}
            />

            {errors.role && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>
          <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
            Contact Information
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2  ">
            <label
              className="required block text-gray-700 dark:text-white font-medium mb-2"
              htmlFor="mobile_no"
            >
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter Email ID..."
              className="border border-gray-400 dark:border-gray-600 
                   rounded bg-white dark:bg-gray-800 text-gray-900
                   dark:text-gray-200 w-full p-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2  ">
            <label
              className="required block text-gray-700 dark:text-white font-medium mb-2"
              htmlFor="mobile_no"
            >
              Mobile No
            </label>
            <input
              {...register("mobile_no")}
              placeholder="Enter Mobile no..."
              className="border border-gray-400 dark:border-gray-600 
                   rounded bg-white dark:bg-gray-800 text-gray-900
                   dark:text-gray-200 w-full p-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.mobile_no && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.mobile_no.message}
              </p>
            )}
          </div>

          {/* emg contact no */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2  ">
            <label
              className="required block text-gray-700 dark:text-white font-medium mb-2"
              htmlFor="emg_mobile_no"
            >
              Emergency Contact Number
            </label>
            <input
              {...register("emg_mobile_no")}
              placeholder="Enter Emergency Num...."
              className="border border-gray-400 dark:border-gray-600 
                   rounded bg-white dark:bg-gray-800 text-gray-900
                   dark:text-gray-200 w-full p-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.emg_mobile_no && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.emg_mobile_no.message}
              </p>
            )}
          </div>

          {/* address */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label
              className="required block text-gray-700 dark:text-white font-medium mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <textarea
              {...register("address")}
              placeholder="Enter address"
              className="border border-gray-400 dark:border-gray-600 
           rounded bg-white dark:bg-gray-800 text-gray-900
           dark:text-gray-200 w-full p-2
           focus:outline-none focus:ring-2 focus:ring-blue-500
           resize-none h-24"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* city */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2  ">
            <label
              className="required block text-gray-700 dark:text-white font-medium mb-2"
              htmlFor="city"
            >
              City
            </label>
            <input
              {...register("city")}
              placeholder="Enter City...."
              className="border border-gray-400 dark:border-gray-600 
                   rounded bg-white dark:bg-gray-800 text-gray-900
                   dark:text-gray-200 w-full p-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.city && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* pincode */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2  ">
            <label
              className="required block text-gray-700 dark:text-white font-medium mb-2"
              htmlFor="pincode"
            >
              Pincode
            </label>
            <input
              {...register("pincode")}
              placeholder="Enter Pincode...."
              className="border border-gray-400 dark:border-gray-600 
                   rounded bg-white dark:bg-gray-800 text-gray-900
                   dark:text-gray-200 w-full p-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.pincode && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>

          <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
            Bank Details
          </div>

          {/* bankname */}
          <div className="w-full sm:w-1/3 lg:w-1/3 mt-3 px-2">
            <label
              htmlFor="bank_name"
              className="required block text-gray-700 dark:text-white font-medium mb-2"
            >
              Bank Name
            </label>
            <input
              type="text"
              {...register("bank_name")}
              placeholder="Enter Your Bank Name..."
              className="border border-gray-400 dark:border-gray-600 
                rounded bg-white dark:bg-gray-800 text-gray-900
                dark:text-gray-200 w-full p-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            {errors.bank_name && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.bank_name.message}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="w-full sm:w-1/3 lg:w-1/3 mt-3 px-2">
            <label
              htmlFor="account_number"
              className="required block text-gray-700 dark:text-white font-medium mb-2"
            >
              Account Number
            </label>
            <input
              type="text"
              {...register("account_number")}
              placeholder="Enter Account Number..."
              className="border border-gray-400 dark:border-gray-600 
                rounded bg-white dark:bg-gray-800 text-gray-900
                dark:text-gray-200 w-full p-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            {errors.account_number && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.account_number.message}
              </p>
            )}
          </div>

          {/* iffs code */}
          <div className="w-full sm:w-1/3 lg:w-1/3 mt-3 px-2">
            <label
              htmlFor="ifsc_code"
              className="required block text-gray-700 dark:text-white font-medium mb-2"
            >
              IFSC Code
            </label>
            <input
              type="text"
              {...register("ifsc_code")}
              placeholder="Enter IFSC Code..."
              className="border border-gray-400 dark:border-gray-600 
                rounded bg-white dark:bg-gray-800 text-gray-900
                dark:text-gray-200 w-full p-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            {errors.ifsc_code && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.ifsc_code.message}
              </p>
            )}
          </div>

          <div className="w-full font-bold text-white mt-3 px-4 py-2 rounded-md bg-blue-700 dark:bg-gray-600 border border-blue-800 dark:border-gray-700 shadow-sm">
            Documents
          </div>

          {/* ID Proof */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              ID Proof
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("id_proof")}
              onChange={(e) => {
                handleFileChange(e, "id_proof");
                register("id_proof").onChange(e);
              }}
              className="border border-gray-400 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
          rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.id_proof && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.id_proof.message}
              </p>
            )}
            {previews.id_proof && (
              <div className="mt-2">
                <img
                  src={previews.id_proof}
                  alt="ID Proof Preview"
                  className="h-16 w-16 object-cover rounded border dark:border-white"
                />
              </div>
            )}
          </div>

          {/* Degree Certificate */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Degree Certificate
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("degree_certificate")}
              onChange={(e) => {
                handleFileChange(e, "degree_certificate");
                register("degree_certificate").onChange(e);
              }}
              className="border border-gray-400 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
          rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.degree_certificate && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.degree_certificate.message}
              </p>
            )}
            {previews.degree_certificate && (
              <div className="mt-2">
                <img
                  src={previews.degree_certificate}
                  alt="Degree Preview"
                  className="h-16 w-16 object-cover rounded border dark:border-white"
                />
              </div>
            )}
          </div>

          {/* Experience Certificate */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
            <label className="required block text-gray-700 dark:text-white font-medium mb-2">
              Experience Certificate
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("experience_certificate")}
              onChange={(e) => {
                handleFileChange(e, "experience_certificate");
                register("experience_certificate").onChange(e);
              }}
              className="border border-gray-400 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200
          rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.experience_certificate && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.experience_certificate.message}
              </p>
            )}
            {previews.experience_certificate && (
              <div className="mt-2">
                <img
                  src={previews.experience_certificate}
                  alt="Experience Preview"
                  className="h-16 w-16 object-cover rounded border dark:border-white"
                />
              </div>
            )}
          </div>
        </div>

        <hr className="mt-4 border-gray-400 dark:border-gray-600" />

        {/* Submit Button */}
        <div className="mt-4 flex justify-end px-2 gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-800 font-semibold transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 font-semibold transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              reset(defaultValues);
              setDob(null);
              setPreviews({
                profile_image: null,
                id_proof: null,
                degree_certificate: null,
                experience_certificate: null,
              });
            }}
            disabled={loading}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAdd;
