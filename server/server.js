
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

// --------------------------------------------------
// BASIC ROUTES
// --------------------------------------------------

app.get("/", (req, res) => {
    res.send("ShopPulse API is running!");
});

app.get("/test", (req, res) => {
    res.send("Test route is working!");
});

// --------------------------------------------------
// OVERVIEW ANALYTICS
// --------------------------------------------------

app.get("/api/analytics/overview", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                COUNT(*) AS totalSessions,
                COALESCE(SUM(checkout_started), 0) AS checkoutStarted,
                COALESCE(SUM(purchase_completed), 0) AS purchases
            FROM cart_sessions
        `);

        res.json(rows[0]);
    } catch (error) {
        console.error("Analytics query failed:", error.message);

        res.status(500).json({
            error: "Unable to fetch analytics"
        });
    }
});

// --------------------------------------------------
// SHIPPING ANALYTICS
// --------------------------------------------------

app.get("/api/analytics/shipping", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                shipping_fee AS shippingFee,
                COUNT(*) AS totalSessions,
                SUM(purchase_completed) AS purchases,
                ROUND(
                    SUM(purchase_completed) * 100.0 / COUNT(*),
                    2
                ) AS conversion
            FROM cart_sessions
            GROUP BY shipping_fee
            ORDER BY shipping_fee
        `);

        res.json(rows);
    } catch (error) {
        console.error(
            "Shipping analytics query failed:",
            error.message
        );

        res.status(500).json({
            error: "Unable to fetch shipping analytics"
        });
    }
});

// --------------------------------------------------
// EXISTING RULE-BASED REVIEW ANALYTICS
// Kept for compatibility with the existing dashboard.
// --------------------------------------------------

app.get("/api/analytics/reviews", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                CASE
                    WHEN LOWER(review_text) LIKE '%shipping%'
                      OR LOWER(review_text) LIKE '%delivery charge%'
                      OR LOWER(review_text) LIKE '%shipping cost%'
                      OR LOWER(review_text) LIKE '%shipping fee%'
                    THEN 'Shipping cost'

                    WHEN LOWER(review_text) LIKE '%late%'
                      OR LOWER(review_text) LIKE '%slow%'
                      OR LOWER(review_text) LIKE '%arrived%'
                      OR LOWER(review_text) LIKE '%delivery%'
                    THEN 'Delivery experience'

                    WHEN LOWER(review_text) LIKE '%checkout%'
                      OR LOWER(review_text) LIKE '%payment%'
                    THEN 'Checkout and payment'

                    WHEN LOWER(review_text) LIKE '%quality%'
                      OR LOWER(review_text) LIKE '%packaging%'
                    THEN 'Product quality'

                    ELSE 'Other'
                END AS theme,
                COUNT(*) AS reviewCount,
                ROUND(AVG(rating), 2) AS averageRating
            FROM customer_reviews
            GROUP BY theme
            ORDER BY reviewCount DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error(
            "Review analytics query failed:",
            error.message
        );

        res.status(500).json({
            error: "Unable to fetch review analytics"
        });
    }
});

// --------------------------------------------------
// AI-POWERED CUSTOMER REVIEW INSIGHTS
// Uses local Ollama; no paid AI API required.
// --------------------------------------------------

const THEME_DEFINITIONS = [
    {
        name: "High Shipping Fees",
        definition:
            "Explicit complaints about expensive shipping, high delivery fees, or unexpected shipping charges."
    },
    {
        name: "Late Delivery",
        definition:
            "Explicit mentions of delayed orders, late arrivals, slow delivery, or missed delivery estimates."
    },
    {
        name: "Payment Issues",
        definition:
            "Failed transactions, declined payments, payment errors, or payments that could not be completed."
    },
    {
        name: "Product Quality",
        definition:
            "Explicit feedback about good or poor product quality, defective products, or damaged products."
    }
];

const ALLOWED_THEMES = THEME_DEFINITIONS.map(t => t.name);

