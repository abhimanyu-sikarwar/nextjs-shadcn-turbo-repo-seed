export interface User {
  _id: string
  googleId: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
  isActive: boolean
  preferences: {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
    timezone: string
  }
}
