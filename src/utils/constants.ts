export const CAMPAIGN_STATUSES = [
  { value: "ACTIVE", label: "Active", color: "green" },
  { value: "PAUSED", label: "Paused", color: "yellow" },
  { value: "DELETED", label: "Deleted", color: "red" },
  { value: "ARCHIVED", label: "Archived", color: "gray" },
];

export const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

export const METRIC_DEFINITIONS = {
  impressions: "The number of times your ads were shown",
  clicks: "The number of clicks on your ads",
  ctr: "Click-through rate - the percentage of people who clicked your ad",
  cpc: "Cost per click - average amount spent for each click",
  cpm: "Cost per thousand impressions",
  spend: "Total amount spent on your ads",
  conversions: "Number of desired actions taken",
  roas: "Return on ad spend - revenue generated per dollar spent",
};

export const CAMPAIGN_OBJECTIVES = [
  {
    value: "OUTCOME_AWARENESS",
    label: "Brand Awareness",
    description: "Increase awareness of your brand, business, or service",
    icon: "👁️",
  },
  {
    value: "OUTCOME_TRAFFIC",
    label: "Traffic",
    description: "Drive traffic to your website or app",
    icon: "🚗",
  },
  {
    value: "OUTCOME_ENGAGEMENT",
    label: "Engagement",
    description: "Get more video views, post engagement, or page likes",
    icon: "❤️",
  },
  {
    value: "OUTCOME_LEADS",
    label: "Lead Generation",
    description: "Collect leads for your business",
    icon: "📧",
  },
  {
    value: "OUTCOME_APP_PROMOTION",
    label: "App Promotion",
    description: "Get more app installs or engagement",
    icon: "📱",
  },
  {
    value: "OUTCOME_SALES",
    label: "Sales",
    description: "Drive online and offline sales",
    icon: "💰",
  },
];

export const BUDGET_TYPES = [
  {
    value: "DAILY",
    label: "Daily Budget",
    description: "Set a daily spending limit",
  },
  {
    value: "LIFETIME",
    label: "Lifetime Budget",
    description: "Set a total budget for the entire campaign",
  },
];

export const AD_PLACEMENTS = [
  { value: "facebook", label: "Facebook Feed", checked: true },
  { value: "instagram", label: "Instagram Feed", checked: true },
  { value: "facebook_stories", label: "Facebook Stories", checked: false },
  { value: "instagram_stories", label: "Instagram Stories", checked: false },
  { value: "messenger", label: "Messenger", checked: false },
  { value: "audience_network", label: "Audience Network", checked: false },
];

export const TARGETING_AGES = Array.from({ length: 52 }, (_, i) => ({
  value: i + 13,
  label: `${i + 13}${i === 51 ? "+" : ""}`,
}));

export const TARGETING_GENDERS = [
  { value: "all", label: "All Genders" },
  { value: "1", label: "Men" },
  { value: "2", label: "Women" },
];

export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "IN", label: "India" },
  { value: "MX", label: "Mexico" },
];

export const CALL_TO_ACTIONS = [
  { value: "LEARN_MORE", label: "Learn More" },
  { value: "SHOP_NOW", label: "Shop Now" },
  { value: "SIGN_UP", label: "Sign Up" },
  { value: "DOWNLOAD", label: "Download" },
  { value: "GET_QUOTE", label: "Get Quote" },
  { value: "CONTACT_US", label: "Contact Us" },
  { value: "BOOK_TRAVEL", label: "Book Now" },
  { value: "WATCH_MORE", label: "Watch Video" },
];
