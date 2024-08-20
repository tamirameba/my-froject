require("dotenv").config();
const path = require("path");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");

const connectDB = require("./server/config/db");

const app = express();
const port = 5000;

//connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//templating engine
app.set("view engine ", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "views", "layout.ejs"));
app.use(expressLayout);

app.use("/", require("./routes/main"));

app.listen(port, () => {
  console.log("app listening on port ${5000}");
});
