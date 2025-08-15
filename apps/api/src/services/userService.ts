import { User, IUserDocument } from '../models/User';
import { Preference } from '../models/Preference';
import { Category } from '../models/Category';
import { UserUpdateRequest } from '../types';
import { logger } from '../utils/logger';

export class UserService {
    async getUserById(userId: string): Promise<IUserDocument | null> {
        return User.findById(userId).select('-password -refreshToken -apiKey');
    }

    async updateUser(userId: string, updates: UserUpdateRequest): Promise<IUserDocument> {
        const user = await User.findByIdAndUpdate(
            userId,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password -refreshToken -apiKey');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateUserSystemPreferences(userId: string, preferences: any): Promise<IUserDocument> {
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                $set: { 
                    preferences: preferences,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        ).select('-password -refreshToken -apiKey');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async deleteUser(userId: string): Promise<void> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Soft delete user and all associated data
        user.isActive = false;
        await user.save();

        // Soft delete all user preferences
        await Preference.updateMany(
            { userId, deletedAt: null },
            { deletedAt: new Date() }
        );

        // Delete custom categories (system categories remain)
        await Category.deleteMany({ userId, isSystem: false });
    }

    async getUserStats(userId: string): Promise<any> {
        try {
            // Get total preferences count
            const totalPreferences = await Preference.countDocuments({
                userId,
                deletedAt: null
            });

            // Get total categories count (including system)
            const totalCategories = await Category.countDocuments({
                $or: [
                    { userId, isSystem: false },
                    { isSystem: true }
                ]
            });

            // Get preferences by category
            const preferencesByCategory = await Preference.aggregate([
                { $match: { userId: userId, deletedAt: null } },
                { $group: { _id: '$categoryId', count: { $sum: 1 } } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                {
                    $project: {
                        categoryName: '$category.name',
                        count: 1
                    }
                }
            ]);

            // Get recent activity (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentPreferences = await Preference.countDocuments({
                userId,
                createdAt: { $gte: thirtyDaysAgo },
                deletedAt: null
            });

            const recentUpdates = await Preference.countDocuments({
                userId,
                updatedAt: { $gte: thirtyDaysAgo },
                createdAt: { $lt: thirtyDaysAgo },
                deletedAt: null
            });

            return {
                totalPreferences,
                totalCategories,
                preferencesByCategory: preferencesByCategory.reduce((acc, item) => {
                    acc[item.categoryName] = item.count;
                    return acc;
                }, {}),
                recentActivity: {
                    preferencesCreated: recentPreferences,
                    preferencesUpdated: recentUpdates,
                    lastActivityDate: await this.getLastActivityDate(userId)
                }
            };
        } catch (error) {
            logger.error('Error getting user stats:', error);
            throw new Error('Failed to get user statistics');
        }
    }

    async exportUserData(userId: string, format: string): Promise<string> {
        try {
            // Get user data
            const user = await this.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Get all categories (user custom + system)
            const categories = await Category.find({
                $or: [
                    { userId, isSystem: false },
                    { isSystem: true }
                ]
            }).lean();

            // Get all preferences
            const preferences = await Preference.find({
                userId,
                deletedAt: null
            }).populate('categoryId').lean();

            const exportData = {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    preferences: user.preferences
                },
                categories,
                preferences,
                exportedAt: new Date(),
                totalRecords: preferences.length
            };

            if (format === 'csv') {
                return this.convertToCSV(exportData);
            }

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            logger.error('Error exporting user data:', error);
            throw new Error('Failed to export user data');
        }
    }

    private async getLastActivityDate(userId: string): Promise<Date | null> {
        const lastPreference = await Preference.findOne({
            userId,
            deletedAt: null
        }).sort({ updatedAt: -1 }).select('updatedAt');

        return lastPreference ? lastPreference.updatedAt : null;
    }

    private convertToCSV(data: any): string {
        const preferences = data.preferences;
        if (!preferences || preferences.length === 0) {
            return 'No preferences to export';
        }

        const headers = ['Name', 'Category', 'Value', 'Description', 'Tags', 'Priority', 'Created', 'Updated'];
        const csvRows = [headers.join(',')];

        preferences.forEach((pref: any) => {
            const row = [
                this.escapeCSV(pref.name),
                this.escapeCSV(pref.categoryId?.name || 'Unknown'),
                this.escapeCSV(typeof pref.value === 'object' ? JSON.stringify(pref.value) : String(pref.value)),
                this.escapeCSV(pref.description || ''),
                this.escapeCSV(pref.tags?.join('; ') || ''),
                pref.priority || 3,
                pref.createdAt ? new Date(pref.createdAt).toISOString() : '',
                pref.updatedAt ? new Date(pref.updatedAt).toISOString() : ''
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    private escapeCSV(field: string): string {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    }
}