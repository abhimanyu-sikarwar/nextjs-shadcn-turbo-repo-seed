import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SubscriptionTier, AuthProvider } from '../types';

export interface IUserDocument extends Document {
    _id: string;
    email: string;
    password?: string; // Optional for social logins
    name: string;
    googleId?: string;
    appleId?: string;
    profilePicture?: string;
    preferences?: string;
    avatarCount: number;
    subscription: SubscriptionTier;
    apiKey?: string;
    refreshToken?: string;
    authProvider: AuthProvider;
    isActive: boolean;
    emailVerified: boolean;
    lastLogin?: Date;
    createdAt?: any;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    generateApiKey(): string;
}

const UserSchema = new Schema<IUserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        minlength: 6,
        // required: function () {
        //     return this.authProvider === AuthProvider.LOCAL;
        // }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    appleId: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    profilePicture: {
        type: String
    },
    avatarCount: {
        type: Number,
        default: 0
    },
    subscription: {
        type: String,
        enum: Object.values(SubscriptionTier),
        default: SubscriptionTier.FREE
    },
    apiKey: {
        type: String,
        unique: true,
        sparse: true
    },
    refreshToken: {
        type: String
    },
    authProvider: {
        type: String,
        enum: Object.values(AuthProvider),
        default: AuthProvider.LOCAL,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
UserSchema.index({ email: 1, authProvider: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ appleId: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate access token
UserSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            subscription: this.subscription
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function (): string {
    const refreshToken = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );
    this.refreshToken = refreshToken;
    return refreshToken;
};

// Generate API key
UserSchema.methods.generateApiKey = function (): string {
    const apiKey = `mk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    this.apiKey = apiKey;
    return apiKey;
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
