# ShopPulse — E-commerce Product Analytics Case Study

**Role:** Product Management / Analytics Project  
**Product:** ShopPulse  
**Project Type:** Portfolio Prototype  
**Data:** Synthetic e-commerce data

## 1. Problem Statement

Customers add products to their carts and begin checkout, but many do not complete their purchases. Product teams need to understand where this drop-off occurs and investigate the factors that may contribute to it.

Shipping charges are one possible factor worth investigating, but they should not be assumed to be the definitive cause. Payment difficulties, delivery expectations, product quality concerns, and checkout usability may also influence purchase decisions.

**Objective:** Build an analytics dashboard that combines purchase funnel data, shipping-fee comparisons, and customer review insights to help product teams identify patterns and develop testable hypotheses.

## 2. Approach

I developed ShopPulse to bring quantitative behavioural data and qualitative customer feedback into one dashboard.

The analysis focused on three areas:

- **Purchase funnel:** Understand the relationship between cart sessions, checkout starts, and completed purchases.
- **Shipping-fee analysis:** Compare purchase conversion across different shipping-fee groups.
- **AI-assisted review analysis:** Organize customer reviews into four themes: High Shipping Fees, Late Delivery, Payment Issues, and Product Quality.

The goal was to make patterns easier to investigate rather than to claim that a particular factor caused purchase abandonment.

## 3. Data and Methodology

The prototype uses synthetic data containing:

- 1,000 cart sessions.
- 696 checkout starts.
- 330 completed purchases.
- 12 synthetic customer reviews.

Purchase conversion was calculated as completed purchases divided by total cart sessions.

Shipping-fee group conversion was calculated as purchases within a fee group divided by sessions in that group.

Customer feedback was analyzed using rule-based review analytics and AI-assisted classification through a locally hosted language model.

Because the dataset is synthetic and small, the findings are exploratory and cannot establish real-world customer behaviour or causality.

## 4. Key Findings

### 4.1 Purchase Funnel

| Metric | Result |
|---|---:|
| Cart sessions | 1,000 |
| Checkout starts | 696 |
| Completed purchases | 330 |
| Checkout-start rate | 69.6% |
| Overall purchase conversion | 33.0% |
| Purchases per checkout start | 47.4% |

**Observation:** 670 out of 1,000 sessions did not result in a recorded purchase. Of these sessions, 304 had a checkout start recorded but no completed purchase.

These figures identify where further investigation may be useful. They do not, by themselves, explain why customers did not purchase.

### 4.2 Purchase Conversion by Shipping Fee

| Shipping fee | Sessions | Purchases | Conversion |
|---|---:|---:|---:|
| ₹0 | 229 | 99 | 43.23% |
| ₹20 | 227 | 96 | 42.29% |
| ₹50 | 269 | 85 | 31.60% |
| ₹100 | 275 | 50 | 18.18% |

**Observation:** The sample shows lower purchase conversion in the higher shipping-fee groups. Conversion ranges from 43.23% in the ₹0 group to 18.18% in the ₹100 group.

**Interpretation:** This pattern makes shipping-fee levels worth investigating as a possible factor associated with purchase behaviour. However, other differences between sessions, customers, products, or checkout experiences may also explain the pattern. The current data does not prove that shipping charges caused the lower conversion.

### 4.3 Customer Review Insights

ShopPulse organizes review feedback into four predefined themes:

- High Shipping Fees
- Late Delivery
- Payment Issues
- Product Quality

This structure helps product teams explore potential customer pain points alongside funnel metrics.

However, the current dataset contains only 12 synthetic reviews, and AI classification can be inaccurate. Review-level validation is needed before using these insights to prioritize significant product changes.

## 5. Product Insights and Hypotheses

Based on the exploratory analysis, I identified three areas for further investigation.

### Hypothesis 1: Shipping-fee levels or presentation may be associated with purchase behaviour

The conversion differences across fee groups justify further investigation, but they do not establish a causal relationship.

**Next step:** Analyze real transaction data and, where feasible, test an alternative shipping-fee presentation or policy through a controlled experiment.

### Hypothesis 2: Checkout friction may contribute to incomplete purchases

The funnel shows a gap between recorded checkout starts and completed purchases, but it does not identify the underlying reasons.

**Next step:** Instrument checkout steps and examine payment failures, validation errors, page performance, and exit points.

### Hypothesis 3: Customer feedback can help prioritize investigation areas

Review themes may help teams identify issues to investigate alongside quantitative metrics.

**Next step:** Collect a larger, representative review dataset and validate AI-generated themes against manually labelled reviews.

These hypotheses require further validation before being treated as product conclusions.

## 6. Recommended Experiments and Actions

| Priority | Action | Purpose |
|---|---|---|
| P1 | Validate funnel events and collect real transaction data | Improve confidence in the analysis |
| P1 | Investigate checkout exits and payment failures | Identify specific friction points |
| P2 | Test an alternative shipping-fee presentation where feasible | Evaluate whether the change affects purchase conversion |
| P2 | Expand and manually validate customer review classifications | Improve the reliability of feedback insights |

### Proposed experiment

Compare the current shipping-fee experience with an alternative, such as clearer upfront fee communication or a clearly communicated free-shipping threshold.

- **Primary metric:** Purchase conversion rate.
- **Guardrail metrics:** Average order value, contribution margin per order, checkout abandonment, and shipping-related complaints.
- **Method:** A controlled A/B test where feasible, with the sample size, duration, target audience, and success criteria defined before launch.

The experiment should determine whether the proposed change produces a measurable improvement. No impact should be assumed in advance.

## 7. Success Metrics

The proposed success metrics are:

- Purchase conversion rate.
- Checkout abandonment rate.
- Average order value and contribution margin per order.
- Review classification precision and recall against manually labelled data.
- Dashboard task-completion rate.
- User-rated usefulness of generated insights.

Business outcome metrics should be evaluated using reliable real-world data and appropriate experimentation.

## 8. Limitations

- The current dataset is synthetic and may not represent real customer behaviour.
- The review sample is small and not representative.
- AI-generated review classifications may contain errors.
- Differences between shipping-fee groups do not establish causation.
- No controlled experiment or real-world business impact has been demonstrated.
- The prototype is intended to demonstrate product thinking and analytics capabilities, not production-ready decision automation.

## 9. Learnings

Building ShopPulse helped me connect product analytics with practical product decision-making.

Key learnings include:

1. Funnel metrics help identify where a problem may exist, but additional investigation is needed to understand why.
2. Conversion differences across groups can generate hypotheses, but correlation alone does not establish causation.
3. Quantitative metrics and qualitative feedback provide complementary perspectives.
4. AI-generated insights require validation and traceability to source evidence.
5. Product recommendations should balance conversion goals with customer experience and business guardrails.

## 10. Conclusion

ShopPulse demonstrates how an e-commerce product team could combine funnel analytics, shipping-fee comparisons, and AI-assisted review analysis in a single dashboard.

The prototype identifies patterns worth investigating and proposes experiments to test potential explanations. Its findings are exploratory because the current data is synthetic and does not establish causality.

The next stage would be to validate the analysis using real customer data, improve review classification quality, and test prioritized hypotheses through controlled experiments.

---

**Prepared by:** Pallavi  
**Project:** ShopPulse — E-commerce Product Analytics & AI Insights