require('dotenv/config')
require("./src/db/conn")
const express = require("express");
const app = express();
const ejs = require("ejs");
const User = require("./src/models/user");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { ensureAuthenticated } = require("./config/auth");

// const qr = require("qrcode");

// const contactSchema ={
//   name3:{
//     type:String,
//   required:true,
//   },
//   email3:{
//     type:String,
//     required:true,
//     unqiue:true
//   },
//   number3:{
//     type:Number,
//     required:true,
//     unqiue:true
//   },
//   message:{
//     type:String,
//     required:true
//   }
// }

// const contact1 = mongoose.model("Support",contactSchema)

// Check in Check out Schema
const mongoose = require("mongoose");

const user1Schema = {
  Name: String,
  Checkin: String,
  Checkout: String,
};
const employee = mongoose.model("Stat", user1Schema);

const user12Schema = {
  Name: String,
  Food: String,
  Price: String,
};
const employee1 = mongoose.model("Food", user12Schema);

//Register New Employee Schema

const user2Schema = new mongoose.Schema({
  name1: String,
  age: String,
  dob: String,
  gender: String,
  phone: String,
  email: String,
  password: String,
  aadhar: String,
});

const user2 = mongoose.model("Register", user2Schema);

const user3Scheme = new mongoose.Schema({
  announcement: String,
});

const user3 = mongoose.model("Announcement", user3Scheme);

const contactSchema = {
  name3: String,
  email3: String,
  number3: String,
  message: String,
};

const contact1 = mongoose.model("Support", contactSchema);

require("./config/passport")(passport);
// const expressLayout = require("express-ejs-layouts");

// EJS
app.use(express.static("public"));
// app.use(expressLayout);
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: false,
  })
);

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

// Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//QR code
app.get("/qrcode", (req, res) => {
  res.render("qrcode");
});

// Home Page
app.get("/", (req, res) => {
  res.render("index");
});

//Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

//Register dummy Page
app.get("/%%%register%%%", (req, res) => {
  res.render("Register");
});

app.get("/registeruser",ensureAuthenticated,(req, res) =>
  res.render("registeruser", {
    // name: req.user.name,
  })
);

app.get("/parking", ensureAuthenticated, (req, res) =>
  res.render("parking", {
    name: req.user.name,
  })
);

app.get("/announcement", ensureAuthenticated, (req, res) =>
  res.render("announcement", {
    name: req.user.name,
  })
);

app.post("/announcement", async (req, res) => {
  try {
    const existingUser1 = new user3({
      announcement: req.body.announcement,
    });
    const registered = await existingUser1.save();
    res.status(201).render("announcement", {
      name: req.user.name,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// try{
//     const existingUser = new user2({
//         name:req.body.name,
//         age:req.body.age,
//         dob:req.body.dob,
//         gender:req.body.gender,
//         phone:req.body.phone,
//         email:req.body.email,
//         password:req.body.password,
//         aadhar:req.body.aadhar
//     })
//     const registered = await existingUser.save();
//     res.status(201).render("registeruser",{
//         name:req.user.name
//     })
// } catch(error){
//     res.status(400).send(error);
// }
// });

// app.post('/announcement',(req,res)=>{
//     const { announcement } = req.body;
//     try{
//         const announcementDone = User({
//             announcement:req.body.announcement

//     })

//     const announced = await announcementDone.save();
//     res.status(201).render("/announcement")
// } catch(error){
//     res.status(400).send(error);
// }

app.get("/canteen", ensureAuthenticated, (req, res) =>
  employee1.find({}, function (err, user1) {
    res.render("canteen", {
      userDetails: user1,
      name: req.user.name,
    });
  })
);

// app.get('/userdetails', ensureAuthenticated, (req, res) =>
//     res.render('userdetails', {
//         name: req.user.name
//     }));

// Getting Emp Details From DB
app.get("/userdetails", ensureAuthenticated, (req, res) => {
  user2.find({}, (err, user, userdetails) => {
    res.render("userdetails", {
      name: req.user.name,
      empDetails: user,
    });
  });
});

// app.post("/registeruser",  async(req, res) => {

// console.log(req.body.name)
//   try {
//     const existingUser = new user2({
//       name: req.body.name,
//       age: req.body.age,
//       dob: req.body.dob,
//       gender: req.body.gender,
//       phone: req.body.phone,
//       email: req.body.email,
//       password: req.body.password,
//       aadhar: req.body.aadhar,
//     });
//     const registered = await existingUser.save();
//     res.status(201).render("registeruser", {
//       name: req.user.name,
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

app.post("/scan", (req, res) => {
  const url = req.body.url;

  if (url.length === 0) res.send("Empty Data!");
  qr.toDataURL(url, (err, src) => {
    if (err) res.send("Error Occured");

    res.render("scan", { src });
  });
});

app.post("/registeruser", (req, res) => {
  const { name1, age, dob, gender, phone, email, password, password2, aadhar } =
    req.body;

  let errors = [];

  if (
    !name1 ||
    !age ||
    !dob ||
    !gender ||
    !phone ||
    !email ||
    !password ||
    !password2 ||
    !aadhar
  ) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (password != password2) {
    errors.push({ msg: "Passwords do no match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("registeruser", {
      name: req.user.name,
      errors,
      name1,
      age,
      dob,
      gender,
      phone,
      email,
      password,
      password2,
      aadhar,
    });
  } else {
    // Validation Passed
    user2.findOne({ email: email }).then((user) => {
      if (user) {
        name: req.user.name;
        // User Exists
        errors.push({ msg: "Email is already registered" });
        res.render("registeruser", {
          errors,
          name1,
          age,
          dob,
          gender,
          phone,
          email,
          password,
          password2,
          aadhar,
        });
      } else {
        name: req.user.name;
        const newUser = new user2({
          name1,
          age,
          dob,
          gender,
          phone,
          email,
          password,
          password2,
          aadhar,
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Pasword turned to hash
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("registeruser");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

app.get("/feedback", ensureAuthenticated, (req, res) => {
  contact1.find({}, (err, user, emp1Details) => {
    res.render("feedback", {
      name: req.user.name,
      emp1Details: user,
    });
  });
});

// app.get("/userdetails", ensureAuthenticated, (req, res) => {
//   user2.find({}, (err, user, userdetails) => {
//     res.render("userdetails", {
//       name: req.user.name,
//       empDetails: user,
//     });
//   });
// });

//Register dummy post page
app.post("/register",ensureAuthenticated, (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (password != password2) {
    errors.push({ msg: "Passwords do no match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation Passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User Exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Pasword turned to hash
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

//Logout
app.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

// Dashboard
// app.get('/dashboard', ensureAuthenticated, (req, res) =>
//     res.render('dashboard', {
//         name: req.user.name
//     }));

app.get("/dashboard", ensureAuthenticated, (req, res) => {
  employee.find({}, function (err, user1) {
    res.render("dashboard", {
      userDetails: user1,
      name: req.user.name,
    });
  });
});

// Welcome
app.get("/welcome", (req, res) => {
  res.render("welcome");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});