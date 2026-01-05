const Location = require("../../models/Master/Location");
const Upload = require("../../models/Administration/UploadLog");

const locationStore = async (req, res) => {
    try {
        const { location_name } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const location_exists = await Location.findOne({ location_name, status: 1, trash: "No" });

        if (location_exists) {
            return res.status(400).json({ message: "Location Already Exists" });
        }

        const newLocation = await Location.create({
            location_name,
            createdBy: req.user.id
        });

        res.status(201).json(newLocation);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllLocation = async (req, res) => {
    try {
        const location = await Location.find({ trash:"No" }).sort({ _id: -1 });
        res.status(200).json(location)

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const LocationEdit = async (req, res) => {
    try {

        const { id } = req.params

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "No Data Found" });
        }

        res.status(200).json(location)


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    }
}

const LocationUpdate = async (req, res) => {
    try {
        const { id, location_name } = req.body
        const user_id = req.user.id
        if (!location_name) {
            return res.status(400).json({ message: "Location Name is required" });
        }

        const existing = await Location.findOne({
            location_name: location_name,
            _id: { $ne: id },
            status: 1,
            trash: "No"
        });

        if (existing) {
            return res.status(404).json({ message: "Name alredy exist" })
        }

        const updatedLocation = await Location.findByIdAndUpdate(
            id,
            {
                location_name: location_name,
                updatedBy: user_id,
                updatedAt: Date.now()
            },
            { new: true }
        )

        if (!updatedLocation) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({
            message: "Location updated successfully",
            location: updatedLocation
        });


    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    }
}

const LocationView = async (req, res) => {
    try {

        const { id } = req.params

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "No Data Found" });
        }

        res.status(200).json(location)


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    }
}

const LocationDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const updateDelete = await Location.updateOne(
            { _id: id },
            {
                $set: { status: 0, trash: "Yes" }
            }
        )

        if (updateDelete.deletedCount === 0) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const LocationStatusChange = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Location.updateOne(
            { _id: id },
            { $set: { status } }
        );

        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: `Location ${status === 1 ? "activated" : "deactivated"} successfully` });
    } catch (err) {
        console.error("Error changing status:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const fetchDetails = async (req, res) => {
    try {
        const { location_name } = req.body
        const filteredData = await Location.find({
            location_name: { $regex: location_name, $options: "i" },
            status: 1,
            trash: "No"
        });
        res.json(filteredData)

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Server Error" })
    }
}


const importSubmit = async (req, res) => {
    try {
        const importedData = req.importedData;
        const createdBy = req.user?.id || null;

        if (!importedData || importedData.length === 0) {
            await Upload.create({
                file_name: req.file?.originalname || "Unknown File",
                errors_reason: JSON.stringify([
                    { error: "File is empty or contains no valid rows" },
                ]),
                status: 2,
                created_by: createdBy,
            });

            return res.status(400).json({ message: "No data found in Excel file" });
        }

        const validRows = [];
        const errorsArray = [];

        for (let i = 0; i < importedData.length; i++) {
            const row = importedData[i];
            const rowErrors = {};

            const locationName = row["Location Name"]?.trim();

            if (!locationName) {
                rowErrors["Location Name"] = "Location Name is required";
            } else {
                const existing = await Location.findOne({ location_name: locationName });
                if (existing) {
                    rowErrors["Duplicate"] = `Location '${locationName}' already exists`;
                }
            }

            if (Object.keys(rowErrors).length > 0) {
                errorsArray.push({
                    row: i + 2,
                    errors: rowErrors
                })
            } else {
                validRows.push({
                    location_name: locationName,
                    createdBy: createdBy
                })
            }

        }


        if (errorsArray.length > 0) {
            await Upload.create({
                file_name: req.file?.originalname || "Unknown file",
                errors_reason: JSON.stringify(errorsArray, null, 2),
                status: 2,
                created_by: createdBy
            })

            return res.status(400).json({
                message: "Validation failed. Check Upload Log.",
                errors: errorsArray,
            });
        }

        if (validRows.length > 0) {
            await Location.insertMany(validRows);
        }

        await Upload.create({
            file_name: req.file?.originalname || "Unknown File",
            errors_reason: null,
            status: 3,
            created_by: createdBy,
        });

        return res.status(200).json({
            message: `${validRows.length} locations imported successfully.`,
            imported: validRows.length,
        });

    } catch (err) {
        console.error("Import error:", err);
        await Upload.create({
            file_name: req.file?.originalname || "Unknown File",
            errors_reason: JSON.stringify([{ error: err.message }]),
            status: 1,
            created_by: req.user?.id || null,
        });

        return res.status(500).json({ message: "Server error while importing" });
    }
};

const fetchLocation = async (req,res) => {
    try {
        const data = await Location.find({ status: 1, trash: 'No' });

        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({ message: "Server Error" })
    }

}



module.exports = {
    locationStore,
    getAllLocation,
    LocationEdit,
    LocationUpdate,
    LocationView,
    LocationDelete,
    LocationStatusChange,
    fetchDetails,
    importSubmit,
    fetchLocation
};

