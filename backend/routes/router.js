const express = require("express");
const authController = require("../controllers/auth-controller");
const router = express.Router();
router.route("/login").post(authController.login);
router.route("/auth").get(authController.auth);

module.exports = router;
