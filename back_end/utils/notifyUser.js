const PushToken = require("../models/Auth/PushToken.js");
const admin = require("../config/firebaseAdmin.js");

const sendFcmNotificationToUsers = async (userIds, title, body) => {
  try {
    // Fetch tokens
    const tokens = await PushToken.find({ user_id: { $in: userIds } });
    

    if (!tokens?.length) {
      console.log("❗ No FCM tokens found for these users.");
      return;
    }

    console.log("🎯 Sending to tokens:", tokens.map(t => t.fcm_token));

    // Prepare the message object
    const message = {
      notification: {
        title,
        body,
      },
      tokens: tokens.map((t) => t.fcm_token), // Batch send
    };

    // 🔁 Use sendEachForMulticast() for current version
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(
      `📩 Push sent: ${response.successCount} succeeded, ${response.failureCount} failed`
    );

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log(`❌ Token failed: ${tokens[idx].fcm_token}`);
        }
      });
    }
  } catch (err) {
    console.error("❌ Error sending push notifications:", err);
  }
};

module.exports = {
  sendFcmNotificationToUsers,
};
