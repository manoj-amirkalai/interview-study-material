'use client';

import { useOptimistic } from 'react';
import './HookComponents.css';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

// Simulated server action
async function deleteTodoAction(todoId: string) {
    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would delete from database
    return { success: true, id: todoId };
}

async function toggleTodoAction(todo: Todo) {
    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...todo, completed: !todo.completed };
}

export default function UseOptimisticExample() {
    const [todos, addOptimistic] = useOptimistic<Todo[], { type: string; todo?: Todo; id?: string }>(
        [
            { id: '1', text: 'Learn React 19', completed: false },
            { id: '2', text: 'Master Server Actions', completed: false },
            { id: '3', text: 'Build Real App', completed: false },
        ],
        (state, action) => {
            if (action.type === 'delete') {
                return state.filter(todo => todo.id !== action.id);
            }
            if (action.type === 'toggle') {
                return state.map(todo =>
                    todo.id === action.todo?.id ? { ...todo, completed: !todo.completed } : todo
                );
            }
            return state;
        }
    );

    const handleDelete = (todoId: string) => {
        // Update UI optimistically
        addOptimistic({ type: 'delete', id: todoId });
        deleteTodoAction(todoId);
    };

    const handleToggle = (todo: Todo) => {
        // Update UI optimistically
        addOptimistic({ type: 'toggle', todo });
        toggleTodoAction(todo);
    };

    return (
        <div className="hook-component-container">
            <h2 className="hook-component-title">useOptimistic Example</h2>
            <p className="hook-component-subtitle">Updates UI immediately while server processes changes</p>

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '15px' }}>Your Todos:</h3>
                <ul className="todo-list">
                    {todos.map(todo => (
                        <li key={todo.id} className="todo-item">
                            <div className="todo-item-content">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggle(todo)}
                                    className="todo-item-checkbox"
                                />
                                <span className={`todo-item-text ${todo.completed ? 'completed' : ''}`}>
                                    {todo.text}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(todo.id)}
                                className="btn btn-delete"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="helper-text" style={{ marginTop: '15px' }}>
                ✓ Note: Changes appear instantly! Server validates in background.
            </p>
        </div>
    );
}
