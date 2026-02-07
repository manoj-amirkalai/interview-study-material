import { useState, useOptimistic, useActionState, useRef } from 'react';
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
// MOCK API FUNCTIONS
// ============================================================================

// Simulated async action for form submission
async function subscribeEmail(_previousState: FormState, formData: FormData) {
  const email = formData.get('email') as string;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!email || !email.includes('@')) {
    return { 
      message: 'Please enter a valid email', 
      success: false,
      error: 'Invalid email' 
    };
  }

  // Simulate successful subscription
  return { 
    message: `Successfully subscribed: ${email}`, 
    success: true 
  };
}

// Simulated async action for adding todo
// Note: This function is kept for documentation purposes but not currently used
// async function addTodoAction(_previousState: Todo[], formData: FormData) {
//   const text = formData.get('todo') as string;

//   if (!text.trim()) {
//     throw new Error('Todo text cannot be empty');
//   }

//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 800));

//   return {
//     id: Date.now(),
//     text,
//     completed: false
//   };
// }

// ============================================================================
// FEATURE 1: useActionState DEMO
// ============================================================================

function EmailSubscriptionDemo() {
  const [state, formAction, isPending] = useActionState(
    subscribeEmail,
    { message: '', success: false }
  );

  return (
    <div className="feature-demo">
      <h3>1. useActionState Hook - Form Handling</h3>
      <p className="description">
        Simplifies form submission with automatic state management. No need for 
        useTransition + useState combo.
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
  subscribeEmail,
  { message: '', success: false }
);

<form action={formAction}>
  <input name="email" />
  <button disabled={isPending}>
    {isPending ? 'Subscribing...' : 'Subscribe'}
  </button>
</form>`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Verbose)</h4>
          <pre>
{`const [isPending, startTransition] = useTransition();
const [message, setMessage] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  startTransition(async () => {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    setMessage(await response.text());
  });
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 2: useOptimistic DEMO
// ============================================================================

function OptimisticUpdateDemo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React 19', completed: false },
    { id: 2, text: 'Build a project', completed: true },
  ]);

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTodo: Todo) => [...state, { ...newTodo, optimistic: true }]
  );

  const handleAddTodo = async (formData: FormData) => {
    const text = formData.get('todo') as string;

    if (!text.trim()) return;

    // Add optimistically
    const tempTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      optimistic: true
    };

    addOptimisticTodo(tempTodo);

    try {
      // Simulate server request
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Update with real data
      setTodos(prev => [...prev, {
        id: Date.now(),
        text,
        completed: false
      }]);
    } catch (error) {
      console.error('Failed to add todo:', error);
      // Optimistic update will revert automatically
    }
  };

  return (
    <div className="feature-demo">
      <h3>2. useOptimistic Hook - Optimistic Updates</h3>
      <p className="description">
        Show changes immediately while the server request is in flight. 
        Automatically reverts if the request fails.
      </p>

      <div className="demo-container">
        <form action={handleAddTodo} className="todo-form">
          <input
            name="todo"
            type="text"
            placeholder="Add a new todo..."
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">Add Todo</button>
        </form>

        <ul className="todo-list">
          {optimisticTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.optimistic ? 'pending' : ''}`}>
              <input 
                type="checkbox" 
                checked={todo.completed}
                readOnly
              />
              <span className="todo-text">{todo.text}</span>
              {todo.optimistic && <span className="badge">Saving...</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Optimistic)</h4>
          <pre>
{`const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo) => [...state, newTodo]
);

const handleAdd = async (formData) => {
  addOptimisticTodo(newTodo); // Immediate UI update
  
  try {
    const result = await fetch('/api/todos', {
      method: 'POST',
      body: formData
    });
    setTodos(prev => [...prev, result]);
  } catch (err) {
    // Optimistic update reverts automatically
  }
};`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Manual)</h4>
          <pre>
{`const [todos, setTodos] = useState([]);
const [pending, setPending] = useState([]);

