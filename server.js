// Import npm packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
let cors = require("cors");
const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;
// const path = require("path");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();
const PORT = process.env.PORT || 8080;

const mongoDB =
  "mongodb+srv://ayubaola:ayubaola@cluster0.t4ixh.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongoDB);

// const db = mongoose.connection;

// const dbName = "myFirstDatabase";

// MongoClient.connect(mongoDB, function (err, client) {
//   const db = client.db(dbName);
//   db.collection("customers").deleteMany({});
//   // get access to the relevant collections
//   const customersCollection = db.collection("customers");
//   // make a bunch of users
//   let customers = [];
//   for (let i = 0; i < 200; i += 1) {
//     const first_name = faker.name.firstName();
//     const last_name = faker.name.lastName();
//     const email = faker.internet.email(first_name, last_name);
//     let address = faker.address.state();
//     let words = faker.lorem.words(6);

//     customers.push({
//       first_name: first_name,
//       last_name: last_name,
//       email: email,
//       address: address,
//       comments: words,
//     });
//   }
//   customersCollection.insertMany(customers);
//   console.log("Database seeded! :)");
//   // client.close();
// });

mongoose.connection.on("error", function (error) {
  console.error("Database connection error:", error);
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require("./routes/api");

app.use("/api", routes);

app.use(notFound);
app.use(errorHandlerMiddleware);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
