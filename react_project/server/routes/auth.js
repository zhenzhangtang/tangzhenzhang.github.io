const router = require("express").Router();
const registerValidation = require("..//validation").registerValidation;
const loginValidation = require("..//validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");
//get message whenever a authtication coming in
router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});
//use postman interact server, use testAPI to make sure it connecting with server
router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Success!!Test API is working.",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  // check validation of data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message); //register role error message will show adminregisteronly to user
  // check if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Opus! Email address has already exists.");
  // register the user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "Success! User is saved!",
      savedObject: savedUser,
    });
  } catch (err) {
    res.status(400).send("Opus! something went wrong. User is not saved.");
  }
});

//use json webtoken login
router.post("/login", (req, res) => {
  // check validation of data FIRST
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if request of email login address is exit in database or not,if error then 400
  //if not exit,then 401 no user,
  //else result is email address exit,then comparePassword
  //call comparePassword from models/user-modules
  //if cant compare(error) then 400 error
  //if is match then//get tokenobject then sign with SECRET
  //then send success with JWT
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("User is not found,please check again.");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);
        if (isMatch) {
          //get tokenobject then sign with secret
          //then send success with JWT
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong password.");
        }
      });
    }
  });
});

module.exports = router;
//pratise:JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWMzOTQ3Nzg0YjFjYTI0YzRhZjQ5YjYiLCJlbWFpbCI6IjEyM2FsdmluemhlbnpoYW5ndGFuZ0BnbWFpbC5jb20iLCJpYXQiOjE3MDczMTY0NDZ9.4ITWVTpTY7d6koJf0iPWalYD7aEnIaKJx-WBGYYXTUU
