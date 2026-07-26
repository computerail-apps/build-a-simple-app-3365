const BASE = 'https://api.coingecko.com/api/v3';

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

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { small: string; large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number };
    ath_date: { usd: string };
    ath_change_percentage: { usd: number };
    price_change_percentage_24h: number;
  };
}

export interface MarketChart {
  prices: [number, number][];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('CoinGecko rate limit reached. Please wait a moment and retry.');
    }
    throw new Error(`CoinGecko request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function getMarkets(): Promise<MarketCoin[]> {
  const url = `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`;
  return fetchJson<MarketCoin[]>(url);
}

export async function getCoin(id: string): Promise<CoinDetail> {
  const url = `${BASE}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
  return fetchJson<CoinDetail>(url);
}

export async function getMarketChart(id: string, days = 7): Promise<MarketChart> {
  const url = `${BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}`;
  return fetchJson<MarketChart>(url);
}
