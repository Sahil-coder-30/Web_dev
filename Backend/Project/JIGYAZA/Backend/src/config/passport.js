import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Try to find the user by their Google ID
        let user = await userModel.findOne({ googleId: profile.id });
        if (user) {
          // Keep display name and profile picture up-to-date
          let changed = false;
          const avatarUrl = profile.photos && profile.photos[0]?.value;
          if (avatarUrl && user.avatar !== avatarUrl) {
            user.avatar = avatarUrl;
            changed = true;
          }
          if (profile.displayName && user.displayName !== profile.displayName) {
            user.displayName = profile.displayName;
            changed = true;
          }
          if (!user.verified) {
            user.verified = true;
            changed = true;
          }
          if (changed) {
            await user.save();
          }
          return done(null, user);
        }

        // 2. If not found by Google ID, check if email is registered
        const email = profile.emails && profile.emails[0]?.value;
        if (email) {
          user = await userModel.findOne({ email });
          if (user) {
            // Link Google account to existing user and save details
            user.googleId = profile.id;
            user.verified = true; // Google emails are already verified
            user.displayName = profile.displayName || user.displayName;
            user.avatar = (profile.photos && profile.photos[0]?.value) || user.avatar;
            await user.save();
            return done(null, user);
          }
        }

        // 3. Create a new user if none exists
        if (!email) {
          return done(new Error("Email not returned by Google"), null);
        }

        // Generate a unique username
        const baseUsername = profile.displayName
          ? profile.displayName.replace(/\s+/g, "").toLowerCase()
          : email.split("@")[0];
        let username = baseUsername;
        let count = 1;

        while (await userModel.findOne({ username })) {
          username = `${baseUsername}${count}`;
          count++;
        }

        user = await userModel.create({
          googleId: profile.id,
          username,
          email,
          displayName: profile.displayName,
          avatar: profile.photos && profile.photos[0]?.value,
          verified: true,
          // password field is omitted so they don't have a password set initially
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// We're not using session-based authentication, but passport-google-oauth20 still requires these if passport.initialize() is used, though serializeUser isn't run if session: false is set.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
