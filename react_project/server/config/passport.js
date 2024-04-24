//let json web token protect API
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;

module.exports = (passport) => {
  let options = {};
  //extract tokens from authorization
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  options.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          //if error then return done of function(jwt_payload) and value is error flase
          return done(err, false);
        }
        if (user) {
          //if no error and find user then  done of function(jwt_payload) and value is null user No need return
          done(null, user);
        } else {
          //if no error and NOT find user then done of function(jwt_payload) and value is null false No need return
          done(null, false);
        }
      });
    })
  );
};
