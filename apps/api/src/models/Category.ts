import mongoose, { Schema, Document } from 'mongoose'



export interface ICategory {
  _id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isSystem: boolean
  userId?: string
  order: number
  createdAt: Date
  updatedAt: Date
}


export interface CategoryDocument extends Omit<ICategory, '_id'>, Document {}

const categorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: 200,
  },
  icon: {
    type: String,
    default: '📁',
  },
  color: {
    type: String,
    match: /^#[0-9A-F]{6}$/i,
    default: '#6B7280',
  },
  isSystem: {
    type: Boolean,
    default: false,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  collection: 'categories',
})

// Compound indexes
categorySchema.index({ userId: 1, slug: 1 }, { unique: true })
categorySchema.index({ isSystem: 1 })
categorySchema.index({ userId: 1, order: 1 })
categorySchema.index({ userId: 1, name: 1 })

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }
  next()
})

// Virtuals
// categorySchema.virtual('id').get(function() {
//   return this._id.toHexString()
// })

// Ensure virtual fields are serialized
// categorySchema.set('toJSON', {
//   virtuals: true,
//   transform: function(_doc, ret) {
//     delete ret._id
//     delete ret.__v
//     return ret
//   },
// })

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema)