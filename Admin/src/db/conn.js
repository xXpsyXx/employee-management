require('dotenv/config')
const mongoose = require("mongoose");
const url = "mongodb+srv://pranay:Pranay4psy1234@testing.osytn.mongodb.net/adminDB?retryWrites=true&w=majority";
mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`Connected!`);

}).catch((e) => {
    console.log(`Failed`);
})

