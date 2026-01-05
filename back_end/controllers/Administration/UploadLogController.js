const UploadLog = require("../../models/Administration/UploadLog");

const uploadLogList = async (req, res) => {
    try {
        const data = await UploadLog.find().sort({ _id: -1 });

        return res.status(200).json(data);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const getUploadLogView = async (req, res) => {
    try {
        const { id } = req.params
        const data = await UploadLog.findById(id).populate("created_by", "name email");

        return res.status(200).json(data)


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const getUploadFilterData = async (req, res) => {
    try {
        const {status} = req.body
        const data = await UploadLog.find({status:status});
        return res.status(200).json(data)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = {
    uploadLogList,
    getUploadLogView,
    getUploadFilterData
}