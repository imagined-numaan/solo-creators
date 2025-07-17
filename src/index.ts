import mongoose from "mongoose";
import initEnv from "./env";
import fetchFollowingByUserId, { fetchProfileInfo } from "./scraping/creators";
import profileAnalyzer from "./analysis/profile_score";
import creatorAnalyzer from "./analysis/creator_profile";

const envData = initEnv();

let localTestDB: mongoose.Connection;
let soloCon: mongoose.Connection;

async function connectToDatabase() {
  try {
    // this connects to the local database (a test database)
    localTestDB = mongoose.createConnection(envData.MONGO_URI);
    localTestDB.on("error", (err) =>
      console.error("Local MongoDB error:", err)
    );
    localTestDB.once("open", () => console.log("Connected to local MongoDB"));

    // this connects to solo db for fetching socials (solodb)
    soloCon = mongoose.createConnection(envData.SOLO_URI);
    soloCon.on("error", (err) => console.error("Solo MongoDB error:", err));
    soloCon.once("open", () => console.log("Connected to solo MongoDB"));

    await Promise.all([
      new Promise((res) => localTestDB.once("open", res)),
      new Promise((res) => soloCon.once("open", res)),
    ]);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

async function createProfilesArray() {
  const userCollection = soloCon.collection("socials");
  const cursor = userCollection.find();

  const profiles = [];

  // this basically iterates the user accounts from the db
  while (await cursor.hasNext()) {
    const user = await cursor.next();
    if (!user || !user.platformId) continue;

    console.log("Existing profile:", user.handle);

    // i fetch the first 25 (or less) followings of each user
    const followingAccounts = await fetchFollowingByUserId(user.platformId);
    if (Array.isArray(followingAccounts)) {
      for (const acc of followingAccounts[0]) {
        // for each of those following i fetch their complete profile info
        // including pfp, location, category etc
        const info = await fetchProfileInfo(acc.pk);
        if (info) profiles.push(info);
      }
    }

    // todo: need to optimize this loop and the api calls
    break;
  }

  const allProfiles = profiles.map((profile) => ({
    _id: new mongoose.Types.ObjectId(),
    pk: profile.pk,
    username: profile.username,
    full_name: profile.full_name,
    profile_pic_url: profile.profile_pic_url,
    profile_pic_url_hd: profile.profile_pic_url_hd,
    is_private: profile.is_private,
    is_verified: profile.is_verified,
    biography: profile.biography || " ",
    following_count: profile.following_count,
    follower_count: profile.follower_count,
    category: profile.category,
  }));

  // we add all these profiles to the database for further processing
  // could be stored in a collection called "followings"
  if (allProfiles.length) {
    try {
      await localTestDB
        .collection("followings")
        .insertMany(allProfiles, { ordered: false });
      console.log("Inserted profiles:", allProfiles.length);
    } catch (err: any) {
      console.error("Error inserting profiles:", err.message);
    }
  } else {
    console.log("No profiles to insert.");
  }

  return allProfiles;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function analyseProfiles() {
  // we get all the followings we fetched for each user in our db
  //
  const profiles = await createProfilesArray();
  if (!profiles || profiles.length === 0) {
    throw new Error("No profiles found to analyze");
  }

  // this basically calls gemini api to analyse each attribute of the profile
  // and then computes a riskScore (how likely it is a bot account)
  for (const profile of profiles) {
    try {
      const {
        username,
        profile_pic_url,
        biography,
        is_private,
        follower_count,
        following_count,
      } = profile;

      console.log(`----- [Analyzing profile]: ${username} -----`);

      const analysisResult = await profileAnalyzer.analyzeProfile(
        username,
        profile_pic_url,
        biography,
        is_private,
        following_count,
        follower_count
      );

      // if the account is not a fake account, i proceeed to add it to the db
      if (analysisResult === false) {
        localTestDB.collection("creators").insertOne(profile);
        console.log(
          `Profile ${username} is not a fake account, inserted into local database.`
        );
      }
      await delay(5000);
    } catch (error) {
      console.error(`Error analyzing profile ${profile.username}:`, error);
    }

    // todo: creator analysis
  }
}

(async () => {
  await connectToDatabase();
  // await createProfilesArray();
  await analyseProfiles();
})();
