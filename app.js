const express = require("express");
const { connnectToDb } = require("./db/db");
const categoryRouter = require("./routes/categories");
const userStatusRouter = require("./routes/user-statuses");
const usersRouter = require("./routes/users");

// init app & middleware
const app = express();
app.use(express.json());

// db connection
connnectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
  } else {
    console.log("Can not connect to Database");
  }
});

// Routes
app.use("/users", usersRouter);
app.use("/statuses", userStatusRouter);
app.use("/categories", categoryRouter);
