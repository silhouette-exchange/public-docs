import React from 'react';

// Skip to content link for accessibility
function SkipToContent() {
  return (
    <a href="#__docusaurus_skipToContent_fallback" className="skip-to-content">
      Skip to main content
    </a>
  );
}

export default function Root({ children }) {
  return (
    <>
      <SkipToContent />
      {children}
    </>
  );
}
