const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

const app = express();
dotenv.config();

app.use("/", (req, res) => {
  res.send("Hello from root..");
});

connectDB()
  .then(() => {
    console.log(`Database connected successfuly...`);
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running on PORT: ${process.env.PORT}...`);
    });
  })
  .catch((err) => console.log(err));
