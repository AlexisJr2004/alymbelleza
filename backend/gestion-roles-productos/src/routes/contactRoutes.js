const express = require("express");
const { sendContactEmail } = require("../controllers/authController");

const router = express.Router();

router.post("/", sendContactEmail);

module.exports = router;