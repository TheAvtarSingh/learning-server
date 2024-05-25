// Imports
// Inbuilt Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Files Modules
const dataController = require("./controller/dataController");
const UserRoutes = require("./routes/user-routes/users");
const AdminRoutes = require("./routes/user-routes/admins");
const DoubtSolverRoutes = require("./routes/user-routes/doubtSolver");
const Functionality = require("./routes/functionalities/send-otp-emailjs");
const DoubtRoutes = require("./routes/user-routes/doubts");
const ConversationRoutes = require("./routes/conversation-routes/conv");
const MessagesRoutes = require("./routes/conversation-routes/msg");
const CompilerRoutes = require("./routes/compiler-routes/compiler");
const UploadRoutes = require("./routes/video-rotes/videos");
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
app.get("/", (req, res) => res.json({success:true,message:"Server is Working Fine !!"}) );

//  Main Routing
app.use("/api", UserRoutes);
app.use("/api", AdminRoutes);
app.use("/api", DoubtSolverRoutes);
app.use("/api", DoubtRoutes);
app.use("/api", ConversationRoutes);
app.use("/api", MessagesRoutes);
app.use("/core", Functionality);
app.use("/core", CompilerRoutes);
app.use("/core",UploadRoutes );

// Payment
app.use("/payments", require("./routes/payment-routes/payment"));
app.use("/keys",require("./routes/payment-routes/keys"));

// getPODTLC("https://leetcode.com/problemset/").then((data) => {console.log(data);});
// Server
app.listen(port, () => console.log(`Server Started at Port : ${port} `));