const handleAdd = async (formData) => {
  const optimistic = { id: Date.now(), text: formData };
  setPending(prev => [...prev, optimistic]);

  try {
    const result = await fetch('/api/todos', {
      method: 'POST',
      body: formData
    });
    setTodos(prev => [...prev, result]);
    setPending(p => p.filter(x => x.id !== optimistic.id));
  } catch {
    setPending(p => p.filter(x => x.id !== optimistic.id));
  }
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 3: Ref Forwarding Simplification
// ============================================================================

function RefForwardingDemo() {
  const inputRef2 = useRef<HTMLInputElement>(null);

  return (
    <div className="feature-demo">
      <h3>3. Simplified Ref Forwarding</h3>
      <p className="description">
        React 19 automatically forwards refs - no need for the forwardRef wrapper.
      </p>

      <div className="demo-container">
        <div className="ref-demo-box">
          <p>Click "Focus" to focus the input field:</p>
          <input
            ref={inputRef2}
            type="text"
            placeholder="Click the Focus button to focus me..."
            className="form-input"
          />
          <button 
            onClick={() => inputRef2.current?.focus()} 
            className="btn btn-secondary"
          >
            Focus Input
          </button>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Simple)</h4>
          <pre>
{`// No forwardRef needed!
function Input({ placeholder }, ref) {
  return <input ref={ref} placeholder={placeholder} />;
}

// Usage
const inputRef = useRef();
<Input ref={inputRef} placeholder="Type here" />
<button onClick={() => inputRef.current?.focus()}>
  Focus
</button>`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Requires forwardRef)</h4>
          <pre>
{`import { forwardRef } from 'react';

const Input = forwardRef(({ placeholder }, ref) => (
  <input ref={ref} placeholder={placeholder} />
));

// Usage is same but component wrapper is required
const inputRef = useRef();
<Input ref={inputRef} placeholder="Type here" />`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 4: Actions with Server Data
// ============================================================================

function ActionsWithDataDemo() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]);

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: FormState, formData: FormData) => {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!name || !email) {
        return { message: 'All fields required', success: false };
      }

      // Add new user
      const newUser = { id: Date.now(), name, email };
      setUsers(prev => [...prev, newUser]);

      return { message: `User ${name} added successfully!`, success: true };
    },
    { message: '', success: false }
  );

  return (
    <div className="feature-demo">
      <h3>4. Actions - Unified Async Operations</h3>
      <p className="description">
        Actions combine form handling with data mutations. Works seamlessly with 
        Server Actions in Next.js for direct database access.
      </p>

      <div className="demo-container">
        <div className="two-column">
          <div className="column">
            <h4>Add User Form</h4>
            <form action={formAction} className="demo-form">
              <div className="form-group">
                <input
                  name="name"
                  type="text"
                  placeholder="User name..."
                  className="form-input"
                  disabled={isPending}
                />
              </div>
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email..."
                  className="form-input"
                  disabled={isPending}
                />
              </div>

              {formState.message && (
                <div className={`alert ${formState.success ? 'success' : 'error'}`}>
                  {formState.message}
                </div>
              )}

              <button type="submit" disabled={isPending} className="btn btn-primary">
                {isPending ? 'Adding...' : 'Add User'}
              </button>
            </form>
          </div>

          <div className="column">
            <h4>Users List</h4>
            <ul className="users-list">
              {users.map(user => (
                <li key={user.id} className="user-item">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (With Actions)</h4>
          <pre>
{`async function addUser(formState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  // Direct database access (Server Action)
  const user = await db.users.create({ name, email });
  
  return { success: true, message: 'User added' };
}

function Form() {
  const [state, action, isPending] = useActionState(addUser, {});
  
  return (
    <form action={action}>
      <input name="name" />
      <input name="email" />
      <button disabled={isPending}>Add</button>
    </form>
  );
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Manual Fetch)</h4>
          <pre>
{`function Form() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    startTransition(async () => {
      const formData = new FormData(e.target);
      
      // Need API route
      const res = await fetch('/api/users', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      setUsers(prev => [...prev, data]);
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 5: useFormStatus Hook
// ============================================================================

function FormStatusDemo() {
  const [formState, formAction, isPending] = useActionState(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { submitted: true };
    },
    { submitted: false }
  );

  return (
    <div className="feature-demo">
      <h3>5. Enhanced useFormStatus - Form State Integration</h3>
      <p className="description">
        useFormStatus provides direct access to form submission state without 
        additional hooks or state management.
      </p>

      <div className="demo-container">
        <form action={formAction} className="demo-form">
          <div className="form-group">
            <input
              name="feedback"
              type="text"
              placeholder="Send us your feedback..."
              className="form-input"
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your message..."
              className="form-input"
              disabled={isPending}
              rows={3}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="btn btn-primary"
          >
            {isPending ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              'Send Feedback'
            )}
          </button>

          {formState.submitted && !isPending && (
            <div className="alert success">
              ✓ Thank you! Your feedback has been sent.
            </div>
          )}
        </form>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 Benefit</h4>
          <pre>
{`// useFormStatus gives you direct access to:
const { pending, data, method, action } = useFormStatus();

// Perfect for controlling button state
<button disabled={pending}>
  {pending ? 'Submitting...' : 'Submit'}
</button>

// No extra useState or useTransition needed!`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 Workaround</h4>
          <pre>
{`// Had to combine multiple hooks
const [isPending, startTransition] = useTransition();
const { pending } = useFormStatus();

// Often didn't have enough state info
const isSubmitting = isPending || pending;

// Sometimes needed additional useState calls`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 6: Context as Provider
// ============================================================================

function ContextDemo() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="feature-demo">
      <h3>6. Context as Provider - Simplified API</h3>
      <p className="description">
        In React 19, you can use Context directly as a provider without the 
        .Provider syntax.
      </p>

      <div className="demo-container">
        <div className={`theme-demo ${theme}`}>
          <p>Current Theme: <strong>{theme.toUpperCase()}</strong></p>
          <button onClick={toggleTheme} className="btn btn-secondary">
            Toggle Theme
          </button>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Direct Provider)</h4>
          <pre>
{`const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  // Use context directly as provider!
  return (
    <ThemeContext value={{ theme, setTheme }}>
      <Header />
      <Content />
    </ThemeContext>
  );
}`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Requires .Provider)</h4>
          <pre>
{`const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  // Required .Provider wrapper
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Content />
    </ThemeContext.Provider>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 7: Batching Comparison
// ============================================================================

function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [double, setDouble] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  const handleClickBatch = () => {
    // React 19: Both updates batched together - only 1 render
    setCount(c => c + 1);
    setDouble(d => d + 2);
    setRenderCount(r => r + 1);
  };

  return (
    <div className="feature-demo">
      <h3>7. Automatic Batching (React 18 Feature, Enhanced in React 19)</h3>
      <p className="description">
        React automatically batches state updates. Multiple setState calls 
        result in a single render cycle.
      </p>

      <div className="demo-container">
        <div className="batch-demo">
          <div className="stats">
            <div className="stat-box">
              <span className="stat-label">Count</span>
              <span className="stat-value">{count}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Double</span>
              <span className="stat-value">{double}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Renders</span>
              <span className="stat-value">{renderCount}</span>
            </div>
          </div>

          <button onClick={handleClickBatch} className="btn btn-primary btn-large">
            Click to Update State
          </button>

          <p className="info-text">
            Notice: Despite 3 state updates, only 1 render happens per click
          </p>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-block">
          <h4>React 19 (Always Batched)</h4>
          <pre>
{`// Even in promises, batching works
async function handleSubmit() {
  setCount(c => c + 1);      // Batched
  setBool(b => !b);          // Batched
  setData(d => [...d, new]); // Batched
  
  const result = await fetch('/data');
  setResult(result); // Also batched!
}
// Only 1 render for all updates!`}
          </pre>
        </div>

        <div className="code-block">
          <h4>React 18 (Auto-batching with limits)</h4>
          <pre>
{`// Batching works in events, but...
function handleClick() {
  setCount(c => c + 1);  // Batched
  setBool(b => !b);      // Batched
  // 1 render
}

// ...not always in promises/callbacks
setTimeout(() => {
  setCount(c => c + 1);  // Separate render
  setBool(b => !b);      // Another render
  // Potential: 2 renders
}, 0);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function React19Features() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    { id: 0, name: 'useActionState', component: EmailSubscriptionDemo },
    { id: 1, name: 'useOptimistic', component: OptimisticUpdateDemo },
    { id: 2, name: 'Ref Forwarding', component: RefForwardingDemo },
    { id: 3, name: 'Actions', component: ActionsWithDataDemo },
    { id: 4, name: 'useFormStatus', component: FormStatusDemo },
    { id: 5, name: 'Context', component: ContextDemo },
    { id: 6, name: 'Batching', component: BatchingDemo },
  ];

  const ActiveComponent = features[activeTab].component;

  return (
    <div className="react19-features-container">
      <header className="features-header">
        <h1>React 18 vs React 19 - Interactive Demo</h1>
        <p className="subtitle">
          Explore the new features and improvements in React 19 with live examples
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
          <h3>Key Improvements in React 19</h3>
          <ul>
            <li>✨ Simpler API with useActionState, useOptimistic</li>
            <li>📝 Better form handling without boilerplate</li>
            <li>⚡ Automatic optimistic updates support</li>
            <li>🔗 No forwardRef needed for ref forwarding</li>
            <li>🎯 Server Actions for seamless client-server integration</li>
            <li>📦 Reduced bundle size and improved performance</li>
            <li>🔄 Automatic batching in all scenarios</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
