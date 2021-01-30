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

app.get("/login", function(req, res) {
    res.render("login");
})

 app.get("/admin", function(req, res) {
     res.render("admin");
 })

  app.get("/canteen", function(req, res) {
     res.render("canteen");
})
app.get("/canteen_menu", function(req, res) {
    res.render("canteen_menu");
})
app.listen(3000, function() {
    console.log("Server is up and running!");
});
