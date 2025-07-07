import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0].value;
      const name = profile.displayName;

      const user = {
        facebookId: profile.id,
        email,
        name,
      };

      return done(null, user);
    }
  )
);
