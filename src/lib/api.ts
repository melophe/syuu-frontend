import type {
  PracticeSettings,
  SessionResponse,
  PracticeQuestion,
  AnswerResult,
  SessionCompleteResponse,
  StatsSummary,
  Weakness,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async googleCallback(accessToken: string) {
    return this.fetch<{
      access_token: string;
      refresh_token: string;
      user: { id: string; email: string; name: string };
    }>('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    });
  }

  // Practice
  async startSession(settings: PracticeSettings): Promise<SessionResponse> {
    return this.fetch<SessionResponse>('/api/practice/start', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getNextQuestion(sessionId: string): Promise<PracticeQuestion | SessionCompleteResponse> {
    return this.fetch<PracticeQuestion | SessionCompleteResponse>(
      `/api/practice/${sessionId}/next`
    );
  }

  async submitAnswer(
    sessionId: string,
    itemId: string,
    userInput: string,
    responseTimeMs: number
  ): Promise<AnswerResult> {
    return this.fetch<AnswerResult>(`/api/practice/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({
        item_id: itemId,
        user_input: userInput,
        response_time_ms: responseTimeMs,
      }),
    });
  }

  async endSession(sessionId: string): Promise<void> {
    await this.fetch(`/api/practice/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async getHint(sessionId: string, itemId: string, level: number): Promise<{ hint: string; level: number }> {
    return this.fetch<{ hint: string; level: number }>(`/api/practice/${sessionId}/hint`, {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, level }),
    });
  }

  // Stats
  async getStatsSummary(): Promise<StatsSummary> {
    return this.fetch<StatsSummary>('/api/stats/summary');
  }

  async getWeaknesses(): Promise<{ weaknesses: Weakness[] }> {
    return this.fetch<{ weaknesses: Weakness[] }>('/api/stats/weakness');
  }
}

export const api = new ApiClient();
