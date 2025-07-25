import mongoose from "mongoose";
import fetchFollowingByUserId, { fetchProfileInfo } from "../scraping/creators";
import delay from "../utils/delay.utils";
import { IUser } from "../types/response.types";

export default class FollowingsFetcher {
  private localDB: mongoose.Connection;
  private soloDB: mongoose.Connection;

  constructor(localDB: mongoose.Connection, soloDB: mongoose.Connection) {
    this.localDB = localDB;
    this.soloDB = soloDB;
  }

  async fetchAndStoreFollowings(limit: number = 100, skip: number = 0) {
    console.log(`Fetching followings with limit: ${limit}, skip: ${skip}`);

    const socials = this.soloDB.collection("socials");
    const mongooseCursor = socials.find().skip(skip).limit(limit);

    for await (const social of mongooseCursor) {
      if (!social || !social.platformId) continue;

      const followingAccounts = await fetchFollowingByUserId(social.platformId);
      if (Array.isArray(followingAccounts)) {
        await this.processFollowings(followingAccounts[0], social.platformId);
      }

      await delay(2000);
    }
    return { limit: limit + 1, skip: skip + limit };
  }

  async processFollowings(followings: IUser[], socialId: string) {
    const batches = [];
    for (const account of followings) {
      const accountInfo = await fetchProfileInfo(account.pk);
      if (accountInfo) {
        batches.push({
          ...accountInfo,
          follows: socialId,
        });
      }

      // here, we perform batch inserts to improve performance
      // i limit the batch size to 50 to avoid losing all collected data
      // in case of an error and frequently insert the data
      if (batches.length >= 50) {
        await this.batchInsertFollowings(batches);
        batches.length = 0;
      }
    }

    if (batches.length > 0) {
      await this.batchInsertFollowings(batches);
    }
    console.log(
      `Processed ${followings.length} followings for social ID: ${socialId}`
    );
  }

  async batchInsertFollowings(batches: any[]) {
    try {
      if (batches.length > 0) {
        await this.localDB
          .collection("followings")
          .insertMany(batches, { ordered: false });
        console.log(`Inserted ${batches.length} followings into the database.`);
      } else {
        console.log("No followings to insert.");
      }
    } catch (error) {
      console.error("Error inserting followings:", error);
    }
  }
}
