import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';

const CopyPageButtonInner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Position at top-right of main content area, left of TOC
  useEffect(() => {
    // Close dropdown on navigation
    setIsOpen(false);

    // Small delay to ensure DOM is updated after navigation
    const timer = setTimeout(() => {
      // Remove any existing container first
      const existingContainer = document.getElementById('copy-page-button-portal');
      if (existingContainer) {
        existingContainer.remove();
      }

      // Find the main content markdown container
      const markdownContainer = document.querySelector('.theme-doc-markdown');
      if (!markdownContainer) return;

      // Make sure the parent has relative positioning for absolute child
      const parent = markdownContainer.parentElement;
      if (parent) {
        parent.style.position = 'relative';
      }

      const container = document.createElement('div');
      container.id = 'copy-page-button-portal';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.right = '0';
      container.style.width = '180px';
      container.style.zIndex = '50';

      // Insert at the beginning of the markdown container's parent
      if (parent) {
        parent.insertBefore(container, parent.firstChild);
      }

      setPortalContainer(container);
    }, 100);

    return () => {
      clearTimeout(timer);
      const existingContainer = document.getElementById('copy-page-button-portal');
      if (existingContainer) {
        existingContainer.remove();
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const clickedOutsideDropdown = !dropdownRef.current || !dropdownRef.current.contains(target);
      if (clickedOutsideContainer && clickedOutsideDropdown) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const getPageMarkdown = (): string => {
    const article = document.querySelector('article');
    if (!article) return '';
    const pageTitle = document.querySelector('h1')?.textContent || 'Documentation';
    const url = window.location.href;
    let markdown = `# ${pageTitle}\n\nSource: ${url}\n\n`;
    const elements = article.querySelectorAll('h1, h2, h3, h4, p, ul, ol, pre, blockquote');
    elements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';
      if (!text) return;
      switch (tagName) {
        case 'h1': markdown += `# ${text}\n\n`; break;
        case 'h2': markdown += `## ${text}\n\n`; break;
        case 'h3': markdown += `### ${text}\n\n`; break;
        case 'h4': markdown += `#### ${text}\n\n`; break;
        case 'p':
          if (el.closest('li')) return;
          markdown += `${text}\n\n`;
          break;
        case 'ul':
          el.querySelectorAll(':scope > li').forEach((li) => { markdown += `- ${li.textContent?.trim()}\n`; });
          markdown += '\n';
          break;
        case 'ol':
          el.querySelectorAll(':scope > li').forEach((li, idx) => { markdown += `${idx + 1}. ${li.textContent?.trim()}\n`; });
          markdown += '\n';
          break;
        case 'pre':
          const code = el.querySelector('code');
          const lang = code?.className?.match(/language-(\w+)/)?.[1] || '';
          markdown += `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
          break;
        case 'blockquote': markdown += `> ${text}\n\n`; break;
      }
    });
    return markdown.trim();
  };

  const handleCopyPage = async () => {
    try {
      await navigator.clipboard.writeText(getPageMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleViewMarkdown = () => {
    const blob = new Blob([getPageMarkdown()], { type: 'text/plain' });
    window.open(URL.createObjectURL(blob), '_blank');
    setIsOpen(false);
  };

  const handleOpenInChatGPT = () => {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(getPageMarkdown())}`, '_blank');
    setIsOpen(false);
  };

  const handleOpenInClaude = () => {
    window.open(`https://claude.ai/new?q=${encodeURIComponent(getPageMarkdown())}`, '_blank');
    setIsOpen(false);
  };

  const buttonContent = (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 0,
          color: '#a1a1aa', fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 13, fontWeight: 400, letterSpacing: '0.5px',
          textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left' }}>{copied ? 'Copied!' : 'Copy page'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 99999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            isolation: 'isolate',
          }}
        >
          <DropdownItem onClick={handleCopyPage} icon="copy" title="Copy page" desc="Copy page as Markdown for LLMs" />
          <DropdownItem onClick={handleViewMarkdown} icon="md" title="View as Markdown" desc="View this page as plain text" />
          <DropdownItem onClick={handleOpenInChatGPT} icon="gpt" title="Open in ChatGPT" desc="Ask questions about this page" />
          <DropdownItem onClick={handleOpenInClaude} icon="claude" title="Open in Claude" desc="Ask questions about this page" last />
        </div>
      )}
    </div>
  );

  if (!portalContainer) return null;

  return createPortal(buttonContent, portalContainer);
};

const DropdownItem = ({ onClick, icon, title, desc, last }: { onClick: () => void; icon: string; title: string; desc: string; last?: boolean }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%',
      padding: '12px 14px', background: 'transparent', border: 'none',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
      color: '#a1a1aa', cursor: 'pointer', textAlign: 'left',
    }}
  >
    {icon === 'copy' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
    {icon === 'md' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8v8l3-3 3 3V8" /><path d="M18 12l-2.5-2.5M18 12l-2.5 2.5M18 12h-5" /></svg>}
    {icon === 'gpt' && <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07z" /></svg>}
    {icon === 'claude' && <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
    <div>
      <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#d4d4d8' }}>{title}</span>
      <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#71717a', marginTop: 2 }}>{desc}</span>
    </div>
  </button>
);

const CopyPageButton: React.FC = () => {
  return (
    <BrowserOnly fallback={null}>
      {() => <CopyPageButtonInner />}
    </BrowserOnly>
  );
};

export default CopyPageButton;
