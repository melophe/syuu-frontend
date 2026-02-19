'use client';

import { useState } from 'react';
import { PracticeSettings } from '@/components/practice/PracticeSettings';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { SessionResult } from '@/components/practice/SessionResult';
import type { SessionResponse, SessionCompleteResponse } from '@/types';

type AppState = 'settings' | 'practice' | 'result';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('settings');
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const [resultData, setResultData] = useState<SessionCompleteResponse | null>(null);

  const handleStartSession = (data: SessionResponse) => {
    setSessionData(data);
    setAppState('practice');
  };

  const handleSessionComplete = (result: SessionCompleteResponse) => {
    setResultData(result);
    setAppState('result');
  };

  const handleRestart = () => {
    setSessionData(null);
    setResultData(null);
    setAppState('settings');
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Syun-Eng</h1>
          <p className="text-muted-foreground">瞬間英作文トレーニング</p>
        </header>

        {appState === 'settings' && (
          <PracticeSettings onStart={handleStartSession} />
        )}

        {appState === 'practice' && sessionData && (
          <PracticeSession
            sessionId={sessionData.session_id}
            firstQuestion={sessionData.first_question!}
            totalQuestions={sessionData.total_questions}
            onComplete={handleSessionComplete}
          />
        )}

        {appState === 'result' && resultData && (
          <SessionResult
            result={resultData}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  );
}
