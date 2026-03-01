'use client';

import { useActionState } from 'react';
import './HookComponents.css';

interface ActionState {
    success: boolean;
    message: string;
    errors?: Record<string, string>;
    data?: any;
}

// Server action for updating user profile
async function updateProfileAction(
    _previousState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const username = formData.get('username');
    const bio = formData.get('bio');
    const website = formData.get('website');

    // Validate inputs
    const errors: Record<string, string> = {};

    if (!username || (username as string).trim().length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }

    if (website && !(website as string).startsWith('http')) {
        errors.website = 'Website must start with http or https';
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: 'Validation failed',
            errors,
        };
    }

    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
        success: true,
        message: 'Profile updated successfully!',
        data: {
            username,
            bio,
            website,
        },
    };
}

export default function UseActionStateExample() {
    // useActionState is similar to useFormState but more general
    // Returns: [state, action, isPending]
    const [state, formAction, isPending] = useActionState(updateProfileAction, {
        success: false,
        message: '',
    });

    return (
        <div className="hook-component-container">
            <h2 className="hook-component-title">useActionState Example</h2>
            <p className="hook-component-subtitle">Manages action state with loading, error, and success handling</p>

            <form action={formAction}>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter username"
                        required
                        disabled={isPending}
                        className="form-input"
                    />
                    {state.errors?.username && (
                        <div className="error-text">
                            {state.errors.username}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="bio" className="form-label">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself"
                        rows={3}
                        disabled={isPending}
                        className="form-textarea"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="website" className="form-label">Website:</label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        placeholder="https://example.com"
                        disabled={isPending}
                        className="form-input"
                    />
                    {state.errors?.website && (
                        <div className="error-text">
                            {state.errors.website}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary"
                >
                    {isPending ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            {state.success && (
                <div className="alert alert-success">
                    <strong>✓ {state.message}</strong>
                    {state.data && (
                        <pre className="code-block">
                            {JSON.stringify(state.data, null, 2)}
                        </pre>
                    )}
                </div>
            )}

            {!state.success && state.message && (
                <div className="alert alert-error">
                    <strong>✗ {state.message}</strong>
                </div>
            )}

            <div className="helper-text" style={{ marginTop: '20px', backgroundColor: 'var(--color-bg-tertiary)', padding: '10px', borderRadius: '4px' }}>
                <h4 style={{ marginTop: '0', marginBottom: '10px', color: 'var(--color-accent-primary)' }}>useActionState vs useFormState:</h4>
                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                    <li><strong>useActionState</strong>: More general, works with any async action</li>
                    <li><strong>useFormStatus</strong>: Returns pending boolean for form status</li>
                    <li><strong>Returns</strong>: [state, action, isPending]</li>
                    <li>Can handle complex validation and multi-step actions</li>
                </ul>
            </div>
        </div>
    );
}
