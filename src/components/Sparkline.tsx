interface SparklineProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ data, positive, width = 120, height = 36 }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="rounded bg-muted/40" />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const stroke = positive ? 'var(--color-success, #22c55e)' : 'var(--color-destructive, #ef4444)';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={positive ? '#34d399' : '#f87171'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
