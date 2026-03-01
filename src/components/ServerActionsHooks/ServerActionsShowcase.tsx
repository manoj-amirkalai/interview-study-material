import { Suspense } from 'react';
import UseFormStateExample from './useFormState';
import UseOptimisticExample from './useOptimistic';
import UseFormStatusExample from './useFormStatus';
import UseExample from './use';
import UseActionStateExample from './useActionState';
import './ServerActionsHooks.css';

export default function ServerActionsHooksShowcase() {
    return (
        <div className="server-actions-showcase">
            <h1 className="showcase-title">React 19 Server Actions Hooks - Complete Guide</h1>
            <p className="showcase-subtitle">
                Learn all the new hooks for handling server actions and form management in React 19
            </p>

            <div className="hooks-grid">
                {/* useFormState */}
                <section className="hook-section">
                    <div className="hook-section-header header-green">
                        <h2>1. useFormState</h2>
                    </div>
                    <div className="hook-section-content">
                        <UseFormStateExample />
                        <div className="hook-description">
                            <p><strong>Use Case:</strong> Manage form submission state with server actions</p>
                            <p><strong>Returns:</strong> [state, formAction]</p>
                            <p><strong>Best For:</strong> Forms that need to display server responses</p>
                        </div>
                    </div>
                </section>

                {/* useFormStatus */}
                <section className="hook-section">
                    <div className="hook-section-header header-blue">
                        <h2>2. useFormStatus</h2>
                    </div>
                    <div className="hook-section-content">
                        <UseFormStatusExample />
                        <div className="hook-description">
                            <p><strong>Use Case:</strong> Track form submission pending state</p>
                            <p><strong>Best For:</strong> Disabling inputs during submission, showing spinners</p>
                        </div>
                    </div>
                </section>

                {/* useOptimistic */}
                <section className="hook-section">
                    <div className="hook-section-header header-orange">
                        <h2>3. useOptimistic</h2>
                    </div>
                    <div className="hook-section-content">
                        <UseOptimisticExample />
                        <div className="hook-description">
                            <p><strong>Use Case:</strong> Update UI optimistically before server confirms</p>
                            <p><strong>Returns:</strong> [optimisticState, addOptimistic]</p>
                            <p><strong>Best For:</strong> Deleting items, toggling, real-time features</p>
                        </div>
                    </div>
                </section>

                {/* useActionState */}
                <section className="hook-section">
                    <div className="hook-section-header header-purple">
                        <h2>4. useActionState</h2>
                    </div>
                    <div className="hook-section-content">
                        <UseActionStateExample />
                        <div className="hook-description">
                            <p><strong>Use Case:</strong> Handle complex async actions with state management</p>
                            <p><strong>Returns:</strong> [state, formAction, isPending]</p>
                            <p><strong>Best For:</strong> Complex forms with validation, multi-step actions</p>
                        </div>
                    </div>
                </section>

                {/* use() */}
                <section className="hook-section">
                    <div className="hook-section-header header-pink">
                        <h2>5. use() Hook</h2>
                    </div>
                    <div className="hook-section-content">
                        <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
                            <UseExample />
                        </Suspense>
                        <div className="hook-description">
                            <p><strong>Use Case:</strong> Unwrap promises in client components</p>
                            <p><strong>Returns:</strong> Resolved promise value</p>
                            <p><strong>Best For:</strong> Passing promises from server components to client</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Comparison Table */}
            <section className="comparison-table-section">
                <div className="hook-section-header header-dark">
                    <h2>Quick Comparison</h2>
                </div>
                <div className="table-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Hook</th>
                                <th>Purpose</th>
                                <th>Returns</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>useFormState</strong></td>
                                <td>Form submission with state</td>
                                <td>[state, formAction]</td>
                                <td>Basic form handling</td>
                            </tr>
                            <tr>
                                <td><strong>useFormStatus</strong></td>
                                <td>Track form pending state</td>
                                <td>{'{ pending, data, ... }'}</td>
                                <td>Loading indicators</td>
                            </tr>
                            <tr>
                                <td><strong>useOptimistic</strong></td>
                                <td>Instant UI updates</td>
                                <td>[state, addOptimistic]</td>
                                <td>Real-time features</td>
                            </tr>
                            <tr>
                                <td><strong>useActionState</strong></td>
                                <td>Advanced action handling</td>
                                <td>[state, action, isPending]</td>
                                <td>Complex forms</td>
                            </tr>
                            <tr>
                                <td><strong>use()</strong></td>
                                <td>Unwrap promises</td>
                                <td>Promise value</td>
                                <td>Server data in client</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Concepts */}
            <section className="key-concepts-section">
                <div className="hook-section-header header-dark">
                    <h2>Key Concepts</h2>
                </div>
                <div className="concepts-grid">
                    <div className="concept-card">
                        <h4>Server Actions</h4>
                        <p>Functions marked with 'use server' that run on the server and can be called from client components</p>
                    </div>
                    <div className="concept-card">
                        <h4>Optimistic Updates</h4>
                        <p>Update the UI immediately with expected result, then sync with server</p>
                    </div>
                    <div className="concept-card">
                        <h4>Form Binding</h4>
                        <p>Pass server actions directly to form action props for seamless integration</p>
                    </div>
                    <div className="concept-card">
                        <h4>Error Handling</h4>
                        <p>Handle validation errors and server errors within the state object</p>
                    </div>
                </div>
            </section>

            <div className="pro-tips-section">
                <h3>Pro Tips</h3>
                <ul>
                    <li>Always use 'use client' directive in components using these hooks</li>
                    <li>Combine useFormStatus with useFormState for complete form control</li>
                    <li>Use useOptimistic for better UX in real-time features</li>
                    <li>Validate on both server and client for security and UX</li>
                    <li>Use use() hook to pass data from server to client components</li>
                </ul>
            </div>
        </div>
    );
}
