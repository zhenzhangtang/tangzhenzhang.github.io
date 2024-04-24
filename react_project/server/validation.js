const Joi = require("joi");
//check everthing in  register/login/coure
// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(40).required(),
    email: Joi.string().min(4).max(40).required().email(),
    password: Joi.string().min(4).max(200).required(),
    role: Joi.string()
      .required()
      .valid("student", "instructor", "adminregisteronly"),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(4).max(40).required().email(),
    password: Joi.string().min(4).max(200).required(),
  });
  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(50).required(),
    price: Joi.number().min(0).max(9999).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

module.exports.courseValidation = courseValidation;
