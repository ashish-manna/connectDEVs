require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./route/auth");

const app = express();
app.use(express.json());

app.use("/api", authRouter);

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
