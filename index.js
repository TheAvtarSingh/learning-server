// Imports
// Inbuilt Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Files Modules
const dataController = require("./controller/dataController");
const UserRoutes = require("./routes/user-routes/users");
const Functionality = require("./routes/functionalities/send-otp-emailjs");
// Database Modules
const mongodb = require("./database/db");

// DotEnv
const dotenv = require("dotenv");
dotenv.config();

// Implemmentations
// Config
const port = process.env.PORT;

// Database

mongodb();


// Middleware

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
// Routes
app.use("/api/compile", dataController);
app.get("/", (req, res) => res.send("Server is working !!"));

//  Main Routing
app.use("/api", UserRoutes);
app.use("/core", Functionality);
// Server
app.listen(port, () => console.log(`Server Started at Port : ${port} `));
