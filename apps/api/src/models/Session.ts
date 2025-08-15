import mongoose, { Schema, Document } from 'mongoose'

export interface ISession {
  _id: string
  userId: Schema.Types.ObjectId
  tokenId: string
  type: 'access' | 'refresh'
  expiresAt: Date
  createdAt: Date
  revokedAt?: Date
  userAgent?: string
  ipAddress?: string
}

export interface SessionDocument extends Omit<ISession, '_id'>, Document {}

const sessionSchema = new Schema<SessionDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tokenId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['access', 'refresh'],
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
  revokedAt: {
    type: Date,
    default: null,
  },
  userAgent: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
}, {
  timestamps: true,
  collection: 'sessions',
})

// Indexes
sessionSchema.index({ tokenId: 1 }, { unique: true })
sessionSchema.index({ userId: 1, type: 1 })
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
sessionSchema.index({ revokedAt: 1 })

// Query helpers
// sessionSchema.query.active = function() {
//   return this.where({
//     revokedAt: null,
//     expiresAt: { $gt: new Date() },
//   })
// }

// sessionSchema.query.byUser = function(userId: string) {
//   return this.where({ userId })
// }

// sessionSchema.query.byType = function(type: 'access' | 'refresh') {
//   return this.where({ type })
// }

// // Instance methods
// sessionSchema.methods.revoke = function() {
//   this.revokedAt = new Date()
//   return this.save()
// }

// sessionSchema.methods.isExpired = function() {
//   return this.expiresAt < new Date()
// }

// sessionSchema.methods.isRevoked = function() {
//   return this.revokedAt !== null
// }

// sessionSchema.methods.isValid = function() {
//   return !this.isExpired() && !this.isRevoked()
// }

// // Virtuals
// sessionSchema.virtual('id').get(function() {
//   return this._id.toHexString()
// })

// // Ensure virtual fields are serialized
// sessionSchema.set('toJSON', {
//   virtuals: true,
//   transform: function(_doc, ret) {
//     delete ret._id
//     delete ret.__v
//     return ret
//   },
// })

export const Session = mongoose.model<SessionDocument>('Session', sessionSchema)