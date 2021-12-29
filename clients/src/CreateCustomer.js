import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CreateCustomer = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = `Create Customer`;
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setErrors(validate(values));
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
    }
  };

  const postDataToAPI = useCallback(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      setDisabled(true);

      const customer = {
        method: "POST",
        url: "/api/create-customer",
        headers: {
          Accept: "application/json",
        },
        data: {
          firstName: values.firstname,
          lastName: values.surname,
          email: values.email,
          address: values.address,
          comments: values.comments,
        },
      };

      axios
        .request(customer)
        .then((response) => {
          if (response.status === 201) {
            setIsSubmitting(false);
            setDisabled(false);
            toast.success(`${values.firstname} has been saved!`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setIsSubmitting(false);
          setDisabled(false);
          toast.error(
            `Server error, ${error.message} Customer wasn't saved!,  try again later`,
            {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        });
    }
  }, [errors, isSubmitting, values]);

  useEffect(() => {
    postDataToAPI();
  }, [postDataToAPI]);

  const validate = (values) => {
    let errors = {};
    if (!values.firstname || values.firstname?.trim() === "") {
      errors.firstname = "First_name is required";
    } else if (/\d/.test(values.firstname)) {
      errors.firstname = "First_Name can not contain numbers";
    } else if (values.firstname?.length === 0) {
      errors.firstname = "First_Name is invalid";
    }
    if (!values.surname || values.surname?.trim() === "") {
      errors.surname = "Surname is required";
    } else if (/\d/.test(values.surname)) {
      errors.surname = "Surname can not contain numbers";
    } else if (values.surname?.length === 0) {
      errors.surname = "Surname is invalid";
    }
    if (!values.email || values.email.trim() === "") {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    if (!values.address || values.address?.trim() === "") {
      errors.address = "Address is required";
    } else if (values.surname?.length === 0) {
      errors.address = "Address is invalid";
    }
    if (!values.comments || values.comments?.trim() === "") {
      errors.comments = "Comment is required";
    } else if (values.comments?.length === 0) {
      errors.comments = "Comment is invalid";
    }

    return errors;
  };

  return (
    <div className="container topPadding">
      <div>
        <h1 className="mb-3 ml-0 font-weight-bold">Create a customer</h1>
      </div>
      <div className="row justify-content-center align-items-center ">
        <div className="col-12 col-md-12 col-xl-12">
          <form
            // onSubmit={handleSubmit}
            id="validation-form"
            noValidate="novalidate"
          >
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="name">
                First Name:
              </label>
              <input
                autoComplete="on"
                className={`form-control ${
                  errors.firstname && "border-danger"
                } d-block w-100 mb-2`}
                type="text"
                name="firstname"
                onChange={handleChange}
                value={values.firstname || ""}
                required
                placeholder="John"
                id="firstname"
              />
            </div>
            {errors.firstname && (
              <small className="text-danger d-block mb-2">
                {errors.firstname}
              </small>
            )}
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="surname">
                Surname:
              </label>
              <input
                autoComplete="off"
                className={`form-control ${
                  errors.surname && "border-danger"
                } d-block w-100 mb-2`}
                type="text"
                name="surname"
                onChange={handleChange}
                value={values.surname || ""}
                required
                placeholder="Musk"
                id="surname"
              />
            </div>
            {errors.surname && (
              <small className="text-danger d-block mb-2">
                {errors.surname}
              </small>
            )}
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="email">
                Email:
              </label>
              <input
                autoComplete="off"
                className={`form-control ${
                  errors.email && "border-danger"
                } d-block w-100 mb-2`}
                name="email"
                onChange={handleChange}
                value={values.email || ""}
                required
                placeholder="Joe@gmail.co.mt"
                id="email"
              />
            </div>
            {errors.email && (
              <small className="text-danger d-block mb-2">{errors.email}</small>
            )}
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="surname">
                Address:
              </label>
              <input
                autoComplete="off"
                className={`form-control ${
                  errors.address && "border-danger"
                } d-block w-100 mb-2`}
                type="text"
                name="address"
                onChange={handleChange}
                value={values.address || ""}
                required
                placeholder="166 Triq Nazu"
                id="address"
              />
            </div>
            {errors.address && (
              <small className="text-danger d-block mb-2">
                {errors.address}
              </small>
            )}
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="surname">
                Comments:
              </label>
              <input
                autoComplete="off"
                className={`form-control ${
                  errors.comments && "border-danger"
                } d-block w-100 mb-2`}
                type="text"
                name="comments"
                onChange={handleChange}
                value={values.comments || ""}
                required
                placeholder=""
                id="comments"
              />
            </div>
            {errors.comments && (
              <small className="text-danger d-block mb-2">
                {errors.comments}
              </small>
            )}
            <div className="d-flex flex-row justify-content-between align-items-center ">
              <div className="col-6 col-md-6 col-xl-6 ">
                <button
                  type="submit"
                  className={disabled ? "btn btn-success" : "btn btn-primary"}
                  disabled={disabled}
                  onClick={handleSubmit}
                >
                  {disabled ? "Submitting..." : "Submit"}
                </button>
              </div>

              <div className="col-6 col-md-6 col-xl-6 text-end">
                <Link to="/">
                  <div className="h4 mb-0 btn btn-primary">back</div>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
