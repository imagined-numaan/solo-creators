import mongoose from "mongoose";
import { IUserDocument } from "../db/schemas/user.schema";
import { IUser } from "../types/response.types";
import delay from "../utils/delay.utils";
import profileAnalyzer from "../analysis/profile_score";
import creatorAnalyzer from "../analysis/creator_profile";
import connectToDatabase from "../db/connect.db";
import { initializeModels } from "../db/models.db";

export default class FollowingsAnalyzer {
  private UserModel: mongoose.Model<IUserDocument>;
  private CreatorModel: mongoose.Model<IUserDocument>;

  constructor(
    UserModel: mongoose.Model<IUserDocument>,
    CreatorModel: mongoose.Model<IUserDocument>
  ) {
    this.UserModel = UserModel;
    this.CreatorModel = CreatorModel;
  }

  async analyseAndStoreFollowings() {
    const batches: IUser[] = [];

    const followings = await this.UserModel.find().exec();
    if (followings.length === 0) {
      console.log("No followings found to analyze.");
      return;
    }

    for (const following of followings) {
      const { username } = following;

      const existingCreator = await this.CreatorModel.findOne({
        id: following.id,
        username: following.username,
      });

      if (existingCreator) {
        console.log(`Creator ${username} already exists in the database.`);
        continue;
      }

      console.log(`----- [Analyzing following]: ${username} -----`);

      const fakeProfileAnalysisResult = await this.fakeAccountAnalysis(
        following
      );

      if (!fakeProfileAnalysisResult) {
        console.error(
          `Error analyzing profile for ${username}, skipping further analysis.`
        );
        continue;
      }

      if (fakeProfileAnalysisResult.isFake) {
        console.log(
          `Following ${username} is a fake account, skipping further analysis.`
        );
        continue;
      }

      console.log(
        `Following ${username} is not a fake account, performing creator analysis...`
      );
      const creatorAnalysisResult = await this.creatorAccountAnalysis(
        following
      );

      if (!creatorAnalysisResult) {
        console.error(
          `Error analyzing creator profile for ${username}, skipping further analysis.`
        );
        continue;
      }

      if (creatorAnalysisResult.isCreator) {
        batches.push(following);
        console.log(
          `Following ${username} is a creator profile, inserted into the database.`
        );
      } else {
        console.log(
          `Following ${username} is not a creator profile, skipping.`
        );
      }

      if (batches.length >= 50) {
        await this.batchInsertCreators(batches);
        batches.length = 0;
      }
      await delay(2000);
    }

    if (batches.length > 0) {
      await this.batchInsertCreators(batches);
    }
    console.log("Finished analyzing and storing followings.");
  }
  async fakeAccountAnalysis(following: IUser) {
    const {
      username,
      profile_pic_url,
      biography,
      is_private,
      follower_count,
      following_count,
    } = following;

    try {
      const result = await profileAnalyzer.analyzeProfile(
        username,
        profile_pic_url,
        biography,
        is_private,
        following_count,
        follower_count
      );

      return result || null;
    } catch (error) {
      console.error(`Error in fake account analysis for ${username}:`, error);
      return null;
    }
  }

  async creatorAccountAnalysis(following: IUser) {
    try {
      const result = await creatorAnalyzer.analyzeProfile(following);
      return result || null;
    } catch (error) {
      console.error(
        `Error in creator account analysis for ${following.username}:`,
        error
      );
      return null;
    }
  }

  async batchInsertCreators(creators: IUser[]): Promise<void> {
    try {
      await this.CreatorModel.insertMany(creators);
      console.log(`Inserted ${creators.length} creators into the database.`);
    } catch (error) {
      console.error("Error inserting creators:", error);
    }
  }
}
