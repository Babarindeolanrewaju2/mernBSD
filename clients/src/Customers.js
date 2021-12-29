import React, { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Link } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "react-use";

export function Customers() {
  const style = { textAlign: "center" };
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useLocalStorage("modal", false);
  const [customer, setCustomer] = useLocalStorage("customer", null);

  useEffect(() => {
    document.title = `List of Customers`;
  }, []);

  const handleDelete = async ({ id }) => {
    try {
      const { data: response } = await axios.delete(
        `/api/delete-customer/${id}`
      );
      toast.success(
        `${customer?.first_name} ${customer?.last_name} has been deleted`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      toast.error(`Server error, ${error.response.data}, try again later`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      throw new Error(`${error.response.data.msg}`);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (
        event.keyCode === 27 ||
        event.keyCode === 88 ||
        event.key === "x" ||
        event.key === "Escape"
      ) {
        setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const mutation = useMutation(handleDelete, {
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries("customersData");
      const previousValue = queryClient.getQueryData(["customersData"], {
        exact: false,
      });
      const updatedValue = [...previousValue];
      const removeDeleted = updatedValue.filter(
        (customer) => customer._id !== id
      );
      queryClient.setQueryData("customersData", [...removeDeleted]);

      return { previousValue };
    },
    onError: (err, _id, context) => {
      queryClient.setQueryData("customersData", context.previousValue);
    },
  });

  const fetchCustomersData = () => {
    const options = {
      method: "GET",
      url: "/api",
      headers: {
        Accept: "application/json",
      },
    };

    return axios
      .request(options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {});
  };

  const { isLoading, isError, data } = useQuery(
    "customersData",
    fetchCustomersData,
    {
      retry: 3,
    }
  );

  if (isLoading) {
    return (
      <div className="container" style={style}>
        <div className="row justify-content-center align-items-center vh-100">
          <Loader type="TailSpin" color="black" height="70" width="70" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container topPadding">
        <div
          className="row justify-content-center align-items-center"
          style={style}
        >
          <h1>something wrong with the server!</h1>
          <Link to="/">
            <div className="h4 mb-3 ml-0 btn btn-primary">back</div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container table-responsive topPadding">
      <div className="row justify-content-between align-items-center mb-4 w-100">
        <div className="col-6 col-md-6 col-xl-6">
          <h1>{data?.length} customers</h1>
        </div>
        <div className="col-6 col-md-6 col-xl-6 text-end">
          <Link to="/create-customer">
            <div className="btn btn-primary">AddCustomer</div>
          </Link>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              React.Children.toArray(
                data?.map((customer) => (
                  <>
                    <tr>
                      <td>
                        <Link
                          to={`/customer/${customer._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {customer?.first_name}
                        </Link>
                      </td>

                      <td>
                        <Link
                          to={`/customer/${customer._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {customer?.last_name}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/customer/${customer._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {customer?.email}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/customer/${customer._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {customer?.address}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/customer/${customer._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {customer?.comments}
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex flex-row justify-content-center align-items-centers">
                          <Link
                            to={`/edit-customer/${customer._id}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <p className="btn btn-primary mr-2">Edit</p>
                          </Link>
                          <p
                            className="btn btn-secondary"
                            onClick={() => {
                              setCustomer(customer);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </p>
                        </div>
                      </td>
                    </tr>
                  </>
                ))
              )}
          </tbody>
        </table>
      </div>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <p>
            {`Do you want to delete ${customer?.first_name} ${customer?.last_name}`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              mutation.mutate({
                id: customer?._id,
              });
              setShowDeleteModal(false);
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
