interface IUser {
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
type FollowingResponseType = [IUser[], string];
export { IUser, FollowingResponseType };
