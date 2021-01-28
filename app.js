const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/canteen", function(req, res) {
    res.render("canteen");
})

app.listen(8000, function() {
    console.log("Pranay ka website sabse chan!");
});
