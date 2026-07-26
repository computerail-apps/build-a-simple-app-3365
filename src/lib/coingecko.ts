const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetailData {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    price_change_percentage_24h: number;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    ath_date: { usd: string };
  };
}

export interface MarketChartData {
  prices: [number, number][];
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      detail = '';
    }
    if (res.status === 429) {
      throw new Error('CoinGecko rate limit reached. Please wait a moment and retry.');
    }
    throw new Error(`CoinGecko request failed (${res.status}): ${detail || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTopCoins(perPage = 50): Promise<MarketCoin[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h`;
  const res = await fetch(url);
  return handle<MarketCoin[]>(res);
}

export async function fetchCoinDetail(id: string): Promise<CoinDetailData> {
  const url = `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const res = await fetch(url);
  return handle<CoinDetailData>(res);
}

export async function fetchCoinMarketChart(id: string, days = 7): Promise<MarketChartData> {
  const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  return handle<MarketChartData>(res);
}
