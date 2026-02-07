import React, { useState, useTransition, useDeferredValue, useRef, Suspense, useMemo } from 'react';
import './React18Features.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// ============================================================================
// MOCK API FUNCTIONS
// ============================================================================

// Simulate expensive search operation
function performSearch(term: string): User[] {
  const allUsers: User[] = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
    { id: 4, name: 'Diana Prince' },
    { id: 5, name: 'Eve Wilson' },
  ];

  return allUsers.filter(user =>
    user.name.toLowerCase().includes(term.toLowerCase())
  );
}

// Simulate product filtering
function filterProducts(term: string): Product[] {
  const allProducts: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299 },
    { id: 2, name: 'Laptop Air', price: 999 },
    { id: 3, name: 'Laptop Stand', price: 49 },
    { id: 4, name: 'Phone 15', price: 899 },
    { id: 5, name: 'Tablet Max', price: 799 },
  ];

  return allProducts.filter(product =>
    product.name.toLowerCase().includes(term.toLowerCase())
  );
}

// ============================================================================
// FEATURE 1: CONCURRENT RENDERING DEMO
// ============================================================================

function ConcurrentRenderingDemo() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<number[]>([]);

  const handleClickMultipleTimes = () => {
    // React 18 handles concurrent rendering
    // These updates can be interrupted by higher priority tasks
    setCount(c => c + 1);
    setItems(prev => [...prev, count]);
  };

  return (
    <div className="feature-demo">
      <h3>1. Concurrent Rendering</h3>
      <p className="description">
        React can interrupt rendering to handle higher priority updates like user input. 
        This makes the app more responsive.
      </p>

      <div className="demo-container">
        <div className="demo-content">
          <p>Click the button - React handles it responsively:</p>
          <button
            onClick={handleClickMultipleTimes}
            className="btn btn-primary"
          >
            Increment Count ({count})
          </button>

          <div className="info-box">
            <h4>How it works:</h4>
            <ul>
              <li>React can pause rendering of items list</li>
              <li>Higher priority updates (state) get handled first</li>
              <li>User interactions remain responsive</li>
              <li>Long renders don't block the UI</li>
            </ul>
          </div>

          {items.length > 0 && (
            <div className="items-list">
              <h4>Items Added ({items.length}):</h4>
              <div className="items-grid">
                {items.map((item, idx) => (
                  <span key={idx} className="item-badge">
                    Item {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="code-block">
          <h4>Code Example</h4>
          <pre>
{`const [count, setCount] = useState(0);
const [items, setItems] = useState([]);

const handleClick = () => {
  // React 18: These updates can be interrupted
  // by higher-priority tasks like user input
  setCount(c => c + 1);
  setItems(prev => [...prev, count]);
};

// React renders responsively without blocking
return <button onClick={handleClick}>Click me</button>;`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 2: AUTOMATIC BATCHING DEMO
// ============================================================================

function AutomaticBatchingDemo() {
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // Increment render count
  const handleMultipleUpdates = async () => {
    // In React 18, both updates are batched into ONE render
    setCount(c => c + 1);
    setToggle(t => !t);
    setRenderCount(r => r + 1);

    // Even in async operations, batching still works in React 18
    await new Promise(resolve => setTimeout(resolve, 100));
    setCount(c => c + 1);
    setToggle(t => !t);
  };

  return (
    <div className="feature-demo">
      <h3>2. Automatic Batching</h3>
      <p className="description">
        React batches multiple state updates into a single render, 
        even outside React event handlers (promises, setTimeout, etc.).
      </p>

      <div className="demo-container">
        <div className="demo-content">
          <button
            onClick={handleMultipleUpdates}
            className="btn btn-primary"
          >
            Trigger Multiple Updates
          </button>

          <div className="stats-box">
            <div className="stat">
              <span className="stat-label">Count:</span>
              <span className="stat-value">{count}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Toggle:</span>
              <span className={`stat-value ${toggle ? 'active' : ''}`}>
                {toggle ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Renders:</span>
              <span className="stat-value">{renderCount}</span>
            </div>
          </div>

          <div className="info-box">
            <h4>React 18 Batching Benefits:</h4>
            <ul>
              <li>Multiple setState calls = 1 render (not N renders)</li>
              <li>Works in event handlers</li>
              <li>Works in promises and async/await</li>
              <li>Works in setTimeout and setInterval</li>
              <li>Significant performance improvement</li>
            </ul>
          </div>
        </div>

        <div className="code-block">
          <h4>Code Example</h4>
          <pre>
{`const [count, setCount] = useState(0);
const [bool, setBool] = useState(false);

const handleClick = async () => {
  // React 18: Both updates batched → 1 render
  setCount(c => c + 1);
  setBool(b => !b);
  
  // Even in promises, batching works!
  await fetch('/data');
  setCount(c => c + 1);
  setBool(b => !b);  // Still 1 render total
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 3: useTransition HOOK DEMO
// ============================================================================

function UseTransitionDemo() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Urgent update - input shows immediately
    setInput(value);

    // Non-urgent update - can be interrupted
    startTransition(() => {
      // Simulate expensive search operation
      const searchResults = performSearch(value);
      setResults(searchResults);
    });
  };

  return (
    <div className="feature-demo">
      <h3>3. useTransition Hook</h3>
      <p className="description">
        Mark state updates as non-urgent (transitions) vs urgent updates. 
        Allows React to deprioritize expensive operations.
      </p>

      <div className="demo-container">
        <div className="demo-content">
          <div className="form-group">
            <input
              type="text"
              value={input}
              onChange={handleSearch}
              placeholder="Search users (try 'a', 'b', 'c')..."
              className="form-input"
            />
            {isPending && <span className="loading-indicator">Searching...</span>}
          </div>

          {results.length > 0 && (
            <div className="results-box">
              <h4>Results ({results.length}):</h4>
              <ul className="results-list">
                {results.map(user => (
                  <li key={user.id} className={isPending ? 'dimmed' : ''}>
                    <span className="user-icon">👤</span> {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="info-box">
            <h4>useTransition Benefits:</h4>
            <ul>
              <li>Input (urgent) updates immediately</li>
              <li>Search results (non-urgent) can be interrupted</li>
              <li>isPending state shows transition progress</li>
              <li>Better perceived performance</li>
            </ul>
          </div>
        </div>

        <div className="code-block">
          <h4>Code Example</h4>
          <pre>
{`const [input, setInput] = useState('');
const [results, setResults] = useState([]);
const [isPending, startTransition] = useTransition();

const handleSearch = (e) => {
  const value = e.target.value;
  
  // Urgent: update input immediately
  setInput(value);
  
  // Non-urgent: can be interrupted
  startTransition(() => {
    setResults(performSearch(value));
  });
};

return (
  <>
    <input value={input} onChange={handleSearch} />
    {isPending && <p>Searching...</p>}
    <ResultsList results={results} />
  </>
);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 4: useDeferredValue HOOK DEMO
// ============================================================================

function UseDeferredValueDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredProducts = useMemo(
    () => {
      // Simulate expensive filtering
      return filterProducts(deferredSearchTerm);
    },
    [deferredSearchTerm]
  );

  const isStale = searchTerm !== deferredSearchTerm;

  return (
    <div className="feature-demo">
      <h3>4. useDeferredValue Hook</h3>
      <p className="description">
        Defer updating a value until more urgent updates are done. 
        Useful for expensive filtering or rendering operations.
      </p>

      <div className="demo-container">
        <div className="demo-content">
          <div className="form-group">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products (try 'laptop', 'phone')..."
              className="form-input"
            />
            {isStale && <span className="loading-indicator">Updating...</span>}
          </div>

          {filteredProducts.length > 0 && (
            <div className={`results-box ${isStale ? 'dimmed' : ''}`}>
              <h4>Products Found ({filteredProducts.length}):</h4>
              <ul className="results-list">
                {filteredProducts.map(product => (
                  <li key={product.id}>
                    <span className="product-icon">📦</span>
                    {product.name}
                    <span className="product-price">${product.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="info-box">
            <h4>useDeferredValue Benefits:</h4>
            <ul>
              <li>Input stays responsive</li>
              <li>Filtering (expensive) happens in background</li>
              <li>Shows stale UI while new value is being processed</li>
              <li>Smoother experience than blocking</li>
            </ul>
          </div>
        </div>

        <div className="code-block">
          <h4>Code Example</h4>
          <pre>
{`const [searchTerm, setSearchTerm] = useState('');
const deferredSearchTerm = useDeferredValue(searchTerm);

const filteredProducts = useMemo(
  () => filterProducts(deferredSearchTerm),
  [deferredSearchTerm]
);

const isStale = searchTerm !== deferredSearchTerm;

return (
  <>
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {isStale && <p>Updating...</p>}
    <ProductList products={filteredProducts} />
  </>
);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 5: SUSPENSE IMPROVEMENTS DEMO
// ============================================================================

interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string;
}

function UserProfileContent({ userId }: { userId: number }) {
  // Simulate fetching user data
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setUser({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        bio: 'React 18 enthusiast'
      });
      setIsLoading(false);
    }, 1500);
  }, [userId]);

  if (isLoading) {
    return <div className="loading-skeleton">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="error-box">User not found</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h4>{user.name}</h4>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>
      <div className="profile-bio">
        <h5>About</h5>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}

function SuspenseDemo() {
  const [selectedUserId, setSelectedUserId] = useState(1);

  return (
    <div className="feature-demo">
      <h3>5. Suspense Improvements</h3>
      <p className="description">
        Better handling of async operations like data fetching with Suspense boundaries 
        and fallback UI.
      </p>

      <div className="demo-container">
        <div className="demo-content">
          <div className="user-selector">
            <label>Select User:</label>
            <div className="button-group">
              {[1, 2, 3].map(id => (
                <button
                  key={id}
                  onClick={() => setSelectedUserId(id)}
                  className={`btn ${selectedUserId === id ? 'active' : ''}`}
                >
                  User {id}
                </button>
              ))}
            </div>
          </div>

          <div className="suspense-boundary">
            <Suspense fallback={<div className="loading-skeleton">Loading profile...</div>}>
              <UserProfileContent userId={selectedUserId} />
            </Suspense>
          </div>

          <div className="info-box">
            <h4>Suspense Benefits:</h4>
            <ul>
              <li>Cleaner async data fetching patterns</li>
              <li>Automatic fallback UI during loading</li>
              <li>Better error boundaries integration</li>
              <li>Streaming SSR support (in frameworks like Next.js)</li>
            </ul>
          </div>
        </div>

        <div className="code-block">
          <h4>Code Example</h4>
          <pre>
{`function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserProfile userId={123} />
    </Suspense>
  );
}

function UserProfile({ userId }) {
  // Component that "suspends" while fetching
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function React18Features() {
  const [activeFeature, setActiveFeature] = useState(1);

  const features = [
    { id: 1, title: 'Concurrent Rendering', component: ConcurrentRenderingDemo },
    { id: 2, title: 'Automatic Batching', component: AutomaticBatchingDemo },
    { id: 3, title: 'useTransition Hook', component: UseTransitionDemo },
    { id: 4, title: 'useDeferredValue Hook', component: UseDeferredValueDemo },
    { id: 5, title: 'Suspense Improvements', component: SuspenseDemo },
  ];

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component || ConcurrentRenderingDemo;

  return (
    <div className="react18-features-container">
      <header className="features-header">
        <h1>React 18 Key Features</h1>
        <p>
          React 18 introduces powerful features for better performance and user experience. 
          Explore each feature with interactive examples.
        </p>
      </header>

      <div className="features-layout">
        <aside className="features-sidebar">
          <nav className="features-nav">
            {features.map(feature => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`nav-item ${activeFeature === feature.id ? 'active' : ''}`}
              >
                <span className="feature-number">{feature.id}</span>
                <span className="feature-title">{feature.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="features-main">
          <ActiveComponent />
        </main>
      </div>

      <footer className="features-footer">
        <p>
          💡 <strong>Tip:</strong> Each feature can be combined for optimal performance. 
          React 18 makes it easier to build fast, responsive applications.
        </p>
      </footer>
    </div>
  );
}
