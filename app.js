if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require("express-flash");
//DB Connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL,  { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

//Table of Registered Users
const User = require("./models/user.js");
const Log = require("./models/log.js");

//Initializing passport for authentication
const passport = require('passport')
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => User.findOne({email : email}).exec(),
    username => User.findOne({username : username}).exec()
)
app.use(flash());
app.use(express.urlencoded({ extended: false }))

//handling session requirements
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render('index', {title: "hi"});
});

app.get("/failure", (req, res) => {
  res.status(404).send("Please register a new account.");
});

//login
app.post('/login', checkNotAuthenticated,
    passport.authenticate('local', {
    successRedirect: '/logs',
    failureRedirect: '/failure',
    failureFlash: true
}));

//register a new user
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    if(req.body.username.length < 1 || req.body.email.length < 1 || req.body.password.length < 1
      || await User.findOne({username: req.body.username}) || await User.findOne({email: req.body.email}) ){
      throw {message: "Invalid Credentials"} ;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    const addedUser = await newUser.save();
    res.json({username: addedUser.username, email: addedUser.email});
  } catch(err) {
    res.status(400).send({message : err.message});
  }
})

//log out
app.delete('/logout', checkAuthenticated,async (req, res) => {
  const username = req.user.username;
  req.logOut();
  let newLog = new Log({
    username: username,
    description: "Successful Logout"
  });
  await newLog.save();
  res.status(204).send({message: `${username} Logged Out`});
})

app.get("/logs", checkAuthenticated, async (req, res, next) => {
  res.json(await Log.find({username: req.user.username}));
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({message : "Unauthorized, login required."});
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(401).send({message : "Please first log out to register a new account or log in"});
  }
  next();
}

const chatsRouter = require("./chats");
app.use("/chats", chatsRouter);

app.listen(3000, () => console.log("Server Started"));

module.exports = function (){
  return "hello";
}