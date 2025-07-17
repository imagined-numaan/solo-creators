interface PredictionResult {
  isFake: number;
  riskScore: number;
  accuracy: number;
  reason: string;
}

interface Predictions {
  username: PredictionResult;
  profilePic: PredictionResult;
  biography: PredictionResult;
  private: PredictionResult;
  followerFollowingRatio: PredictionResult;
}

interface Weights {
  username: number;
  profilePic: number;
  biography: number;
  private: number;
  followerFollowingRatio: number;
}

interface ProfileScore {
  realScore: number;
  fakeScore: number;
  isFake: boolean;
  totalConfidence: number;
  breakdown: {
    username: { fakeScore: number; confidence: number };
    profilePic: { fakeScore: number; confidence: number };
    biography: { fakeScore: number; confidence: number };
    followerFollowingRatio: { fakeScore: number; confidence: number };
    privateStatus: { fakeScore: number; confidence: number };
  };
}

export { PredictionResult, Predictions, Weights, ProfileScore };
