interface PriceChartProps {
  points: [number, number][];
  height?: number;
}

export function PriceChart({ points, height = 280 }: PriceChartProps) {
  if (!points || points.length < 2) {
    return <div style={{ height }} className="flex items-center justify-center rounded-lg bg-muted/30 text-small text-muted-foreground">Not enough data</div>;
  }
  const width = 800;
  const prices = points.map((p) => p[1]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p[1] - min) / range) * (height - 16) - 8;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const first = prices[0];
  const last = prices[prices.length - 1];
  const positive = last >= first;
  const stroke = positive ? 'rgb(34 197 94)' : 'rgb(239 68 68)';
  const areaPath = `${path} L${width},${height} L0,${height} Z`;
  const gradientId = 'chart-gradient';
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
