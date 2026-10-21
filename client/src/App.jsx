
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  MessageSquareText,
  Settings,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  CircleHelp,
} from "lucide-react";
import "./App.css";

function App() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [shippingData, setShippingData] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(true);
  const [shippingError, setShippingError] = useState("");
  const [reviewThemes, setReviewThemes] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [aiInsights, setAiInsights] = useState(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(true);
  const [aiInsightsError, setAiInsightsError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/overview")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load analytics data.");
        }
        return response.json();
      })
      .then((data) => {
        setOverview({
          totalSessions: Number(data.totalSessions) || 0,
          checkoutStarted: Number(data.checkoutStarted) || 0,
          purchases: Number(data.purchases) || 0,
        });
        setApiError("");
      })
      .catch((error) => {
        console.error("Analytics API error:", error);
        setApiError("Could not load live analytics. Check that the ShopPulse server is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/shipping")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load shipping analytics data.");
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((item) => ({
          fee: `₹${Number(item.shippingFee).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          shippingFee: Number(item.shippingFee),
          totalSessions: Number(item.totalSessions) || 0,
          purchases: Number(item.purchases) || 0,
          conversion: Number(item.conversion) || 0,
        }));
        setShippingData(formattedData);
        setShippingError("");
      })
      .catch((error) => {
        console.error("Shipping analytics API error:", error);
        setShippingError(
          "Could not load shipping analysis. Check that the shipping API is running."
        );
      })
      .finally(() => setShippingLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/reviews")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load review analytics data.");
        }
        return response.json();
      })
      .then((data) => {
        const formattedThemes = data.map((item) => ({
          theme: item.theme,
          reviewCount: Number(item.reviewCount) || 0,
          averageRating: Number(item.averageRating) || 0,
        }));
        setReviewThemes(formattedThemes);
        setReviewsError("");
      })
      .catch((error) => {
        console.error("Review analytics API error:", error);
        setReviewsError(
          "Could not load review insights. Check that the review analytics API is added and the server is running."
        );
      })
      .finally(() => setReviewsLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/ai-insights")
      .then((response) => {
        if (!response.ok) {
          return response.json().catch(() => ({})).then((errorData) => {
            throw new Error(errorData.error || "Unable to load AI review insights.");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (!data.insights) {
          throw new Error("The AI insights response did not contain insight data.");
        }
        setAiInsights(data);
        setAiInsightsError("");
      })
      .catch((error) => {
        console.error("AI review insights error:", error);
        setAiInsightsError("Could not load AI insights. Check that Ollama and the ShopPulse server are running.");
      })
      .finally(() => setAiInsightsLoading(false));
  }, []);

  const lowestShippingConversion = shippingData.length
    ? shippingData.reduce((lowest, item) =>
      item.conversion < lowest.conversion ? item : lowest
    )
    : null;

  const topReviewTheme = reviewThemes.length
    ? reviewThemes.reduce((top, item) =>
      item.reviewCount > top.reviewCount ? item : top
    )
    : null;
  const productInsightText = shippingLoading || reviewsLoading
    ? "Analyzing shipping and customer review data…"
    : shippingError || reviewsError
      ? "Product insight is unavailable until both shipping and review data load successfully."
      : !lowestShippingConversion || !topReviewTheme
        ? "There is not enough data to generate a product insight yet."
        : `The ₹${lowestShippingConversion.shippingFee.toLocaleString("en-IN", { maximumFractionDigits: 0 })} shipping-fee group has the lowest observed conversion (${lowestShippingConversion.conversion.toFixed(2)}%). “${topReviewTheme.theme}” is the most frequent review theme in this sample (${topReviewTheme.reviewCount} reviews). Investigate whether these patterns are related, and compare similar cart values before making product or pricing changes.`;

  const totalSessions = overview?.totalSessions ?? 0;
  const checkoutStarted = overview?.checkoutStarted ?? 0;
  const purchases = overview?.purchases ?? 0;
  const checkoutDropoff = checkoutStarted - purchases;
  const cartConversion = totalSessions ? (purchases / totalSessions) * 100 : 0;
  const checkoutStartRate = totalSessions ? (checkoutStarted / totalSessions) * 100 : 0;
  const checkoutDropoffRate = checkoutStarted ? (checkoutDropoff / checkoutStarted) * 100 : 0;

  const funnelData = [
    { name: "Cart sessions", value: totalSessions, fill: "#E65365" },
    { name: "Checkout started", value: checkoutStarted, fill: "#F28B96" },
    { name: "Purchases", value: purchases, fill: "#F8B5BC" },
  ];

  const kpis = [
    {
      title: "Cart Sessions",
      value: loading ? "…" : totalSessions.toLocaleString(),
      note: "Total sessions analyzed",
      icon: ShoppingCart,
      trend: "Dataset size",
    },
    {
      title: "Purchases",
      value: loading ? "…" : purchases.toLocaleString(),
      note: `${cartConversion.toFixed(2)}% cart conversion`,
      icon: TrendingUp,
      trend: `${cartConversion.toFixed(2)}%`,
    },
    {
      title: "Checkout Started",
      value: loading ? "…" : checkoutStarted.toLocaleString(),
      note: `${checkoutStartRate.toFixed(2)}% of cart sessions`,
      icon: LayoutDashboard,
      trend: `${checkoutStartRate.toFixed(2)}%`,
    },
    {
      title: "Checkout Drop-off",
      value: loading ? "…" : checkoutDropoff.toLocaleString(),
      note: `${checkoutDropoffRate.toFixed(2)}% of checkouts`,
      icon: TrendingDown,
      trend: `${checkoutDropoffRate.toFixed(2)}%`,
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <h2>ShopPulse</h2>
            <span>PRODUCT ANALYTICS</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="navigation">
          <a className="nav-item active" href="#overview">
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </a>
          <a className="nav-item" href="#funnel">
            <ShoppingCart size={19} />
            <span>Checkout funnel</span>
          </a>
          <a className="nav-item" href="#shipping">
            <Truck size={19} />
            <span>Shipping analysis</span>
          </a>
          <a className="nav-item" href="#review-insights">
            <MessageSquareText size={19} />
            <span>Review insights</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <CircleHelp size={20} />
            <div>
              <strong>Need a hand?</strong>
              <p>Explore your store insights.</p>
            </div>
          </div>
          <a className="nav-item" href="#settings">
            <Settings size={19} />
            <span>Settings</span>
          </a>
          <div className="profile">
            <div className="avatar">SP</div>
            <div>
              <strong>ShopPulse Analyst</strong>
              <span>Demo workspace</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Overview</strong>
          </div>
          <div className="topbar-actions">
            <div className="demo-badge">
              <span className="status-dot" />
              Synthetic data
            </div>
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="top-avatar">P</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">YOUR STORE AT A GLANCE</p>
            <h1>Overview</h1>
            <p className="page-subtitle">
              Understand your checkout performance and discover opportunities.
            </p>
          </div>
          <button className="date-button">Last 30 days ▾</button>
        </section>

        {apiError && (
          <p role="alert" className="api-error">
            {apiError}
          </p>
        )}

        <section className="kpi-grid">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <article className="kpi-card" key={kpi.title}>
                <div className="kpi-top">
                  <span className="kpi-title">{kpi.title}</span>
                  <span className="kpi-icon">
                    <Icon size={19} />
                  </span>
                </div>
                <h2>{kpi.value}</h2>
                <p>{kpi.note}</p>
                <div className="kpi-footer">
                  <span className="kpi-indicator">
                    <ArrowUpRight size={14} />
                    {kpi.trend}
                  </span>
                  <span className="muted-label">in this dataset</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="charts-grid">
          <article className="panel funnel-panel" id="funnel">
            <div className="panel-heading">
              <div>
                <h3>Checkout funnel</h3>
                <p>From cart to completed purchase</p>
              </div>
              <button className="more-button" aria-label="More options">•••</button>
            </div>
            <div className="funnel-summary">
              <div>
                <span className="summary-label">Overall conversion</span>
                <h2>{loading ? "…" : `${cartConversion.toFixed(2)}%`}</h2>
              </div>
              <span className="summary-chip">{loading ? "Loading…" : `${purchases.toLocaleString()} purchases`}</span>
            </div>
            <div className="funnel-chart">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip formatter={(value) => [value.toLocaleString(), "Sessions"]} />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList
                      position="center"
                      dataKey="name"
                      fill="#FFFFFF"
                      stroke="none"
                      style={{ fontSize: 12, fontWeight: 600 }}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <div className="funnel-rows">
              <div><span className="funnel-dot dot-one" /><span>Cart sessions</span><strong>{loading ? "…" : totalSessions.toLocaleString()}</strong></div>
              <div><span className="funnel-dot dot-two" /><span>Checkout started</span><strong>{loading ? "…" : checkoutStarted.toLocaleString()}</strong></div>
              <div><span className="funnel-dot dot-three" /><span>Purchases completed</span><strong>{loading ? "…" : purchases.toLocaleString()}</strong></div>
            </div>
          </article>

          <article className="panel shipping-panel" id="shipping">
            <div className="panel-heading">
              <div>
                <h3>Shipping fee vs. conversion</h3>
                <p>How conversion varies across shipping fee groups</p>
              </div>
              <button className="more-button" aria-label="More options">•••</button>
            </div>
            <div className="chart-legend">
              <span className="legend-dot" />
              Cart-to-purchase conversion
            </div>
            <div className="chart-container">
              {shippingLoading ? (
                <p>Loading shipping analysis…</p>
              ) : shippingError ? (
                <p role="alert">{shippingError}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shippingData}
                    margin={{ top: 12, right: 8, left: -18, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF3" />
                    <XAxis dataKey="fee" axisLine={false} tickLine={false} tick={{ fill: "#758197", fontSize: 12 }} />
                    <YAxis
                      domain={[0, 50]}
                      ticks={[0, 10, 20, 30, 40, 50]}
                      tickFormatter={(value) => `${value}%`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#758197", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${Number(value).toFixed(2)}%`, "Conversion"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid #E7EAF0" }}
                    />
                    <Bar dataKey="conversion" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {shippingData.map((entry, index) => (
                        <Cell
                          key={entry.fee}
                          fill={index === shippingData.length - 1 ? "#E65365" : "#F2A1AB"}
                        />
                      ))}
                      <LabelList
                        dataKey="conversion"
                        position="top"
                        formatter={(value) => `${Number(value).toFixed(1)}%`}
                        style={{ fill: "#39445A", fontSize: 11, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="chart-insight">
              <div className="insight-icon"><TrendingDown size={18} /></div>
              <p>
                <strong>Observation:</strong>{" "}
                {lowestShippingConversion
                  ? `${lowestShippingConversion.fee} fee group has the lowest conversion (${lowestShippingConversion.conversion.toFixed(2)}%) in this synthetic dataset. `
                  : "Shipping conversion data is not available yet. "}
                This association does not establish causation.
              </p>
            </div>
          </article>
        </section>

        <section className="bottom-grid" id="insights">
          <article className="panel dropoff-panel">
            <div className="panel-heading">
              <div>
                <h3>Where customers drop off</h3>
                <p>Session counts across the purchase journey</p>
              </div>
            </div>
            <div className="dropoff-row">
              <div className="dropoff-icon cart-icon"><ShoppingCart size={18} /></div>
              <div className="dropoff-copy">
                <strong>Did not start checkout</strong>
                <span>Cart sessions that didn't progress</span>
              </div>
              <div className="dropoff-number">
                <strong>{loading ? "…" : Math.max(totalSessions - checkoutStarted, 0).toLocaleString()}</strong>
                <span>{loading ? "…" : `${(totalSessions ? ((totalSessions - checkoutStarted) / totalSessions) * 100 : 0).toFixed(2)}%`}</span>
              </div>
            </div>
            <div className="dropoff-row">
              <div className="dropoff-icon checkout-icon"><Truck size={18} /></div>
              <div className="dropoff-copy">
                <strong>Checkout without purchase</strong>
                <span>Checkout sessions with no completed order</span>
              </div>
              <div className="dropoff-number">
                <strong>{loading ? "…" : checkoutDropoff.toLocaleString()}</strong>
                <span>{loading ? "…" : `${checkoutDropoffRate.toFixed(2)}%`}</span>
              </div>
            </div>
          </article>

          <article className="panel takeaway-panel" id="review-insights">
            <div className="panel-heading">
              <div>
                <h3>Customer review insights</h3>
                <p>AI-generated themes from the synthetic review dataset</p>
              </div>
              <MessageSquareText size={21} />
            </div>
            <p className="eyebrow">AI-GENERATED · LLAMA 3.2 (LOCAL)</p>
            {aiInsightsLoading ? (
              <p className="takeaway-text">AI is analyzing customer reviews…</p>
            ) : aiInsightsError ? (
              <p role="alert" className="takeaway-text">{aiInsightsError}</p>
            ) : (
              <>
                <div className="chart-insight">
                  <div className="insight-icon"><MessageSquareText size={18} /></div>
                  <p><strong>Overall sentiment: {aiInsights.insights.overallSentiment}</strong><br />{aiInsights.insights.summary}</p>
                </div>
                <div className="review-theme-list">
                  {(aiInsights.insights.mainThemes || []).map((item, index) => (
                    <div className="dropoff-row" key={`${item.theme}-${index}`}>
                      <div className="dropoff-icon checkout-icon"><MessageSquareText size={18} /></div>
                      <div className="dropoff-copy">
                        <strong>{item.theme}</strong>
                        <span>{item.sentiment} sentiment</span>
                        {item.evidence && <span>{item.evidence}</span>}
                      </div>
                      <div className="dropoff-number">
                        <strong>{item.evidenceCount}</strong>
                        <span>{item.evidenceCount === 1 ? "mention" : "mentions"}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {(aiInsights.insights.recommendations || []).length > 0 && (
                  <div className="chart-insight">
                    <div className="insight-icon"><TrendingUp size={18} /></div>
                    <p><strong>AI recommendation:</strong> {aiInsights.insights.recommendations.join(" ")}</p>
                  </div>
                )}
                {(aiInsights.insights.limitations || []).length > 0 && (
                  <p className="takeaway-footer">Limitation: {aiInsights.insights.limitations.join(" ")}</p>
                )}
              </>
            )}
            <span className="takeaway-footer">{aiInsights?.reviewCount ?? 0} reviews analyzed · Local model: {aiInsights?.model || "llama3.2:3b"} · Synthetic sample</span>
          </article>
        </section>

        <section className="bottom-grid" aria-label="Product insight">
          <article className="panel takeaway-panel product-insight-panel">
            <div className="takeaway-icon"><MessageSquareText size={21} /></div>
            <p className="eyebrow">PRODUCT INSIGHT · DATA-DRIVEN</p>
            <h3>Signals to investigate, not conclusions to assume.</h3>
            <p className="takeaway-text">{productInsightText}</p>
            <span className="takeaway-footer">
              Synthetic sample · Rule-based analysis · Association does not prove causation
            </span>
          </article>
        </section>

        <footer className="page-footer">
          <span>ShopPulse · Product Analytics</span>
          <span>Portfolio demo · Synthetic data only</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
