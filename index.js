const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./config");

// connect to the database and load models
require("./server/models").connect(process.env.MONGODB_URI || config.dbUri);

// let MONGODB_URI = process.env.MONGODB_URI || config.dbUri;
// mongoose
//   .connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => console.log("MongoDB successfully connected"))
//   .catch(err => console.log(err));

const app = express();
// tell the app to look for static files in these directories
app.use(express.static("./server/static/"));
app.use(express.static("./client/dist/"));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require("./server/passport/local-signup");
const localLoginStrategy = require("./server/passport/local-login");
passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require("./server/middleware/auth-check");
app.use("/api", authCheckMiddleware);

// routes
const authRoutes = require("./server/routes/auth");
const apiRoutes = require("./server/routes/api");
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// Set Port, hosting services will look for process.env.PORT
app.set("port", process.env.PORT || 3000);

// start the server
app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
