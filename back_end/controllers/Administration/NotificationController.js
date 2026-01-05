const Notification = require("../../models/Administration/Notification");
const List = async (req, res) => {
    try {
        const data = await Notification.find()
            .sort({ created_at: -1 });
        return res.status(200).json(data)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateReadCount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Notification.findByIdAndUpdate(
            id,
            { status: "read" },
            { new: true }
        )
        return res.status(200).json(data);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });

    }
}

module.exports = {
    List,
    updateReadCount
}