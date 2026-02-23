export type LengthBucket = 'S' | 'M' | 'L' | 'XL';

export interface PracticeSettings {
  situations: string[];
  length_buckets: LengthBucket[];
  question_count: number;
  review_priority: boolean;
  custom_topic?: string;
}

export interface PracticeQuestion {
  item_id: string;
  japanese: string;
  length_bucket: LengthBucket;
  difficulty: number;
  question_number: number;
  total_questions: number;
}

export interface CoachFeedback {
  natural_answer: string;    // ✅ 自然で良い解答
  alternatives: string[];    // 🔁 言い換え
  grammar_point: string;     // 🧠 ポイント
  common_mistake: string;    // 🪵 よくあるミス
  encouragement: string;     // 励まし
}

export interface AnswerResult {
  is_correct: boolean;
  user_input: string;
  model_answers: string[];
  acceptable: string[];
  matched_with?: string;
  explanation?: string;
  feedback?: CoachFeedback;  // コーチフィードバック
}

export interface SessionResponse {
  session_id: string;
  total_questions: number;
  first_question?: PracticeQuestion;
}

export interface SessionCompleteResponse {
  complete: boolean;
  total: number;
  correct: number;
  accuracy_rate: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface StatsSummary {
  total_answers: number;
  correct_answers: number;
  accuracy_rate: number;
  avg_response_ms: number;
  due_review_count: number;
  today_answers: number;
  today_correct: number;
  week_answers: number;
  week_correct: number;
  by_length_bucket: Record<LengthBucket, BucketStats>;
  by_situation: Record<string, BucketStats>;
}

export interface BucketStats {
  total: number;
  correct: number;
  accuracy: number;
}

export interface Weakness {
  category: string;
  type: 'situation' | 'length';
  total: number;
  correct: number;
  accuracy: number;
}

export const SITUATIONS = [
  { value: 'incident', label: '障害対応' },
  { value: 'deploy', label: 'デプロイ' },
  { value: 'review', label: '設計レビュー' },
  { value: 'request', label: '依頼・お願い' },
  { value: 'progress', label: '進捗報告' },
  { value: 'casual', label: '雑談' },
  { value: 'technical', label: '技術的議論' },
  { value: 'meeting', label: 'ミーティング' },
] as const;

export const LENGTH_BUCKETS: { value: LengthBucket; label: string; description: string }[] = [
  { value: 'S', label: 'S', description: '~6語' },
  { value: 'M', label: 'M', description: '7-12語' },
  { value: 'L', label: 'L', description: '13-20語' },
  { value: 'XL', label: 'XL', description: '21語~' },
];
