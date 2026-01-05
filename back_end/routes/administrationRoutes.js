const express = require("express");
const router = express.Router();
const { importHandler } = require("../middleware/authMiddleware");

const UploadLogController = require("../controllers/Administration/UploadLogController");
const EmployeeController = require("../controllers/Administration/EmployeeController");
const Notification = require("../controllers/Administration/NotificationController");

// upload log
router.get("/uploadlog/list", UploadLogController.uploadLogList);
router.get("/uploadlog/view/:id", UploadLogController.getUploadLogView);
router.post("/uploadlog/filterData", UploadLogController.getUploadFilterData);

// employee
router.get("/employee/generate-id", EmployeeController.getPreviewEmployeeId);
router.post("/employee/unique-check", EmployeeController.checkEmailUnique);
router.get("/employee/list", EmployeeController.list);
router.post(
  "/employee/store",
  importHandler("image", "employee", [
    { name: "profile_image", maxCount: 1 },
    { name: "id_proof", maxCount: 1 },
    { name: "degree_certificate", maxCount: 1 },
    { name: "experience_certificate", maxCount: 1 },
  ]),
  EmployeeController.Store
);
router.get("/employee/edit/:id", EmployeeController.Edit);
router.post(
  "/employee/update/:id",
  importHandler("image", "employee", [
    { name: "profile_image", maxCount: 1 },
    { name: "id_proof", maxCount: 1 },
    { name: "degree_certificate", maxCount: 1 },
    { name: "experience_certificate", maxCount: 1 },
  ]),
  EmployeeController.Update
);
router.get("/employee/view/:id", EmployeeController.View);
router.put("/employee/statusChange/:id", EmployeeController.StatusChange);
router.put("/employee/delete/:id", EmployeeController.employeeDelete);
router.post("/employee/filterData", EmployeeController.filterData);
router.get("/get-profile-data", EmployeeController.getProfileData);

// Notification
router.get("/notification/list", Notification.List);
router.post("/notification/updateRead/:id", Notification.updateReadCount);

// profile_image
router.post(
  "/profile-image/update",
  importHandler("image", "employee", [{ name: "profile_image", maxCount: 1 }]),
  EmployeeController.updateProfileImage
);

module.exports = router;
