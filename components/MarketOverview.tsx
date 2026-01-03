interface MarketIndex {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface MarketOverviewProps {
  indices?: MarketIndex[];
}

const defaultIndices: MarketIndex[] = [
  { name: 'S&P 500', value: '5,127.79', change: '+1.23%', isPositive: true },
  { name: 'Dow Jones', value: '38,671.69', change: '+0.80%', isPositive: true },
  { name: 'NASDAQ', value: '16,156.33', change: '+1.56%', isPositive: true },
  { name: 'Russell 2000', value: '2,124.55', change: '-0.32%', isPositive: false },
];

export default function MarketOverview({ indices = defaultIndices }: MarketOverviewProps) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h3 className="h5 fw-bold mb-4">Market Overview</h3>
        <ul className="list-group list-group-flush">
          {indices.map((index, idx) => (
            <li key={idx} className="list-group-item border-0 px-0 py-3 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{index.name}</div>
                <div className="small text-secondary">{index.value}</div>
              </div>
              <span className={`badge ${index.isPositive ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
                {index.change}
              </span>
            </li>
          ))}
        </ul>
        <p className="small text-secondary mb-0 mt-3">Data delayed by 15 minutes.</p>
      </div>
    </div>
  );
}

