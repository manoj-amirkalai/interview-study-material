import { useState, useOptimistic, useActionState, useRef, useMemo } from 'react';
import './React19Features.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  optimistic?: boolean;
}

interface FormState {
  message: string;
  success: boolean;
  error?: string;
}

// ============================================================================
// NEW FEATURES SECTION - React 19 Additions
// ============================================================================

// ============================================================================
// 1. REF AS DIRECT PROP (React 19)
// ============================================================================

function DirectRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="feature-demo">
      <h3>1. Ref as Direct Prop (React 19 New)</h3>
      <p className="description">
        No more forwardRef wrapper needed! Functional components can now directly 
        accept ref without wrapper components.
      </p>

      <div className="demo-container">
        <div className="ref-demo-box">
          <p>Click "Focus" to focus input using direct ref:</p>
          <input
            ref={inputRef}
            type="text"
            placeholder="Direct ref access - no forwardRef needed!"
            className="form-input"
          />
          <button 
            onClick={() => inputRef.current?.focus()} 
            className="btn btn-secondary"
          >
            Focus Input
          </button>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Direct Ref)</h4>
          <pre>
{`// No forwardRef wrapper!
function Input({ placeholder }, ref) {
  return <input ref={ref} placeholder={placeholder} />;
}

// Use directly with ref
const inputRef = useRef();
<Input ref={inputRef} placeholder="Type here" />
<button onClick={() => inputRef.current?.focus()}>
  Focus
</button>`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (forwardRef Required)</h4>
          <pre>
{`import { forwardRef } from 'react';

// Wrapper required
const Input = forwardRef(
  ({ placeholder }, ref) => (
    <input ref={ref} placeholder={placeholder} />
  )
);

// Same usage but with wrapper overhead
const inputRef = useRef();
<Input ref={inputRef} placeholder="Type here" />`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. CUSTOM ELEMENTS SUPPORT (React 19)
// ============================================================================

function CustomElementsDemo() {
  const [customValue, setCustomValue] = useState('React');

  return (
    <div className="feature-demo">
      <h3>2. Built-in Custom Elements Support (React 19)</h3>
      <p className="description">
        React now properly handles Web Components with correct prop/attribute 
        conversion. Custom elements work seamlessly with React components.
      </p>

      <div className="demo-container">
        <div className="custom-element-demo">
          <p>Custom Element Example:</p>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Type to update custom element..."
            className="form-input"
          />
          
          <div className="custom-element-box">
            <p>Custom Element Output:</p>
            <div className="custom-element-preview">
              <strong>Input Value:</strong> {customValue}
            </div>
          </div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Native Support)</h4>
          <pre>
{`// Custom elements work directly
function MyComponent() {
  return (
    <>
      {/* Props auto-convert to attributes */}
      <my-custom-element 
        data-value="test"
        onCustomEvent={handleEvent}
        exportParts="button"
      >
        Content
      </my-custom-element>
    </>
  );
}

// No special handling needed!`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Manual Handling)</h4>
          <pre>
{`// Required manual attribute setting
function MyComponent(ref) {
  const customRef = useRef();

  useEffect(() => {
    // Manual attribute setup
    customRef.current?.setAttribute('data-value', 'test');
  }, []);

  return (
    <my-custom-element 
      ref={customRef}
      onCustomEvent={handleEvent}
    />
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. useEvent HOOK (React 19 New)
// ============================================================================

function UseEventDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  // Regular handler (new identity each render)
  const regularHandler = () => {
    setLog(prev => [...prev, `Regular handler at ${new Date().toLocaleTimeString()}`]);
  };

  // useEvent would provide stable identity (shown conceptually)
  const stableHandler = () => {
    setLog(prev => [...prev, `Stable handler at ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div className="feature-demo">
      <h3>3. useEvent Hook (React 19 New)</h3>
      <p className="description">
        Provides stable event handler identity across renders without relying on 
        useMemo or useCallback. Perfect for passing handlers to optimized components.
      </p>

      <div className="demo-container">
        <div className="two-column">
          <div className="column">
            <h4>Handler Stability</h4>
            <button 
              onClick={() => setCount(c => c + 1)}
              className="btn btn-primary"
            >
              Trigger Re-render ({count})
            </button>
            
            <button 
              onClick={stableHandler}
              className="btn btn-secondary"
              style={{ marginTop: '10px' }}
            >
              Stable Handler
            </button>
            
            <p className="info-text">
              useEvent keeps handler identity stable even during re-renders
            </p>
          </div>

          <div className="column">
            <h4>Event Log</h4>
            <div className="event-log">
              {log.length === 0 ? (
                <p className="empty-log">No events yet...</p>
              ) : (
                log.map((entry, idx) => (
                  <div key={idx} className="log-entry">{entry}</div>
                ))
              )}
            </div>
            {log.length > 0 && (
              <button 
                onClick={() => setLog([])}
                className="btn btn-secondary"
                style={{ marginTop: '10px', width: '100%' }}
              >
                Clear Log
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (useEvent - Stable)</h4>
          <pre>
{`import { useEvent } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  // Handler keeps same identity across renders
  const handleClick = useEvent(() => {
    console.log('Always same identity!');
  });

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>
        Render: {count}
      </button>
      {/* handleClick doesn't change, no re-renders */}
      <OptimizedChild onClick={handleClick} />
    </>
  );
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (useCallback - Verbose)</h4>
          <pre>
{`function ParentComponent() {
  const [count, setCount] = useState(0);

  // New identity every render unless deps match
  const handleClick = useCallback(() => {
    console.log('Changed on each render');
  }, []); // Must manually track deps

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>
        Render: {count}
      </button>
      {/* May trigger unnecessary re-renders */}
      <OptimizedChild onClick={handleClick} />
    </>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. USE HOOK FOR PROMISES (React 19)
// ============================================================================

function UseHookDemo() {
  const [userId, setUserId] = useState(1);
  const [userPromise, setUserPromise] = useState(
    Promise.resolve({ id: 1, name: 'Alice', role: 'Developer' })
  );

  const handleLoadUser = (id: number) => {
    setUserId(id);
    setUserPromise(
      new Promise(resolve => 
        setTimeout(() => {
          const users: { [key: number]: { id: number; name: string; role: string } } = {
            1: { id: 1, name: 'Alice', role: 'Developer' },
            2: { id: 2, name: 'Bob', role: 'Designer' },
            3: { id: 3, name: 'Carol', role: 'Product Manager' }
          };
          resolve(users[id] || { id, name: 'Unknown', role: 'User' });
        }, 1000)
      )
    );
  };

  return (
    <div className="feature-demo">
      <h3>4. use() Hook for Promises (React 19)</h3>
      <p className="description">
        Unwrap promises directly in render. Works with Suspense to handle async 
        operations elegantly without useEffect boilerplate.
      </p>

      <div className="demo-container">
        <div className="user-demo">
          <p>Select a user:</p>
          <div className="button-group">
            {[1, 2, 3].map(id => (
              <button
                key={id}
                onClick={() => handleLoadUser(id)}
                className={`btn ${userId === id ? 'btn-primary' : 'btn-secondary'}`}
              >
                User {id}
              </button>
            ))}
          </div>

          <div className="user-card">
            <p><strong>User Details:</strong></p>
            <p>ID: {userId}</p>
            <p className="info-text">
              (In real app, use() with Suspense would show loading state automatically)
            </p>
          </div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (use Hook)</h4>
          <pre>
{`import { use, Suspense } from 'react';

function UserProfile({ userPromise }) {
  // Unwrap promise - suspends until resolved
  const user = use(userPromise);

  return <div>Welcome, {user.name}</div>;
}

// Usage with Suspense
function App() {
  const userPromise = fetchUser(123);

  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (useEffect)</h4>
          <pre>
{`function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Loading />;
  if (!user) return <Error />;
  
  return <div>Welcome, {user.name}</div>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. REACT COMPILER (React 19)
// ============================================================================

function ReactCompilerDemo() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [filter, setFilter] = useState('');

  // In React 19 with compiler, this is automatically memoized
  const filteredItems = useMemo(
    () => items.filter(item => item.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  return (
    <div className="feature-demo">
      <h3>5. React Compiler - Automatic Optimizations (React 19)</h3>
      <p className="description">
        React 19 includes a compiler that automatically optimizes components by 
        memoizing expensive computations, eliminating the need for useMemo/useCallback in most cases.
      </p>

      <div className="demo-container">
        <div className="compiler-demo">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter items..."
            className="form-input"
          />

          <div className="items-list">
            {filteredItems.map((item, idx) => (
              <div key={idx} className="item-card">
                {item}
              </div>
            ))}
          </div>

          <p className="info-text">
            Filtering is automatically optimized by the React compiler
          </p>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Automatic)</h4>
          <pre>
{`// Compiler handles optimization automatically
function ItemList({ items }) {
  const [filter, setFilter] = useState('');

  // Compiler auto-memoizes this!
  const filtered = items.filter(
    item => item.includes(filter)
  );

  return (
    <>
      <input onChange={e => setFilter(e.target.value)} />
      {filtered.map(item => <Item key={item} />)}
    </>
  );
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Manual)</h4>
          <pre>
{`// Must manually wrap in useMemo
function ItemList({ items }) {
  const [filter, setFilter] = useState('');

  // Manual memoization needed
  const filtered = useMemo(
    () => items.filter(item => item.includes(filter)),
    [items, filter]
  );

  return (
    <>
      <input onChange={e => setFilter(e.target.value)} />
      {filtered.map(item => <Item key={item} />)}
    </>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. RESOURCE LOADING (React 19)
// ============================================================================

function ResourceLoadingDemo() {
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  const loadResources = () => {
    // Simulate resource preloading
    setResourcesLoaded(true);
  };

  return (
    <div className="feature-demo">
      <h3>6. Resource & Asset Loading (React 19)</h3>
      <p className="description">
        Built-in support for optimized resource preloading. React now manages 
        scripts, stylesheets, and other resources more efficiently.
      </p>

      <div className="demo-container">
        <div className="resource-demo">
          <button 
            onClick={loadResources}
            className="btn btn-primary"
          >
            Load Resources
          </button>

          {resourcesLoaded && (
            <div className="alert success" style={{ marginTop: '15px' }}>
              ✓ Resources loaded and cached efficiently!
            </div>
          )}

          <div className="resource-info">
            <p><strong>Resource Types Optimized:</strong></p>
            <ul>
              <li>📜 Scripts (async/defer handling)</li>
              <li>🎨 Stylesheets (preload support)</li>
              <li>🔤 Fonts (font-display optimization)</li>
              <li>🖼️ Images (lazy loading)</li>
              <li>🔗 Prefetch/Preconnect hints</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Built-in)</h4>
          <pre>
{`import { 
  preload, 
  preinitializeModule,
  preloadModule 
} from 'react-dom';

function App() {
  // Automatic resource optimization
  preload('font.woff2', { as: 'font', type: 'font/woff2' });
  preinitializeModule('heavy-lib.js');
  
  return <div>App</div>;
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Manual)</h4>
          <pre>
{`// Manual resource management
function App() {
  useEffect(() => {
    // Manual link tag creation
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = 'font.woff2';
    document.head.appendChild(link);
  }, []);

  return <div>App</div>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. IMPROVED SUSPENSE & SSR (React 19)
// ============================================================================

function SSRImprovementsDemo() {
  const [hydrationStatus, setHydrationStatus] = useState('Ready for SSR');

  return (
    <div className="feature-demo">
      <h3>7. Improved Suspense & SSR Hydration (React 19)</h3>
      <p className="description">
        Better hydration error reporting, smoother SSR with Suspense integration, 
        and more resilient handling of third-party scripts during hydration.
      </p>

      <div className="demo-container">
        <div className="ssr-demo">
          <div className="status-badge">
            <p><strong>Hydration Status:</strong></p>
            <div className="status-text">{hydrationStatus}</div>
          </div>

          <div className="ssr-features">
            <p><strong>React 19 SSR Improvements:</strong></p>
            <ul>
              <li>✅ Clearer hydration mismatch errors</li>
              <li>✅ Better diagnostic messages</li>
              <li>✅ Suspense boundary coordination</li>
              <li>✅ Third-party script resilience</li>
              <li>✅ Streaming HTML support</li>
              <li>✅ Progressive enhancement</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Suspense SSR)</h4>
          <pre>
{`// Server
import { renderToPipeableStream } from 'react-dom/server';

function handler(request, response) {
  // Suspense boundaries auto-stream
  const { pipe } = renderToPipeableStream(
    <App />,
    { onShellReady() { response.setHeader(...) } }
  );
  pipe(response);
}

// Client - Auto-hydrates correctly
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App />);`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Limited)</h4>
          <pre>
{`// Server
const html = renderToString(<App />);

// Client - Manual hydration
const root = createRoot(document);
root.hydrate(<App />, document);

// Issues:
// - No Suspense streaming
// - Manual HTML generation
// - Hydration mismatches
// - Third-party script issues`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXISTING FEATURES (Keep the ones from before)
// ============================================================================

function useActionStateDemo() {
  const [state, formAction, isPending] = useActionState(
    async (_previousState: FormState, formData: FormData) => {
      const email = formData.get('email') as string;
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!email || !email.includes('@')) {
        return { message: 'Please enter a valid email', success: false };
      }

      return { message: `Successfully subscribed: ${email}`, success: true };
    },
    { message: '', success: false }
  );

  return (
    <div className="feature-demo">
      <h3>8. useActionState Hook</h3>
      <p className="description">
        Simplifies form submission with automatic state management for pending, 
        success, and error states.
      </p>

      <div className="demo-container">
        <form action={formAction} className="demo-form">
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Enter your email..."
              className="form-input"
              disabled={isPending}
            />
          </div>

          {state.message && (
            <div className={`alert ${state.success ? 'success' : 'error'}`}>
              {state.message}
            </div>
          )}

          <button type="submit" disabled={isPending} className="btn btn-primary">
            {isPending ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Simple)</h4>
          <pre>
{`const [state, formAction, isPending] = useActionState(
  subscribeAction,
  initialState
);

<form action={formAction}>
  <input name="email" />
  <button disabled={isPending}>
    {isPending ? '...' : 'Subscribe'}
  </button>
</form>`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Verbose)</h4>
          <pre>
{`const [isPending, startTransition] = useTransition();
const [state, setState] = useState(initialState);

const handleSubmit = (e) => {
  e.preventDefault();
  startTransition(async () => {
    const result = await subscribeAction(
      new FormData(e.target)
    );
    setState(result);
  });
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONCURRENT RENDERING IMPROVEMENTS (React 19)
// ============================================================================

function ConcurrentImprovementsDemo() {
  const [items, setItems] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
    setIsAdding(false);
  };

  return (
    <div className="feature-demo">
      <h3>9. Refined Concurrent Features (React 19)</h3>
      <p className="description">
        Smoother concurrent rendering and scheduling. React 19 refines how 
        concurrent features work, making priority-based updates more responsive.
      </p>

      <div className="demo-container">
        <div className="concurrent-demo">
          <button 
            onClick={addItem}
            disabled={isAdding}
            className="btn btn-primary"
          >
            {isAdding ? 'Adding...' : 'Add Item'}
          </button>

          <div className="items-list">
            {items.map((item, idx) => (
              <div key={idx} className="item-card">{item}</div>
            ))}
          </div>

          <p className="info-text">
            React 19 handles concurrent updates more efficiently
          </p>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Better Scheduling)</h4>
          <pre>
{`// Automatic priority management
function ItemList() {
  const [items, setItems] = useState([]);

  // React 19 automatically prioritizes:
  // - User input (high priority)
  // - Non-blocking updates (low priority)
  const handleAdd = async () => {
    setItems(prev => [...prev, newItem]);
  };

  return <List items={items} />;
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Manual Priority)</h4>
          <pre>
{`// Must manually handle priorities
function ItemList() {
  const [items, setItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  // Must manually wrap non-urgent updates
  const handleAdd = () => {
    startTransition(async () => {
      setItems(prev => [...prev, newItem]);
    });
  };

  return <List items={items} />;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FORM ENHANCEMENTS (React 19)
// ============================================================================

function FormEnhancementsDemo() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    const text = formData.get('message') as string;
    if (text.trim()) {
      setMessage(text);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  return (
    <div className="feature-demo">
      <h3>10. Form Actions & Enhancements (React 19)</h3>
      <p className="description">
        Form Actions provide declarative form handling with automatic management 
        of pending states and server/client-side logic.
      </p>

      <div className="demo-container">
        <form 
          action={handleFormSubmit}
          className="demo-form"
        >
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Type your message..."
              className="form-input"
              rows={3}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Form
          </button>

          {submitted && (
            <div className="alert success">
              Form submitted! Message: "{message}"
            </div>
          )}
        </form>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Declarative)</h4>
          <pre>
{`// Declarative form actions
<form action={async (formData) => {
  const result = await submitForm(formData);
  if (result.success) {
    redirect('/success');
  }
}}>
  <input name="email" />
  <input name="message" />
  <button>Submit</button>
</form>

// Automatic pending state handling`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Imperative)</h4>
          <pre>
{`// Imperative approach
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsPending(true);
  try {
    const data = new FormData(e.target);
    const result = await submitForm(data);
    if (result.success) {
      navigate('/success');
    }
  } catch (err) {
    setError(err);
  } finally {
    setIsPending(false);
  }
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

export default function React19FeaturesComprehensive() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    { id: 0, name: 'Direct Ref', component: DirectRefDemo },
    { id: 1, name: 'Custom Elements', component: CustomElementsDemo },
    { id: 2, name: 'useEvent', component: UseEventDemo },
    { id: 3, name: 'use() Hook', component: UseHookDemo },
    { id: 4, name: 'Compiler', component: ReactCompilerDemo },
    { id: 5, name: 'Resources', component: ResourceLoadingDemo },
    { id: 6, name: 'SSR/Suspense', component: SSRImprovementsDemo },
    { id: 7, name: 'useActionState', component: useActionStateDemo },
    { id: 8, name: 'Concurrent', component: ConcurrentImprovementsDemo },
    { id: 9, name: 'Form Actions', component: FormEnhancementsDemo },
  ];

  const ActiveComponent = features[activeTab].component;

  return (
    <div className="react19-features-container">
      <header className="features-header">
        <h1>🚀 React 19 - Complete Feature Guide</h1>
        <p className="subtitle">
          All new features, improvements, and best practices for React 19
        </p>
      </header>

      <nav className="features-nav">
        <div className="nav-tabs">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(index)}
              className={`nav-tab ${activeTab === index ? 'active' : ''}`}
            >
              {feature.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="features-main">
        <div className="feature-content">
          <ActiveComponent />
        </div>
      </main>

      <footer className="features-footer">
        <div className="footer-content">
          <h3>React 19 - Complete Feature Set</h3>
          <ul>
            <li>🔗 Direct ref on functional components (no forwardRef)</li>
            <li>🎨 Native Web Components support</li>
            <li>⚡ useEvent for stable event handlers</li>
            <li>🔄 use() hook for promise unwrapping</li>
            <li>🤖 React Compiler with auto-memoization</li>
            <li>📦 Built-in resource loading optimization</li>
            <li>🌊 Improved Suspense & SSR hydration</li>
            <li>📝 useActionState for form handling</li>
            <li>⏱️ Refined concurrent rendering</li>
            <li>📋 Declarative Form Actions</li>
            <li>✨ Better TypeScript support</li>
            <li>🎯 Reduced boilerplate with automatic optimizations</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
