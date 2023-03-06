const express = require("express");
const port = process.env.PORT || 9000;
const musicRouter = require("./routes/MusicRoutes");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //acces
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", musicRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
