import { Category } from '../models/Category';
import { Preference } from '../models/Preference';
import { logger } from '../utils/logger';

export class CategoryService {
    async getUserCategories(userId: string, includeSystem: boolean = true): Promise<any[]> {
        try {
            const query: any = {};
            
            if (includeSystem) {
                query.$or = [
                    { userId, isSystem: false },
                    { isSystem: true }
                ];
            } else {
                query.userId = userId;
                query.isSystem = false;
            }

            const categories = await Category.find(query)
                .sort({ isSystem: -1, order: 1, name: 1 })
                .lean();

            return categories;
        } catch (error) {
            logger.error('Error getting user categories:', error);
            throw new Error('Failed to get categories');
        }
    }

    async getCategoryById(categoryId: string, userId: string): Promise<any | null> {
        try {
            const category = await Category.findOne({
                _id: categoryId,
                $or: [
                    { userId, isSystem: false },
                    { isSystem: true }
                ]
            }).lean();

            return category;
        } catch (error) {
            logger.error('Error getting category by ID:', error);
            throw new Error('Failed to get category');
        }
    }

    async createCategory(userId: string, categoryData: any): Promise<any> {
        try {
            // Check if category name already exists for this user
            const existingCategory = await Category.findOne({
                name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') },
                $or: [
                    { userId, isSystem: false },
                    { isSystem: true }
                ]
            });

            if (existingCategory) {
                throw new Error('Category name already exists');
            }

            // Get the highest order number for user categories
            const lastCategory = await Category.findOne({
                userId,
                isSystem: false
            }).sort({ order: -1 });

            const order = lastCategory ? lastCategory.order + 1 : 1;

            const category = await Category.create({
                ...categoryData,
                userId,
                isSystem: false,
                order
            });

            return category;
        } catch (error) {
            logger.error('Error creating category:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to create category');
        }
    }

    async updateCategory(categoryId: string, userId: string, updateData: any): Promise<any | null> {
        try {
            // System categories cannot be updated
            const category = await Category.findOne({
                _id: categoryId,
                userId,
                isSystem: false
            });

            if (!category) {
                throw new Error('Category not found or cannot be updated');
            }

            // Check name uniqueness if name is being updated
            if (updateData.name && updateData.name !== category.name) {
                const existingCategory = await Category.findOne({
                    name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
                    _id: { $ne: categoryId },
                    $or: [
                        { userId, isSystem: false },
                        { isSystem: true }
                    ]
                });

                if (existingCategory) {
                    throw new Error('Category name already exists');
                }
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            return updatedCategory;
        } catch (error) {
            logger.error('Error updating category:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to update category');
        }
    }

    async deleteCategory(categoryId: string, userId: string): Promise<boolean> {
        try {
            // System categories cannot be deleted
            const category = await Category.findOne({
                _id: categoryId,
                userId,
                isSystem: false
            });

            if (!category) {
                return false;
            }

            // Check if category has preferences
            const preferenceCount = await Preference.countDocuments({
                categoryId,
                userId,
                deletedAt: null
            });

            if (preferenceCount > 0) {
                throw new Error('Cannot delete category that contains preferences. Please move or delete all preferences first.');
            }

            await Category.findByIdAndDelete(categoryId);
            return true;
        } catch (error) {
            logger.error('Error deleting category:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to delete category');
        }
    }

    async reorderCategories(userId: string, categoryIds: string[]): Promise<void> {
        try {
            // Verify all categories belong to the user and are not system categories
            const categories = await Category.find({
                _id: { $in: categoryIds },
                userId,
                isSystem: false
            });

            if (categories.length !== categoryIds.length) {
                throw new Error('Invalid category IDs provided');
            }

            // Update order for each category
            const updatePromises = categoryIds.map((categoryId, index) => 
                Category.findByIdAndUpdate(categoryId, { order: index + 1 })
            );

            await Promise.all(updatePromises);
        } catch (error) {
            logger.error('Error reordering categories:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to reorder categories');
        }
    }

    async getCategoryStatistics(categoryId: string, userId: string): Promise<any | null> {
        try {
            const category = await Category.findOne({
                _id: categoryId,
                $or: [
                    { userId, isSystem: false },
                    { isSystem: true }
                ]
            });

            if (!category) {
                return null;
            }

            // Get preference count
            const preferenceCount = await Preference.countDocuments({
                categoryId,
                userId,
                deletedAt: null
            });

            // Get average priority
            const avgPriorityResult = await Preference.aggregate([
                { $match: { categoryId: categoryId, userId, deletedAt: null } },
                { $group: { _id: null, avgPriority: { $avg: '$priority' } } }
            ]);

            const avgPriority = avgPriorityResult.length > 0 ? avgPriorityResult[0].avgPriority : 0;

            // Get recent activity (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentPreferences = await Preference.countDocuments({
                categoryId,
                userId,
                createdAt: { $gte: thirtyDaysAgo },
                deletedAt: null
            });

            // Get most common tags
            const tagsResult = await Preference.aggregate([
                { $match: { categoryId: categoryId, userId, deletedAt: null } },
                { $unwind: '$tags' },
                { $group: { _id: '$tags', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            return {
                category: {
                    id: category._id,
                    name: category.name,
                    description: category.description,
                    icon: category.icon,
                    color: category.color,
                    isSystem: category.isSystem
                },
                preferenceCount,
                averagePriority: Math.round(avgPriority * 100) / 100,
                recentActivity: {
                    preferencesCreated: recentPreferences,
                    period: '30 days'
                },
                topTags: tagsResult.map(tag => ({
                    name: tag._id,
                    count: tag.count
                }))
            };
        } catch (error) {
            logger.error('Error getting category statistics:', error);
            throw new Error('Failed to get category statistics');
        }
    }
}