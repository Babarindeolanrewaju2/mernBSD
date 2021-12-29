import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Customers } from "./Customers";
import { SingleCustomer } from "./SingleCustomer";
import { CreateCustomer } from "./CreateCustomer";
import { EditCustomer } from "./EditCustomer";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Customers />} />
          <Route exact path="/customer/:id" element={<SingleCustomer />} />
          <Route exact path="/create-customer" element={<CreateCustomer />} />
          <Route exact path="/edit-customer/:id" element={<EditCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}

//Ayuba Babarinde Olanrewaju
