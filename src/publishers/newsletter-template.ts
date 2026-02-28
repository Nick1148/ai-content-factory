/**
 * 뉴스레터 이메일 HTML 템플릿 생성
 */

export interface PaperForEmail {
  title: string;
  tldr: string;
  summary: string;
  keyFindings: string[];
  category: string;
  arxivUrl: string;
}

export function generateEmailHtml(papers: PaperForEmail[]): string {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paperCards = papers
    .map(
      (paper) => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">${escapeHtml(paper.category)}</p>
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #111827; line-height: 1.4;">${escapeHtml(paper.title)}</h2>
              <p style="margin: 0 0 16px 0; padding: 12px 16px; background-color: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 8px 8px 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
                <strong>TL;DR:</strong> ${escapeHtml(paper.tldr)}
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #374151; line-height: 1.6;">${escapeHtml(paper.summary)}</p>
              ${
                paper.keyFindings.length > 0
                  ? `
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #111827;">Key Findings:</p>
              <ul style="margin: 0 0 16px 0; padding-left: 20px;">
                ${paper.keyFindings
                  .map(
                    (finding) =>
                      `<li style="margin: 0 0 4px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${escapeHtml(finding)}</li>`
                  )
                  .join("")}
              </ul>`
                  : ""
              }
              <a href="${escapeHtml(paper.arxivUrl)}" style="display: inline-block; padding: 8px 16px; background-color: #2563eb; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 6px;">arXiv 원문 보기</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Paper Daily - ${today}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background-color: #1e3a5f; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em;">AI Paper Daily</h1>
              <p style="margin: 0; font-size: 14px; color: #93c5fd;">${today} - 오늘의 AI 논문 해설</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px; background-color: #ffffff;">
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                안녕하세요! 오늘 주목할 만한 AI 논문 ${papers.length}편을 해설해 드립니다.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${paperCards}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
                AI Content Factory | AI Paper Daily Newsletter
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                <a href="https://ai-content-factory.vercel.app/newsletter" style="color: #6b7280; text-decoration: underline;">구독 설정 변경</a>
                &nbsp;&middot;&nbsp;
                <a href="https://ai-content-factory.vercel.app" style="color: #6b7280; text-decoration: underline;">웹사이트 방문</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
