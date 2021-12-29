import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import axios from "axios";

export function SingleCustomer() {
  const style = { textAlign: "center" };
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    document.title = `Single Customer`;
  }, []);

  const fetchCustomerByID = async (id) => {
    try {
      const { data: response } = await axios.get(`/api/${id}`);
      return response;
    } catch (error) {
      throw new Error(`${error.response.data.msg}`);
    }
  };

  const {
    isLoading: isLoadingCustomer,
    data,
    isError,
    error,
  } = useQuery(["customerDetails", id], () => fetchCustomerByID(id), {
    enabled: Boolean(id),
    retry: false,
  });

  if (isLoadingCustomer) {
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
          <h1>{error?.message}</h1>
          <Link to="/">
            <div className="h4 mb-3 ml-0 btn btn-primary">back</div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container topPadding">
      <Link to="/">
        <div className="btn btn-primary mb-4">Back to home </div>
      </Link>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "10%" }}>{data?.first_name}</td>
              <td style={{ width: "10%" }}>{data?.last_name}</td>
              <td style={{ width: "25%" }}>{data?.email}</td>
              <td style={{ width: "25%" }}>{data?.address}</td>
              <td style={{ width: "25%" }}>{data?.comments}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
