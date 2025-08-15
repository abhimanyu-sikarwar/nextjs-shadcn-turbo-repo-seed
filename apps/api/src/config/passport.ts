import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import { AuthProvider } from '../types';
import { logger } from '../utils/logger';

// JWT Strategy
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET!
        },
        async (payload: any, done: any) => {
            try {
                const user = await User.findById(payload.id).select('-password');
                if (user && user.isActive) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists with this Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // Update last login
                    user.lastLogin = new Date();
                    await user.save();
                    return done(null, user);
                }

                // Check if user exists with this email
                user = await User.findOne({ email: profile.emails?.[0].value });

                if (user) {
                    // Link Google account to existing user
                    if (user.authProvider === AuthProvider.LOCAL) {
                        user.googleId = profile.id;
                        user.profilePicture = profile.photos?.[0].value;
                        user.emailVerified = true;
                        user.lastLogin = new Date();
                        await user.save();
                        return done(null, user);
                    } else {
                        // User exists with different provider
                        return done(null, false, { message: 'Email already registered with different provider' });
                    }
                }

                // Create new user
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                    profilePicture: profile.photos?.[0].value,
                    authProvider: AuthProvider.GOOGLE,
                    emailVerified: true,
                    lastLogin: new Date()
                });

                return done(null, user);
            } catch (error) {
                logger.error('Google OAuth error:', error);
                return done(error as Error, false);
            }
        }
    )
);

// Serialize/Deserialize user
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;