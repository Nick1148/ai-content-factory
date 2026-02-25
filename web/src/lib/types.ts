export interface AITool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  pricing: "free" | "freemium" | "paid" | "open-source";
  url: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  launchDate: string;
  trending: boolean;
  featured: boolean;
  tags: string[];
  features: string[];
  pros: string[];
  cons: string[];
}

export type ToolCategory =
  | "text-generation"
  | "image-generation"
  | "code-assistant"
  | "productivity"
  | "data-analysis"
  | "video-generation"
  | "audio"
  | "chatbot"
  | "automation"
  | "design";

export interface CategoryInfo {
  slug: ToolCategory;
  name: string;
  nameKo: string;
  description: string;
  icon: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export interface PaperExplanation {
  id: string;
  title: string;
  tldr: string;
  summary: string;
  keyFindings: string[];
  whyItMatters: string;
  technicalDetail: string;
  category: string;
  arxivUrl: string;
  publishedDate: string;
  authors: string[];
}
