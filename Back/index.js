const express = require("express");
const userRoutes = require("./Routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log("Server is Running..."));
