'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import type { LengthBucket, SessionResponse } from '@/types';
import { SITUATIONS, LENGTH_BUCKETS } from '@/types';

interface Props {
  onStart: (session: SessionResponse) => void;
}

export function PracticeSettings({ onStart }: Props) {
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);
  const [selectedLengths, setSelectedLengths] = useState<LengthBucket[]>(['S', 'M']);
  const [questionCount, setQuestionCount] = useState(10);
  const [reviewPriority, setReviewPriority] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSituation = (value: string) => {
    setSelectedSituations(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  };

  const toggleLength = (value: LengthBucket) => {
    setSelectedLengths(prev =>
      prev.includes(value)
        ? prev.filter(l => l !== value)
        : [...prev, value]
    );
  };

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await api.startSession({
        situations: selectedSituations,
        length_buckets: selectedLengths.length > 0 ? selectedLengths : ['S', 'M', 'L', 'XL'],
        question_count: questionCount,
        review_priority: reviewPriority,
      });
      onStart(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'セッションの開始に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>学習設定</CardTitle>
        <CardDescription>シチュエーションと文の長さを選択してください</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Situations */}
        <div className="space-y-3">
          <Label>シチュエーション（複数選択可、未選択で全て）</Label>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map(({ value, label }) => (
              <Badge
                key={value}
                variant={selectedSituations.includes(value) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleSituation(value)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Length */}
        <div className="space-y-3">
          <Label>文の長さ（複数選択可）</Label>
          <div className="flex flex-wrap gap-2">
            {LENGTH_BUCKETS.map(({ value, label, description }) => (
              <Badge
                key={value}
                variant={selectedLengths.includes(value) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleLength(value)}
              >
                {label} ({description})
              </Badge>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-3">
          <Label htmlFor="questionCount">出題数</Label>
          <div className="flex items-center gap-4">
            <Input
              id="questionCount"
              type="number"
              min={1}
              max={100}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">問</span>
          </div>
        </div>

        {/* Review Priority */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="reviewPriority"
            checked={reviewPriority}
            onChange={(e) => setReviewPriority(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="reviewPriority" className="cursor-pointer">
            復習優先モード（期限切れの問題を優先）
          </Label>
        </div>

        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        <Button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? '読み込み中...' : '学習を開始'}
        </Button>
      </CardContent>
    </Card>
  );
}
