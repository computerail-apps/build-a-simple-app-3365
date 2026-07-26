import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { getMarkets } from '@/lib/coingecko';
import { formatUsd, formatCompactNumber, formatPercent } from '@/lib/format';
import { Sparkline } from '@/components/Sparkline';

export function CoinTable() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['markets'],
    queryFn: getMarkets,
    refetchInterval: 45_000,
    staleTime: 30_000,
  });

  const filtered = (data ?? []).filter((c) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {isFetching && !isLoading && (
          <span className="text-micro text-muted-foreground whitespace-nowrap">Updating…</span>
        )}
      </div>

      {isLoading ? (
        <CenteredSpinner label="Loading market data" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load market data</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{(error as Error).message}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="w-fit">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={20} />}
          title="No coins match your search"
          description="Try a different name or symbol."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="hidden grid-cols-[2.5rem_1.5fr_1fr_1fr_1fr_1fr_8rem] gap-4 border-b border-border px-6 py-3 text-micro uppercase tracking-wide text-muted-foreground md:grid">
              <span>#</span>
              <span>Coin</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h</span>
              <span className="text-right">Market Cap</span>
              <span className="text-right">Volume (24h)</span>
              <span className="text-right">7d Chart</span>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((coin) => {
                const change = coin.price_change_percentage_24h;
                const positive = (change ?? 0) >= 0;
                const sparkline = coin.sparkline_in_7d?.price ?? [];
                return (
                  <button
                    key={coin.id}
                    onClick={() => navigate(`/coin/${coin.id}`)}
                    className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-6 py-3 text-left transition-colors hover:bg-surface-elevated focus:outline-none focus-visible:bg-surface-elevated md:grid-cols-[2.5rem_1.5fr_1fr_1fr_1fr_1fr_8rem]"
                  >
                    <span className="text-small tabular-nums text-muted-foreground">{coin.market_cap_rank ?? '—'}</span>
                    <span className="flex items-center gap-3 min-w-0">
                      <img src={coin.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-body text-foreground">{coin.name}</span>
                        <span className="truncate text-micro uppercase text-muted-foreground">{coin.symbol}</span>
                      </span>
                    </span>
                    <span className="hidden text-right text-small tabular-nums text-foreground md:block">
                      {formatUsd(coin.current_price)}
                    </span>
                    <span className="hidden text-right md:block">
                      <Badge variant={positive ? 'success' : 'destructive'} className="tabular-nums">
                        {formatPercent(change)}
                      </Badge>
                    </span>
                    <span className="hidden text-right text-small tabular-nums text-muted-foreground md:block">
                      {formatCompactNumber(coin.market_cap)}
                    </span>
                    <span className="hidden text-right text-small tabular-nums text-muted-foreground md:block">
                      {formatCompactNumber(coin.total_volume)}
                    </span>
                    <span className="hidden justify-end md:flex">
                      <Sparkline data={sparkline} positive={positive} />
                    </span>
                    <span className="flex flex-col items-end gap-1 md:hidden">
                      <span className="text-small tabular-nums text-foreground">{formatUsd(coin.current_price)}</span>
                      <Badge variant={positive ? 'success' : 'destructive'} className="tabular-nums">
                        {formatPercent(change)}
                      </Badge>
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
