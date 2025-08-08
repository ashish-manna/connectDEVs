require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./route/auth");
const profileRouter = require("./route/profile");
const cookieParser = require("cookie-parser");
const requestRouter = require("./route/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);

app.use("/", (req, res) => {
  res.status(200).json({ message: `Server is up and running...` });
});

connectDB()
  .then(() => {
    console.log(`Database connected successfuly...`);
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running on PORT: ${process.env.PORT}...`);
    });
  })
  .catch((err) => console.log(err));
