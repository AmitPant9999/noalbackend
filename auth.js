const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '', // Check if emails array exists
        image: profile.photos && profile.photos[0] ? profile.photos[0].value : ''  // Check if photos array exists
      });
      await user.save();
    } else {
      // Update user with email and photo if they are missing
      user.email = user.email || (profile.emails && profile.emails[0] ? profile.emails[0].value : '');
      user.image = user.image || (profile.photos && profile.photos[0] ? profile.photos[0].value : '');
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});