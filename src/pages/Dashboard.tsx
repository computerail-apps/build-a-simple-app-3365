import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, RefreshCw } from 'lucide-react';
import { Container } from '@/lib/ui/Container';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { CoinTable } from '@/components/CoinTable';
import { fetchTopCoins } from '@/lib/coingecko';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['top-coins'],
    queryFn: () => fetchTopCoins(50),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <Container>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-display text-foreground">Market pulse</h1>
        <p className="text-body text-muted-foreground">
          Live prices, 24h moves, and 7-day trends for the top coins by market cap, straight from CoinGecko.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching} aria-label="Refresh">
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : undefined} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16">
          <CenteredSpinner label="Loading market data" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load market data</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{(error as Error).message}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <CoinTable coins={filtered} />
      )}
    </Container>
  );
}
