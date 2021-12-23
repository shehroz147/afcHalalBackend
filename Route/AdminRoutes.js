// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const AdminController = require('../Controller/AdminController');


// Routes
router.post("/login",AdminController.login);
router.post("/signup",AdminController.signup);
router.post("/addProduct",AdminController.addProduct);
router.post("/editProduct",AdminController.editProduct);
router.post("/deleteProduct",AdminController.deleteProducts);
module.exports = router;