const express = require("express");
const bodyParser = require("body-parser");
const user_router = require("./user/api");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/v1/user', user_router);

// listen on a given port
app.listen(3000, function() {
    console.log("App listening at port 3000");
});