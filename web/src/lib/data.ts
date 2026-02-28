import { createClient } from "@supabase/supabase-js";
import { ArxivCategory, PaperExplanation } from "./types";

// Supabase 클라이언트 (서버 컴포넌트에서 직접 사용)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type PaperRow = Record<string, unknown> & { paper_explanations?: ExplanationRow[] };
type ExplanationRow = Record<string, unknown>;

function mapPaperRow(row: PaperRow): PaperExplanation {
  const exp: ExplanationRow | null = row.paper_explanations?.[0] ?? null;
  const cats = Array.isArray(row.categories) ? (row.categories as string[]) : [];
  return {
    id: String(row.arxiv_id ?? row.id ?? ""),
    title: String(row.title_ko ?? row.title ?? ""),
    tldr: String(exp?.tldr ?? ""),
    summary: String(exp?.summary ?? ""),
    keyFindings: Array.isArray(exp?.key_findings) ? (exp.key_findings as string[]) : [],
    whyItMatters: String(exp?.why_it_matters ?? ""),
    technicalDetail: String(exp?.technical_detail ?? ""),
    category: String(cats[0] ?? "AI"),
    arxivUrl: String(row.arxiv_url ?? ""),
    publishedDate: String(row.published_date ?? "").slice(0, 10),
    authors: Array.isArray(row.authors) ? (row.authors as string[]) : [],
  };
}

// arXiv 카테고리 정의
export const arxivCategories: ArxivCategory[] = [
  {
    id: "cs.AI",
    name: "Artificial Intelligence",
    description: "인공지능 전반, 지식 표현, 계획, 자연어 이해 등",
    slug: "cs-ai",
  },
  {
    id: "cs.LG",
    name: "Machine Learning",
    description: "기계학습 알고리즘, 이론, 응용",
    slug: "cs-lg",
  },
  {
    id: "cs.CL",
    name: "Computation and Language",
    description: "자연어 처리, 텍스트 분석, 언어 모델",
    slug: "cs-cl",
  },
  {
    id: "cs.CV",
    name: "Computer Vision",
    description: "컴퓨터 비전, 이미지 인식, 객체 탐지",
    slug: "cs-cv",
  },
  {
    id: "stat.ML",
    name: "Machine Learning (Statistics)",
    description: "통계적 기계학습, 베이지안 방법론",
    slug: "stat-ml",
  },
  {
    id: "cs.RO",
    name: "Robotics",
    description: "로봇공학, 자율 시스템, 제어",
    slug: "cs-ro",
  },
  {
    id: "cs.NE",
    name: "Neural and Evolutionary Computing",
    description: "신경망, 진화 연산, 딥러닝 아키텍처",
    slug: "cs-ne",
  },
  {
    id: "cs.IR",
    name: "Information Retrieval",
    description: "정보 검색, 추천 시스템, 웹 검색",
    slug: "cs-ir",
  },
];

