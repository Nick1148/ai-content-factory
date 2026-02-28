export interface ArxivCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
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
