const Medical = require("../../models/Master/Medical");
const MedicalList = async (req, res) => {
  try {
    const data = await Medical.find({ trash: "No" })
      .populate({
        path: "location_id",
        select: "location_name"
      })
      .populate({
        path: "created_by",
        select:"first_name"
      })
      .select("medical_name status createdAt created_by")

    return res.status(200).json({ success: true, data })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" })
  }
}
const MedicalStore = async (req, res) => {
  try {
    const { location_id, medical_name } = req.body;
    const user_id = req.user?.id || null;

    if (!location_id || !medical_name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existsMedicalName = await Medical.findOne({
      location_id,
      medical_name: medical_name.trim(),
    });

    if (existsMedicalName) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Medical name already exists in this location",
        });
    }

    const data = await Medical.create({
      location_id,
      medical_name: medical_name.trim(),
      created_by: user_id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Medical saved successfully", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};


const viewMedicalList = async (req, res) => {
  try {
    const { id } = req.params
    const data = await Medical.findById({ _id: id })
      .populate({
        path: "location_id",
        select: "location_name",
      })
      .populate({
        path: "created_by",
        select: "first_name",
      })
      

    return res.status(200).json({ success: true, data })

  } catch (error) {
    return res.status(500).json({ message: "Server Error" })
  }
}

const MedicalEdit = async (req, res) => {
  try {
    const { id } = req.params
    const data = await Medical.findById({ _id: id }).populate({ path: "location_id", select: "location_name" })
    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ message: "Server Error" })
  }
}

const MedicalUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    const { location_id, medical_name } = req.body;

    if (!location_id || !medical_name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingData = await Medical.findOne({
      location_id,
      medical_name: medical_name.trim(),
      _id: { $ne: id },
    });

    if (existingData) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Medical name already exists in this location",
        });
    }

    const updatedData = await Medical.findByIdAndUpdate(
      id,
      {
        medical_name: medical_name.trim(),
        location_id,
        updated_by: user_id,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({ success: false, message: "Medical record not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Medical record updated successfully",
        data: updatedData,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

const MedicalDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Medical.updateOne(
      { _id: id },
      {
        $set: { status: 1, trash: "Yes" }
      }
    );

    if (data) {
      return res.status(200).json({ success: true, message: "Medical Details Deleted Successufully" })
    }


  } catch (error) {

    console.log(error);
    return res.status(500).json({ message: "Server Error" })
  }
}

const MedicalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id, status);


    const data = await Medical.updateOne(
      { _id: id },
      { $set: { status: status } } // correctly updates the status field
    );

    if (data.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: "Medical Details Status Changed Successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Medical not found or status already set" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


const MedicalData = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Medical.find({
      location_id: id,
      status: 1,
      trash: "No", // make sure your DB stores "No" or "Yes"
    }).select("_id medical_name"); // use _id, not id

    if (data.length > 0) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(404).json({
        success: false,
        message: "No medical records found for this location",
      });
    }
  } catch (error) {
    console.error("Error fetching medical data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

const FilterData = async (req, res) => {
  try {
    const { location_id, medical_id, status } = req.body;
    const query = {};

    if (location_id) query.location_id = location_id;
    if (medical_id) query._id = medical_id; 
    if (status !== "") query.status = status;

    const filteredData = await Medical.find(query).populate("location_id").populate({path:"created_by",select:"name"});
    return res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



module.exports = {
  MedicalStore,
  MedicalList,
  viewMedicalList,
  MedicalEdit,
  MedicalUpdate,
  MedicalDelete,
  MedicalStatus,
  MedicalData,
  FilterData
};

