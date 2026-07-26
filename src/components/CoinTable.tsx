import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { SearchX } from 'lucide-react';
import { Sparkline } from '@/components/Sparkline';
import { formatCompactCurrency, formatCurrency, formatPercent } from '@/lib/format';
import type { MarketCoin } from '@/lib/coingecko';

export function CoinTable({ coins }: { coins: MarketCoin[] }) {
  if (coins.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={<SearchX size={20} />}
            title="No coins match your search"
            description="Try a different name or symbol."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="hidden grid-cols-[2.5rem_1fr_7rem_6rem_7rem] gap-4 border-b border-border px-6 py-2 text-micro uppercase tracking-wide text-muted-foreground md:grid">
          <span>#</span>
          <span>Name</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h</span>
          <span className="text-right">7d</span>
        </div>
        <ul className="divide-y divide-border">
          {coins.map((coin) => {
            const change = coin.price_change_percentage_24h ?? 0;
            const positive = change >= 0;
            return (
              <li key={coin.id}>
                <Link
                  to={`/coin/${coin.id}`}
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-6 py-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none md:grid-cols-[2.5rem_1fr_7rem_6rem_7rem]"
                >
                  <span className="text-small tabular-nums text-muted-foreground">{coin.market_cap_rank ?? '—'}</span>
                  <span className="flex items-center gap-3 min-w-0">
                    <img src={coin.image} alt="" className="h-6 w-6 shrink-0 rounded-full" />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-body text-foreground">{coin.name}</span>
                      <span className="text-micro text-muted-foreground">{coin.symbol.toUpperCase()}</span>
                    </span>
                  </span>
                  <span className="hidden text-right text-small tabular-nums md:block">{formatCurrency(coin.current_price)}</span>
                  <span className="hidden justify-self-end md:block">
                    <Badge variant={positive ? 'success' : 'destructive'}>{formatPercent(change)}</Badge>
                  </span>
                  <span className="hidden justify-self-end md:block">
                    <Sparkline data={coin.sparkline_in_7d?.price} positive={positive} />
                  </span>
                  <span className="flex flex-col items-end gap-1 md:hidden">
                    <span className="text-small tabular-nums">{formatCurrency(coin.current_price)}</span>
                    <Badge variant={positive ? 'success' : 'destructive'}>{formatPercent(change)}</Badge>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export function marketCapLabel(value: number): string {
  return formatCompactCurrency(value);
}
