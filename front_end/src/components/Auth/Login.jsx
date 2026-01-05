import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import LoginImage from '../../assets/student_portal.jpg'; // make sure to include extension
import axios from 'axios'
import { useAuth } from "../../context/AuthContext";
import { notifySuccess } from '../../utils/notify';

const Login = () => {
  const api_url = import.meta.env.VITE_API_URL

  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is Required")
      .matches(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]{3,15}\.[a-zA-Z]{2,4}$/, "Enter Valid Email"),
    password: Yup.string().required("Enter a Password"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });


  const handleCheck = async (data) => {
    try {
      const res = await axios.post(`${api_url}api/auth/log_in`, data);
      login(res.data.token, res.data.user);
      notifySuccess(res.data.message || "Login successfully!");
     
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";

      setErrorMsg(message);
    }
  };



  const handleNavigate = () => {
    navigate("/sign_up");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${LoginImage})` }}
      >
        <div className="bg-black bg-opacity-30 w-full h-full flex items-center justify-center">
          <h1 className="text-white text-4xl  font-bold">Welcome Back!</h1>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit(handleCheck)}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-xl"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleNavigate}
            className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Sign-up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
