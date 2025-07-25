import { Predictions, ProfileScore, Weights } from "../types/analysis.types";
import fakeProfileAnalyzer from "./fake_profile";

class ProfileAnalyzer {
  private weights: Weights;

  constructor(weights?: Weights) {
    this.weights = weights || {
      username: 0.3,
      profilePic: 0.5,
      biography: 0.2,
      private: 0.3,
      followerFollowingRatio: 0.4,
    };
  }

  private normalizeWeights(weights: Weights): Weights {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    const normalizedWeights: Partial<Weights> = {};

    // normalizing the weights to sum up to 1 so that they can be in a consistent scale
    for (const key in weights) {
      const property = key as keyof Weights;
      normalizedWeights[property] = weights[property] / total;
    }

    return normalizedWeights as Weights;
  }

  private computeRiskScore(predictions: Predictions, weights: Weights) {
    let totalRiskScore = 0;
    let totalWeight = 0;
    for (const key in predictions) {
      const property = key as keyof Predictions;
      const prediction = predictions[property];
      console.log(prediction);
      totalWeight += weights[property] * prediction.accuracy;
      // the reason for multiplying by accuracy is to ensure that the risk score is weighted by the confidence of the prediction
      // if the prediction is not accurate, it should not contribute much to the total risk score
      // for example, if the prediction is 0.9 but the accuracy is 0.1, then the risk score will be 0.09
      // and not 0.9
      totalRiskScore +=
        prediction.riskScore * weights[property] * prediction.accuracy;
    }

    return totalWeight > 0 ? totalRiskScore / totalWeight : 0.5;
  }

  private computeTotalConfidence(predictions: Predictions) {
    let totalConfidence = 0;
    for (const key in predictions) {
      const property = key as keyof Predictions;
      const prediction = predictions[property];
      totalConfidence += prediction.accuracy;
    }
    totalConfidence /= Object.keys(predictions).length;
    return totalConfidence;
  }

  private parseScores(score: number) {
    return parseFloat(score.toFixed(3));
  }

  private computeProfileScore(
    predictions: Predictions,
    weights: Weights = this.weights,
    threshold: number = 0.5
  ): ProfileScore {
    const totalConfidence = this.computeTotalConfidence(predictions);

    const fakeAttributesCount = Object.entries(predictions).filter(
      ([key, value]) => value.isFake === 1
    ).length;

    // here, i dynamically calculate the penalty bonus based on the number of fake attributes
    // for example, if there are 3 fake attributes, the penalty bonus will be 3 * 0.08 = 0.24
    const penaltyBonus =
      fakeAttributesCount > 0 ? fakeAttributesCount * 0.1 : 0;
    const riskScore = Math.min(
      1,
      penaltyBonus + this.computeRiskScore(predictions, weights)
    );

    return {
      realScore: this.parseScores(1 - riskScore),
      fakeScore: this.parseScores(riskScore),
      totalConfidence: this.parseScores(totalConfidence),
      isFake: riskScore >= threshold,
      breakdown: {
        username: {
          fakeScore: this.parseScores(predictions.username.riskScore),
          confidence: this.parseScores(predictions.username.accuracy),
        },
        profilePic: {
          fakeScore: this.parseScores(predictions.profilePic.riskScore),
          confidence: this.parseScores(predictions.profilePic.accuracy),
        },
        biography: {
          fakeScore: this.parseScores(predictions.biography.riskScore),
          confidence: this.parseScores(predictions.biography.accuracy),
        },

        followerFollowingRatio: {
          fakeScore: this.parseScores(
            predictions.followerFollowingRatio.riskScore
          ),
          confidence: this.parseScores(
            predictions.followerFollowingRatio.accuracy
          ),
        },
        privateStatus: {
          fakeScore: this.parseScores(predictions.private.riskScore),
          confidence: this.parseScores(predictions.private.accuracy),
        },
      },
    };
  }

  async analyzeProfile(
    username: string,
    profilePic: string,
    biography: string,
    privateStatus: boolean,
    followingCount: number,
    followerCount: number
  ) {
    try {
      const usernamePrediction = await fakeProfileAnalyzer.classifyUsername(
        username
      );
      const profilePicPrediction =
        await fakeProfileAnalyzer.classifyProfilePicture(profilePic);

      const bioPrediction = await fakeProfileAnalyzer.classifyBiography(
        biography
      );
      const ratioPrediction = await fakeProfileAnalyzer.classifyFollowingCount(
        followerCount,
        followingCount
      );

      if (
        !usernamePrediction ||
        !profilePicPrediction ||
        !bioPrediction ||
        !ratioPrediction
      ) {
        console.error("Error analyzing profile attributes.");
        return null;
      }

      const normalizedWeights = this.normalizeWeights(this.weights);
      const predictions: Predictions = {
        username: usernamePrediction,
        profilePic: profilePicPrediction,
        biography: bioPrediction,
        followerFollowingRatio: ratioPrediction,
        // todo: change riskScore values for each of the private and public status
        // currently, it is set to 0.5 for both private and public profiles
        private: privateStatus
          ? {
              isFake: 0,
              riskScore: 0.5,
              accuracy: 1,
              reason: "Profile is private",
            }
          : {
              isFake: 0,
              riskScore: 0.5,
              accuracy: 1,
              reason: "Profile is public",
            },
      };

      const finalScore = this.computeProfileScore(
        predictions,
        normalizedWeights,
        0.5
      );
      return finalScore;
    } catch (error) {
      console.error("Error analyzing profile:", error);
      return null;
    }
  }
}

const profileAnalyzer = new ProfileAnalyzer();
export default profileAnalyzer;
