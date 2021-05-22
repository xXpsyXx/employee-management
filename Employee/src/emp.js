const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
// require("./database/connection");
// const Login = require("./models/login")

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")

app.use(express.static(static_path));
app.set("views", template_path);

app.get("/index", (req, res )=>{
    res.render("index")

});

app.listen(3050,()=>{
    console.log(`Server is running`)
})
