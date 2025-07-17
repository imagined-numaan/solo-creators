import mongoose, { Schema, Document } from "mongoose";

export interface IFollowingsModel extends Document {
  pk: string;
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  is_private: boolean;
  is_verified: boolean;
  biography: string;
}

const FollowingsSchema: Schema = new Schema({
  pk: { type: String, required: true },
  id: { type: String, required: true },
  username: { type: String, required: true },
  full_name: { type: String, required: false },
  profile_pic_url: { type: String, required: false },
  profile_pic_url_hd: { type: String, required: false },
  is_private: { type: Boolean, required: true },
  is_verified: { type: Boolean, required: true },
  biography: { type: String, required: true },
});

export default mongoose.model<IFollowingsModel>("Following", FollowingsSchema);
