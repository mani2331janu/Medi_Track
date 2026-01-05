import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { CiFilter } from "react-icons/ci";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { useTheme } from "../../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { TbEdit } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "../../../../utils/notify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { displayDateFormat, displayStatus } from "../../../../utils/helper";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const EmployeeList = () => {
  const api_url = import.meta.env.VITE_API_URL;

  const { theme } = useTheme();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [empIdOpt, setEmpIdOpt] = useState([]);

  createTheme("darkCustom", {
    text: { primary: "#f9fafb", secondary: "#d1d5db" },
    background: { default: "#1f2937" },
    context: { background: "#374151", text: "#FFFFFF" },
    divider: { default: "#374151" },
    highlightOnHover: { default: "#374151", text: "#f9fafb" },
  });

  const handleFilter = () => setShowFilter((pre) => !pre);
  const defaultValues = { emp_id: null }

  const { control, handleSubmit, reset } = useForm({ defaultValues });

  const filterEmployeeData = async (data) => {
    try {
      const emp_id = data.emp_id.value;
      const res = await api.post(`${api_url}api/administration/employee/filterData`, { emp_id });

      if (res.data.success) {

        const empArray = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];

        setEmployee(empArray);
        setFilteredData(empArray);
      }

    } catch (err) {
      console.log(err);
    }
  };


  // Employee data  
  const getAllEmployee = async () => {
    try {
      const res = await api.get(`${api_url}api/administration/employee/list`);
      setEmployee(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  // status Chnage
  const handleStatus = async (id, status) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want ${status === 1 ? "Deactivate" : "Activate"} this Employee Status?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      });

      if (result.isConfirmed) {
        const res = await api.put(
          `${api_url}api/administration/employee/statusChange/${id}`,
          { status: status === 1 ? 0 : 1 }
        );

        if (res.data.success) {
          notifySuccess(res.data.message);
          getAllEmployee();
        } else {
          notifyError(res.data.message)
        }
      }
    } catch (err) {
      console.log(err);
      notifyError(
        err.response?.data?.message ||
        "Something went wrong. Please try again!"
      );
    }
  };

  // Delete  record
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await api.put(`${api_url}api/administration/employee/delete/${id}`);
        if (res.data.success) {
          notifySuccess(res.data.message);
          getAllEmployee();
        }
      }
    } catch (err) {
      console.log(err);
      notifyError(err.response?.data?.message)
    }
  };

  // DataTabel Column
  const columns = [
    { name: "#", cell: (row, index) => index + 1 },
    {
      name: "Employee ID",
      selector: (row) => row.employee_id || "-",
      sortable: true,
    },

    {
      name: "Employee Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },

    {
      name: "Email",
      selector: (row) => row.email || "-",
      sortable: true,
    },

    {
      name: "Mobile No",
      selector: (row) => row.mobile_no || "-",
    },

    {
      name: "Status",
      cell: (row) => (
        <button
          className={`px-3 py-1 rounded ${row.status === 1 ? "bg-green-600" : "bg-red-600"
            } text-white hover:opacity-80 transition cursor-pointer`}
          onClick={() => handleStatus(row._id, row.status)}
        >
          {row.status === 1 ? "Active" : "Inactive"}
        </button>
      ),
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="text-green-600 p-1 text-xl hover:text-black dark:text-white cursor-pointer"
            onClick={() => navigate(`/administration/employee/edit/${row._id}`)}
          >
            <TbEdit />
          </button>

          <button
            title="View"
            className="text-blue-600 p-1 text-xl hover:text-black dark:text-white cursor-pointer"
            onClick={() => navigate(`/administration/employee/view/${row._id}`)}
          >
            <AiOutlineEye />
          </button>

          <button
            title="Delete"
            className="text-red-600 p-1 text-xl hover:text-black dark:text-white cursor-pointer"
            onClick={() => handleDelete(row._id)}
          >
            <MdDeleteForever />
          </button>
        </>
      ),
    },
    {
      name: "Created By",
      selector: (row) => row.created_by?.first_name,
    },

    {
      name: "Created At",
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-GB")
          : "-",
    },
  ];

  // SearchValue
  const serachFilterData = async () => {
    if (!Array.isArray(employee)) return;

    const result = employee.filter((item) => {
      const searchValue = search.toLowerCase();
      return (
        item.employee_id?.toLowerCase().includes(searchValue) ||
        `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue) ||
        item.mobile_no?.toLowerCase().includes(searchValue)
      );
    });

    setFilteredData(result);
  };

  const exportToExcel = (data) => {
    if (!data || data.length === 0) return; 
    const formattedData = data.map((row, i) => ({
      "#": i + 1,
      "Employee ID" : row.employee_id,
      "Employee Name": `${row.first_name || "-"} ${row.last_name || "-"}`,
      "Email": row.email || "-",
      "Mobile": row.mobile_no || "-",
      "Status": displayStatus(row.status),
      "Created By": row.created_by?.name || "-",
      "Created At": displayDateFormat(row.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Employee_Data.xlsx");
  };

  const exportToPDF = (data) => {
    if (!data || data.length === 0) return; 

    const doc = new jsPDF();
    doc.text("Employee Details", 14, 15);

    const tableData = data.map((row, i) => [
      i + 1,
      row.employee_id,
      `${row.first_name || "-"} ${row.last_name || "-"}`,
      row.email || "-",
      row.mobile_no || "-",
      displayStatus(row.status),
      row.created_by?.name || "-",
      displayDateFormat(row.createdAt),
    ]);

    autoTable(doc, {
      head: [["#", "Employee ID","Employee Name", "Email", "Mobile No", "Status", "Created By", "Created At"]],
      body: tableData,
      startY: 25,
    });

    doc.save("Employee_Details.pdf");
  };



  useEffect(() => {
    getAllEmployee();
  }, []);

  useEffect(() => {
    serachFilterData();
  }, [search, employee]);

  useEffect(() => {
    if (employee.length > 0) {
      const opts = employee.map((item) => ({
        value: item._id,
        label: item.employee_id,
      }));
      setEmpIdOpt(opts);
    }
  }, [employee]);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold dark:text-white">Employee List</h2>
        <div className="flex gap-3">
          <button
            onClick={handleFilter}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <CiFilter /> Filter
          </button>
          <button
            onClick={() => navigate("/administration/employee/add")}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <IoIosAddCircle /> Add
          </button>
        </div>
      </div>

      {showFilter && (
        <form onSubmit={handleSubmit(filterEmployeeData)} className="transition-all bg-white/70 dark:bg-gray-800/70 backdrop-blur-md duration-300 shadow-md border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Select Employee ID
              </label>
              <Controller
                name="emp_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={empIdOpt}
                    placeholder="Select Employee Id ..."
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-5 gap-3">
            <button
              type="submit"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={() => {
                reset(defaultValues);
                getAllEmployee();

              }}
              className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      )}

      <hr className="my-4 border-gray-400 dark:border-white-700" />

      {/* Export Buttons */}
      <div className="flex justify-between items-center mt-5 mb-5">
        <div className="flex gap-3">
          <button onClick={()=>{exportToExcel(filteredData)}} className="flex cursor-pointer items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
            <FaFileExcel /> Excel
          </button>
          <button onClick={()=>{exportToPDF(filteredData)}} className="flex cursor-pointer items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md border border-gray-200 rounded-xl">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
          theme={theme === "dark" ? "darkCustom" : "default"}
          subHeader
          subHeaderAlign="right"
          subHeaderComponent={
            <div className="flex flex-col w-full items-end">
              <input
                type="text"
                placeholder="Search..."
                className="border mt-2 border-gray-400 dark:border-gray-600 
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-200
                rounded w-64 p-2 
                focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="w-full h-px bg-gray-300 dark:bg-gray-700 mt-2"></div>
            </div>
          }

        />
      </div>
    </div>
  );
};

export default EmployeeList;
