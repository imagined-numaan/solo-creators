import { Schema } from "mongoose";

export const CreatorSchema: Schema = new Schema({
  pk: { type: String, required: true },
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
