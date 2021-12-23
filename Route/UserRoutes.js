// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require("../Controller/UserController");


// Routes
router.post("/login",UserController.login);
router.post("/signup",UserController.signup);
router.post("/showProducts",UserController.getProducts);

module.exports = router;