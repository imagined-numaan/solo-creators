import { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  pk: string;
  id: string;
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  is_private: boolean;
  is_verified: boolean;
  following_count: number;
  follower_count: number;
  category: string;
}

export const FollowingSchema: Schema = new Schema({
  pk: { type: String, required: true },
  id: { type: String, required: true },
  username: { type: String, required: true },
  full_name: { type: String, required: true },
  biography: { type: String, required: false },
  profile_pic_url: { type: String, required: true },
  is_private: { type: Boolean, required: true },
  is_verified: { type: Boolean, required: true },
  following_count: { type: Number, required: true },
  follower_count: { type: Number, required: true },
  category: { type: String, required: false },
});



