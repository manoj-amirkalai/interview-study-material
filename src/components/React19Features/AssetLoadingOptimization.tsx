import { useState, useEffect, useRef } from 'react';
import { preinitializeModule, preloadModule, preload } from 'react-dom';
import './AssetLoadingOptimization.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LoadingEvent {
  id: string;
  type: 'preinitialize' | 'preload' | 'preload-style' | 'preload-font';
  url: string;
  timestamp: number;
  status: 'pending' | 'loaded' | 'failed';
  duration?: number;
}

interface ModuleStatus {
  url: string;
  loaded: boolean;
  loadTime: number;
  size: string;
}

// ============================================================================
// MOCK MODULE LOADING SIMULATION
// ============================================================================

// Simulate module loading with realistic delays
const mockModules: Record<string, number> = {
  'https://cdn.example.com/auth-sdk.js': 800,
  'https://cdn.example.com/analytics.js': 1200,
  'https://cdn.example.com/chart-library.js': 2000,
  'https://cdn.example.com/ml-library.js': 3000,
  'https://cdn.example.com/premium-feature.js': 1500,
};

const mockStyles: Record<string, number> = {
  '/styles/critical.css': 400,
  '/styles/dashboard.css': 600,
  '/styles/premium.css': 500,
};

const mockFonts: Record<string, number> = {
  '/fonts/roboto.woff2': 200,
  '/fonts/inter.woff2': 180,
};

// Simulate actual loading
const simulateModuleLoad = (url: string): Promise<number> => {
  return new Promise((resolve) => {
    const delay = mockModules[url] || Math.random() * 2000 + 500;
    setTimeout(() => resolve(delay), delay);
  });
};

// ============================================================================
// FEATURE 1: PREINITIALIZE VS PRELOAD COMPARISON
// ============================================================================

