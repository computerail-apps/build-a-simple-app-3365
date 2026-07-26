import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/cn';

interface SparklineProps {
  data: number[] | undefined;
  positive: boolean;
  className?: string;
}

export function Sparkline({ data, positive, className }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div className={cn('h-8 w-24 rounded bg-muted', className)} />;
  }
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className={cn('h-8 w-24', positive ? 'text-success' : 'text-destructive', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <Line type="monotone" dataKey="v" stroke="currentColor" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
