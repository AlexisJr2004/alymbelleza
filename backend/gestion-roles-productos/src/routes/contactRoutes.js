const express = require("express");
const { sendContactEmail } = require("../controllers/authController");

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log("POST /api/contact recibido", req.body);
  next();
}, sendContactEmail);

module.exports = router;