function ModuleLoadingComparison() {
  const [events, setEvents] = useState<LoadingEvent[]>([]);
  const [stats, setStats] = useState({ preinitialized: 0, preloaded: 0 });

  const addEvent = (event: Omit<LoadingEvent, 'id'>) => {
    const id = `event-${Date.now()}-${Math.random()}`;
    setEvents(prev => [...prev, { ...event, id }]);
  };

  const handlePreinitializeModule = async (url: string) => {
    const startTime = Date.now();
    addEvent({
      type: 'preinitialize',
      url,
      timestamp: startTime,
      status: 'pending',
    });

    try {
      const duration = await simulateModuleLoad(url);
      const endTime = Date.now();

      setEvents(prev =>
        prev.map(e =>
          e.type === 'preinitialize' && e.url === url
            ? { ...e, status: 'loaded', duration: endTime - startTime }
            : e
        )
      );

      setStats(s => ({ ...s, preinitialized: s.preinitialized + 1 }));
    } catch (err) {
      setEvents(prev =>
        prev.map(e =>
          e.type === 'preinitialize' && e.url === url
            ? { ...e, status: 'failed' }
            : e
        )
      );
    }
  };

  const handlePreloadModule = async (url: string) => {
    const startTime = Date.now();
    addEvent({
      type: 'preload',
      url,
      timestamp: startTime,
      status: 'pending',
    });

    try {
      const duration = await simulateModuleLoad(url);
      const endTime = Date.now();

      setEvents(prev =>
        prev.map(e =>
          e.type === 'preload' && e.url === url
            ? { ...e, status: 'loaded', duration: endTime - startTime }
            : e
        )
      );

      setStats(s => ({ ...s, preloaded: s.preloaded + 1 }));
    } catch (err) {
      setEvents(prev =>
        prev.map(e =>
          e.type === 'preload' && e.url === url
            ? { ...e, status: 'failed' }
            : e
        )
      );
    }
  };

  return (
    <div className="feature-section">
      <h3>1. preinitializeModule vs preloadModule</h3>
      <p className="description">
        Compare how critical and non-critical modules load differently
      </p>

      <div className="comparison-container">
        <div className="module-control">
          <h4>Critical Modules (Immediate Execution)</h4>
          <p className="module-desc">
            Use <code>preinitializeModule</code> for modules needed right away
          </p>
          <div className="button-group">
            <button
              onClick={() =>
                handlePreinitializeModule(
                  'https://cdn.example.com/auth-sdk.js'
                )
              }
              className="btn btn-critical"
            >
              Load Auth SDK (800ms)
            </button>
            <button
              onClick={() =>
                handlePreinitializeModule(
                  'https://cdn.example.com/chart-library.js'
                )
              }
              className="btn btn-critical"
            >
              Load Charts (2000ms)
            </button>
          </div>
        </div>

        <div className="module-control">
          <h4>Non-Critical Modules (Background Download)</h4>
          <p className="module-desc">
            Use <code>preloadModule</code> for modules that can load in background
          </p>
          <div className="button-group">
            <button
              onClick={() =>
                handlePreloadModule('https://cdn.example.com/analytics.js')
              }
              className="btn btn-noncritical"
            >
              Preload Analytics (1200ms)
            </button>
            <button
              onClick={() =>
                handlePreloadModule(
                  'https://cdn.example.com/ml-library.js'
                )
              }
              className="btn btn-noncritical"
            >
              Preload ML Library (3000ms)
            </button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-label">Preinitialize Calls:</span>
          <span className="stat-value critical">{stats.preinitialized}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Preload Calls:</span>
          <span className="stat-value noncritical">{stats.preloaded}</span>
        </div>
      </div>

      <div className="events-timeline">
        <h4>Loading Timeline</h4>
        <div className="timeline-container">
          {events.length === 0 ? (
            <div className="empty-state">
              Click buttons above to simulate module loading
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={`timeline-event ${event.status}`}>
                <div className="event-header">
                  <span className={`event-type ${event.type}`}>
                    {event.type === 'preinitialize'
                      ? '🚀'
                      : event.type === 'preload'
                      ? '📥'
                      : event.type === 'preload-style'
                      ? '🎨'
                      : '📝'}
                    {event.type}
                  </span>
                  <span className="event-status">
                    {event.status === 'pending' && '⏳ Loading'}
                    {event.status === 'loaded' && '✅ Loaded'}
                    {event.status === 'failed' && '❌ Failed'}
                  </span>
                </div>
                <div className="event-details">
                  <span className="event-url">{event.url}</span>
                  {event.duration && (
                    <span className="event-duration">
                      {event.duration}ms
                    </span>
                  )}
                </div>
                {event.status === 'pending' && (
                  <div className="loading-bar">
                    <div className="loading-progress"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="info-box">
        <h4>Key Differences:</h4>
        <ul>
          <li>
            <strong>preinitializeModule</strong>: Blocks rendering, executes
            immediately, use for critical features
          </li>
          <li>
            <strong>preloadModule</strong>: Non-blocking, executes on demand,
            use for non-critical features
          </li>
          <li>Reduces Time to Interactive (TTI) by strategically loading</li>
          <li>Better than old script tag approach with more control</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 2: ASSET LOADING STRATEGY
// ============================================================================

function AssetLoadingStrategy() {
  const [activeStrategy, setActiveStrategy] = useState<
    'critical' | 'optimal' | 'lazy'
  >('critical');
  const [loadingProgress, setLoadingProgress] = useState<Record<string, number>>({});

  const strategiesDescription = {
    critical: {
      title: 'Critical First Strategy',
      desc: 'Load only essential assets immediately',
      assets: ['Auth SDK', 'Core CSS'],
    },
    optimal: {
      title: 'Optimal Performance Strategy',
      desc: 'Balance between critical and non-critical loading',
      assets: ['Auth SDK', 'Critical CSS', 'Roboto Font', 'Analytics (preload)'],
    },
    lazy: {
      title: 'Lazy Loading Strategy',
      desc: 'Defer non-critical assets until needed',
      assets: [
        'Auth SDK',
        'Core CSS',
        'Premium Module (on demand)',
        'Analytics (background)',
      ],
    },
  };

  const simulateAssetLoad = (assetName: string) => {
    setLoadingProgress(prev => ({ ...prev, [assetName]: 0 }));
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const current = prev[assetName] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [assetName]: current + Math.random() * 30 };
      });
    }, 100);
  };

  const handleLoadAssets = () => {
    const strategy = strategiesDescription[activeStrategy];
    strategy.assets.forEach(asset => simulateAssetLoad(asset));
  };

  return (
    <div className="feature-section">
      <h3>2. Asset Loading Strategies</h3>
      <p className="description">
        Choose the best strategy for your application's needs
      </p>

      <div className="strategy-selector">
        {(['critical', 'optimal', 'lazy'] as const).map((strategy) => (
          <button
            key={strategy}
            onClick={() => setActiveStrategy(strategy)}
            className={`strategy-btn ${activeStrategy === strategy ? 'active' : ''}`}
          >
            {strategiesDescription[strategy].title}
          </button>
        ))}
      </div>

      <div className="strategy-display">
        <h4>{strategiesDescription[activeStrategy].title}</h4>
        <p>{strategiesDescription[activeStrategy].desc}</p>

        <div className="assets-list">
          {strategiesDescription[activeStrategy].assets.map((asset) => (
            <div key={asset} className="asset-item">
              <div className="asset-name">{asset}</div>
              <div className="asset-bar">
                <div
                  className="asset-progress"
                  style={{
                    width: `${Math.min(loadingProgress[asset] || 0, 100)}%`,
                  }}
                ></div>
              </div>
              <span className="asset-percent">
                {Math.round(loadingProgress[asset] || 0)}%
              </span>
            </div>
          ))}
        </div>

        <button onClick={handleLoadAssets} className="btn btn-primary">
          Simulate Loading Strategy
        </button>
      </div>

      <div className="strategy-comparison">
        <h4>Strategy Comparison</h4>
        <div className="comparison-table">
          <div className="comparison-row header">
            <div className="comparison-cell">Strategy</div>
            <div className="comparison-cell">TTI</div>
            <div className="comparison-cell">FCP</div>
            <div className="comparison-cell">Best For</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-cell">Critical First</div>
            <div className="comparison-cell">~1.2s</div>
            <div className="comparison-cell">~0.8s</div>
            <div className="comparison-cell">Simple apps</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-cell">Optimal</div>
            <div className="comparison-cell">~0.9s</div>
            <div className="comparison-cell">~0.6s</div>
            <div className="comparison-cell">Most apps</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-cell">Lazy Loading</div>
            <div className="comparison-cell">~0.7s</div>
            <div className="comparison-cell">~0.5s</div>
            <div className="comparison-cell">Complex apps</div>
          </div>
        </div>
      </div>

      <div className="info-box">
        <h4>Strategy Guidelines:</h4>
        <ul>
          <li>
            <strong>Critical First</strong>: Good for simple sites, all assets
            needed upfront
          </li>
          <li>
            <strong>Optimal</strong>: Recommended, balance speed and
            functionality
          </li>
          <li>
            <strong>Lazy Loading</strong>: Best for complex apps with many
            features
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 3: REAL-TIME PERFORMANCE MONITORING
// ============================================================================

function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    tti: '0ms',
    fcp: '0ms',
    lcp: '0ms',
    cls: '0',
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setMetrics({
      tti: Math.random() * 1000 + 500 + 'ms',
      fcp: Math.random() * 400 + 200 + 'ms',
      lcp: Math.random() * 1200 + 600 + 'ms',
      cls: (Math.random() * 0.2).toFixed(3),
    });
    setTimeout(() => setIsMonitoring(false), 2000);
  };

  return (
    <div className="feature-section">
      <h3>3. Web Vitals & Performance Impact</h3>
      <p className="description">
        See how proper asset loading affects Core Web Vitals
      </p>

      <div className="metrics-container">
        <div className={`metric-card ${isMonitoring ? 'monitoring' : ''}`}>
          <h4>Time to Interactive (TTI)</h4>
          <div className="metric-value">{metrics.tti}</div>
          <p className="metric-desc">Time until page is interactive</p>
        </div>

        <div className={`metric-card ${isMonitoring ? 'monitoring' : ''}`}>
          <h4>First Contentful Paint (FCP)</h4>
          <div className="metric-value">{metrics.fcp}</div>
          <p className="metric-desc">Time to first content on screen</p>
        </div>

        <div className={`metric-card ${isMonitoring ? 'monitoring' : ''}`}>
          <h4>Largest Contentful Paint (LCP)</h4>
          <div className="metric-value">{metrics.lcp}</div>
          <p className="metric-desc">Time to largest element loaded</p>
        </div>

        <div className={`metric-card ${isMonitoring ? 'monitoring' : ''}`}>
          <h4>Cumulative Layout Shift (CLS)</h4>
          <div className="metric-value">{metrics.cls}</div>
          <p className="metric-desc">Visual stability score</p>
        </div>
      </div>

      <button onClick={startMonitoring} className="btn btn-primary">
        {isMonitoring ? '⏳ Measuring...' : '📊 Start Monitoring'}
      </button>

      <div className="metrics-guide">
        <h4>Performance Impact of Proper Asset Loading:</h4>
        <ul>
          <li>
            ✅ <strong>preinitializeModule</strong> for critical modules →
            Better TTI
          </li>
          <li>
            ✅ <strong>preloadModule</strong> for non-critical modules →
            Faster FCP
          </li>
          <li>✅ Strategic font loading → Reduced CLS (no font swaps)</li>
          <li>✅ CSS preloading → Faster rendering of critical content</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 4: INTERACTIVE ASSET LOADER
// ============================================================================

function InteractiveAssetLoader() {
  const [customUrl, setCustomUrl] = useState('');
  const [loadedAssets, setLoadedAssets] = useState<ModuleStatus[]>([]);

  const handleLoadCustomAsset = async () => {
    if (!customUrl) return;

    const asset: ModuleStatus = {
      url: customUrl,
      loaded: false,
      loadTime: 0,
      size: '~250KB',
    };

    setLoadedAssets(prev => [...prev, asset]);

    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1500));
    const loadTime = Date.now() - startTime;

    setLoadedAssets(prev =>
      prev.map(a =>
        a.url === customUrl ? { ...a, loaded: true, loadTime } : a
      )
    );

    setCustomUrl('');
  };

  return (
    <div className="feature-section">
      <h3>4. Custom Asset Loader</h3>
      <p className="description">
        Test preloading with custom URLs and track their loading
      </p>

      <div className="custom-loader">
        <div className="input-group">
          <input
            type="text"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Enter module URL or path..."
            className="input-field"
          />
          <button onClick={handleLoadCustomAsset} className="btn btn-primary">
            Load Asset
          </button>
        </div>

        <div className="loaded-assets">
          {loadedAssets.length === 0 ? (
            <div className="empty-state">
              No assets loaded yet. Enter a URL above to get started.
            </div>
          ) : (
            loadedAssets.map((asset, idx) => (
              <div key={idx} className={`loaded-asset ${asset.loaded ? 'ready' : 'loading'}`}>
                <div className="asset-icon">
                  {asset.loaded ? '✅' : '⏳'}
                </div>
                <div className="asset-info">
                  <div className="asset-url">{asset.url}</div>
                  <div className="asset-meta">
                    {asset.loaded ? (
                      <>
                        <span>Loaded in {asset.loadTime}ms</span>
                        <span>Size: {asset.size}</span>
                      </>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="info-box">
        <h4>Tips for Custom Assets:</h4>
        <ul>
          <li>Always include the full URL for external modules</li>
          <li>For stylesheets, use <code>preload</code> instead</li>
          <li>Use CORS headers for cross-origin assets</li>
          <li>Monitor actual loading performance in DevTools</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AssetLoadingOptimization() {
  const [activeFeature, setActiveFeature] = useState(1);

  const features = [
    {
      id: 1,
      title: 'Module Comparison',
      component: ModuleLoadingComparison,
    },
    {
      id: 2,
      title: 'Loading Strategies',
      component: AssetLoadingStrategy,
    },
    {
      id: 3,
      title: 'Performance Monitoring',
      component: PerformanceMonitoring,
    },
    {
      id: 4,
      title: 'Custom Loader',
      component: InteractiveAssetLoader,
    },
  ];

  const ActiveComponent = features.find(
    f => f.id === activeFeature
  )?.component || ModuleLoadingComparison;

  return (
    <div className="asset-loading-container">
      <header className="asset-header">
        <h1>React 19 Asset Loading Optimization</h1>
        <p>
          Master preinitializeModule, preloadModule, and asset optimization
          strategies
        </p>
      </header>

      <div className="asset-layout">
        <aside className="asset-sidebar">
          <nav className="asset-nav">
            {features.map(feature => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`nav-btn ${activeFeature === feature.id ? 'active' : ''}`}
              >
                <span className="nav-number">{feature.id}</span>
                <span className="nav-title">{feature.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="asset-main">
          <ActiveComponent />
        </main>
      </div>

      <footer className="asset-footer">
        <p>
          💡 <strong>Best Practice:</strong> Use{' '}
          <code>preinitializeModule</code> for critical modules and{' '}
          <code>preloadModule</code> for non-critical ones to optimize Time to
          Interactive.
        </p>
      </footer>
    </div>
  );
}
