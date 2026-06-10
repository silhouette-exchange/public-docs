import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EndpointCard from './index';

describe('<EndpointCard>', () => {
  it('renders the operation name', () => {
    render(<EndpointCard operation="createOrder" />);
    expect(screen.getByTestId('endpoint-card-operation')).toHaveTextContent('createOrder');
  });

  it('defaults to POST method', () => {
    render(<EndpointCard operation="createOrder" />);
    expect(screen.getByTestId('endpoint-card-method')).toHaveTextContent('POST');
  });

  it('respects an explicit method prop', () => {
    render(<EndpointCard operation="getMarkets" method="GET" />);
    expect(screen.getByTestId('endpoint-card-method')).toHaveTextContent('GET');
  });

  it('applies a method-specific class for colour mapping', () => {
    const { rerender } = render(<EndpointCard operation="a" method="POST" />);
    expect(screen.getByTestId('endpoint-card-method').className).toMatch(/post/i);

    rerender(<EndpointCard operation="a" method="GET" />);
    expect(screen.getByTestId('endpoint-card-method').className).toMatch(/get/i);

    rerender(<EndpointCard operation="a" method="DELETE" />);
    expect(screen.getByTestId('endpoint-card-method').className).toMatch(/delete/i);
  });

  it('shows a bearer auth indicator when auth="bearer"', () => {
    render(<EndpointCard operation="createOrder" auth="bearer" />);
    expect(screen.getByTestId('endpoint-card-auth')).toHaveTextContent(/bearer|jwt|auth/i);
  });

  it('shows an unauthenticated indicator when auth is omitted', () => {
    render(<EndpointCard operation="getMarkets" />);
    const authEl = screen.getByTestId('endpoint-card-auth');
    expect(authEl).toBeInTheDocument();
    expect(authEl).not.toHaveTextContent(/bearer|jwt/i);
  });

  it('renders the description when provided', () => {
    render(<EndpointCard operation="login" description="Authenticate via SIWE and obtain a JWT" />);
    expect(screen.getByText(/Authenticate via SIWE/)).toBeInTheDocument();
  });

  it('links the View affordance to the API reference anchor by default', () => {
    render(<EndpointCard operation="createOrder" />);
    const link = screen.getByTestId('endpoint-card-try');
    expect(link).toHaveAttribute('href', '/api/reference#createOrder');
  });

  it('respects an explicit tryUrl prop', () => {
    render(<EndpointCard operation="createOrder" tryUrl="/api/reference#createOrder" />);
    expect(screen.getByTestId('endpoint-card-try')).toHaveAttribute('href', '/api/reference#createOrder');
  });

  it('gives the Try-it affordance an accessible label', () => {
    render(<EndpointCard operation="createOrder" />);
    const link = screen.getByTestId('endpoint-card-try');
    expect(link).toHaveAccessibleName(/createOrder/i);
  });
});
