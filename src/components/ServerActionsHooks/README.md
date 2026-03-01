# React 19 Server Actions Hooks - Complete Guide

This folder contains comprehensive examples of React 19 Server Actions and related hooks.

##📁 Files Overview

### 1. **useFormState.tsx**

Manages form submission state with server actions.

```jsx
const [state, formAction] = useFormState(serverAction, initialState);

<form action={formAction}>{/* form fields */}</form>;
```

**Key Features:**

- Automatic handling of form submission
- Access to server response in state
- Perfect for displaying success/error messages
- Resets on form submission

**Best For:**

- Traditional form submissions
- Displaying validation errors from server
- Showing success confirmations

---

### 2. **useFormStatus.tsx**

Tracks the pending state of a form submission.

```jsx
const { pending, data, method, action } = useFormStatus();

<button disabled={pending}>{pending ? "Loading..." : "Submit"}</button>;
```

**Key Features:**

- Returns `pending` boolean while form is submitting
- Access to FormData being submitted
- Must be used in a component inside the form
- Works with useFormState

**Best For:**

- Disabling inputs during submission
- Showing loading spinners
- Displaying form status messages

---

### 3. **useOptimistic.tsx**

Updates the UI immediately with optimistic values before server confirmation.

```jsx
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (state, action) => {
    // Update state optimistically
    return updatedState;
  },
);

const handleDelete = (id) => {
  addOptimistic({ type: "delete", id });
  deleteFromServer(id);
};
```

**Key Features:**

- Instant UI feedback without waiting for server
- Automatically reverts if server action fails
- Requires an updater function
- Works with useTransition for concurrent updates

**Best For:**

- Deleting list items
- Toggling states
- Like/upvote features
- Removing items from lists

---

### 4. **useActionState.tsx**

General-purpose hook for handling async actions with state management.

```jsx
const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    // Action logic
    return newState;
  },
  initialState,
);
```

**Key Features:**

- Returns `[state, action, isPending]`
- More flexible than useFormState
- Can handle complex validation
- Perfect for non-form async actions

**Best For:**

- Complex form handling
- Multi-step actions
- Custom state management
- Advanced validation

---

### 5. **use.tsx**

Unwraps promises in client components, enabling Suspense boundaries.

```jsx
const data = use(promise);

<Suspense fallback={<Loading />}>
  <Component />
</Suspense>;
```

**Key Features:**

- Unwraps promises synchronously
- Works with React Suspense
- Enables component suspension
- Perfect for server-to-client data passing

**Best For:**

- Passing promises from server components
- Conditional promise handling
- Suspense-based loading states
- Data fetching in server components

---

## 🎯 Comparison Table

| Hook               | Purpose                    | Returns                      | Use Case                             |
| ------------------ | -------------------------- | ---------------------------- | ------------------------------------ |
| **useFormState**   | Form submission management | `[state, formAction]`        | Basic forms with server responses    |
| **useFormStatus**  | Track form pending state   | `{ pending, data, ... }`     | Loading indicators & input disabling |
| **useOptimistic**  | Instant UI updates         | `[state, addOptimistic]`     | Real-time list updates, deletions    |
| **useActionState** | Advanced action handling   | `[state, action, isPending]` | Complex forms & validation           |
| **use()**          | Promise unwrapping         | Resolved value               | Server data in client components     |

---

## 💡 Key Concepts

### Server Actions

Functions that run on the server and can be called from client components:

```jsx
"use server";

export async function submitForm(formData) {
  // Server-only code
  const email = formData.get("email");
  // Database operations, validation, etc.
  return { success: true, message: "Submitted!" };
}
```

### Optimistic Updates

Update the UI instantly with expected changes, then reconcile with server:

```jsx
const [todos, addOptimistic] = useOptimistic(initialTodos, reducer);

// UI updates immediately
addOptimistic({ type: "delete", id: 1 });
// Server processes in background
await deleteTodo(1);
```

### Form Binding

Pass server actions directly to form action props:

```jsx
<form action={serverAction}>
  <input name="email" />
  <button type="submit">Submit</button>
</form>
```

---

## 🚀 Usage Examples

### Example 1: Simple Form with useFormState

