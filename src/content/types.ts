/**
 * 콘텐츠 관련 타입 정의
 */

export interface PaperExplanation {
  paperId: string;
  titleOriginal: string;
  titleKo: string;
  tldr: string;
  summary: string;
  keyFindings: string[];
  whyItMatters: string;
  technicalDetail: string;
}

export interface ProcessedPaper {
  paper: import('../collectors/types.js').ArxivPaper;
  explanation: PaperExplanation;
}
