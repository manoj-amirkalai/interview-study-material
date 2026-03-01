'use client';

import { use, Suspense, useMemo } from 'react';
import './HookComponents.css';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Simulated async function that returns a promise
function fetchUserData(userId: number): Promise<User> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: userId,
                name: 'John Doe',
                email: 'john@example.com',
                role: 'Senior Developer',
            });
        }, 1500);
    });
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div style={{ padding: '15px', backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
            <p style={{ color: 'var(--color-warning)', marginBottom: '10px' }}>Loading user profile...</p>
            <div className="spinner" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }} />
        </div>
    );
}

// Component that uses the use() hook
function UserProfile(props: Readonly<{ userPromise: Promise<User> }>) {
    // use() unwraps the promise and returns the resolved value
    // This component will suspend until promise resolves
    const user = use(props.userPromise);

    return (
        <div style={{ padding: '15px', backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
            <h3 style={{ marginTop: '0', marginBottom: '15px', color: 'var(--color-accent-primary)' }}>{user.name}</h3>
            <p style={{ margin: '10px 0' }}>
                <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: '10px 0' }}>
                <strong>Role:</strong> {user.role}
            </p>
            <p style={{ margin: '10px 0' }}>
                <strong>ID:</strong> {user.id}
            </p>
        </div>
    );
}

export default function UseExample() {
    // Create a promise (in real app, this might come from server component)
    const userPromise = useMemo(() => fetchUserData(1), []);

    return (
        <div className="hook-component-container">
            <h2 className="hook-component-title">use() Hook Example</h2>
            <p className="hook-component-subtitle">Unwraps promises in client components and supports Suspense</p>

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '10px' }}>Basic Usage:</h3>
                <code className="code-block">
                    const user = use(userPromise);
                </code>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '15px' }}>With Suspense Boundary:</h3>
                <Suspense fallback={<LoadingFallback />}>
                    <UserProfile userPromise={userPromise} />
                </Suspense>
            </div>

            <div className="helper-text" style={{ marginTop: '20px', backgroundColor: 'var(--color-bg-tertiary)', padding: '10px', borderRadius: '4px' }}>
                <h4 style={{ marginTop: '0', marginBottom: '10px', color: 'var(--color-accent-primary)' }}>Key Points:</h4>
                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                    <li>use() unwraps promises and works with Suspense</li>
                    <li>Component suspends until promise resolves</li>
                    <li>Handles rejections as errors</li>
                    <li>Can pass promises from server components</li>
                    <li>Useful for passing data-fetching promises to client components</li>
                </ul>
            </div>
        </div>
    );
}
