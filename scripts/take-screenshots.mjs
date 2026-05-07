#!/usr/bin/env node
/**
 * Automated screenshot capture for Silhouette docs.
 *
 * Injects a mock wallet provider using TEST_WALLET_PK from .env.local,
 * authenticates against app.silhouette.exchange, and captures product
 * screenshots for the docs site.
 *
 * Usage: node scripts/take-screenshots.mjs
 */

import puppeteer from 'puppeteer';
import { ethers } from 'ethers';
import { mkdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'static', 'img', 'app-screenshots');
const TRADE_URL = 'https://app.silhouette.exchange/trade';

async function loadPrivateKey() {
  const envPath = join(__dirname, '..', '.env.local');
  const content = await readFile(envPath, 'utf-8');
  const match = content.match(/^TEST_WALLET_PK=(.+)$/m);
  if (!match) throw new Error('TEST_WALLET_PK not found in .env.local');
  return match[1].trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function setupWalletInjection(page, wallet) {
  const address = wallet.address;

  await page.exposeFunction('__eth_signMessage', async (message) => {
    return wallet.signMessage(
      typeof message === 'string' && message.startsWith('0x')
        ? ethers.getBytes(message)
        : message
    );
  });

  await page.exposeFunction('__eth_signTypedData', async (typedDataJson) => {
    const typedData = JSON.parse(typedDataJson);
    const { domain, types, message } = typedData;
    const sigTypes = { ...types };
    delete sigTypes.EIP712Domain;
    return wallet.signTypedData(domain, sigTypes, message);
  });

  await page.exposeFunction('__eth_getAddress', () => address);

  await page.evaluateOnNewDocument(`
    (function() {
      let connected = false;

      const provider = {
        isMetaMask: true,
        _metamask: { isUnlocked: () => Promise.resolve(true) },
        chainId: '0xa4b1',
        networkVersion: '42161',
        selectedAddress: null,
        _events: {},

        on(event, cb) {
          if (!this._events[event]) this._events[event] = [];
          this._events[event].push(cb);
          return this;
        },
        removeListener(event, cb) {
          if (this._events[event]) {
            this._events[event] = this._events[event].filter(f => f !== cb);
          }
          return this;
        },
        removeAllListeners(event) {
          if (event) delete this._events[event];
          else this._events = {};
          return this;
        },
        emit(event, ...args) {
          (this._events[event] || []).forEach(cb => cb(...args));
        },

        async request({ method, params }) {
          switch (method) {
            case 'eth_requestAccounts':
            case 'eth_accounts': {
              if (!connected) {
                const addr = await window.__eth_getAddress();
                provider.selectedAddress = addr;
                connected = true;
                provider.emit('accountsChanged', [addr]);
                provider.emit('connect', { chainId: provider.chainId });
              }
              return [provider.selectedAddress];
            }
            case 'eth_chainId':
              return provider.chainId;
            case 'net_version':
              return provider.networkVersion;
            case 'personal_sign': {
              const [message] = params;
              return await window.__eth_signMessage(message);
            }
            case 'eth_sign': {
              const [, message] = params;
              return await window.__eth_signMessage(message);
            }
            case 'eth_signTypedData':
            case 'eth_signTypedData_v3':
            case 'eth_signTypedData_v4': {
              const [, typedData] = params;
              const data = typeof typedData === 'string' ? typedData : JSON.stringify(typedData);
              return await window.__eth_signTypedData(data);
            }
            case 'wallet_switchEthereumChain': {
              const [{ chainId }] = params;
              provider.chainId = chainId;
              provider.networkVersion = String(parseInt(chainId, 16));
              provider.emit('chainChanged', chainId);
              return null;
            }
            case 'wallet_addEthereumChain':
              return null;
            case 'eth_getBalance':
              return '0x0';
            case 'eth_blockNumber':
              return '0x1';
            case 'eth_estimateGas':
              return '0x5208';
            case 'eth_call':
              return '0x';
            case 'wallet_getPermissions':
              return [{ parentCapability: 'eth_accounts' }];
            case 'wallet_requestPermissions':
              return [{ parentCapability: 'eth_accounts' }];
            default:
              console.warn('[mock-wallet] unhandled:', method);
              throw new Error('Method not supported: ' + method);
          }
        },

        send(method, params) {
          if (typeof method === 'string') return this.request({ method, params });
          return this.request(method);
        },
        sendAsync(payload, cb) {
          this.request(payload)
            .then(result => cb(null, { id: payload.id, jsonrpc: '2.0', result }))
            .catch(err => cb(err));
        },
      };

      window.ethereum = provider;
      window.dispatchEvent(new Event('ethereum#initialized'));

      const info = {
        uuid: 'silhouette-test-wallet',
        name: 'Test Wallet',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
        rdns: 'io.metamask',
      };
      window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
          detail: Object.freeze({ info, provider }),
        })
      );
      window.addEventListener('eip6963:requestProvider', () => {
        window.dispatchEvent(
          new CustomEvent('eip6963:announceProvider', {
            detail: Object.freeze({ info, provider }),
          })
        );
      });
    })();
  `);
}

async function waitForAuth(page, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const authed = await page.evaluate(() => {
      return document.body.innerText.includes('Portfolio') ||
             document.body.innerText.includes('Balances') ||
             document.body.innerText.includes('Silhouette Spot');
    });
    if (authed) return true;
    await sleep(2000);
  }
  return false;
}

