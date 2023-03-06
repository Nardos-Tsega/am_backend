const express = require("express");
const port = process.env.PORT || 5000;
const musicRouter = require("./routes/MusicRoutes");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", musicRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
