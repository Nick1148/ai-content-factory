/**
 * 데이터 수집기 공통 타입 정의
 */

export interface ArxivPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  categories: string[];
  publishedDate: string;
  pdfUrl: string;
  arxivUrl: string;
  score: number;
}
