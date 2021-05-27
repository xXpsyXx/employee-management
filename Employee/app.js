require('dotenv/config')
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const passport = require("passport");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { ensureAuthenticated } = require("./config/auth");
const User = require("./src/models/users");
require("./config/passport")(passport);
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { findByIdAndDelete } = require("./src/models/users");
const { Template } = require("ejs");

require("./src/db/conn");

// Contact page Schema
const contactSchema = {
  name3: {
    type: String,
    required: true,
  },
  email3: {
    type: String,
    required: true,
    unqiue: true,
  },
  number3: {
    type: Number,
    required: true,
    unqiue: true,
  },
  message: {
    type: String,
    required: true,
  },
};

const contact1 = mongoose.model("Support", contactSchema);

// const user3Schema = ({
//   book1

// });

// const user2 = mongoose.model("Parking", user3Schema);

//Announcement Schema

const user3Scheme = new mongoose.Schema({
  announcement: String,
});

const user30 = mongoose.model("Announcement", user3Scheme);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: false,
  })
);

let db;

const url = process.env.SECRET_MESSAGE1;

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("adminDB");
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/bookparking", (req, res) => {
  res.render("bookparking");
});

app.get("/bookconfirm", (req, res) => {
  res.render("bookconfirm");
});

app.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/breakfast",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
  //window.localStorage.setItem("email", req.body.email);
  // console.log(typeof(req.body.email))
  // //store.set("email",req.body.email)
  // store.set('user', { name:req.body.email })

  res.cookie("email", req.body.email);
});

app.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log(`Server is running at ${PORT}`));

app.get("/checkin", ensureAuthenticated, (req, res) => {
  function SetCheckin() {
    user30.find({}, function (err, announcement) {
      res.render("checkin", {
        name1: UserName,
        user101Details: announcement,
      });
    });
  }
  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.get("/support", (req, res) => {
  res.render("support");
});

var UserName;
app.post("/clicked", (req, res) => {
  var options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };

  function SetCheckin() {
    const click = {
      Name: UserName,
      Checkin: new Date().toLocaleTimeString("en-US", options),
    };

    db.collection("stats").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }

      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/cliked", (req, res) => {
  var options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  function SetCheckout() {
    const click = {
      Name: UserName,
      Checkout: new Date().toLocaleTimeString("en-US", options),
    };

    db.collection("stats").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }

      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckout();
    }
  );
});

app.get("/frontpage", (req, res) => {
  res.render("frontpage");
});

app.get("/lunch", ensureAuthenticated, (req, res) => {
  res.render("lunch");
});

app.get("/breakfast", ensureAuthenticated, (req, res) => {
  res.render("breakfast");
});

app.post("/food", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Chicken Biryani",
      Price: "₹60",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }
  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food1", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Veg thali",
      Price: "₹50",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food2", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Pav Bhaji",
      Price: "₹40",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food3", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Cold Drink",
      Price: "₹20",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food4", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Poha",
      Price: "₹20",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food5", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Idle",
      Price: "₹20",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food6", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Tea",
      Price: "₹20",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.post("/food7", (req, res) => {
  function SetCheckin() {
    const click = {
      Name: UserName,
      Food: "Coffee",
      Price: "₹20",
    };

    db.collection("foods").save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.sendStatus(201);
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});

app.get("/contactpage", (req, res) => {
  res.render("contactpage");
});

app.post("/support", async (req, res) => {
  try {
    const Contact = new contact1({
      name3: req.body.name3,
      email3: req.body.email3,
      number3: req.body.number3,
      message: req.body.message,
    });
    const Submitted = await Contact.save();

    res.status(201).render("login");
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/time", (req, res) => {
  user30.find({}, function (err, announcement) {
    res.render("time", {
      user101Details: announcement,
    });
  });
});

app.get("/welcome", (req, res) => {
  // res.render("welcome",{
  //   name1:UserName
  // })
  function SetCheckin() {
    res.render("welcome", {
      name1: UserName,
    });
  }

  db.collection("registers").findOne(
    { email: req.cookies["email"] },
    function (err, doc) {
      UserName = doc["name1"];
      SetCheckin();
    }
  );
});
