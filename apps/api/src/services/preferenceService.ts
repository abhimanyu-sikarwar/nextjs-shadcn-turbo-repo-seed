import { Preference } from '../models/Preference';
import { Category } from '../models/Category';
import { logger } from '../utils/logger';

interface PreferenceFilters {
    categoryId?: string;
    search?: string;
    tags?: string[];
    isPrivate?: boolean;
    priority?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}

interface PaginatedResult {
    preferences: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export class PreferenceService {
    async getUserPreferences(userId: string, filters: PreferenceFilters): Promise<PaginatedResult> {
        try {
            const page = filters.page || 1;
            const limit = Math.min(filters.limit || 20, 100); // Max 100 per page
            const skip = (page - 1) * limit;

            // Build match query
            const matchQuery: any = {
                userId,
                deletedAt: null
            };

            if (filters.categoryId) {
                matchQuery.categoryId = filters.categoryId;
            }

            if (filters.isPrivate !== undefined) {
                matchQuery.isPrivate = filters.isPrivate;
            }

            if (filters.priority) {
                matchQuery.priority = filters.priority;
            }

            if (filters.tags && filters.tags.length > 0) {
                matchQuery.tags = { $in: filters.tags };
            }

            if (filters.search) {
                matchQuery.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }

            // Build sort query
            const sortQuery: any = {};
            const sortBy = filters.sortBy || 'created';
            const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

            switch (sortBy) {
                case 'name':
                    sortQuery.name = sortOrder;
                    break;
                case 'priority':
                    sortQuery.priority = sortOrder;
                    break;
                case 'updated':
                    sortQuery.updatedAt = sortOrder;
                    break;
                default:
                    sortQuery.createdAt = sortOrder;
            }

            // Execute queries
            const [preferences, total] = await Promise.all([
                Preference.find(matchQuery)
                    .populate('categoryId', 'name icon color')
                    .sort(sortQuery)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Preference.countDocuments(matchQuery)
            ]);

            return {
                preferences,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Error getting user preferences:', error);
            throw new Error('Failed to get preferences');
        }
    }

    async getPreferenceById(preferenceId: string, userId: string): Promise<any | null> {
        try {
            const preference = await Preference.findOne({
                _id: preferenceId,
                userId,
                deletedAt: null
            }).populate('categoryId', 'name icon color').lean();

            return preference;
        } catch (error) {
            logger.error('Error getting preference by ID:', error);
            throw new Error('Failed to get preference');
        }
    }

    async createPreference(userId: string, preferenceData: any): Promise<any> {
        try {
            // Validate category ownership
            const category = await Category.findOne({
                _id: preferenceData.categoryId,
                $or: [
                    { userId, isSystem: false },
                    { isSystem: true }
                ]
            });

            if (!category) {
                throw new Error('Invalid category');
            }

            // Check for duplicate names within the same category
            const existingPreference = await Preference.findOne({
                userId,
                categoryId: preferenceData.categoryId,
                name: { $regex: new RegExp(`^${preferenceData.name}$`, 'i') },
                deletedAt: null
            });

            if (existingPreference) {
                throw new Error('Preference with this name already exists in the category');
            }

            const preference = await Preference.create({
                ...preferenceData,
                userId,
                metadata: {
                    source: 'manual',
                    version: 1
                }
            });

            return await Preference.findById(preference._id)
                .populate('categoryId', 'name icon color')
                .lean();
        } catch (error) {
            logger.error('Error creating preference:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to create preference');
        }
    }

    async updatePreference(preferenceId: string, userId: string, updateData: any): Promise<any | null> {
        try {
            const preference = await Preference.findOne({
                _id: preferenceId,
                userId,
                deletedAt: null
            });

            if (!preference) {
                return null;
            }

            // Validate category if being changed
            if (updateData.categoryId && updateData.categoryId !== preference.categoryId.toString()) {
                const category = await Category.findOne({
                    _id: updateData.categoryId,
                    $or: [
                        { userId, isSystem: false },
                        { isSystem: true }
                    ]
                });

                if (!category) {
                    throw new Error('Invalid category');
                }
            }

            // Check for duplicate names if name is being changed
            if (updateData.name && updateData.name !== preference.name) {
                const categoryId = updateData.categoryId || preference.categoryId;
                const existingPreference = await Preference.findOne({
                    userId,
                    categoryId,
                    name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
                    _id: { $ne: preferenceId },
                    deletedAt: null
                });

                if (existingPreference) {
                    throw new Error('Preference with this name already exists in the category');
                }
            }

            const updatedPreference = await Preference.findByIdAndUpdate(
                preferenceId,
                {
                    ...updateData,
                    updatedAt: new Date(),
                    'metadata.version': preference.metadata.version + 1
                },
                { new: true, runValidators: true }
            ).populate('categoryId', 'name icon color');

            return updatedPreference;
        } catch (error) {
            logger.error('Error updating preference:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to update preference');
        }
    }

    async deletePreference(preferenceId: string, userId: string): Promise<boolean> {
        try {
            const preference = await Preference.findOne({
                _id: preferenceId,
                userId,
                deletedAt: null
            });

            if (!preference) {
                return false;
            }

            // Soft delete
            preference.deletedAt = new Date();
            await preference.save();

            return true;
        } catch (error) {
            logger.error('Error deleting preference:', error);
            throw new Error('Failed to delete preference');
        }
    }

    async searchPreferences(userId: string, query: string, page: number = 1, limit: number = 20): Promise<PaginatedResult> {
        try {
            const skip = (page - 1) * limit;

            const searchQuery = {
                userId,
                deletedAt: null,
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            };

            const [preferences, total] = await Promise.all([
                Preference.find(searchQuery)
                    .populate('categoryId', 'name icon color')
                    .sort({ updatedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Preference.countDocuments(searchQuery)
            ]);

            return {
                preferences,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Error searching preferences:', error);
            throw new Error('Failed to search preferences');
        }
    }

    async bulkDeletePreferences(userId: string, preferenceIds: string[]): Promise<{ deletedCount: number; notFoundCount: number }> {
        try {
            const preferences = await Preference.find({
                _id: { $in: preferenceIds },
                userId,
                deletedAt: null
            });

            const deletedCount = preferences.length;
            const notFoundCount = preferenceIds.length - deletedCount;

            if (deletedCount > 0) {
                await Preference.updateMany(
                    { _id: { $in: preferences.map(p => p._id) } },
                    { deletedAt: new Date() }
                );
            }

            return { deletedCount, notFoundCount };
        } catch (error) {
            logger.error('Error bulk deleting preferences:', error);
            throw new Error('Failed to bulk delete preferences');
        }
    }

    async bulkUpdatePreferences(userId: string, updates: { id: string; data: any }[]): Promise<{
        updatedCount: number;
        notFoundCount: number;
        preferences: any[];
    }> {
        try {
            const updatedPreferences = [];
            let updatedCount = 0;
            let notFoundCount = 0;

            for (const update of updates) {
                const preference = await this.updatePreference(update.id, userId, update.data);
                if (preference) {
                    updatedPreferences.push(preference);
                    updatedCount++;
                } else {
                    notFoundCount++;
                }
            }

            return {
                updatedCount,
                notFoundCount,
                preferences: updatedPreferences
            };
        } catch (error) {
            logger.error('Error bulk updating preferences:', error);
            throw new Error('Failed to bulk update preferences');
        }
    }

    async restorePreference(preferenceId: string, userId: string): Promise<any | null> {
        try {
            const preference = await Preference.findOne({
                _id: preferenceId,
                userId,
                deletedAt: { $ne: null }
            });

            if (!preference) {
                return null;
            }

            preference.deletedAt = undefined;
            await preference.save();

            return await Preference.findById(preferenceId)
                .populate('categoryId', 'name icon color')
                .lean();
        } catch (error) {
            logger.error('Error restoring preference:', error);
            throw new Error('Failed to restore preference');
        }
    }

    async getPreferencesByCategory(userId: string, categoryId: string, page: number = 1, limit: number = 20): Promise<PaginatedResult> {
        try {
            const skip = (page - 1) * limit;

            const matchQuery = {
                userId,
                categoryId,
                deletedAt: null
            };

            const [preferences, total] = await Promise.all([
                Preference.find(matchQuery)
                    .populate('categoryId', 'name icon color')
                    .sort({ priority: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Preference.countDocuments(matchQuery)
            ]);

            return {
                preferences,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Error getting preferences by category:', error);
            throw new Error('Failed to get preferences by category');
        }
    }
}