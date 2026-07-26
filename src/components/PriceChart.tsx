interface PriceChartProps {
  points: [number, number][];
  positive: boolean;
}

export function PriceChart({ points, positive }: PriceChartProps) {
  if (!points || points.length < 2) {
    return <div className="flex h-72 w-full items-center justify-center rounded-lg bg-muted text-small text-muted-foreground">Not enough data</div>;
  }

  const width = 800;
  const height = 280;
  const padding = 8;

  const prices = points.map((p) => p[1]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const step = (width - padding * 2) / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = padding + i * step;
    const y = padding + (height - padding * 2) * (1 - (p[1] - min) / range);
    return [x, y] as [number, number];
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c[0].toFixed(2)},${c[1].toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1][0].toFixed(2)},${height - padding} L${coords[0][0].toFixed(2)},${height - padding} Z`;

  const stroke = positive ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  const gradientId = positive ? 'priceChartGradientUp' : 'priceChartGradientDown';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
