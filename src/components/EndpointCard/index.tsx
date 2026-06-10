import React from 'react';
import styles from './styles.module.css';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
export type AuthMode = 'none' | 'bearer';

export interface EndpointCardProps {
  operation: string;
  method?: HttpMethod;
  path?: string;
  auth?: AuthMode;
  description?: string;
  tryUrl?: string;
}

function LockIcon() {
  return (
    <svg
      className={styles.authIcon}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="5.5"
        width="7"
        height="5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M4 5.5V3.75a2 2 0 0 1 4 0V5.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg
      className={styles.authIcon}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 6h6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className={styles.tryArrow}
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 5h10M6 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function EndpointCard({
  operation,
  method = 'POST',
  path = '/v0',
  auth = 'none',
  description,
  tryUrl,
}: EndpointCardProps) {
  const methodClass = styles[method.toLowerCase()] ?? '';
  const href = tryUrl ?? `/api/reference#${operation}`;
  const isBearer = auth === 'bearer';
  const authTitle = isBearer
    ? `Requires a bearer JWT. Call login first to obtain one.`
    : `No authentication required. Public endpoint under ${path}.`;
  const authLabel = isBearer ? 'bearer JWT' : 'public';

  return (
    <div
      className={styles.card}
      data-testid="endpoint-card"
      data-method={method}
      data-auth={auth}
    >
      <div className={styles.left}>
        <span
          className={`${styles.method} ${methodClass}`}
          data-testid="endpoint-card-method"
        >
          {method}
        </span>

        <div className={styles.identity}>
          <span
            className={styles.operation}
            data-testid="endpoint-card-operation"
            tabIndex={0}
          >
            {operation}
          </span>
          {description && (
            <span className={styles.description} tabIndex={0}>
              {description}
            </span>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <span
          className={`${styles.auth} ${isBearer ? styles.authBearer : styles.authNone}`}
          data-testid="endpoint-card-auth"
          title={authTitle}
          tabIndex={0}
        >
          {isBearer ? <LockIcon /> : <DashIcon />}
          <span className={styles.authLabel}>{authLabel}</span>
        </span>

        <a
          className={styles.tryLink}
          href={href}
          data-testid="endpoint-card-try"
          aria-label={`Open ${operation} in the API reference`}
        >
          <span>View</span>
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}
