import initEnv from "../env";
import { FollowingResponseType } from "../types/response.types";

const envData = initEnv();
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": envData.RAPID_API_INSTAGRAM_KEY,
    "x-rapidapi-host": envData.RAPID_API_INSTAGRAM_HOST,
    "x-access-key": envData.RAPID_API_INSTAGRAM_KEY,
  },
};

export async function fetchProfileInfo(userId: string) {
  const url = `https://${envData.RAPID_API_INSTAGRAM_HOST}/v1/user/by/id?id=${userId}`;
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export default async function fetchFollowingByUserId(userId: number) {
  // todo: add dynamic max_id for fetching more followings in the url
  const url = `https://${envData.RAPID_API_INSTAGRAM_HOST}/v1/user/following/chunk?user_id=${userId}`;

  try {
    const response = await fetch(url, options);
    const result: FollowingResponseType = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}
