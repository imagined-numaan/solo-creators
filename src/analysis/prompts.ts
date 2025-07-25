import { IUser } from "../types/response.types";

export const promptsObj = {
  usernameClassificationPrompt(username: string) {
    return `
      Instagram Username Analysis Prompt

      Task:
      Analyze the provided Instagram username ("${username}") and classify it as either "fake" or "real" based *solely* on the username string itself. Do not infer or assume the existence of a URL or external contextual information beyond what is directly derivable from the username's structure, content, and common naming conventions.

      Instructions for Fake Account Analysis/Detection:
      - Rigorously evaluate the username against the criteria below.
      - A classification of "fake" should only be made if there are **strong, multiple, and unambiguous indicators** of bot-generated, spam, or clearly deceptive patterns within the username.
      - **Prioritize classifying as "real" or "plausible real" if the username could reasonably belong to a genuine user, brand, or organization, even if minor stylistic quirks or generic terms are present.** The goal is to minimize false positives (incorrectly flagging real users as fake).
      - If a username exhibits a mix of weak indicators for "fake" and plausible "real" characteristics, lean towards "real" unless the "fake" indicators are overwhelming.

      Step-by-Step Analysis:
      1. Random Character Sequences:
        - Evaluate whether the username contains seemingly random or nonsensical combinations of letters, numbers, or symbols that lack coherence, meaning, or clear purpose.

      2. Excessive or Arbitrary Numbers:
        - Assess the presence, quantity, and placement of numbers. Distinguish between arbitrary, extremely long, or repetitive sequences (stronger indicator of fake) versus shorter, common, or potentially contextually relevant numbers (e.g., birth year, common suffix like '88', or sequential numbering for a legitimate series). Do not flag as fake solely because numbers are present.

      3. Legitimate Brand or Account Alignment:
        - Consider if the username clearly aligns with or attempts to impersonate characteristics of verified or legitimate brands, public figures, or established organizations. Evaluate for concise, recognizable names consistent with official entities without unnecessary embellishments. If it appears generic, assess if it could plausibly be a thematic, fan, or personal account.

      4. Cultural and Linguistic Context:
        - Analyze whether the username reflects culturally or linguistically appropriate elements, such as common names, words, or phrases. Flag usernames that clearly misuse, misspell, or misalign with typical cultural or linguistic norms (e.g., a string of unrelated foreign words, obvious machine translation errors).

      5. Unusual, Excessive, or Obscuring Symbols/Punctuation:
        - Examine the use and quantity of underscores, periods, or other special characters. Evaluate if they are excessive, irregularly placed, or appear to intentionally obscure meaning or bypass naming conventions. Common and natural use of single underscores or periods for readability should not be flagged.

      6. Length and Complexity:
        - Determine if the username is unusually long, overly complex, or lacks natural coherence. Consider if its structure strongly suggests automated generation, mass production, or spam behavior rather than human creation.

      7. Contextual Relevance and Personalization:
        - Assess whether the username appears meaningful, personalized, or contextually appropriate for a real user, reflecting names, hobbies, professions, interests, or a clear theme (e.g., "avid_hiker," "sarahs_bakery"). Contrast this with purely generic, spam-oriented terms, or combinations that lack any human-like intent.

      8. Common Strong Fake Account Patterns:
        - Specifically look for explicit patterns strongly associated with bot or fake accounts, such as direct promotional terms ("free," "win," "promo," "followback") combined with random or sequential elements, or structures that are highly characteristic of mass-generated accounts (e.g., "user12345," "giveaway_bot_007").

      Analysis Requirements:
      - For each analysis point, provide a concise explanation of how the username's characteristics contribute to the overall assessment.
      - Explicitly address any ambiguities within the username, weighing plausible "real" interpretations against any suspicious features. Do not overemphasize minor stylistic choices as strong indicators of fakery.
      - The final classification ("fake" or "real") must be clearly supported by a comprehensive summary of your reasoning, emphasizing the strength and aggregation of evidence for either classification.
      - **Crucially, ensure accuracy by being highly cautious about classifying a username as "fake." A "fake" classification requires compelling, consistent, and aggregated evidence from multiple analysis points that strongly suggest non-human creation or malicious intent. If the username could plausibly be real, classify it as "real."**

      Before assigning isFake, riskScore, and accuracy, analyze the attribute thoroughly, and compute each score based on the severity, number, and clarity of suspicious patterns—use a scale, not a binary jump.
      `;
  },

  profilePictureClassificationPrompt() {
    return `
    Instagram Profile Picture Analysis Prompt

    Task:
      - Analyze the provided Instagram profile picture (visual characteristics and metadata, if applicable) and classify the profile as either "fake" or "real".
      - Perform a conceptual web search of reverse image search patterns (do not perform an actual search).
      - Compute insights for the profile picture for fake account analysis/detection.
    
    Previous Attribute Prediction:
      - This prediction may provide context for the profile picture analysis, but do not assume any specific characteristics beyond what is directly observable in the image itself.

    Instructions for Fake Account Analysis/Detection:
    - Focus on visual cues and patterns that strongly indicate non-human origin, widespread reuse for deceptive purposes, or a clear lack of authentic personalization.
    - **A classification of "fake" should only be made if there are strong, unambiguous, and multiple indicators** of stock photography, AI-generation, widespread use on unrelated fake accounts, or clear signs of impersonation.
    - **Prioritize classifying as "real" or "plausible real" if the image could reasonably belong to a genuine user, brand, or organization.** Minimize false positives.

    Step-by-Step Analysis:
    1. Indicators of Online Appearance and Origin (Reverse Image Search):
      - Identify if the image *would likely*:
        - Appear on multiple unrelated social media accounts or websites (suggesting widespread reuse).
        - Be found on commercial stock photo websites or databases of AI-generated faces/images.
        - Have been reported or used in known scam, catfishing, or bot detection platforms.
      - Look for visual artifacts common in AI-generated or heavily edited photos: hyper-realistic but uncanny features, overly smooth skin, inconsistent lighting/shadows, strange backgrounds, or facial asymmetry (for human subjects).

    2. Edge Cases and Nuances (Do NOT classify as "fake" solely based on these, unless other strong indicators are present):
      - **Illustrations, Anime, Cartoons, Digital Art:** These are commonly used by real users, fan pages, community accounts, or creators. Only flag as "fake" if such an image is *also* widely associated with known bot profiles, spam, or direct impersonation.
      - **Celebrity or Public Figure Images:** Often used by legitimate fan accounts. Only flag as "fake" if it clearly indicates impersonation (e.g., claiming to be the celebrity with no verification), or if it's paired with other strong bot/scam indicators.
      - **Generic/Abstract Images:** An image that is a simple logo, abstract pattern, or unidentifiable object. While low-effort, this alone does not definitively mean "fake" as many real users or placeholder accounts might use them. Only classify as "fake" if combined with other strong fake indicators.

    Evaluation Requirements:
    - For each analysis point, explain how the observed visual characteristic influences your assessment, providing specific visual cues, patterns, or anomalies.
    - Explicitly address potential ambiguities: weigh features that could plausibly belong to a real person, brand, or organization against suspicious or low-effort features (e.g., common stock images, AI-generated faces used deceptively, blank/abstract images *when combined with other flags*, inconsistent branding).
    - Conclude with a clear "fake" or "real" classification, supported by a comprehensive summary of your reasoning.
    - **Prioritize accuracy, minimizing false positives (misclassifying real users as fake) by being cautious and thorough in evaluating questionable visual indicators. A "fake" classification requires compelling and aggregated evidence.**
    - Remain sensitive to cultural context, aesthetic diversity, and legitimate branding choices.
    - Consider overall image quality, perceived originality, naturalness of facial features (if present), background coherence, and consistency with the username or overall account theme when making your decision.

    Response Format:
    {
      "isFake": 0 or 1, // 1 if classified as Fake/Spam/Bot/Automated, 0 if Real
      "riskScore": float, // Float between 0.0 and 1.0 representing the fake profile score for this feature. (higher score -> fake, lower score -> real)
      "accuracy": float, // Float between 0.0 and 1.0 representing classification accuracy. Note: This represents the confidence in the classification, not the model's overall accuracy.
      "reason": string // Concise but detailed explanation for the classification, referring to the Step-by-Step Analysis.
    }

    Before assigning isFake, riskScore, and accuracy, analyze the attribute thoroughly, and compute each score based on the severity, number, and clarity of suspicious patterns—use a scale, not a binary jump.
    `;
  },

  userBiographyClassificationPrompt(biography: string) {
    return `
      Instagram Biography Analysis Prompt
  
      Task:
        - Analyze the given Instagram biography ("${biography}") and classify it as either "real" or "fake".
        - Determine whether it is likely written by a real human user, a legitimate brand/business/creator, or generated by a bot/spammer.
        - If any brand names, organizations, or entities are mentioned (e.g., usernames, business names, external links), conceptually consider if they are real and relevant (do not perform actual web searches).

      Instructions for Fake Account Analysis/Detection:
      - Focus on linguistic patterns and content that strongly indicate automated generation, spam, or clear deceptive intent.
      - **A classification of "fake" should only be made if there are strong, unambiguous, and multiple indicators** of bot-like language, aggressive spamming, or clear incoherence.
      - **Prioritize classifying as "real" or "plausible real" if the biography could reasonably belong to a genuine user, brand, or organization.** Minimize false positives.
      - For extremely short or entirely blank biographies, default to "unknown" or "plausible real" unless combined with other strong indicators of fakery from other features.

      Evaluation Guidelines:
      1. Content & Context Awareness:
         - Look for signs of personalization, unique hobbies, specific interests, genuine profession details, cultural references, or authentic humor.
         - Bios with meaningful context, specific personal/professional details, or a clear, consistent purpose often indicate real users or genuine brands/creators.
         - Conversely, content that is overly generic, clearly stolen, or nonsensical is a stronger indicator of fake.
  
      2. Structure & Language Patterns:
         - Be cautious of bios that are overly stuffed with irrelevant emojis, excessive hashtags, keywords, or random symbols for no clear purpose.
         - Check for unnatural phrasing, grammatical errors typical of non-human generation, spammy language, or incoherence that suggests a bot-generated bio.
         - Conversely, natural language, varied sentence structure, and appropriate use of emojis/hashtags point towards a real user.
  
      3. Length and Brevity Edge Case:
         - A short bio (e.g., under 10 words, or even blank) is **not inherently fake**. Many real users and legitimate brands prefer minimal or no bios.
         - If the bio is very short or empty, classify as "real" or "unknown" unless it contains strong, explicit fake indicators (e.g., "Follow me for free crypto!" in a 5-word bio, or patterns of clearly bot-like phrases).

      4. Promotional or Commercial Content:
         - If the bio contains URLs or promotional phrases (e.g., "linktr.ee," "bit.ly," "onlyfans.com," store pages), assess whether the promotion aligns with a genuine creator, business, or brand.
         - Promotional bios can be **real** if they match the tone and context of verified public or professional accounts, or if they appear to be from a legitimate small business/creator.
         - Only flag as "fake" if the promotional content is aggressively spammy, deceptive, or points to clearly fraudulent activities (e.g., "win free money click here").

      5. Brand/Entity Mentions and Verification (Conceptual):
         - If the biography includes names of companies, influencers, creators, or public figures, conceptually evaluate their typical digital footprint.
         - A real brand or creator will typically have a consistent, verifiable online presence.
         - Beware of obvious impersonation attempts or bios using brand names in misleading or illegitimate ways that don't align with the username or profile picture.

      Final Note on Classification:
      - **Do not classify real businesses, content creators, influencers, or public figures as fake simply because their bio contains promotions, links, or marketing language.** The goal is to differentiate between authentic presence (individual or commercial) versus misleading, deceptive, or clearly fake/bot-like spam content.
      - **If the biography is too short, blank, or lacks sufficient context to make a strong judgment, classify it as "unknown" to avoid misclassification as "fake."**
      - The classification should represent the *likelihood* of the biography being generated or used by a non-human entity for deceptive purposes.

      Before assigning isFake, riskScore, and accuracy, analyze the attribute thoroughly, and compute each score based on the severity, number, and clarity of suspicious patterns—use a scale, not a binary jump.
      

      The given biography is:
      "${biography}"
    `;
  },

  followerFollowingClassificationPrompt(followers: number, following: number) {
    return `

      Instagram Follower/Following Ratio Analysis Prompt

      Data:
      Followers: ${followers}
      Following: ${following}

      Task:
        - Analyze the given follower and following counts for an Instagram account.
        - Classify the account as either "fake" or "real" based on the follower ratio and patterns.

      Instructions for Fake Account Analysis/Detection:
      - Focus on the follower-to-following ratio and patterns that strongly indicate non-human behavior, spam, or automated accounts.
      - **A classification of "fake" should only be made if there are strong, unambiguous, and multiple indicators** of bot-like behavior or spammy practices.
      - **Prioritize classifying as "real" or "plausible real" if the account could reasonably belong to a genuine user, brand, or organization.** Minimize false positives
      - Do not classify the account as fake solely based on the ratio; consider the context of large brands/influencers and large accounts that often have a large ratio.
      - If the account has a very high number of follows and significantly fewer followers, it is likely to be fake.
      - If the account has a very low number of follows and a high number of followers, it is likely to be real.

      Step-by-Step Analysis:
      1. Follower Ratio Calculation:
        - Calculate the follower ratio:
          - Follower Ratio = Number of Followers / Number of Accounts Followed
        - Identify if the ratio is significantly high or low, which may indicate fake behavior.
      2. High Follower Count with Low Following:
        - If the account has a very high number of followers and a low number of accounts followed
          - This is often a sign of a real account, especially for influencers or brands.
              
      3. Contextual Considerations:
        - Consider the context of the account:
          - Large brands or influencers often have a large following-to-follower ratio.
          - Small accounts with a high ratio may be more suspicious.


      Final Classification:
        - Based on the follower ratio and contextual analysis, classify the account as "fake" or "real".
        - Provide a concise explanation for the classification based on the follower ratio patterns.

      Before assigning isFake, riskScore, and accuracy, analyze the attribute thoroughly, and compute each score based on the severity, number, and clarity of suspicious patterns—use a scale, not a binary jump.
      
    `;
  },

  creatorAnalysisPrompt(profile: IUser) {
    return `
  You are a skilled social media analyst tasked with determining whether an Instagram account qualifies as a "creator."
  
  ## Definition of a Creator
  A creator is an individual or a small content-focused group that actively produces and shares original or curated content within a specific niche on Instagram. This includes people creating around topics like fitness, beauty, fashion, technology, travel, education, entertainment, lifestyle, and art. Creators use their accounts to engage an audience through consistent and thematic content output such as posts, reels, stories, and collaborations.
  
  Important:
  - Do **not** classify large brands, corporations, or mainstream celebrities (e.g., actors, musicians, athletes with widespread fame) as creators unless their Instagram behavior clearly reflects personal or small-scale content creation.
  - Founders, freelancers, or professionals may qualify as creators if their account reflects consistent, thematic content geared toward an audience or community.
  
  ## Provided Account Information
  Evaluate the following details to make your judgment:
  - Username: "${profile.username}"
  - Bio: "${profile.biography}"
  - Category: "${profile.category}"
  - Is Private: ${profile.is_private}
  - Follower Count: ${profile.follower_count}
  - Following Count: ${profile.following_count}
  
  ## Key Evaluation Instructions
  
  1. **Privacy Status Consideration**
     - If the account is private (\`is_private = true\`), it is less likely to be a creator. Creators typically maintain public visibility to reach and grow their audience.
     - If private, classify as \`isCreator: 0\` with high confidence (\`accuracy: 0.9\`), unless strong evidence in the username, bio, or Google results indicates creator behavior.
  
  2. **Content Creation Signals**
     - Look for evidence in the biography or username that suggests the account is producing content (e.g., “sharing daily recipes,” “travel vlogs,” “art reels,” “tech reviews”).
     - Check for mentions of collaborations, schedules, content types, or links to external platforms (like YouTube, blogs, etc).
  
  3. **Follower/Following Pattern**
     - A higher follower-to-following ratio often indicates audience-building behavior typical of creators.
     - Large follower counts may indicate celebrity status—check using Google search results.
     - Small or mid-sized follower counts are common for emerging creators and are valid.
  
  4. **Category Analysis**
     - The account’s category (e.g., "Fitness Trainer", "Artist", "Blogger") can support classification but should not be the sole basis. Always cross-reference with the bio and other details.
  
  5. **Username and Bio**
     - Personal branding in the username or niche-specific wording (e.g., “TechWithNina”, “ArtByJon”) is a positive signal.
     - Bios showing creative intent, storytelling, teaching, showcasing skills, or content themes indicate creator status.
     - Avoid classifying accounts focused solely on product promotion or e-commerce without content indicators.
  
  6. **Search Verification (if applicable)**
     - Conduct a Google search using terms like "${profile.username} Instagram ${profile.biography}".
     - If search results reveal the user is a famous public figure, large brand, or celebrity, classify as non-creator (\`isCreator: 0\`).
     - Mentions on blogs, YouTube channels, or niche platforms are positive signals of creator activity.
  
  ## Output Format
  Respond in this exact JSON format:
  
  \`\`\`json
  {
    "isCreator": 0 or 1,         // 1 if the account is a creator, 0 otherwise
    "accuracy": float,           // Confidence score between 0.0 and 1.0
    "reason": "Your explanation here referencing profile data and reasoning"
  }
  \`\`\`
  
  Use complete reasoning in the \`reason\` field. Be objective, structured, and refer directly to elements from the profile and search data.
    `;
  },
};
