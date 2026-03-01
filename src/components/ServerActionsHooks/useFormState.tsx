'use client';

import { useFormState } from 'react-dom';
import './HookComponents.css';

interface FormState {
    error: string;
    success: boolean;
    message: string;
}

// Server Action (would be in a separate server file)
async function submitFormAction(_previousState: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;

    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !name) {
        return {
            error: 'Email and name are required',
            success: false,
            message: '',
        };
    }

    if (!email.includes('@')) {
        return {
            error: 'Invalid email address',
            success: false,
            message: '',
        };
    }

    return {
        success: true,
        message: `User ${name} registered successfully with email ${email}`,
        error: '',
    };
}

export default function UseFormStateExample() {
    // useFormState returns [state, formAction]
    // state: Result from the server action
    // formAction: Function to pass to form's action prop
    const [state, formAction] = useFormState(submitFormAction, {
        error: '',
        success: false,
        message: '',
    });

    return (
        <div className="hook-component-container">
            <h2 className="hook-component-title">useFormState Example</h2>
            <p className="hook-component-subtitle">Manages form state with server actions seamlessly</p>

            <form action={formAction}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="form-input"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>

            {state.error && (
                <div className="alert alert-error">
                    Error: {state.error}
                </div>
            )}

            {state.success && (
                <div className="alert alert-success">
                    ✓ {state.message}
                </div>
            )}
        </div>
    );
}
