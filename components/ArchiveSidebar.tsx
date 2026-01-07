import SearchWidget from './SearchWidget';
import CategoryList from './CategoryList';
import MarketOverview from './MarketOverview';
import { MarketTicker } from '@/types/wordpress';

interface ArchiveSidebarProps {
    tickers: MarketTicker[];
}

export default function ArchiveSidebar({ tickers }: ArchiveSidebarProps) {
    return (
        <div className="sticky-sidebar">
            <SearchWidget />
            <CategoryList />
            <div className="mt-4">
                <MarketOverview tickers={tickers} />
            </div>
        </div>
    );
}
