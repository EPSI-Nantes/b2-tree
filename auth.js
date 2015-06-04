var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

  passport.use(new LocalStrategy({
		usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
  },
  function(req, username, password, done) {
    if(username === 'gsb' && password === 'gsb') {
      return done(null, {username: 'visiteur'});
    }

    return done(null, false, req.flash('loginMessage', 'Login ou mot de passe incorrect !'));
  }
));

  passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});

module.exports = passport;