import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { formatCompactCurrency, formatCurrency, formatDate, formatPercent, formatSupply } from '@/lib/format';
import type { CoinDetailData } from '@/lib/coingecko';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-small text-muted-foreground">{label}</span>
      <span className="text-small tabular-nums">{value}</span>
    </div>
  );
}

export function CoinStats({ coin }: { coin: CoinDetailData }) {
  const md = coin.market_data;
  const athPositive = md.ath_change_percentage.usd >= -0.0001 ? md.ath_change_percentage.usd >= 0 : false;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row label="Market cap" value={formatCompactCurrency(md.market_cap.usd)} />
        <Row label="24h volume" value={formatCompactCurrency(md.total_volume.usd)} />
        <Row label="Circulating supply" value={`${formatSupply(md.circulating_supply)} ${coin.symbol.toUpperCase()}`} />
        <Row label="Total supply" value={md.total_supply ? `${formatSupply(md.total_supply)} ${coin.symbol.toUpperCase()}` : '—'} />
        <Row label="Max supply" value={md.max_supply ? `${formatSupply(md.max_supply)} ${coin.symbol.toUpperCase()}` : '—'} />
        <div className="h-px bg-border" />
        <Row label="All-time high" value={formatCurrency(md.ath.usd)} />
        <Row
          label="ATH change"
          value={
            <Badge variant={athPositive ? 'success' : 'destructive'}>{formatPercent(md.ath_change_percentage.usd)}</Badge>
          }
        />
        <Row label="ATH date" value={formatDate(md.ath_date.usd)} />
      </CardContent>
    </Card>
  );
}