// 논문 mock 데이터
export const papers: PaperExplanation[] = [
  {
    id: "reasoning-models-2025",
    title: "Chain-of-Thought Reasoning at Scale: Emergent Abilities in Large Language Models",
    tldr: "100B 파라미터 이상의 LLM에서 Chain-of-Thought 프롬프팅이 수학적 추론 정확도를 47% 향상시킨다는 것을 대규모 실험으로 입증한 논문입니다.",
    summary: "본 연구는 대규모 언어 모델에서 Chain-of-Thought (CoT) 추론의 스케일링 법칙을 체계적으로 분석합니다. 10B부터 500B 파라미터까지 다양한 크기의 모델에서 CoT 프롬프팅의 효과를 측정한 결과, 모델 크기가 특정 임계점을 넘으면 추론 능력이 급격히 향상되는 'emergence' 현상을 확인했습니다. 특히 GSM8K, MATH, ARC 벤치마크에서 100B+ 모델의 CoT 성능이 기존 방법 대비 현저하게 높았습니다.",
    keyFindings: [
      "100B+ 모델에서 CoT 추론 성능이 비선형적으로 급증하는 emergence 현상 확인",
      "자기 일관성(Self-Consistency) 디코딩과 결합 시 추가 12% 성능 향상",
      "소형 모델(10B 이하)에서는 CoT가 오히려 성능을 저하시킬 수 있음",
      "멀티모달 CoT가 텍스트 전용 CoT 대비 시각적 추론에서 23% 우수",
    ],
    whyItMatters: "이 연구는 LLM의 추론 능력 향상을 위한 스케일링 전략에 중요한 시사점을 제공합니다. 모델 크기와 프롬프팅 기법의 상호작용을 이해함으로써, 기업들은 비용 대비 최적의 모델 크기를 선택할 수 있습니다. 또한 소형 모델에서 CoT가 역효과를 낼 수 있다는 발견은 경량 AI 배포 전략에 영향을 미칠 수 있습니다.",
    technicalDetail: "실험은 Transformer 아키텍처 기반 모델을 사용했으며, 파라미터 수 10B, 30B, 70B, 100B, 200B, 500B의 6개 스케일에서 진행되었습니다. CoT 프롬프팅은 few-shot (0, 3, 5, 8-shot) 설정으로 테스트했고, 각 설정에서 temperature 0.7, top-p 0.95의 샘플링을 사용했습니다. Self-Consistency는 각 문제당 40개 경로를 샘플링하여 다수결 투표로 최종 답을 결정했습니다.",
    category: "cs.CL",
    arxivUrl: "https://arxiv.org/abs/2401.00001",
    publishedDate: "2025-02-20",
    authors: ["Wei, J.", "Wang, X.", "Schuurmans, D.", "Le, Q."],
  },
  {
    id: "vision-transformer-efficiency",
    title: "EfficientViT-V3: Hardware-Aware Vision Transformer for Edge Deployment",
    tldr: "모바일/엣지 디바이스에서 ViT를 실시간으로 실행할 수 있게 하는 새로운 아키텍처로, ImageNet에서 기존 EfficientViT 대비 2.3배 빠르면서 정확도는 유지합니다.",
    summary: "Vision Transformer(ViT)의 엣지 디바이스 배포는 높은 연산 비용으로 인해 어려운 과제입니다. 본 논문은 하드웨어 특성을 고려한 새로운 어텐션 메커니즘과 네트워크 구조를 제안합니다. Cascaded Group Attention과 Hardware-Aware Neural Architecture Search를 결합하여, 실제 모바일 하드웨어에서의 latency를 최적화했습니다.",
    keyFindings: [
      "iPhone 15 Pro에서 224x224 이미지 추론 시 2.1ms 달성 (실시간 가능)",
      "ImageNet top-1 정확도 84.2%로 기존 EfficientViT-V2와 동등 수준 유지",
      "Cascaded Group Attention으로 메모리 접근 횟수 60% 감소",
      "ONNX Runtime 및 Core ML 변환 시에도 성능 저하 최소화",
    ],
    whyItMatters: "온디바이스 AI가 점점 중요해지는 시대에, 고성능 비전 모델을 모바일에서 실시간으로 실행할 수 있다는 것은 AR, 자율주행, 의료 영상 등 다양한 분야에 직접적인 영향을 미칩니다. 클라우드 의존도를 줄이고 프라이버시를 보호하면서도 높은 정확도를 유지할 수 있습니다.",
    technicalDetail: "아키텍처는 3단계 피라미드 구조를 사용하며, 각 단계에서 Cascaded Group Attention(CGA) 블록을 사용합니다. CGA는 기존 Multi-Head Attention을 그룹 단위로 분할하고 캐스케이드 방식으로 연결하여 연산량을 줄입니다. NAS는 latency 예측 모델을 기반으로 하며, iPhone Neural Engine, Snapdragon NPU, Google Edge TPU 각각에 특화된 아키텍처를 탐색합니다.",
    category: "cs.CV",
    arxivUrl: "https://arxiv.org/abs/2401.00002",
    publishedDate: "2025-02-19",
    authors: ["Cai, H.", "Gan, C.", "Han, S."],
  },
  {
    id: "multimodal-agents-planning",
    title: "WebAgent-2: Multimodal AI Agents for Autonomous Web Navigation",
    tldr: "GPT-4V 기반의 멀티모달 에이전트가 실제 웹사이트에서 복잡한 태스크를 자율적으로 수행할 수 있으며, 기존 텍스트 전용 에이전트 대비 성공률이 38% 높습니다.",
    summary: "본 연구는 스크린샷 이해와 HTML 분석을 결합한 멀티모달 웹 에이전트를 제안합니다. WebAgent-2는 시각적 페이지 이해, 계층적 태스크 분해, 자기 반성(Self-Reflection) 메커니즘을 통합하여 복잡한 웹 네비게이션 태스크를 자율적으로 수행합니다. Mind2Web, WebArena 벤치마크에서 SOTA 성능을 달성했습니다.",
    keyFindings: [
      "WebArena 벤치마크에서 태스크 성공률 64.2% 달성 (기존 SOTA 46.5%)",
      "시각적 grounding과 HTML 구조 분석의 결합이 핵심 성능 요인",
      "Self-Reflection 모듈로 실패한 액션을 자동으로 수정하여 성공률 15% 향상",
      "실제 전자상거래 사이트에서 장바구니 추가, 결제 등 복잡한 워크플로우 수행 가능",
    ],
    whyItMatters: "자율 웹 에이전트는 RPA(Robotic Process Automation)의 차세대 형태로, 기업 업무 자동화에 혁신적인 변화를 가져올 수 있습니다. 특히 비정형 웹 인터페이스를 이해하고 조작할 수 있다는 점에서, 기존 규칙 기반 자동화의 한계를 극복합니다.",
    technicalDetail: "시스템은 3개 모듈로 구성됩니다: (1) Visual Grounding Module - Set-of-Mark 프롬프팅으로 스크린샷의 인터랙티브 요소를 식별, (2) Task Planner - 복잡한 태스크를 서브태스크로 분해하고 실행 계획 수립, (3) Action Executor - 계획된 액션을 Playwright API로 실행. Self-Reflection은 액션 실행 후 페이지 상태를 재평가하여 예상과 다른 결과가 나오면 대안 액션을 생성합니다.",
    category: "cs.AI",
    arxivUrl: "https://arxiv.org/abs/2401.00003",
    publishedDate: "2025-02-18",
    authors: ["Gur, I.", "Nachum, O.", "Chen, Y.", "Faust, A."],
  },
  {
    id: "diffusion-video-generation",
    title: "StableVideo-3: Temporally Consistent Video Generation with Diffusion Transformers",
    tldr: "텍스트-to-비디오 생성에서 시간적 일관성 문제를 해결한 새로운 Diffusion Transformer 아키텍처로, 30초 이상의 일관된 비디오 생성이 가능합니다.",
    summary: "기존 비디오 생성 모델의 가장 큰 한계인 시간적 불일관성(temporal inconsistency)을 해결하는 새로운 접근법을 제안합니다. Temporal Attention Blocks과 Motion Flow Prediction을 Diffusion Transformer에 통합하여, 프레임 간 객체의 외형, 움직임, 배경이 일관되게 유지되는 고품질 비디오를 생성합니다.",
    keyFindings: [
      "30초(720프레임) 길이의 시간적으로 일관된 비디오 생성 가능",
      "FVD(Frechet Video Distance) 점수에서 기존 SOTA 대비 34% 개선",
      "인간 평가에서 시각적 품질 85.3%, 시간적 일관성 91.2% 선호율",
      "이미지-to-비디오 모드에서 참조 이미지의 스타일/구도 유지율 향상",
    ],
    whyItMatters: "영화, 광고, 교육 콘텐츠 제작 분야에서 AI 비디오 생성의 실용적 활용이 가능해집니다. 특히 30초 이상의 긴 비디오에서도 일관성을 유지할 수 있다는 것은, 프로페셔널 영상 제작 파이프라인에 AI를 통합할 수 있는 중요한 진전입니다.",
    technicalDetail: "아키텍처는 DiT(Diffusion Transformer) 기반으로, 기존 spatial attention 외에 temporal attention layer를 추가합니다. Motion Flow Predictor는 optical flow를 예측하여 프레임 간 변환을 가이드하며, Progressive Generation 전략으로 4프레임 단위로 생성 후 overlap 영역의 latent를 보간하여 긴 비디오를 생성합니다. 학습 데이터는 WebVid-10M과 내부 고품질 비디오 데이터셋을 사용했습니다.",
    category: "cs.CV",
    arxivUrl: "https://arxiv.org/abs/2401.00004",
    publishedDate: "2025-02-17",
    authors: ["Blattmann, A.", "Rombach, R.", "Ling, H.", "Muller, T."],
  },
  {
    id: "rlhf-alignment-safety",
    title: "Constitutional AI v2: Scalable Alignment Without Human Feedback Labels",
    tldr: "인간 피드백 레이블 없이 AI 모델을 정렬(alignment)할 수 있는 Constitutional AI의 개선 버전으로, 안전성과 유용성을 동시에 향상시킵니다.",
    summary: "RLHF(Reinforcement Learning from Human Feedback)의 높은 비용과 레이블링 편향 문제를 해결하기 위해, 헌법적 AI(Constitutional AI)를 확장한 CAI-v2를 제안합니다. 자체 생성된 비평(critique)과 수정(revision)을 활용한 자기 개선 루프로 모델을 정렬하며, 다단계 헌법 규칙 체계로 복잡한 윤리적 상황에서의 판단 능력을 향상시킵니다.",
    keyFindings: [
      "인간 레이블 데이터 없이 RLHF 수준의 안전성 달성 (TruthfulQA에서 92.1%)",
      "다단계 헌법 규칙으로 상충하는 원칙 간의 우선순위 결정 가능",
      "유용성(helpfulness) 점수가 RLHF 대비 5.3% 향상",
      "레드팀 공격 성공률 7.2%로 기존 모델(18.4%) 대비 크게 감소",
    ],
    whyItMatters: "AI 안전성은 산업 전반의 핵심 과제입니다. RLHF의 비용과 확장성 문제를 해결하면서 동등 이상의 안전성을 달성할 수 있다면, 더 많은 조직이 안전한 AI를 배포할 수 있게 됩니다. 특히 인간 레이블러의 편향 문제를 우회할 수 있다는 점이 주목할 만합니다.",
    technicalDetail: "CAI-v2는 3단계 파이프라인으로 작동합니다: (1) 자기 비평 - 모델이 자신의 응답을 헌법 원칙에 비추어 평가, (2) 자기 수정 - 비평 결과를 반영하여 응답을 개선, (3) 정렬 학습 - 원본과 수정된 응답 쌍으로 DPO(Direct Preference Optimization) 학습. 헌법 규칙은 3계층(핵심 안전, 윤리적 가이드라인, 스타일 선호)으로 구성되며, 충돌 시 상위 계층이 우선합니다.",
    category: "cs.AI",
    arxivUrl: "https://arxiv.org/abs/2401.00005",
    publishedDate: "2025-02-16",
    authors: ["Bai, Y.", "Kadavath, S.", "Kundu, S.", "Askell, A."],
  },
];

const PAPER_SELECT = "*, paper_explanations(tldr, summary, key_findings, why_it_matters, technical_detail)";

export async function getAllPapers(): Promise<PaperExplanation[]> {
  const db = getSupabase();
  if (db) {
    try {
      const { data, error } = await db
        .from("papers")
        .select(PAPER_SELECT)
        .order("score", { ascending: false })
        .limit(30);
      if (!error && data && data.length > 0) return (data as PaperRow[]).map(mapPaperRow);
    } catch { /* fall through */ }
  }
  return papers;
}

export async function getPaperById(id: string): Promise<PaperExplanation | undefined> {
  const db = getSupabase();
  if (db) {
    try {
      const { data, error } = await db
        .from("papers")
        .select(PAPER_SELECT)
        .eq("arxiv_id", id)
        .single();
      if (!error && data) return mapPaperRow(data as PaperRow);
    } catch { /* fall through */ }
  }
  return papers.find((p) => p.id === id);
}

export function getAllPaperIds(): string[] {
  return papers.map((p) => p.id);
}

export function getArxivCategories(): ArxivCategory[] {
  return arxivCategories;
}

export function getArxivCategoryBySlug(slug: string): ArxivCategory | undefined {
  return arxivCategories.find((c) => c.slug === slug);
}
