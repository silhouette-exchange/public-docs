import React from 'react';
import './styles.css';

/*
 * Designer-authored RFQ trade-lifecycle diagram. The SVG is rendered verbatim
 * so it stays byte-for-byte with the source asset; all styling lives in
 * styles.css, scoped under .tradeLifecycleChart. No user input flows in here,
 * so the static markup is safe to inject.
 */
const SVG = `<svg viewBox="55 0 1120 1240" role="img" aria-label="Trade lifecycle flowchart: taker submits RFQ, quote window opens, makers submit quotes, a quote is selected leading either to cancelled or failed, or to quoted and settlement, which then either settles or fails.">
  <defs>
    <marker id="tl-arrow" viewBox="0 0 10 10" refX="8.6" refY="5" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="15" orient="auto">
      <path class="arrow-fill" d="M1,1 L9,5 L1,9 L3.4,5 Z"></path>
    </marker>
  </defs>

  <g>
    <path class="edge" style="--d:.15s" d="M540,108 L540,156" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:1.5s" pathLength="1" d="M540,108 L540,156"></path>

    <path class="edge" style="--d:.30s" d="M540,234 L540,282" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:1.65s" pathLength="1" d="M540,234 L540,282"></path>

    <path class="edge" style="--d:.45s" d="M540,360 L540,406" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:1.8s" pathLength="1" d="M540,360 L540,406"></path>

    <path class="edge" style="--d:.64s" d="M540,588 C 470,636 250,632 250,668" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:1.95s" pathLength="1" d="M540,588 C 470,636 250,632 250,668"></path>

    <path class="edge" style="--d:.64s" d="M540,588 C 610,636 830,632 830,668" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:1.95s" pathLength="1" d="M540,588 C 610,636 830,632 830,668"></path>

    <path class="edge" style="--d:.82s" d="M830,766 L830,836" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:2.1s" pathLength="1" d="M830,766 L830,836"></path>

    <path class="edge" style="--d:1s" d="M830,1018 C 760,1058 665,1066 665,1098" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:2.25s" pathLength="1" d="M830,1018 C 760,1058 665,1066 665,1098"></path>

    <path class="edge" style="--d:1s" d="M830,1018 C 900,1058 995,1066 995,1098" marker-end="url(#tl-arrow)"></path>
    <path class="flow" style="--gd:2.25s" pathLength="1" d="M830,1018 C 900,1058 995,1066 995,1098"></path>
  </g>

  <text class="t-cyan" style="font-weight:500" x="374" y="78" font-size="11" text-anchor="end" letter-spacing="0.1em">01</text>
  <text class="t-cyan" style="font-weight:500" x="374" y="204" font-size="11" text-anchor="end" letter-spacing="0.1em">02</text>
  <text class="t-cyan" style="font-weight:500" x="374" y="330" font-size="11" text-anchor="end" letter-spacing="0.1em">03</text>

  <g class="node-in" style="--d:.05s">
    <rect class="shape node" x="390" y="36" width="300" height="72" rx="14"></rect>
    <text class="t-default" x="540" y="79" font-size="19" text-anchor="middle">Taker submits RFQ</text>
  </g>
  <g class="node-in" style="--d:.20s">
    <rect class="shape node" x="390" y="162" width="300" height="72" rx="14"></rect>
    <text class="t-default" x="540" y="205" font-size="19" text-anchor="middle">Quote window opens</text>
  </g>
  <g class="node-in" style="--d:.35s">
    <rect class="shape node" x="390" y="288" width="300" height="72" rx="14"></rect>
    <text class="t-default" x="540" y="331" font-size="19" text-anchor="middle">Makers submit quotes</text>
  </g>

  <g class="node-in" style="--d:.52s">
    <polygon class="shape decision" points="540,412 665,500 540,588 415,500"></polygon>
    <text class="t-default" x="540" y="506" font-size="18" text-anchor="middle">Quote selected</text>
  </g>

  <g class="node-in" style="--d:.64s">
    <rect class="chip chip-pink" x="271" y="615" width="160" height="26" rx="7"></rect>
    <text class="t-pink label" x="351" y="632" font-size="11" text-anchor="middle" letter-spacing="0.06em">NO QUOTE ACCEPTED</text>
  </g>
  <g class="node-in" style="--d:.64s">
    <rect class="chip chip-cyan" x="630" y="615" width="172" height="26" rx="7"></rect>
    <text class="t-cyan label" x="716" y="632" font-size="11" text-anchor="middle" letter-spacing="0.06em">MANUAL OR AUTO-ACCEPT</text>
  </g>

  <g class="node-in" style="--d:.72s">
    <rect class="shape state-pink" x="100" y="674" width="300" height="92" rx="14"></rect>
    <circle class="d-pink pulse-dot" cx="122" cy="696" r="5"></circle>
    <text text-anchor="middle" x="250" y="726" font-size="16" letter-spacing="0.04em">
      <tspan class="t-pink label">CANCELLED</tspan><tspan class="t-dim" font-size="14" font-weight="400" letter-spacing="0"> or </tspan><tspan class="t-pink label">FAILED</tspan>
    </text>
  </g>

  <g class="node-in" style="--d:.72s">
    <rect class="shape state-active" x="680" y="674" width="300" height="92" rx="14"></rect>
    <circle class="d-cyan pulse-dot" cx="702" cy="696" r="5"></circle>
    <text class="t-cyan label" x="830" y="714" font-size="15" text-anchor="middle" letter-spacing="0.08em">QUOTED</text>
    <text class="t-dim" x="830" y="738" font-size="14" text-anchor="middle">settlement starts</text>
  </g>

  <g class="node-in" style="--d:.85s">
    <polygon class="shape decision" points="830,842 955,930 830,1018 705,930"></polygon>
    <text class="t-default" x="830" y="925" font-size="16" text-anchor="middle">Settlement</text>
    <text class="t-default" x="830" y="947" font-size="16" text-anchor="middle">succeeds?</text>
  </g>

  <g class="node-in" style="--d:1s">
    <rect class="chip chip-cyan" x="668" y="1040" width="46" height="24" rx="7"></rect>
    <text class="t-cyan label" x="691" y="1056" font-size="11" text-anchor="middle" letter-spacing="0.08em">YES</text>
  </g>
  <g class="node-in" style="--d:1s">
    <rect class="chip chip-pink" x="926" y="1040" width="42" height="24" rx="7"></rect>
    <text class="t-pink label" x="947" y="1056" font-size="11" text-anchor="middle" letter-spacing="0.08em">NO</text>
  </g>

  <g class="node-in" style="--d:1.08s">
    <rect class="shape state-cyan" x="530" y="1104" width="270" height="92" rx="14"></rect>
    <circle class="d-cyan pulse-dot" cx="552" cy="1126" r="5"></circle>
    <text class="t-cyan label" x="665" y="1144" font-size="15" text-anchor="middle" letter-spacing="0.08em">SETTLED</text>
    <text class="t-dim" x="665" y="1168" font-size="14" text-anchor="middle">trade complete</text>
  </g>

  <g class="node-in" style="--d:1.08s">
    <rect class="shape state-pink" x="860" y="1104" width="270" height="92" rx="14"></rect>
    <circle class="d-pink pulse-dot" cx="882" cy="1126" r="5"></circle>
    <text class="t-pink label" x="995" y="1144" font-size="15" text-anchor="middle" letter-spacing="0.08em">FAILED</text>
    <text class="t-dim" x="995" y="1168" font-size="14" text-anchor="middle">funds released</text>
  </g>
</svg>`;

export default function TradeLifecycle(): React.ReactElement {
  return (
    <figure className="tradeLifecycleChart">
      <div className="tlLegend">
        <span><span className="tlDot neutral" /> Process step</span>
        <span><span className="tlDot cyan" /> Active / settled</span>
        <span><span className="tlDot pink" /> Cancelled / failed</span>
      </div>
      <div className="tlChart" dangerouslySetInnerHTML={{ __html: SVG }} />
    </figure>
  );
}
