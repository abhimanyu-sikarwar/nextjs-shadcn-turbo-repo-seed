import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { AuthProvider, AuthTokens, GoogleProfile, AppleProfile, UserRegistrationRequest } from '../types';
import { logger } from '../utils/logger';

export class AuthService {
    private googleClient: OAuth2Client;

    constructor() {
        this.googleClient = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );
    }

    async registerUser(data: UserRegistrationRequest): Promise<{
        user: IUserDocument;
        tokens: AuthTokens;
    }> {
        // Check if user already exists
        
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create new user
        const user = await User.create({
            ...data,
            authProvider: AuthProvider.LOCAL
        });

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return {
            user,
            tokens: { accessToken, refreshToken }
        };
    }

    async loginUser(email: string, password: string): Promise<{
        user: IUserDocument;
        tokens: AuthTokens;
    }> {
        // Find user
        const user = await User.findOne({ email, authProvider: AuthProvider.LOCAL });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return {
            user,
            tokens: { accessToken, refreshToken }
        };
    }

    async verifyGoogleToken(idToken: string): Promise<GoogleProfile> {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID!
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid token');
            }

            return {
                id: payload.sub,
                email: payload.email!,
                name: payload.name!,
                picture: payload.picture!,
                verified_email: payload.email_verified!
            };
        } catch (error) {
            logger.error('Google token verification failed:', error);
            throw new Error('Invalid Google token');
        }
    }

    async googleSignIn(idToken: string): Promise<{
        user: IUserDocument;
        tokens: AuthTokens;
        isNewUser: boolean;
    }> {
        // Verify Google token
        const googleProfile = await this.verifyGoogleToken(idToken);

        // Check if user exists
        let user = await User.findOne({
            $or: [
                { googleId: googleProfile.id },
                { email: googleProfile.email }
            ]
        });

        let isNewUser = false;

        if (!user) {
            // Create new user
            user = await User.create({
                googleId: googleProfile.id,
                email: googleProfile.email,
                name: googleProfile.name,
                profilePicture: googleProfile.picture,
                authProvider: AuthProvider.GOOGLE,
                emailVerified: googleProfile.verified_email,
                lastLogin: new Date()
            });
            isNewUser = true;
        } else {
            // Update existing user
            if (!user.googleId) {
                user.googleId = googleProfile.id;
            }
            if (!user.profilePicture) {
                user.profilePicture = googleProfile.picture;
            }
            user.emailVerified = true;
            user.lastLogin = new Date();
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return {
            user,
            tokens: { accessToken, refreshToken },
            isNewUser
        };
    }

    async verifyAppleToken(idToken: string): Promise<AppleProfile> {
        try {
            const payload: any = jwt.decode(idToken);
            if (!payload) {
                throw new Error('Invalid token');
            }
            return {
                id: payload.sub,
                email: payload.email,
                name: payload.email,
            };
        } catch (error) {
            logger.error('Apple token verification failed:', error);
            throw new Error('Invalid Apple token');
        }
    }

    async appleSignIn(idToken: string): Promise<{
        user: IUserDocument;
        tokens: AuthTokens;
        isNewUser: boolean;
    }> {
        const appleProfile = await this.verifyAppleToken(idToken);

        let user = await User.findOne({
            $or: [
                { appleId: appleProfile.id },
                { email: appleProfile.email }
            ]
        });

        let isNewUser = false;

        if (!user) {
            user = await User.create({
                appleId: appleProfile.id,
                email: appleProfile.email,
                name: appleProfile.name || appleProfile.email,
                authProvider: AuthProvider.APPLE,
                emailVerified: true,
                lastLogin: new Date()
            });
            isNewUser = true;
        } else {
            if (!user.appleId) {
                user.appleId = appleProfile.id;
            }
            user.emailVerified = true;
            user.lastLogin = new Date();
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return {
            user,
            tokens: { accessToken, refreshToken },
            isNewUser
        };
    }

    async refreshTokens(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;

            // Find user
            const user = await User.findOne({
                _id: decoded.id,
                refreshToken,
                isActive: true
            });

            if (!user) {
                throw new Error('Invalid refresh token');
            }

            // Generate new tokens
            const newAccessToken = user.generateAccessToken();
            const newRefreshToken = user.generateRefreshToken();
            await user.save();

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async logout(userId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, {
            refreshToken: null
        });
    }

    async generateApiKey(userId: string): Promise<string> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const apiKey = user.generateApiKey();
        await user.save();

        return apiKey;
    }

    async revokeApiKey(userId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, {
            apiKey: null
        });
    }

    async generateTokensForUser(userId: string): Promise<AuthTokens> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return {
            accessToken,
            refreshToken
        };
    }
}