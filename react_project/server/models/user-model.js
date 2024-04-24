const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 40,
  },
  email: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 40,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 2000,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "adminregisteronly"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isIntructor = function () {
  return this.role == "instructor";
};

userSchema.methods.isAdmin = function () {
  return this.role == "adminregisteronly";
};

// mongoose schema middleare precheckpassword
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cbk) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cbk(err, isMatch);
    }
    cbk(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
