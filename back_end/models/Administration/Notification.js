const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  notification_type: String,      
  message: String,               
  web_link: String,               
  icon: String,                   
  assigned_user: [String],        
  status: { type: String, default: "unread" }, 
  created_by: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("template_notifications", NotificationSchema);
