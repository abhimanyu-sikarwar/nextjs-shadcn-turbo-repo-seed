import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
    // validateRegistration,
    // validateLogin,
    validateGoogleSignIn,
    validateAppleSignIn,
    validateUserRegistration
} from '../middleware/validation';

const router: Router = Router();
const authController = new AuthController();

// Local authentication
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', authController.login);
// router.post('/register', validateRegistration, authController.register);
// router.post('/login', validateLogin, authController.login);

// Google authentication
router.post('/google', validateGoogleSignIn, authController.googleSignIn);
router.post('/apple', validateAppleSignIn, authController.appleSignIn);
router.get(
    '/google/oauth',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);

// Token management
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

// API key management
router.post('/api-key/generate', authenticate, authController.generateApiKey);
router.delete('/api-key', authenticate, authController.revokeApiKey);

export default router;