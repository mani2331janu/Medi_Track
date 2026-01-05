import React, { useReducer, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {

  const {user} = useAuth()
  
  console.log(user);
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">Welcome Back ! {user?.name || ""}</h2>
      
    </div>
  );
};

export default Dashboard;
