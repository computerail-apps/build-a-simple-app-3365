import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/Card';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { PriceChart } from '@/components/PriceChart';
import { CoinStats } from '@/components/CoinStats';
import { fetchCoinDetail, fetchCoinMarketChart } from '@/lib/coingecko';
import { formatCurrency, formatPercent } from '@/lib/format';

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const detailQuery = useQuery({
    queryKey: ['coin-detail', id],
    queryFn: () => fetchCoinDetail(id as string),
    enabled: Boolean(id),
    refetchInterval: 60_000,
  });

  const chartQuery = useQuery({
    queryKey: ['coin-chart', id],
    queryFn: () => fetchCoinMarketChart(id as string, 7),
    enabled: Boolean(id),
    refetchInterval: 60_000,
  });

  const isLoading = detailQuery.isLoading || chartQuery.isLoading;
  const error = detailQuery.error || chartQuery.error;

  return (
    <Container>
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to dashboard
      </Button>

      {isLoading ? (
        <div className="py-16">
          <CenteredSpinner label="Loading coin data" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load this coin</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{(error as Error).message}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                detailQuery.refetch();
                chartQuery.refetch();
              }}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : detailQuery.data && chartQuery.data ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <img src={detailQuery.data.image.large} alt="" className="h-12 w-12 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-h1 text-foreground">{detailQuery.data.name}</h1>
                <span className="text-body text-muted-foreground">{detailQuery.data.symbol.toUpperCase()}</span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-h2 tabular-nums text-foreground">
                  {formatCurrency(detailQuery.data.market_data.current_price.usd)}
                </span>
                <Badge variant={detailQuery.data.market_data.price_change_percentage_24h >= 0 ? 'success' : 'destructive'}>
                  {formatPercent(detailQuery.data.market_data.price_change_percentage_24h)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>7-day price</CardTitle>
                  <CardDescription>Hourly price series in USD, via CoinGecko.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PriceChart prices={chartQuery.data.prices} />
                </CardContent>
              </Card>
            </div>
            <aside className="md:col-span-4">
              <CoinStats coin={detailQuery.data} />
            </aside>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
