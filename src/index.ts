import connectToDatabase from "./db/connect.db";
import { initializeModels } from "./db/models.db";
import FollowingsAnalyzer from "./services/following_analysis";
import FollowingsFetcher from "./services/following_fetcher";

// this function basically fetches followings and analyzes them
// and finds random creators to add to the database
export default async function findCreators() {
  const { localDB, soloDB } = await connectToDatabase();
  const { FollowingModel, CreatorModel } = initializeModels(localDB);

  const followingsFetcher = new FollowingsFetcher(localDB, soloDB);
  const {limit, skip} = await followingsFetcher.fetchAndStoreFollowings(100, 0);
  await followingsFetcher.fetchAndStoreFollowings(limit, skip);

  // const followingsAnalyzer = new FollowingsAnalyzer(
  //   FollowingModel,
  //   CreatorModel
  // );
  // followingsAnalyzer.analyseAndStoreFollowings();
}

findCreators();
