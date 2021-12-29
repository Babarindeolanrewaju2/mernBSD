const express = require("express");
const { createCustomError } = require("../errors/custom-error");
const Customer = require("../models/customer");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const getAllCustomers = (req, res) => {
  Customer.find({})
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

const createCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // a document instance
  let customer = new Customer({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
    comments: req.body.comments,
  });

  // save model to database
  await customer.save(function (err, customer) {
    if (err) return next(error);
    res.status(201).json(customer);
  });
};

const getCustomer = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(
      createCustomError(`No customer with id : ${req.params.id}`, 404)
    );
  }
  let customer = await Customer.findOne({ _id: req.params.id });
  if (!customer) {
    return next(
      createCustomError(`No customer with id : ${req.params.id}`, 404)
    );
  }
  res.status(201).json(customer);
};

const updateCustomer = async (req, res, next) => {
  console.log(req.body);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(
      createCustomError(`No customer with id : ${req.params.id}`, 404)
    );
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(201).json(data);
      }
    }
  );
};

const deleteCustomer = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(
      createCustomError(`No customer with id : ${req.params.id}`, 404)
    );
  }
  Customer.findOneAndRemove({ _id: req.params.id })
    .exec()
    .then((customer) => {
      if (!customer) {
        return next(
          createCustomError(`No customer with id : ${req.params.id}`, 404)
        );
      }
      res.status(201).json(customer);
    })
    .catch((err) => next(err));
};

module.exports = {
  getAllCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