async function captureElement(page, selector, filename) {
  const el = await page.$(selector);
  if (el) {
    await el.screenshot({ path: join(OUT, filename) });
    console.log(`  ${filename}`);
    return true;
  }
  console.log(`  ${filename} - selector not found: ${selector}`);
  return false;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const pk = await loadPrivateKey();
  const wallet = new ethers.Wallet(pk);
  console.log(`Wallet: ${wallet.address}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1440,1000'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = (await browser.pages())[0];
  await setupWalletInjection(page, wallet);

  console.log('Loading trade page...');
  await page.goto(TRADE_URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await sleep(5000);

  console.log('Waiting for auth...');
  const authed = await waitForAuth(page);
  if (!authed) {
    console.log('Auth not detected after 60s. Taking screenshots anyway.');
  } else {
    console.log('Authenticated!\n');
  }

  await sleep(3000);

  // ── 1. Full trade page ────────────────────────────────────
  console.log('Capturing:');
  await page.screenshot({ path: join(OUT, 'trade-full.png'), fullPage: false });
  console.log('  trade-full.png');

  // ── 2. Balances panel (bottom strip) ──────────────────────
  // Click Balances tab
  const tabs = await page.$$('button, [role="tab"], a');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent?.trim(), tab);
    if (text === 'Balances') {
      await tab.click();
      await sleep(2000);
      break;
    }
  }
  await page.screenshot({ path: join(OUT, 'trade-balances.png'), fullPage: false });
  console.log('  trade-balances.png');

  // ── 3. Transfer modal ─────────────────────────────────────
  // Find and click a Transfer button
  const allButtons = await page.$$('button');
  let transferClicked = false;
  for (const btn of allButtons) {
    const text = await page.evaluate(el => el.textContent?.trim(), btn);
    if (text === 'Transfer') {
      const isVisible = await page.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }, btn);
      if (isVisible) {
        await btn.click();
        transferClicked = true;
        await sleep(2000);
        break;
      }
    }
  }

  if (transferClicked) {
    await page.screenshot({ path: join(OUT, 'transfer-modal.png'), fullPage: false });
    console.log('  transfer-modal.png');

    // Close modal - press Escape
    await page.keyboard.press('Escape');
    await sleep(1000);
  } else {
    console.log('  transfer-modal.png - Transfer button not found');
  }

  // ── 4. At different viewport for responsive ────────────────
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await sleep(2000);
  await page.screenshot({ path: join(OUT, 'trade-1280.png'), fullPage: false });
  console.log('  trade-1280.png');

  console.log(`\nDone! Screenshots in static/img/app-screenshots/`);
  console.log('Browser stays open for manual inspection. Ctrl+C to exit.');

  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
