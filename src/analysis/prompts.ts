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

      Response Format:
      {
        "isFake": 0 or 1, // 1 if classified as Fake/Spam/Bot/Automated, 0 if Real
        "riskScore": float, // Float between 0.0 and 1.0 representing the fake profile score for this feature. (higher score -> fake, lower score -> real)
        "accuracy": float, // Float between 0.0 and 1.0 representing classification accuracy. Note: This represents the confidence in the classification, not the model's overall accuracy.
        "reason": string // Concise but detailed explanation for the classification, referring to the Step-by-Step Analysis.
      }
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

  creatorAnalysisPrompt(
    biography: string,
    category: string,
    username: string
  ) {
    return `
      Creator Category, Biography, and Username Analysis Prompt

      Definition of a Creator:
      A creator is an individual or small-scale brand that uses their Instagram account to produce, promote, or monetize original content in a specific niche such as fitness, beauty, music, fashion, tech, comedy, or lifestyle. This includes influencers, vloggers, artists, educators, meme pages, streamers, small business owners, and personal brands, but explicitly excludes celebrities (e.g., well-known actors, musicians, or public figures with widespread fame) and large brands/organizations (e.g., corporations, major companies, or established franchises). Creators typically build an audience through consistent, niche-focused content creation.

      Instructions:
        - Carefully review the content and structure of the biography, the provided account type/category (if available), and the username to identify whether they signal intentional content creation, self-promotion, or branding by a creator (individual or small-scale brand). Do not classify an account as a creator based on vague or decorative language alone.
        - The given biography is: "${biography}"
        - The given account type/category is: "${category}"
        - The given username is: "${username}"
        - Use the account type/category as a primary signal to inform the classification, ensuring the account aligns with individual or small-scale creators and not celebrities or large brands/organizations. Use the username as a supplementary signal, checking for subtle creator-related hints (e.g., niche-specific terms like "fit," "style," "creates," "vibes") or patterns that align with the biography or category, but recognize that not all creators have explicit creator terms in their usernames.
        - If needed, perform a Google search using the username and category to verify that the account is not associated with a well-known celebrity or large brand/organization. For example, search for "[username] Instagram [category]" to check for indications of celebrity status or large-scale corporate affiliation.

      Step-by-Step Analysis:

        1. **Content Platform Presence**
          - Check for links or mentions of platforms like YouTube, Twitch, Linktree, etc., in the biography, indicating individual or small-scale content creation.
          - If the category indicates a creator-focused niche (e.g., "Blogger," "Content Creator," "Fitness Coach") and does not suggest a celebrity or large brand (e.g., "Actor," "Public Figure," "Brand" without creator context), this strengthens the creator signal.
          - If the username contains niche-specific or creator-related terms (e.g., "artby," "fitcoach," "travelvibes") that align with the biography or category, this supports the creator signal. A generic or unrelated username (e.g., "john123") does not negate creator status if other signals are strong.
          - Use a Google search (e.g., "[username] Instagram [category]") to confirm the account is not linked to a celebrity or large brand. If search results indicate widespread fame or corporate affiliation, this weakens the creator signal.

        2. **Creator Role Identification**
          - Look for self-described roles in the biography that align with individual or small-scale creators, such as “artist,” “influencer,” “coach,” “streamer,” “content creator,” etc. Avoid roles like “actor” or “celebrity” that may indicate widespread fame unless accompanied by clear niche content creation signals.
          - If the category explicitly states a creator role (e.g., "Influencer," "Artist," "Entrepreneur") and does not imply a celebrity or large organization (e.g., "Actor," "Musician" with fame indicators), consider this a strong indicator of creator status, even if the biography is minimal.
          - Check the username for terms that suggest a creator role or niche (e.g., "yogawith," "memelord") when consistent with the biography or category. A username lacking explicit creator terms should not discount creator status if the biography or category provides clear evidence.
          - Verify via Google search that the username and category do not point to a well-known celebrity or large brand. For example, a category like "Musician" with a username like "popstarjane" may require checking if "popstarjane" is a famous artist or a small-scale creator.

        3. **Business or Promotional Intent**
          - Look for signs of monetization in the biography typical of smaller creators:
            - Contact info (email, booking)
            - Phrases like “DM for collabs,” “business inquiries,” “use my code,” etc.
            - Promo links or affiliate references
          - If the category suggests a small business or personal brand (e.g., "Small Business," "Personal Blog"), this increases the likelihood of promotional intent. Categories indicating large organizations (e.g., "Brand," "Company") or celebrity status (e.g., "Actor," "Celebrity") should not be classified as creators.
          - If the username includes promotional or niche-related terms (e.g., "shop," "designs," "studio") that align with the biography or category, this supports the creator signal. A neutral username does not weaken creator status if other indicators are present.
          - Use a Google search to ensure the username and category do not link to a large brand or celebrity. For instance, a username like "brandxstudio" with a "Brand" category should be checked to confirm it’s not a major corporation.

        4. **Personal or Vague Language**
          - Bios that are purely personal, vague, or decorative without clear creator signals should not be classified as creator bios, unless the category or username strongly suggests an individual or small-scale creator role (e.g., "Content Creator," "Vlogger," or username like "craftsbymary").
          - If the category is vague or suggests a celebrity or large organization (e.g., "Celebrity," "Corporation"), rely primarily on the biography and avoid creator classification unless explicit creator intent is present. A username with creator-related terms may provide minor context but should not drive the decision if the biography and category are inconclusive.
          - Perform a Google search to check if the username or category indicates a celebrity or large brand. If search results show significant media coverage or corporate affiliation, do not classify as a creator.

        5. **Length and Clarity**
          - Bios that are extremely short, vague, or empty with no creator signal should not be classified as a creator, unless the category or username explicitly indicates an individual or small-scale creator role (e.g., "Blogger," "Vlogger," or username like "travelvibes").
          - Exception: If there’s a strong platform link in the biography, a category indicating a known creator role, or a username subtly aligned with a creator niche (not associated with celebrities or large organizations), classify with lower confidence.
          - Use a Google search to verify that a vague bio with a creator-like category or username (e.g., "Blogger," "fitwithjane") is not linked to a celebrity or large brand.

      Response Format:
      {
        "isCreator": 0 or 1, // 1 if classified as a creator (individual or small-scale brand), 0 if not a creator
        "creatorScore": float, // Float between 0.0 and 1.0 representing the likelihood of being a creator (higher score -> more likely creator, lower score -> less likely creator)
        "accuracy": float, // Float between 0.0 and 1.0 representing confidence in the classification, not the model's overall accuracy
        "reason": string // Concise but detailed explanation for the classification, referring to the Step-by-Step Analysis and evidence from biography, category, username, and Google search (if performed)
      }

      Note:
        - If the biography has partial hints (like a link but no context) and the category is absent, vague, or suggests a celebrity/organization, default to isCreator: 0 unless clear creator intent is expressed by an individual or small-scale brand in the biography or username, confirmed by a Google search if needed.
        - Use the creatorScore to reflect how strong or clear the indicators are, combining evidence from the biography, the category (if provided), the username (as a supplementary signal), and Google search results (if performed). Prioritize the biography and category when they explicitly indicate an individual or small-scale creator role, and treat the username and Google search as supporting factors, acknowledging that not all creators have explicit creator terms in their usernames.
        - Make decisions based on the biography content, the provided category (if it exists), the username (as a supporting factor), and Google search results (if needed to rule out celebrity or large brand status) — no assumptions from profile photos or outside data beyond the search.
    `;
  },
};
