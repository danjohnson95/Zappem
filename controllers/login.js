var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash-and-salt');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('try');
    var User = require('../models/User.js');
    User.findOne({email: username}, function(err, user){
      if(err) return done(err);
      if(!user) return done(null, false);

      passwordHash(password).verifyAgainst(user.password, function(error, verified){
        if(verified) return done(null, user);
        return done(null, false);
      });
    });
  }
));

router.get('/', function(req, res){

	res.rendr('login/index', {
    title: 'Log In',
    loginErr: req.session.flash
  });
});

router.post('/', passport.authenticate('local', {
	successRedirect:'/projects',
	failureRedirect:'/login',
  failureFlash: true
}));

module.exports = router;