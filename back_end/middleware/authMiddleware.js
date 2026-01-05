const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const allowedExtensions = {
  excel: [".xls", ".xlsx"],
  image: [".jpg", ".jpeg", ".png"],
};


const importHandler = (type, moduleName, fields = []) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join("uploads", moduleName);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

  // Support multiple fields if provided
  const uploader =
    fields.length > 0 ? upload.fields(fields) : upload.single("file");

  return [
    uploader,
    (req, res, next) => {
      try {
        // Handle Excel import
        if (type === "excel" && req.file) {
          const ext = path.extname(req.file.originalname).toLowerCase();
          if (!allowedExtensions.excel.includes(ext)) {
            return res.status(400).json({
              message: "Only Excel files (.xlsx, .xls) are allowed",
            });
          }
          const workbook = XLSX.readFile(req.file.path);
          const sheetName = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          req.importedData = data;
          fs.unlinkSync(req.file.path);
        }

        // Handle multiple image uploads
        if (type === "image" && req.files) {
          req.importedFiles = {};
          for (const field in req.files) {
            const normalizedPath = req.files[field][0].path.replace(/\\/g, "/");
            req.importedFiles[field] = normalizedPath.startsWith("/")
              ? normalizedPath
              : "/" + normalizedPath;
          }
        }
        next();
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "File processing error" });
      }
    },
  ];
};

module.exports = {
  authMiddleware,
  importHandler,
};
