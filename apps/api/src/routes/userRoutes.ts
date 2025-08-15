import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateExportOptions } from '../middleware/validation';
import { validateUserProfileUpdate, validateSystemPreferences } from '../middleware/validation/user';
import { rateLimit } from '../middleware/rateLimit';

const router: Router = Router();

const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// User profile management
router.get('/profile', rateLimit, userController.getProfile);
router.put('/profile', rateLimit, validateUserProfileUpdate, userController.updateProfile);

// User system preferences (theme, language, etc.)
router.put('/preferences', rateLimit, validateSystemPreferences, userController.updateUserPreferences);

// User statistics and analytics
router.get('/stats', rateLimit, userController.getUserStats);

// Data export
router.get('/export', rateLimit, validateExportOptions, userController.exportData);

// Account management
router.delete('/account', rateLimit, userController.deleteAccount);

export default router;