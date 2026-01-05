import Link from 'next/link';

export default function ArchiveSidebar() {
    return (
        <div className="sticky-top" style={{ top: '8rem', zIndex: 10 }}>
            {/* Search Widget */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 font-serif">Search News</h5>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control bg-light border-0 py-2"
                            placeholder="Type keywords..."
                            aria-label="Search"
                        />
                        <button className="btn btn-primary" type="button">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 font-serif">Date Range</h5>
                    <div className="d-flex flex-column gap-2">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="dateFilter" id="dateFilterAll" defaultChecked />
                            <label className="form-check-label small" htmlFor="dateFilterAll">
                                All Time
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="dateFilter" id="dateFilter24h" />
                            <label className="form-check-label small" htmlFor="dateFilter24h">
                                Last 24 Hours
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="dateFilter" id="dateFilter7d" />
                            <label className="form-check-label small" htmlFor="dateFilter7d">
                                Last 7 Days
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="dateFilter" id="dateFilter30d" />
                            <label className="form-check-label small" htmlFor="dateFilter30d">
                                Last 30 Days
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 font-serif">Categories</h5>
                    <div className="d-flex flex-column gap-2">
                        {['Market News', 'Economics', 'Policy & Regulation', 'Global Markets', 'Sectors', 'Analysis'].map((cat, idx) => (
                            <div key={idx} className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id={`cat${idx}`} />
                                <label className="form-check-label small" htmlFor={`cat${idx}`}>
                                    {cat}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subscribe Widget */}
            <div className="bg-primary text-white rounded-4 p-4 text-center position-relative overflow-hidden">
                <div className="position-relative z-1">
                    <i className="fa-regular fa-envelope-open fa-2x mb-3 opacity-75"></i>
                    <h5 className="fw-bold mb-2">Daily Briefing</h5>
                    <p className="small opacity-75 mb-3">Get the top market stories delivered to your inbox every morning.</p>
                    <button className="btn btn-light btn-sm w-100 fw-bold text-primary rounded-pill">Subscribe Now</button>
                </div>
            </div>
        </div>
    );
}
