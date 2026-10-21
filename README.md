# ShopPulse — E-commerce Product Analytics & AI Insights

ShopPulse is an e-commerce product analytics dashboard designed to help product teams investigate checkout drop-offs, understand shipping-fee conversion patterns, and identify recurring customer complaints using AI-powered review analysis.

## Problem Statement

E-commerce teams need to understand where customers abandon their purchase journey and what problems they experience. ShopPulse combines funnel analytics, shipping-fee comparisons, and AI-assisted customer review analysis to help teams identify areas worth investigating and propose data-informed product experiments.

## Key Features

- **Checkout Funnel Analytics:** Track shopping sessions, checkout starts, purchases, and conversion performance.
- **Shipping Fee Analysis:** Compare purchase conversion across different shipping-fee groups.
- **AI-Powered Review Insights:** Analyze customer reviews and classify feedback into four themes:
  1. High Shipping Fees
  2. Late Delivery
  3. Payment Issues
  4. Product Quality
- **Theme-Level Analysis:** Review sentiment patterns, evidence counts, and customer feedback to identify recurring pain points.
- **Interactive Dashboard:** View analytics and customer insights in one place.

## Product Metrics & Sample Findings

The current prototype uses synthetic sample data to demonstrate product analytics.

| Metric | Observed result |
|---|---:|
| Cart sessions | 1,000 |
| Checkout starts | 696 |
| Purchases | 330 |
| Checkout-start rate | 69.6% |
| Overall purchase conversion | 33.0% |
| Purchases per checkout start | 47.4% |

### Shipping Fee vs. Purchase Conversion

| Shipping fee | Sessions | Purchases | Conversion |
|---|---:|---:|---:|
| ₹0 | 229 | 99 | 43.23% |
| ₹20 | 227 | 96 | 42.29% |
| ₹50 | 269 | 85 | 31.60% |
| ₹100 | 275 | 50 | 18.18% |

**Product hypothesis:** Shipping costs may be a friction point in the purchase journey. A potential experiment would test a free-shipping threshold or a reduced shipping fee and measure the effect on conversion and average order value.

These figures are descriptive observations from synthetic data, not proof that shipping fees caused lower conversion.

## AI Review Analysis

ShopPulse uses a locally hosted Ollama model (`llama3.2:3b`) to analyze customer reviews and generate structured insights.

The review-analysis workflow aims to:
- Categorize feedback into the four predefined themes.
- Identify sentiment and recurring customer pain points.
- Summarize evidence from customer reviews.
- Help product teams formulate hypotheses for further investigation.

The current review dataset contains 12 synthetic reviews. AI classifications may be imperfect and require validation before being used for real product decisions.

## Tech Stack

**Frontend**
- React
- Vite
- Recharts
- CSS

**Backend**
- Node.js
- Express.js
- MySQL (`mysql2`)
- Ollama API for AI-powered review analysis

**Development Tools**
- Git and GitHub
- VS Code
- Ollama (`llama3.2:3b`)

## Architecture

```text
MySQL Database
      |
      v
Node.js + Express API
      |
      +---- Analytics queries
      |
      +---- Ollama AI review analysis
      |
      v
React + Vite Dashboard
      |
      v
Product Metrics & Customer Insights
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL
- Ollama

### 1. Clone the repository

```bash
git clone https://github.com/Pallavi0340/shoppulse.git
cd shoppulse
```

### 2. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend, in a separate terminal:

```bash
cd client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` directory. Configure the MySQL connection using the variable names expected by `server/db.js`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=college
```

Use your own local MySQL credentials. Never commit `.env` files or real secrets to GitHub.

Ensure the database and required tables are available before starting the backend.

### 4. Start Ollama

Install the `llama3.2:3b` model if it is not already available:

```bash
ollama pull llama3.2:3b
```

Start Ollama and verify that its local API is accessible.

### 5. Run the backend

From the `server` directory:

```bash
node server.js
```

### 6. Run the frontend

From the `client` directory:

```bash
npm run dev
```

Open the local URL printed by Vite in the terminal.

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `/api/analytics/overview` | Overall analytics and purchase funnel metrics |
| `/api/analytics/shipping` | Conversion comparison by shipping fee |
| `/api/analytics/reviews` | Rule-based review analytics |
| `/api/analytics/ai-insights` | AI-powered review insights |

## Product Thinking

ShopPulse is built around a product investigation workflow:

1. **Identify:** Detect where customers drop off in the purchase journey.
2. **Investigate:** Compare conversion across shipping-fee groups.
3. **Understand:** Analyze customer reviews for recurring complaints.
4. **Hypothesize:** Propose potential product changes based on the evidence.
5. **Validate:** Define an experiment and measure conversion, average order value, and other relevant metrics.

### Potential Next Steps

- Validate AI classifications against manually labelled reviews.
- Increase the size and diversity of the review dataset.
- Add date-based and customer-segment filters.
- Design controlled experiments to test shipping-fee hypotheses.
- Track experiment outcomes and guardrail metrics.
- Deploy the dashboard and backend for public access.

## Limitations

- The current datasets are synthetic and intended for demonstration.
- The review sample is small and may not represent real customer behaviour.
- AI-generated classifications and summaries can contain errors.
- Observed correlations do not establish causation.
- The AI feature currently depends on a locally running Ollama service.

## Author

**Pallavi**  
B.Tech Computer Science and Engineering

[GitHub Profile](https://github.com/Pallavi0340)

---

*ShopPulse is a portfolio project demonstrating e-commerce analytics, AI-assisted customer feedback analysis, and product-oriented problem solving.*