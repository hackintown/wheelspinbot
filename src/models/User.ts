import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  spinsLeft: {
    type: Number,
    default: 3,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  hasJoinedChannel: {
    type: Boolean,
    default: false,
  },
  invitedUsers: [{
    type: String,
  }],
  withdrawals: [{
    amount: Number,
    timestamp: Date,
    status: String,
  }],
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema); 