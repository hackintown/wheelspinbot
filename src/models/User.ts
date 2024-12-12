import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  username?: string;
  joinedChannel: boolean;
  spinsLeft: number;
  totalEarnings: number;
  referrals: number;
}

const UserSchema = new Schema<IUser>({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  joinedChannel: { type: Boolean, default: false },
  spinsLeft: { type: Number, default: 3 },
  totalEarnings: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 }
});

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
