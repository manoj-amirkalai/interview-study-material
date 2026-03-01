'use client';

import { useFormStatus } from 'react-dom';
import './HookComponents.css';

// Server action
async function sendEmailAction(formData: FormData): Promise<void> {
    const to = formData.get('to') as string;

    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In real app, send email here
    console.log(`Email sent to ${to}`);
}

// Separate component for submit button
// Must be inside form's client component but separate from form tag
function SubmitButton() {
    // useFormStatus tells us if form is submitting
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="btn btn-primary"
            style={{ width: pending ? '100%' : 'auto' }}
        >
            {pending ? 'Sending...' : 'Send Email'}
        </button>
    );
}

export default function UseFormStatusExample() {
    return (
        <div className="hook-component-container">
            <h2 className="hook-component-title">useFormStatus Example</h2>
            <p className="hook-component-subtitle">Tracks form submission state to disable input and show loading state</p>

            <form action={sendEmailAction}>
                <div className="form-group">
                    <label htmlFor="to" className="form-label">To:</label>
                    <input
                        type="email"
                        id="to"
                        name="to"
                        placeholder="recipient@example.com"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Email subject"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message" className="form-label">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Your message here"
                        rows={5}
                        required
                        className="form-textarea"
                    />
                </div>

                <SubmitButton />
            </form>

            <div className="helper-text" style={{ marginTop: '20px' }}>
                <h4 style={{ marginTop: '10px', marginBottom: '10px', color: 'var(--color-accent-primary)' }}>What useFormStatus provides:</h4>
                <ul style={{ paddingLeft: '20px' }}>
                    <li><strong>pending</strong>: true while form is submitting</li>
                    <li><strong>data</strong>: FormData object being submitted</li>
                    <li><strong>method</strong>: HTTP method (POST, GET, etc.)</li>
                    <li><strong>action</strong>: Action function being called</li>
                </ul>
            </div>
        </div>
    );
}
