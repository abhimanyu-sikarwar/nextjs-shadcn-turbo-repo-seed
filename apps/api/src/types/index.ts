
export interface User {
    _id: string;
    email: string;
    name: string;
    avatarCount: number;
    subscription?: SubscriptionTier;
}

export enum SubscriptionTier {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium'
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface GoogleProfile {
    id: string;
    email: string;
    name: string;
    picture: string;
    verified_email: boolean;
}

export interface AppleProfile {
    id: string;
    email: string;
    name?: string;
}

export interface LoginResponse {
    success: boolean;
    user?: {
        id: string;
        email: string;
        name: string;
        avatarCount: number;
        subscription: SubscriptionTier;
        profilePicture?: string;
    };
    tokens?: AuthTokens;
    error?: string;
}

export interface UserRegistrationRequest {
    email: string;
    password: string;
    name: string;
}

export interface UserUpdateRequest {
    name?: string;
    password?: string;
    currentPassword?: string;
}

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    APPLE = 'apple'
}

export * from './schema.type'