app.get("/api/analytics/ai-insights", async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT review_id, review_text, rating, product_category
            FROM customer_reviews
            ORDER BY review_id ASC
            LIMIT 100
        `);

        if (!reviews.length) {
            return res.status(404).json({
                error: "No customer reviews found"
            });
        }

        const reviewData = reviews.map(r => ({
            review_id: Number(r.review_id),
            review: String(r.review_text),
            rating: Number(r.rating),
            category: r.product_category || null
        }));

        const prompt = `
You are ShopPulse's customer feedback analyst.

Classify EVERY review below individually into ONE OR MORE of the 4 exact allowed themes based strictly on the text.

REVIEWS:
${JSON.stringify(reviewData)}

For every review, return:
- review_id: its original database ID
- themes: an array of strings containing ONLY exact labels from the allowed list below
- rationale: a short explanation based on the review text

ALLOWED THEMES & STRICT BOUNDARIES:
1. "High Shipping Fees": ONLY for complaints about the monetary cost of shipping, expensive delivery charges, or unexpected checkout fees. DO NOT include speed here.
2. "Late Delivery": ONLY for complaints about how long the order took to arrive, delays, slow transit, or missed delivery dates. DO NOT include shipping price here.
3. "Payment Issues": ONLY for failed transactions, declined cards, or gateway errors.
4. "Product Quality": ONLY for physical item defects, poor material, or damaged goods.

STRICT RULES:
- Use ONLY the exact strings: "High Shipping Fees", "Late Delivery", "Payment Issues", "Product Quality".
- NEVER merge "High Shipping Fees" and "Late Delivery" together. Shipping cost and delivery speed are completely separate categories.
- If a review talks about shipping prices, tag ONLY "High Shipping Fees". If it talks about waiting too long, tag ONLY "Late Delivery".
- Return every supplied review exactly once.
- If no theme applies, return an empty themes array.
- Return ONLY valid JSON in this exact structure:
{
  "classifications": [
    {
      "review_id": 1,
      "themes": ["High Shipping Fees"],
      "rationale": "The customer complained specifically about high shipping costs."
    }
  ],
  "summary": "A concise summary grounded in these reviews.",
  "overallSentiment": "Positive, Mixed, or Negative",
  "recommendations": ["A practical improvement to investigate."],
  "limitations": ["The sample may be small or unrepresentative."]
}
`;

        const response = await fetch(
            "http://127.0.0.1:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:3b",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    format: "json",
                    stream: false,
                    options: {
                        temperature: 0
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `Ollama request failed: ${response.status}`
            );
        }

        const aiResponse = await response.json();
        const content = aiResponse.message?.content;

        if (!content) {
            throw new Error("Ollama returned an empty response");
        }

        const aiResult = JSON.parse(content);

        const validReviews = new Map(
            reviews.map(r => [String(r.review_id), r])
        );

        const classifications = new Map();

        const normalizeTheme = (theme) => {
            if (typeof theme !== "string") return [];

            const value = theme.trim().toLowerCase();

            // SAFETY NET: If the AI stubbornly merges shipping & delivery, split them!
            if (value.includes("shipping and delivery") || value.includes("shipping & delivery")) {
                return ["High Shipping Fees", "Late Delivery"];
            }

            const aliases = {
                "high shipping fees": ["High Shipping Fees"],
                "shipping fees": ["High Shipping Fees"],
                "shipping fee": ["High Shipping Fees"],
                "shipping cost": ["High Shipping Fees"],

                "late delivery": ["Late Delivery"],
                "delivery experience": ["Late Delivery"],
                "delivery delay": ["Late Delivery"],
                "delivery": ["Late Delivery"],

                "payment issues": ["Payment Issues"],
                "checkout and payment": ["Payment Issues"],
                "payment": ["Payment Issues"],

                "product quality": ["Product Quality"],
                "quality": ["Product Quality"]
            };

            return aliases[value] || [];
        };



        for (const item of (
            Array.isArray(aiResult.classifications)
                ? aiResult.classifications
                : []
        )) {
            const id = String(item?.review_id ?? "");

            if (!validReviews.has(id) || classifications.has(id)) {
                continue;
            }

            const rawThemes = Array.isArray(item.themes)
                ? item.themes
                : [];

            const themes = [
                ...new Set(rawThemes.flatMap(normalizeTheme))
            ];

            classifications.set(id, {
                themes,
                rationale: typeof item.rationale === "string"
                    ? item.rationale
                    : ""
            });
        }

        // The server creates the four themes. The AI cannot rename them.
        const mainThemes = THEME_DEFINITIONS.map(definition => {
            const supportingReviews = reviews.filter(review => {
                const result = classifications.get(
                    String(review.review_id)
                );

                return result?.themes.includes(definition.name);
            });

            const ratings = supportingReviews.map(r => Number(r.rating));
            const averageRating = ratings.length
                ? ratings.reduce((sum, rating) => sum + rating, 0)
                / ratings.length
                : null;

            let sentiment = "Mixed";

            if (averageRating !== null) {
                if (averageRating >= 4) sentiment = "Positive";
                else if (averageRating <= 2) sentiment = "Negative";
            }

            const evidence = supportingReviews.length
                ? supportingReviews
                    .slice(0, 4)
                    .map(r =>
                        `Review #${r.review_id}: "${String(r.review_text).slice(0, 250)}"`
                    )
                    .join(" | ")
                : "No supporting reviews were identified in this sample.";

            return {
                theme: definition.name,
                sentiment,
                evidenceCount: supportingReviews.length,
                evidence,
                evidenceReviewIds: supportingReviews.map(
                    r => Number(r.review_id)
                )
            };
        });

        console.log(
            "ROUTE CHECK:",
            mainThemes.map(t => t.theme)
        );

        const limitations = Array.isArray(aiResult.limitations)
            ? aiResult.limitations.filter(
                item => typeof item === "string"
            )
            : [];

        if (!limitations.some(item => /sample|synthetic|representative/i.test(item))) {
            limitations.push(
                `Analysis is based on ${reviews.length} reviews and may not represent the broader customer base.`
            );
        }

        const missingCount = reviews.length - classifications.size;

        if (missingCount > 0) {
            limitations.push(
                `${missingCount} reviews were not classified by the AI and were excluded from theme evidence.`
            );
        }

        console.log("AI ROUTE HIT");
        console.log("THEMES:", mainThemes.map(t => t.theme));

        res.json({
            source: "ollama",
            model: "llama3.2:3b",
            reviewCount: reviews.length,
            classifiedReviewCount: classifications.size,
            insights: {
                summary: typeof aiResult.summary === "string"
                    ? aiResult.summary
                    : "Customer reviews were analyzed against four predefined themes.",
                overallSentiment: [
                    "Positive",
                    "Mixed",
                    "Negative"
                ].includes(aiResult.overallSentiment)
                    ? aiResult.overallSentiment
                    : "Mixed",
                mainThemes,
                recommendations: Array.isArray(aiResult.recommendations)
                    ? aiResult.recommendations.filter(
                        item => typeof item === "string"
                    )
                    : [],
                limitations
            }
        });

    } catch (error) {
        console.error("AI insights failed:", error.message);

        res.status(500).json({
            error: "Unable to generate AI insights",
            details: error.message
        });
    }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ShopPulse server running on port ${PORT}`);
});