import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import api from "../../../../utils/api";
import { getUploadLogStatus } from "../../../../utils/helper";
import { AiOutlineEye } from "react-icons/ai";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CiFilter } from "react-icons/ci";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "../../../../context/ThemeContext";

const UploadLogList = () => {
  const [uploadLog, setUploadLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterLocation, setFilterLocation] = useState([]);
  const api_url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: null,
  });

   const { theme, toggleTheme } = useTheme();


  const fetchUploadLog = async () => {
    try {
      const res = await api.get(`${api_url}api/administration/uploadlog/list`);
      setUploadLog(res.data || res);
    } catch (err) {
      console.error("Error fetching upload logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 1, label: "In Progress" },
    { value: 2, label: "Failed" },
    { value: 3, label: "Success" },
  ];

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    fetchUploadLog();
  }, []);

  const exportToExcel = () => {
    const data = uploadLog.map((row, i) => ({
      "#": i + 1,
      "File Name": row.file_name,
      Status:
        row.status == 1
          ? "In Progress"
          : row.status == 2
          ? "Failed"
          : row.status == 3
          ? "Success"
          : "Error",
      "Created At": new Date(row.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Upload Logs");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "upload_logs.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Upload Logs", 14, 15);

    const tableData = uploadLog.map((row, i) => [
      i + 1,
      row.file_name,
      row.status == 1
        ? "In Progress"
        : row.status == 2
        ? "Failed"
        : row.status == 3
        ? "Success"
        : "Error",
      new Date(row.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      // <-- use autoTable as a function, pass doc as first param
      head: [["#", "File Name", "Status", "Created At"]],
      body: tableData,
      startY: 25,
    });

    doc.save("upload_logs.pdf");
  };

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "File Name",
      selector: (row) => row.file_name,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => getUploadLogStatus(row.status),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => {
            navigate(`/administration/upload-log/view/${row._id}`);
          }}
          title="View Details"
          className="text-blue-600 p-1 text-xl hover:text-black hover:scale-125 transition-transform duration-200 dark:text-white"
        >
          <AiOutlineEye />
        </button>
      ),
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ];

  const handeleSave = async (data) => {
    console.log(data);
    try {
      const res = await api.post(
        `${api_url}api/administration/uploadlog/filterData`,
        {
          status: data.upload_status,
        }
      );
      console.log(res.data);
      setUploadLog(res.data.data || res.data);
    } catch (error) {}
  };

  const handleReset = () => {
    reset();
    fetchUploadLog();
  };

  createTheme("darkCustom", {
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
    },
    background: {
      default: "#1f2937",
    },
    context: {
      background: "#374151",
      text: "#FFFFFF",
    },
    divider: {
      default: "#374151",
    },
    highlightOnHover: {
      default: "#374151",
      text: "#f9fafb",
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Upload Logs
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handleFilter}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 transition-transform duration-400 hover:scale-110 rounded hover:bg-blue-700"
          >
            <CiFilter /> Filter
          </button>
        </div>
      </div>

      {showFilter && (
        <form
          onSubmit={handleSubmit(handeleSave)}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30  dark:border-gray-700/30 shadow-xl transition-all duration-300 bg-white shadow-md  border border-gray-200  rounded-xl p-5 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  ">
            <div>
              <label className="block text-gray-700 dark:text-white font-medium text-gray-600 mb-1">
                Status
              </label>
              <Controller
                name="upload_status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select Status..."
                    className="text-sm"
                    onChange={(select) =>
                      field.onChange(select ? select.value : null)
                    }
                    value={
                      statusOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-5 gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      )}

      <hr className="my-4 border-gray-400 dark:borde-white" />

      <div className="flex justify-between items-center mt-5 mb-5">
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            <FaFileExcel /> Excel
          </button>

          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-md border border-gray-200 rounded-xl">
        <DataTable
          columns={columns}
          data={uploadLog}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
          theme={theme == "dark" ? "darkCustom" : "default"}
        />
      </div>
    </div>
  );
};

export default UploadLogList;
