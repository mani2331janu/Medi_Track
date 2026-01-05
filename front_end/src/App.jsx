import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Layout from "./components/pages/Layouts/Layout";
import Dashboard from "./components/Auth/Dashboard";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Profile from "./components/Profile/Profile";
import LocationList from "./components/pages/Master/Location/LocationList";
import LocationAdd from "./components/pages/Master/Location/LocationAdd";
import LocationEdit from "./components/pages/Master/Location/LocationEdit";
import LocationView from "./components/pages/Master/Location/LocationView";
import LocationImport from "./components/pages/Master/Location/LocationImport";
import UploadLogList from "./components/pages/Administration/UploadLog/UploadLogList";
import UploadLogView from "./components/pages/Administration/UploadLog/UploadLogView";
import MedicalList from "./components/pages/Master/Medical/MedicalList";
import MedicalAdd from "./components/pages/Master/Medical/MedicalAdd";
import MedicalView from "./components/pages/Master/Medical/MedicalView";
import MedicalEdit from "./components/pages/Master/Medical/MedicalEdit";
import EmployeeList from "./components/pages/Administration/Employee/EmployeeList";
import EmployeeAdd from "./components/pages/Administration/Employee/EmployeeAdd";
import EmployeeEdit from "./components/pages/Administration/Employee/EmployeeEdit";
import EmployeeView from "./components/pages/Administration/Employee/EmployeeView";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />

          <Routes>
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="sign_up"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />

              <Route path="administration">
                <Route path="employee">
                  <Route path="list" element={<EmployeeList />} />
                  <Route path="add" element={<EmployeeAdd />} />
                  <Route path="edit/:id" element={<EmployeeEdit />} />
                  <Route path="view/:id" element={<EmployeeView />} />


                </Route>
                <Route path="upload-log">
                  <Route path="list" element={<UploadLogList />} />
                  <Route path="view/:id" element={<UploadLogView />} />
                </Route>
              </Route>

              {/* master location */}
              <Route path="master">
                <Route path="location">
                  <Route path="list" element={<LocationList />} />
                  <Route path="add" element={<LocationAdd />} />
                  <Route path="edit/:id" element={<LocationEdit />} />
                  <Route path="view/:id" element={<LocationView />} />
                  <Route path="importLocation" element={<LocationImport />} />
                </Route>
                <Route path="medical">
                  <Route path="list" element={<MedicalList />} />
                  <Route path="add" element={<MedicalAdd />} />
                  <Route path="view/:id" element={<MedicalView />} />
                  <Route path="edit/:id" element={<MedicalEdit />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
