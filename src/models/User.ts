import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  hasJoinedChannel: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
  },
  lastVerificationTime: {
    type: Date,
  },
  verificationAttempts: {
    type: Number,
    default: 0,
  },
  spinsLeft: {
    type: Number,
    default: 3,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema); 