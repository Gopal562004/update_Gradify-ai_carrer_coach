# SACRA Algorithm v2.0: Deep Dive Documentation

The **Simplified Adaptive Career Recommendation Algorithm (SACRA)** is the mathematical engine that drives the career recommendations in this application. It evaluates a user's suitability for various IT career domains using a sophisticated multi-factor approach. 

Unlike traditional rule-based recommendation engines, SACRA is highly adaptive. It uses "cold-start" weight adjustments, meaning it dynamically rebalances its mathematical formula depending on what data the user has actually provided (e.g., if a user has no academic grades, it shifts the weight to their skills and interests).

The algorithm calculates a **Composite Score (0-100)** for every available career domain based on four primary pillars:
1. **Factor A:** Academic Performance
2. **Factor I:** Interest & Psychometric Analysis
3. **Factor S:** Skill Match & Jaccard Similarity
4. **Factor G:** Industry Growth & Demand

---

## 1. Factor A: Academic Performance Score

### The Math
The Academic Score (`Factor A`) measures how well a user's academic background aligns with the core subjects needed for a specific domain. It looks at four core subjects: `DSA` (Data Structures & Algorithms), `OOP` (Object-Oriented Programming), `DBMS` (Database Management Systems), and `OS` (Operating Systems).

Each career domain has pre-defined "relevance weights" for these subjects. For example, the *Backend Development* domain heavily weights `DBMS` and `DSA`, while *UI/UX Design* assigns them near-zero weights.

```text
Score_A = Σ (User_Grade[subject] * Relevance_Weight[subject]) / Σ (Relevance_Weight[subject])
```

- Grades are normalized to a `0-100` scale.
- If the user hasn't provided any academic grades, the algorithm safely returns a neutral score of `50` and flags `available: false` so the Adaptive Engine can adjust the final weights later.

---

## 2. Factor I: Interest Score (Cosine Similarity)

### The Math
The Interest Score (`Factor I`) maps a user's qualitative quiz answers into quantitative vectors.

**Step 1: Building the User Vector**
When the user takes the career quiz, the algorithm parses their answers. It uses a predefined pattern map and keyword matching to identify psychological traits and interests (e.g., *problem_solving*, *creativity*, *system_design*, *mathematics*).
- Exact phrase matches add `1.0` to the specific trait's vector.
- Fuzzy keyword matches add `0.5` to the vector.

**Step 2: Vector Normalization**
The resulting vector is normalized to a unit length (`Magnitude = 1`) to ensure the score relies on the *direction* of the user's interests, not just the volume of their answers.

**Step 3: Cosine Similarity Calculation**
Each career domain possesses an "Ideal Interest Vector". SACRA computes the dot product between the User's Vector and the Domain's Ideal Vector:

```text
Cosine Similarity = (A • B) / (||A|| * ||B||)
```

This returns a value between `-1` and `1`. SACRA then scales this up to a standard `0-100` score using: `Score_I = ((Similarity + 1) / 2) * 100`

---

## 3. Factor S: Skill Match Score (Fuzzy Matching)

### The Math
The Skill Score (`Factor S`) determines how closely a user's current tech stack aligns with the required tech stack for a domain. It doesn't rely on strict string matching. Instead, it utilizes **Fuzzy Matching** and **Jaccard Bigram Similarity**.

**Step 1: Canonical Synonyms**
The algorithm first maps skills to canonical names (e.g., `"react.js"`, `"reactjs"`, and `"react"` all map to the canonical `"React"`).

**Step 2: Fuzzy Comparison**
For every required skill in a domain, the engine compares it against all of the user's skills:
1. **Exact Canonical Match**: Yields a `1.0` match score.
2. **Substring Match**: Yields a `0.85` match score.
3. **Jaccard Bigram Similarity**: Calculates the intersection over union of 2-character n-grams. If the similarity is > `0.60`, it awards a partial score.

```text
Jaccard Index = (N-grams in A ∩ N-grams in B) / (N-grams in A ∪ N-grams in B)
```

**Step 3: Weighted Aggregation**
Each domain assigns a "weight" to its required skills (e.g., Python is heavily weighted for Data Science). The algorithm sums the weights of the matched skills and divides by the total required weight, outputting a `0-100` score.

---

## 4. Factor G: Growth Potential Score

### The Math
The Growth Score (`Factor G`) ensures users are recommended careers that are future-proof and have high market demand.

It aggregates two distinct metrics defined in the domain configuration:
1. **Base Growth Rate**: The projected annual growth of the industry. It is normalized so that a `40%` growth rate equates to a score of `100`.
2. **Base Demand Level**: A raw `0-100` score indicating current market hiring velocity.

```text
Score_G = (0.5 * Normalized_Growth) + (0.5 * Demand_Level)
```

---

## 5. Cold-Start Adaptive Weighting

The true power of SACRA is its ability to seamlessly handle missing data. It uses dynamic mathematical weights (`w1`, `w2`, `w3`, `w4`) for the final calculation. 

The baseline formula is:
```text
Composite Score = (w1 * Score_A) + (w2 * Score_I) + (w3 * Score_S) + (w4 * Score_G)
```
*(Default Weights: Academic = 0.20, Interest = 0.30, Skill = 0.30, Growth = 0.20)*

If a user signs up but provides zero skills, zero academic grades, and skips the quiz, the algorithm enters "Cold-Start" mode. 
- It redistributes the weights massively in favor of **Factor G (Growth)**, essentially recommending the highest-demand, fastest-growing jobs. 
- If the user provides only Skills, it redistributes the weights primarily to **Factor S (55%)** and **Factor G (35%)**.

---

## 6. Confidence Scoring

Finally, SACRA calculates a `Confidence` score (`0.0` to `1.0`) indicating the statistical reliability of its recommendation.
- Having Academic Data adds `+0.25`
- Completing the Quiz adds `+0.30`
- Having Skills adds `+0.25`
- Having prior Work Experience adds `+0.20`

An additional Consistency Bonus is added based on the number of non-empty data sources, encouraging users to fully flesh out their profiles for hyper-accurate recommendations.
