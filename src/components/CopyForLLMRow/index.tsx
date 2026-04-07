import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

function getMarkdownUrl(pathname: string): string {
  const clean = pathname.replace(/\/$/, '');
  return `${clean}.md`;
}

function buildPromptPrefix(): string {
  return 'Here are the Silhouette Exchange docs for the page I was just reading. Answer my follow-up questions using only what is in these docs when possible.\n\n';
}

export default function CopyForLLMRow(): JSX.Element {
  return (
    <BrowserOnly>{() => <CopyForLLMRowInner />}</BrowserOnly>
  );
}

function CopyForLLMRowInner(): JSX.Element {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const mdUrl = getMarkdownUrl(location.pathname);
  const absoluteMdUrl =
    typeof window !== 'undefined'
      ? new URL(mdUrl, window.location.origin).toString()
      : mdUrl;

  async function handleCopy() {
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error('markdown fetch failed');
      const md = await res.text();
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error(e);
      setCopied(false);
    }
  }

  function handleOpenInChatGPT() {
    const prompt = buildPromptPrefix() + `Source: ${absoluteMdUrl}`;
    window.open(
      `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function handleOpenInClaude() {
    const prompt = buildPromptPrefix() + `Source: ${absoluteMdUrl}`;
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <div className={styles.row} aria-label="Open this page in an AI assistant">
      <span className={styles.label}>Use with AI</span>
      <button type="button" className={styles.btn} onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy as Markdown'}
      </button>
      <button type="button" className={styles.btn} onClick={handleOpenInChatGPT}>
        Open in ChatGPT
      </button>
      <button type="button" className={styles.btn} onClick={handleOpenInClaude}>
        Open in Claude
      </button>
      <a
        className={styles.btn}
        href={mdUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        View .md
      </a>
    </div>
  );
}
