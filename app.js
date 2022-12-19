const express = require('express')
const path = require('path')
const dotenv= require('dotenv')
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()

dotenv.config({path:'./config.env'})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','pug')
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

app.get('/',(req,res)=>{res.render("main")})
app.get("/glm", (req, res)=>{
    res.send("HELLO FROM GLM")
})

app.listen(8000);