# ShopPulse — Product Requirements Document (PRD)

## 1. Product Overview

**ShopPulse** is an e-commerce product analytics dashboard that helps product teams investigate purchase drop-offs, understand how purchase conversion varies across shipping-fee groups, and identify customer pain points using AI-assisted review analysis.

The goal is to bring behavioural data and customer feedback together so product teams can make better-informed decisions.

## 2. Problem Statement

Customers add products to their carts and begin checkout, but many do not complete their purchases. Businesses need to understand where customers drop off and what factors may contribute to this behaviour.

Shipping charges are one possible factor worth investigating, but they may not be the only explanation. Other factors, such as payment difficulties, delivery expectations, product concerns, or checkout usability, may also influence purchase decisions.

Without combining behavioural analytics with customer feedback, product teams may struggle to identify which issues deserve further investigation.

## 3. Proposed Solution

ShopPulse provides a unified dashboard to investigate purchase funnel performance, compare conversion across shipping-fee groups, and analyze customer reviews using AI.

By combining quantitative metrics with qualitative feedback, ShopPulse helps product teams identify patterns, develop hypotheses, and prioritize experiments. It does not assume that shipping charges—or any single factor—are the definitive cause of purchase abandonment.

## 4. Target Users

**Primary users**
- Associate Product Managers and Product Managers
- E-commerce product and growth teams
- Product analysts

**User needs**
- Identify where customers drop off in the purchase journey.
- Compare purchase conversion across shipping-fee groups.
- Understand recurring themes in customer feedback.
- Turn observations into testable product hypotheses.

## 5. Product Goals

1. Make purchase funnel performance easy to understand.
2. Show how conversion varies across shipping-fee groups.
3. Organize customer feedback into four predefined themes.
4. Help product teams identify and prioritize potential improvements.
5. Encourage evidence-based decisions rather than unsupported assumptions.

## 6. Core Features and Requirements

### Feature 1: Purchase Funnel Analytics

Display:
- Total shopping sessions
- Checkout starts
- Completed purchases
- Checkout-start rate
- Overall purchase conversion

**Requirement:** Metrics must be calculated consistently from session data.

### Feature 2: Shipping Fee Analysis

For each shipping-fee group, display:
- Number of sessions
- Number of purchases
- Purchase conversion rate

**Requirement:** Users should be able to compare conversion patterns across shipping-fee groups without assuming that observed differences establish causation.

### Feature 3: AI-Powered Customer Review Insights

Classify customer reviews into four predefined themes:

1. High Shipping Fees
2. Late Delivery
3. Payment Issues
4. Product Quality

Display relevant summaries, sentiment patterns, and evidence counts where available.

**Requirement:** AI-generated classifications must be validated against actual review content. Incorrect classifications and unsupported conclusions should not be presented as reliable findings.

### Feature 4: Unified Dashboard

Bring funnel analytics, shipping-fee comparisons, and customer review insights into a single interface.

**Requirement:** Present the information clearly so users can investigate product issues without switching between separate analytical views.

## 7. Success Metrics

These are proposed success metrics for future evaluation, not outcomes already achieved.

| Metric | Purpose |
|---|---|
| Dashboard task-completion rate | Measure whether users can locate and interpret key metrics |
| Insight usefulness score | Assess whether users find the insights helpful |
| Review classification precision and recall | Evaluate AI classification quality against manually labelled reviews |
| Hypothesis-generation rate | Measure whether users can formulate evidence-based experiments |
| Purchase conversion rate | Evaluate the outcome of future product experiments |

## 8. Current Prototype and Sample Findings

The current prototype uses synthetic sample data.

| Metric | Observed value |
|---|---:|
| Shopping sessions | 1,000 |
| Checkout starts | 696 |
| Purchases | 330 |
| Checkout-start rate | 69.6% |
| Overall purchase conversion | 33.0% |
| Purchases per checkout start | 47.4% |

The sample shows different purchase conversion rates across shipping-fee groups. These differences identify a pattern worth investigating, but they do not establish why customers did or did not purchase.

The current review dataset contains 12 synthetic reviews. This is a small demonstration dataset and cannot reliably represent the wider customer population.

## 9. Product Hypotheses and Experiment Plan

### Initial hypothesis

Shipping-fee levels or how shipping costs are presented may be associated with purchase behaviour for some customers.

This is a hypothesis to investigate, not a confirmed explanation for checkout abandonment.

### Proposed experiment

Test the current shipping-fee experience against an alternative, such as a clearly communicated free-shipping threshold, where commercially feasible.

**Primary metric**
- Purchase conversion rate

**Guardrail metrics**
- Average order value
- Contribution margin per order
- Checkout abandonment
- Customer complaints about shipping

### Evaluation approach

Where feasible, use a controlled A/B test with comparable customer groups. Define the test duration and sample-size requirements before launch, then assess whether the observed difference is meaningful.

A product change should not be rolled out solely because one group in the existing sample has a higher conversion rate.

## 10. Scope and Limitations

**Available in the current prototype**
- Purchase funnel analytics
- Shipping-fee conversion comparisons
- Rule-based review analytics
- AI-assisted review insights
- Dashboard visualizations

**Not yet established**
- Production-scale data ingestion
- Validated AI classification performance
- Real-world business impact
- Controlled experimentation infrastructure
- Public deployment

## 11. Future Improvements

- Expand the review dataset and validate AI classifications manually.
- Add date and customer-segment filters.
- Improve AI output validation and evidence traceability.
- Support experiment planning and evaluation.
- Add data-quality checks and metric monitoring.
- Deploy the application for public demonstration.

## 12. Product Decision Principles

ShopPulse distinguishes observed data from possible explanations. Analytics can reveal patterns, and customer feedback can suggest potential causes, but causal claims require stronger evidence.

Product recommendations should therefore be framed as hypotheses and validated using appropriate research or experiments before implementation decisions are made.

---

**Prepared by:** Pallavi  
**Project:** ShopPulse — E-commerce Product Analytics & AI Insights  
**Document status:** Portfolio PRD for the current prototype
