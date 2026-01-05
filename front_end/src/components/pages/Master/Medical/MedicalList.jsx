import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { CiFilter } from "react-icons/ci";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../context/ThemeContext";
import api from "../../../../utils/api";
import { TbEdit } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { notifyError, notifySuccess } from "../../../../utils/notify";
import Swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { displayDateFormat, displayStatus } from "../../../../utils/helper";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MedicalList = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [showFilter, setShowFilter] = useState(false);
  const [medical, setMedical] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationMedical, setLocationMedical] = useState([]);

  const api_url = import.meta.env.VITE_API_URL;
  const defaultValues = { location_id: null, medical_id: null, status: null }
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues,
  });

  const selectedLocation = watch("location_id");

  // Fetch  medical
  const medicalList = async () => {
    try {
      const res = await api.get(`${api_url}api/master/medical/list`);
      setMedical(res.data.data);
    } catch (err) {
      console.log("Error fetching medical list:", err);
    }
  };

  // Fetch  locations
  const fetchLocationName = async () => {
    try {
      const res = await api.get(`${api_url}api/master/location/getLocation`);
      const options = res.data.map((m) => ({
        value: m._id,
        label: m.location_name,
      }));
      setLocations(options);
    } catch (err) {
      console.log("Error fetching locations:", err);
    }
  };

  // Fetch medical by location
  const fetchMedicalByLocation = async (locationId) => {
    try {
      const res = await api.get(
        `${api_url}api/master/medical/fetchMedicine/${locationId}`
      );
      if (res.data.success) {
        const options = res.data.data.map((m) => ({
          value: m._id,
          label: m.medical_name,
        }));
        setLocationMedical(options);
      } else {
        setLocationMedical([]);
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Server Error";
      setLocationMedical([]);
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
        const res = await api.put(`${api_url}api/master/medical/delete/${id}`);
        if (res.data.success) {
          notifySuccess(res.data.message);
          medicalList();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle status
  const handleStatus = async (id, status) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want ${status === 1 ? "Deactivate" : "Activate"} this medical?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      });

      if (result.isConfirmed) {
        const res = await api.put(
          `${api_url}api/master/medical/statusChange/${id}`,
          { status: status === 1 ? 0 : 1 }
        );

        if (res.data.success) {
          notifySuccess(res.data.message);
          medicalList();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };


  // Filter submit
  const filterData = async (formData) => {
    try {

      const payload = {
        location_id: formData.location_id?.value || "",
        medical_id: formData.medical_id?.value || "",
        status: formData.status?.value ?? "",
      };


      const res = await api.post(`${api_url}api/master/medical/filterData`, payload);

      if (res.data.success) {

        setMedical(res.data.data);

      } else {
        setMedical([]);
        notifyError(res.data.message || "No data found");
      }
    } catch (err) {
      console.log(err);
      notifyError("Server error while filtering");
    }
  };


  // Toggle filter form
  const handleFilter = () => setShowFilter((prev) => !prev);


  createTheme("darkCustom", {
    text: { primary: "#f9fafb", secondary: "#d1d5db" },
    background: { default: "#1f2937" },
    context: { background: "#374151", text: "#FFFFFF" },
    divider: { default: "#374151" },
    highlightOnHover: { default: "#374151", text: "#f9fafb" },
  });

  // Columns
  const columns = [
    { name: "#", cell: (row, index) => index + 1 },
    { name: "Location Name", selector: (row) => row.location_id?.location_name || "-" },
    { name: "Medical Name", selector: (row) => row.medical_name || "-" },
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
            onClick={() => navigate(`/master/medical/edit/${row._id}`)}
            title="Edit"
            className="text-green-600 p-1 text-xl hover:text-black dark:text-white cursor-pointer"
          >
            <TbEdit />
          </button>
          <button
            onClick={() => navigate(`/master/medical/view/${row._id}`)}
            title="View"
            className="text-blue-600 p-1 text-xl hover:text-black dark:text-white cursor-pointer"
          >
            <AiOutlineEye />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            title="Delete"
            className="text-red-600 p-1 text-xl hover:text-black dark:text-white cursor-pointer"
          >
            <MdDeleteForever />
          </button>
        </>
      ),
    },
    { name: "Created By", selector: (row) => row.created_by?.first_name },
    { name: "Created At", selector: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  const exportToExcel = () => {
    const data = medical.map((row, i) => ({
      "#": i + 1,
      "Location Name": row.location_id?.location_name,
      "Medical name": row.medical_name,
      "Status": displayStatus(row.status),
      "Created By" : row.created_by?.first_name,
      "Created At":  displayDateFormat(row.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medical Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Medical Data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Medical Details", 14, 15);

    const tableData = medical.map((row, i) => [
      i + 1,
      row.location_id?.location_name,
      row.medical_name,
      displayStatus(row.status),
      row.created_by?.first_name,
      displayDateFormat(row.createdAt)
    ]);

    autoTable(doc, {
      
      head: [["#", "Location Name", "Medical Name", "Status","Created By","Created At"]],
      body: tableData,
      startY: 25,
    });

    doc.save("medical_details.pdf");
  };



  useEffect(() => {
    medicalList();
    fetchLocationName();
  }, []);

  useEffect(() => {
    if (selectedLocation?.value) {
      fetchMedicalByLocation(selectedLocation.value);
    } else {
      setLocationMedical([]);
    }
  }, [selectedLocation]);

  return (
    <div>

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold dark:text-white">Medical List</h2>
        <div className="flex gap-3">
          <button
            onClick={handleFilter}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <CiFilter /> Filter
          </button>
          <button
            onClick={() => navigate("/master/medical/add")}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <IoIosAddCircle /> Add
          </button>
        </div>
      </div>

      {showFilter && (
        <form
          onSubmit={handleSubmit(filterData)}
          className="transition-all bg-white/70 dark:bg-gray-800/70 backdrop-blur-md duration-300 shadow-md border border-gray-200 rounded-xl p-5 mb-6"
        >
          <div className="flex flex-wrap">
            {/* Location */}
            <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Select Location
              </label>
              <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={locations}
                    placeholder="Select Location..."
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>


            <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Select Medical
              </label>
              <Controller
                name="medical_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={locationMedical}
                    placeholder="Select Medical..."
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/3 mt-3 px-2">
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Select Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select Status..."
                    classNamePrefix="react-select"
                    onChange={(selected) => field.onChange(selected)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-5 gap-3">
            <button type="submit" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
              Apply Filter
            </button>
            <button
              type="button"
              onClick={() => {
                reset(defaultValues);
                setLocationMedical([]);
                medicalList();
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
          <button
            onClick={exportToExcel}
            className="flex cursor-pointer items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
            <FaFileExcel /> Excel
          </button>
          <button onClick={exportToPDF}
          className="flex cursor-pointer items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>


      <div className="overflow-x-auto bg-white shadow-md border border-gray-200 rounded-xl">
        <DataTable
          columns={columns}
          data={medical}
          pagination
          highlightOnHover
          responsive
          theme={theme === "dark" ? "darkCustom" : "default"}
        />
      </div>
    </div>
  );
};

export default MedicalList;
