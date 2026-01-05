const PushToken = require("../../models/Auth/PushToken");

const storeFcmToken = async (req, res) => {
  try {
    const { user_id, fcm_token } = req.body;

    if (!user_id || !fcm_token) {
      return res.status(400).json({ message: "Missing user_id or fcm_token" });
    }

    await PushToken.findOneAndUpdate(
      { user_id },
      { user_id, fcm_token },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "FCM token stored successfully" });
  } catch (error) {
    console.error("Error storing FCM token:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  storeFcmToken
}
