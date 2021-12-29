const {
  getAllCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controller/customerController.js");
const { body } = require("express-validator");
const express = require("express");
const router = express.Router();

var myLogger = function (req, res, next) {
  console.log("LOGGED");
  next();
};

router.get("/", getAllCustomers);

router.post(
  "/create-customer",
  body("firstName").contains(),
  body("lastName").contains(),
  body("email").contains().isEmail(),
  body("address").contains(),
  body("comments").contains(),
  createCustomer
);

router.get("/:id", getCustomer);

router.put(
  "/edit-customer/:id",
  body("first_name").contains(),
  body("last_name").contains(),
  body("email").contains().isEmail(),
  body("address").contains(),
  body("comments").contains(),
  updateCustomer
);

router.delete("/delete-customer/:id", deleteCustomer);

module.exports = router;

// https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/
//https://poopcode.com/error-err_http_headers_sent-cannot-set-headers-after-they-are-sent-to-the-client-how-to-fix/#:~:text=Leave%20a%20Comment-,Error%20%5BERR_HTTP_HEADERS_SENT%5D%3A%20Cannot%20set%20headers%20after%20they%20are%20sent,again%20back%20to%20the%20client.