```jsx
"use client";

async function submitAction(previousState, formData) {
  const email = formData.get("email");
  // Validation and processing...
  return { success: true, message: "Success!" };
}

export default function Form() {
  const [state, formAction] = useFormState(submitAction, {});

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button type="submit">Submit</button>
      {state.success && <p>{state.message}</p>}
    </form>
  );
}
```

### Example 2: Real-time List with useOptimistic

```jsx
"use client";

export default function TodoList({ initialTodos }) {
  const [todos, addOptimistic] = useOptimistic(
    initialTodos,
    (state, action) => {
      if (action.type === "delete") {
        return state.filter((t) => t.id !== action.id);
      }
      return state;
    },
  );

  const handleDelete = async (id) => {
    addOptimistic({ type: "delete", id });
    await deleteTodo(id);
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Example 3: Loading State with useFormStatus

```jsx
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>{pending ? "Submitting..." : "Submit"}</button>
  );
}

export default function Form() {
  return (
    <form action={submitAction}>
      <input name="email" />
      <SubmitButton />
    </form>
  );
}
```

### Example 4: Complex Validation with useActionState

```jsx
"use client";

async function validateForm(previousState, formData) {
  const errors = {};

  const email = formData.get("email");
  if (!email.includes("@")) {
    errors.email = "Invalid email";
  }

  if (Object.keys(errors).length) {
    return { success: false, errors };
  }

  // Server processing...
  return { success: true, message: "Updated!" };
}

export default function Form() {
  const [state, formAction, isPending] = useActionState(validateForm, {
    success: false,
    errors: {},
  });

  return (
    <form action={formAction}>
      <input name="email" />
      {state.errors?.email && <span>{state.errors.email}</span>}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

---

## ✅ Best Practices

1. **Always use 'use client'** at the top of client components
2. **Separate form and status** - Use useFormStatus in a separate component
3. **Handle errors gracefully** - Always include error state in responses
4. **Validate on both sides** - Client for UX, server for security
5. **Use optimistic updates** for better perceived performance
6. **Combine hooks** - useFormState + useFormStatus for complete control
7. **Type your actions** - Use TypeScript for better DX

---

## 🎓 Interview Questions

### Q1: What's the difference between useFormState and useActionState?

**A:** `useFormState` is specifically for forms and resets on submission. `useActionState` is more general and returns an `isPending` boolean, making it suitable for any async action, not just forms.

### Q2: When should you use useOptimistic?

**A:** Use it when you want instant UI feedback without waiting for server confirmation. Common cases: deleting items, toggling follow states, liking posts. If the server request fails, React automatically reverts the optimistic update.

### Q3: How does the use() hook work with Suspense?

**A:** The `use()` hook unwraps a promise and triggers Suspense if not resolved. Once resolved, the component renders with the unwrapped value. Perfect for passing promises from server to client components.

### Q4: Why would you use useFormStatus instead of tracking pending manually?

**A:** `useFormStatus` automatically tracks the form's submission state without manual state management. It works seamlessly with server actions and provides built-in access to form data being submitted.

### Q5: Can you combine multiple hooks in one form?

**A:** Yes! Commonly used together:

- `useFormState` for overall state management
- `useFormStatus` for pending status in a separate button component
- `useOptimistic` for instant list updates if needed

---

## 📚 Resources

- [React 19 Documentation](https://react.dev)
- [Server Actions](https://react.dev/docs/guides/server-actions)
- [useFormState](https://react.dev/reference/react-dom/useFormState)
- [useFormStatus](https://react.dev/reference/react-dom/useFormStatus)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [useActionState](https://react.dev/reference/react/useActionState)
- [use() Hook](https://react.dev/reference/react/use)

---

## 🔧 Running the Examples

All examples are ready to use in your React 19 project. Simply import them:

```jsx
import { UseFormStateExample } from "@/components/ServerActionsHooks";
import { UseOptimisticExample } from "@/components/ServerActionsHooks";
// ... etc
```

Or view the showcase:

```jsx
import ServerActionsShowcase from "@/components/ServerActionsHooks/ServerActionsShowcase";
```

---

Created: 2026 | React 19 Server Actions Pattern Learning
