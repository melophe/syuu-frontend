'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import type { PracticeQuestion, AnswerResult, SessionCompleteResponse } from '@/types';

interface Props {
  sessionId: string;
  firstQuestion: PracticeQuestion;
  totalQuestions: number;
  onComplete: (result: SessionCompleteResponse) => void;
}

type Phase = 'question' | 'result';

export function PracticeSession({ sessionId, firstQuestion, totalQuestions, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion>(firstQuestion);
  const [phase, setPhase] = useState<Phase>('question');
  const [userInput, setUserInput] = useState('');
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [correctCount, setCorrectCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const responseTimeMs = Date.now() - startTime;

    try {
      const result = await api.submitAnswer(
        sessionId,
        currentQuestion.item_id,
        userInput.trim(),
        responseTimeMs
      );

      setAnswerResult(result);
      if (result.is_correct) {
        setCorrectCount(prev => prev + 1);
      }
      setPhase('result');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, currentQuestion, userInput, startTime, isLoading]);

  const handleNext = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.getNextQuestion(sessionId);

      if ('complete' in response && response.complete) {
        onComplete(response as SessionCompleteResponse);
        return;
      }

      setCurrentQuestion(response as PracticeQuestion);
      setUserInput('');
      setAnswerResult(null);
      setPhase('question');
    } catch (error) {
      console.error('Next question error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, onComplete]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (phase === 'question') {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  const progress = (currentQuestion.question_number / totalQuestions) * 100;

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>問題 {currentQuestion.question_number} / {totalQuestions}</span>
            <span>正解: {correctCount}</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question Info */}
        <div className="flex gap-2">
          <Badge variant="secondary">{currentQuestion.length_bucket}</Badge>
          <Badge variant="outline">難易度 {currentQuestion.difficulty}</Badge>
        </div>

        {/* Japanese Question */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-lg font-medium">{currentQuestion.japanese}</p>
        </div>

        {phase === 'question' && (
          <>
            {/* Input */}
            <div className="space-y-2">
              <Input
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="英語で入力..."
                className="text-lg"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Enterで回答を送信
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!userInput.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? '送信中...' : '回答する'}
            </Button>
          </>
        )}

        {phase === 'result' && answerResult && (
          <>
            {/* Result */}
            <div className={`p-4 rounded-lg ${
              answerResult.is_correct
                ? 'bg-green-100 dark:bg-green-900/20 border border-green-500'
                : 'bg-red-100 dark:bg-red-900/20 border border-red-500'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${answerResult.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                  {answerResult.is_correct ? '○' : '×'}
                </span>
                <span className={`font-bold ${answerResult.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                  {answerResult.is_correct ? '正解！' : '不正解'}
                </span>
              </div>

              {/* User Input */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">あなたの回答:</p>
                <p className="font-mono">{answerResult.user_input}</p>
              </div>

              {/* Model Answers */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">模範解答:</p>
                {answerResult.model_answers.map((answer, i) => (
                  <p key={i} className="font-mono text-green-700 dark:text-green-400">
                    {answer}
                    {answerResult.matched_with === answer && (
                      <Badge variant="default" className="ml-2 text-xs">マッチ</Badge>
                    )}
                  </p>
                ))}
              </div>

              {/* Acceptable Answers */}
              {answerResult.acceptable.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">その他の許容表現:</p>
                  {answerResult.acceptable.map((answer, i) => (
                    <p key={i} className="font-mono text-muted-foreground text-sm">
                      {answer}
                      {answerResult.matched_with === answer && (
                        <Badge variant="secondary" className="ml-2 text-xs">マッチ</Badge>
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? '読み込み中...' : '次の問題へ'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
