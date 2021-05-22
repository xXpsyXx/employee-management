const mongoose = require('mongoose');

const user2Schema = ({
    name1: String,
    email: String,
    password: String,
    password2: String,
    
  });

  const user2 = mongoose.model("Register", user2Schema);

  module.exports = user2;