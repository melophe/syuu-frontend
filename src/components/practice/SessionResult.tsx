'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SessionCompleteResponse } from '@/types';

interface Props {
  result: SessionCompleteResponse;
  onRestart: () => void;
}

export function SessionResult({ result, onRestart }: Props) {
  const getGradeMessage = (accuracy: number): { message: string; emoji: string } => {
    if (accuracy >= 90) return { message: '素晴らしい！', emoji: '🎉' };
    if (accuracy >= 70) return { message: 'よくできました！', emoji: '👏' };
    if (accuracy >= 50) return { message: 'もう少し！', emoji: '💪' };
    return { message: '頑張りましょう！', emoji: '📚' };
  };

  const grade = getGradeMessage(result.accuracy_rate);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{grade.emoji}</div>
        <CardTitle className="text-2xl">{grade.message}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">
            {result.correct} / {result.total}
          </div>
          <p className="text-muted-foreground">正解数</p>
        </div>

        {/* Accuracy */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>正答率</span>
            <span className="font-bold">{result.accuracy_rate.toFixed(1)}%</span>
          </div>
          <Progress value={result.accuracy_rate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">{result.correct}</div>
            <div className="text-sm text-muted-foreground">正解</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-red-600">{result.total - result.correct}</div>
            <div className="text-sm text-muted-foreground">不正解</div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">次のおすすめ:</p>
          <ul className="text-sm space-y-1">
            {result.accuracy_rate < 70 && (
              <li>• 文の長さを短くして練習してみましょう</li>
            )}
            {result.accuracy_rate >= 70 && result.accuracy_rate < 90 && (
              <li>• 同じシチュエーションで続けて練習しましょう</li>
            )}
            {result.accuracy_rate >= 90 && (
              <li>• より長い文や新しいシチュエーションに挑戦しましょう</li>
            )}
            <li>• 復習優先モードで間隔を空けて復習しましょう</li>
          </ul>
        </div>

        <Button onClick={onRestart} className="w-full" size="lg">
          もう一度練習する
        </Button>
      </CardContent>
    </Card>
  );
}
