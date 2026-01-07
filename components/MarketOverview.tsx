import { MarketTicker } from '@/types/wordpress';

interface MarketOverviewProps {
  tickers: MarketTicker[];
}

export default function MarketOverview({ tickers }: MarketOverviewProps) {
  if (!tickers || tickers.length === 0) {
    return null;
  }

  return (
    <div className="card border p-4 shadow-sm rounded-4 market-overview">
      <h3 className="h4 fw-semibold mb-4 font-serif primary-text-blue">
        Market Overview
      </h3>
      <div className="d-flex flex-column gap-3">
        {tickers.map((ticker, index) => (
          <div
            key={ticker.symbol}
            className={`d-flex justify-content-between align-items-center pb-3 ${index !== tickers.length - 1 ? 'border-bottom' : ''}`}
          >
            <div>
              <div className="fw-semibold text-dark mb-1">{ticker.name}</div>
              <div className="h5 mb-0 fw-semibold text-font-family">{ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className={`d-flex align-items-center fw-bold ${ticker.change >= 0 ? 'text-success' : 'text-danger'}`}>
              <span className="me-1">
                {ticker.change >= 0 ? (
                  <i className="fa-solid fa-arrow-trend-up small"></i>
                ) : (
                  <i className="fa-solid fa-arrow-trend-down small"></i>
                )}
              </span>
              <span>
                {ticker.change >= 0 ? '+' : ''}{ticker.change_percent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-3 text-start text-muted small fst-italic">
        Market data delayed by 15 minutes
      </div>
    </div>
  );
}

