import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('vitest smoke test', () => {
  it('renders a React element', () => {
    render(<div data-testid="smoke">hello</div>);
    expect(screen.getByTestId('smoke')).toHaveTextContent('hello');
  });

  it('has jsdom environment', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  it('has jest-dom matchers loaded', () => {
    render(<button disabled>click</button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
