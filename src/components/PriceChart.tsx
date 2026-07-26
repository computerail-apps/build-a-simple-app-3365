import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/format';

interface PriceChartProps {
  prices: [number, number][];
}

export function PriceChart({ prices }: PriceChartProps) {
  const points = prices.map(([ts, price]) => ({ ts, price }));
  const first = points[0]?.price ?? 0;
  const last = points[points.length - 1]?.price ?? 0;
  const positive = last >= first;
  const domain: [number, number] = [
    Math.min(...points.map((p) => p.price)) * 0.995,
    Math.max(...points.map((p) => p.price)) * 1.005,
  ];

  return (
    <div className={positive ? 'h-72 w-full text-success' : 'h-72 w-full text-destructive'}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.28} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="ts"
            tickFormatter={(ts: number) => format(new Date(ts), 'MMM d')}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            axisLine={false}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={domain}
            tickFormatter={(v: number) => formatCurrency(v)}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Price']}
            labelFormatter={(ts: number) => format(new Date(ts), 'MMM d, HH:mm')}
            contentStyle={{ background: 'hsl(var(--surface-elevated, 0 0% 10%))', border: '1px solid hsl(var(--border, 0 0% 20%))', borderRadius: 8 }}
          />
          <Area type="monotone" dataKey="price" stroke="currentColor" strokeWidth={2} fill="url(#priceFill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
