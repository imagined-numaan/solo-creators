import { Connection } from "mongoose";
import { CreatorSchema } from "./schemas/creator.schema";
import { IUserDocument, FollowingSchema } from "./schemas/user.schema";

export function initializeModels(localDB: Connection) {
  const FollowingModel = localDB.model<IUserDocument>("Following", FollowingSchema);
  const CreatorModel = localDB.model<IUserDocument>("Creator", CreatorSchema);

  return { FollowingModel, CreatorModel };
}
