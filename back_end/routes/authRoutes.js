const express = require("express");
const { signup,login } = require("../controllers/AuthController/AuthController");
const PushController = require("../controllers/AuthController/PushController")
const router = express.Router();

router.post("/sign_up", signup);
router.post("/log_in",login)

router.post("/push/store-token",PushController.storeFcmToken)

module.exports = router;
