require('dotenv/config')
const mongoose = require("mongoose");
const url = process.env.SECRET_MESSAGE;
mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`Connected!`);

}).catch((e) => {
    console.log(`Failed`);
})

