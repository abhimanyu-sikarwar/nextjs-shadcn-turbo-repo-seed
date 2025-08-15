import mongoose, { Schema, Document } from 'mongoose'


export interface IPreference {
  _id: string
  userId: Schema.Types.ObjectId
  categoryId: Schema.Types.ObjectId
  name: string
  slug: string
  value: string | number | boolean | object | Array<any>
  valueType: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
  tags: string[]
  isPrivate: boolean
  priority: number
  metadata: {
    source: 'manual' | 'imported'
    version: number
    validatedAt?: Date
  }
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
export interface PreferenceDocument extends Omit<IPreference, '_id'>, Document {}

const preferenceSchema = new Schema<PreferenceDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
  valueType: {
    type: String,
    required: true,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
  },
  description: {
    type: String,
    maxlength: 500,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 30,
  }],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  metadata: {
    source: {
      type: String,
      enum: ['manual', 'imported'],
      default: 'manual',
    },
    version: {
      type: Number,
      default: 1,
    },
    validatedAt: {
      type: Date,
    },
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'preferences',
})

// Compound indexes
preferenceSchema.index({ userId: 1, categoryId: 1 })
preferenceSchema.index({ userId: 1, slug: 1 }, { unique: true })
preferenceSchema.index({ userId: 1, deletedAt: 1 })
preferenceSchema.index({ userId: 1, tags: 1 })
preferenceSchema.index({ userId: 1, priority: -1 })
preferenceSchema.index({ userId: 1, name: 'text', description: 'text' })
preferenceSchema.index({ createdAt: 1 })
preferenceSchema.index({ updatedAt: 1 })

// Create slug from name before saving
preferenceSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }
  next()
})

// Update version on modification
preferenceSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.metadata.version += 1
  }
  next()
})

// Query helpers
// preferenceSchema.query.active = function() {
//   return this.where({ deletedAt: null })
// }

// preferenceSchema.query.byCategory = function(categoryId: string) {
//   return this.where({ categoryId })
// }

// preferenceSchema.query.byUser = function(userId: string) {
//   return this.where({ userId })
// }

// preferenceSchema.query.byPriority = function(priority: number) {
//   return this.where({ priority })
// }

// preferenceSchema.query.publicOnly = function() {
//   return this.where({ isPrivate: false })
// }

// // Instance methods
// preferenceSchema.methods.softDelete = function() {
//   this.deletedAt = new Date()
//   return this.save()
// }

// preferenceSchema.methods.restore = function() {
//   this.deletedAt = null
//   return this.save()
// }

// // Virtuals
// preferenceSchema.virtual('id').get(function() {
//   return this._id.toHexString()
// })

// preferenceSchema.virtual('isDeleted').get(function() {
//   return this.deletedAt !== null
// })

// // Ensure virtual fields are serialized
// preferenceSchema.set('toJSON', {
//   virtuals: true,
//   transform: function(_doc, ret) {
//     delete ret._id
//     delete ret.__v
//     return ret
//   },
// })

export const Preference = mongoose.model<PreferenceDocument>('Preference', preferenceSchema)