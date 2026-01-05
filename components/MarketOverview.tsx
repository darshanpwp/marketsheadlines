'use client';

import { useEffect, useState } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketOverview() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated market data for demonstration
    const mockData: MarketData[] = [
      { symbol: 'S&P 500', price: 4783.45, change: 12.34, changePercent: 0.26 },
      { symbol: 'NASDAQ', price: 15003.22, change: -45.18, changePercent: -0.30 },
      { symbol: 'DOW 30', price: 37689.54, change: 158.23, changePercent: 0.42 },
      { symbol: 'FTSE 100', price: 7694.12, change: 5.43, changePercent: 0.07 },
    ];

    setMarkets(mockData);
    setLoading(false);
  }, []);

  return (
    <div className="mb-5 market-widget">
      <h3 className="h4 fw-bold mb-4 market-title">
        Market Overview
      </h3>
      <div className="d-flex flex-column">
        {loading ? (
          <div className="placeholder-glow">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="placeholder col-12 mb-3 rounded" style={{ height: '60px' }}></div>
            ))}
          </div>
        ) : (
          markets.map((market, index) => (
            <div
              key={market.symbol}
              className={`d-flex justify-content-between align-items-center py-3 ${index !== markets.length - 1 ? 'border-bottom' : ''} hover-bg-light transition-all`}
            >
              <div>
                <div className="fw-bold mb-1 market-item-name">{market.symbol}</div>
                <div className="h5 mb-0 fw-bold">{market.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-end">
                <div className={`d-flex align-items-center justify-content-end fw-bold market-trend ${market.change >= 0 ? 'market-trend-up' : 'market-trend-down'}`}>
                  <span className="me-2">
                    {market.change >= 0 ? (
                      <i className="fa-solid fa-arrow-trend-up"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-trend-down"></i>
                    )}
                  </span>
                  {market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-3 border-top text-center text-muted market-footer-note">
        Market data delayed by 15 minutes
      </div>
    </div>
  );
}

