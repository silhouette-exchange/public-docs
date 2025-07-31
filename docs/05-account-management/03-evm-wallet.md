---
title: EVM Wallets
sidebar_label: EVM Wallets
pagination_label: EVM Wallets
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

Your EVM wallet serves as your primary identity and security anchor in the Silhouette ecosystem. It controls deposits, withdrawals, and encryption key management while maintaining complete custody of your assets.

## Wallet Functions

There are certain functions that only the EVM wallet can perform, namely:
- Deposits
- Update encryption key

The remaining functions can be performed by both the EVM and Managed Wallets:
- Create an order
- Cancel an order
- Update (create or replace) the Managed Wallet
- Withdraw

<ThemedImage
  alt="EVM Diagram"
  sources={{
    light: useBaseUrl('/img/evm-light.svg'),
    dark: useBaseUrl('/img/evm-dark.svg'),
  }}
/>

## Compatible Wallets

### Recommended Wallets

#### MetaMask
**Best for**: Beginners and general use
- **Setup**: Download from [metamask.io](https://metamask.io)
- **Security**: Hardware wallet support, transaction simulation
- **Mobile**: Full mobile app support
- **Gas Management**: Automatic gas estimation with user control

#### WalletConnect
**Best for**: Mobile-first users and hardware wallet integration
- **Setup**: No download required, scan QR codes
- **Supported Wallets**: Trust Wallet, Rainbow, Coinbase Wallet, and 100+ others
- **Security**: Non-custodial, direct device communication
- **Hardware Support**: Works with Ledger, Trezor via mobile apps

#### Hardware Wallets (Direct)
**Best for**: Maximum security for large accounts
- **Ledger**: Use with Ledger Live or MetaMask
- **Trezor**: Use with Trezor Suite or MetaMask
- **Security**: Private keys never leave the device
- **Setup**: Requires additional software configuration

#### Coinbase Wallet
**Best for**: Coinbase ecosystem users
- **Features**: Built-in DeFi browser, NFT support
- **Security**: User-controlled private keys (non-custodial)
- **Mobile**: Excellent mobile experience

### Wallet Compatibility Requirements

To work with Silhouette, your wallet must support:
- **EIP-1559**: For efficient gas pricing on HyperEVM
- **Personal Sign**: For authentication without gas costs
- **Custom Networks**: To connect to HyperEVM
- **dApp Browser/WalletConnect**: For webapp integration

## Step-by-Step Integration Guide

### MetaMask Setup

#### 1. Install MetaMask
```bash
# Visit metamask.io and install browser extension
# Or download mobile app from app store
```

#### 2. Add HyperEVM Network
1. Open MetaMask → Networks → Add Network
2. Enter network details:
   ```
   Network Name: HyperEVM
   RPC URL: https://api.hyperliquid-testnet.xyz/evm  # Replace with mainnet
   Chain ID: 998  # Replace with mainnet chain ID
   Currency Symbol: ETH
   Block Explorer: https://explorer.hyperliquid.xyz
   ```

#### 3. Connect to Silhouette
1. Visit [silhouette.exchange](https://silhouette.exchange)
2. Click "Connect Wallet"
3. Select "MetaMask"
4. Approve connection in MetaMask popup
5. Switch to HyperEVM network when prompted

#### 4. Fund Your Wallet
```javascript
// Ensure you have HyperEVM ETH for gas fees
// And HYPE/USDC tokens for trading
```

### WalletConnect Setup

#### 1. Mobile Wallet Preparation
- Install supported wallet (Trust Wallet, Rainbow, etc.)
- Create or import your wallet
- Add HyperEVM network to your mobile wallet

#### 2. Connect via QR Code
1. Visit [silhouette.exchange](https://silhouette.exchange) on desktop
2. Click "Connect Wallet" → "WalletConnect"
3. Scan QR code with mobile wallet
4. Approve connection on mobile device
5. Switch to HyperEVM network

#### 3. Transaction Flow
- All transactions appear as notifications on mobile
- Approve each transaction individually
- Check gas fees before confirming

### Hardware Wallet Setup

#### Ledger Integration
1. **Setup Ledger**:
   ```bash
   # Install Ledger Live
   # Update Ledger firmware to latest version
   # Install Ethereum app on Ledger
   ```

2. **Connect via MetaMask**:
   - Install MetaMask browser extension
   - Connect Ledger to MetaMask
   - Import Ledger accounts to MetaMask
   - Follow MetaMask setup steps above

3. **Direct Ledger Use**:
   - Use Ledger Live with HyperEVM network
   - Configure custom network settings
   - Enable contract data approval

#### Trezor Integration
1. **Setup Trezor**:
   - Install Trezor Suite
   - Update Trezor firmware
   - Enable Ethereum support

2. **Connect via MetaMask**:
   - Connect Trezor to MetaMask
   - Import Trezor accounts
   - Follow standard MetaMask workflow

## Gas Optimization Tips

### Understanding HyperEVM Gas

```javascript
// Typical gas costs on HyperEVM
const gasCosts = {
  deposit: '~50,000 gas',
  withdrawl: '~75,000 gas',
  encryptionKeyUpdate: '~45,000 gas',
  orderSubmission: '~30,000 gas'
};
```

### Gas Optimization Strategies

#### 1. Gas Price Management
- **Use EIP-1559**: Set appropriate base fee and priority fee
- **Monitor Network**: Check current gas prices before trading
- **Batch Operations**: Combine multiple actions when possible

#### 2. Timing Optimization
```javascript
// Check gas prices programmatically
const gasPrice = await web3.eth.getGasPrice();
const optimalTime = gasPrice < threshold;
```

#### 3. Transaction Settings
- **Gas Limit**: Set 10-20% above estimate for safety
- **Priority Fee**: Use 1-2 GWEI for standard transactions
- **Max Fee**: Set reasonable maximum to avoid overpaying

### Gas Troubleshooting

#### Common Issues
1. **Transaction Stuck**:
   - Increase gas price and resend
   - Use "Speed Up" feature in MetaMask

2. **Out of Gas Error**:
   - Increase gas limit by 20%
   - Check for contract interaction complexity

3. **Gas Price Too Low**:
   - Monitor network congestion
   - Adjust priority fee accordingly

## Security Best Practices

### Phishing Protection

:::danger Phishing Warning
**Always verify** you're on the correct Silhouette domain before connecting your wallet:
- ✅ **Correct**: silhouette.exchange
- ❌ **Fake**: silhouette-exchange.com, sil-houette.exchange, etc.
:::

#### Common Phishing Tactics
1. **Fake Domains**: Similar-looking URLs with typos
2. **Social Media Links**: Unverified links on Twitter/Discord
3. **Email Phishing**: Fake support emails requesting wallet access
4. **DM Scams**: Direct messages offering "support" or "updates"

#### Protection Strategies
- **Bookmark** the official site: silhouette.exchange
- **Verify URLs** before entering sensitive information
- **Check HTTPS** and SSL certificates
- **Never share** private keys or seed phrases
- **Use bookmarks** instead of search results

### Wallet Security

#### Private Key Management
```javascript
// NEVER do this - exposing private keys
const privateKey = "0x1234..."; // ❌ WRONG

// ✅ CORRECT - Let wallet handle keys
const signature = await wallet.signMessage(message);
```

#### Security Checklist
- [ ] **Strong passwords** for wallet software
- [ ] **2FA enabled** where available
- [ ] **Regular backups** of seed phrases
- [ ] **Hardware wallet** for large amounts
- [ ] **Separate wallets** for different risk levels
- [ ] **Updated software** (wallet, browser, OS)

### Transaction Security

#### Before Signing Transactions
1. **Verify recipient address** matches expected destination
2. **Check transaction amount** and token type
3. **Review gas fees** for reasonableness
4. **Confirm network** is HyperEVM
5. **Read contract interactions** carefully

#### Red Flags
- Unexpected high gas fees
- Unknown recipient addresses
- Unfamiliar contract interactions
- Urgent pressure to sign quickly
- Transactions from unknown dApps

## Troubleshooting Guide

### Connection Issues

#### MetaMask Won't Connect
1. **Check Network**: Ensure HyperEVM is selected
2. **Clear Cache**: Reset browser cache and cookies
3. **Update Extension**: Install latest MetaMask version
4. **Disable Conflicts**: Turn off other wallet extensions

#### WalletConnect Fails
1. **QR Code**: Ensure good camera/lighting for scanning
2. **Network Match**: Mobile wallet must support HyperEVM
3. **App Updates**: Update mobile wallet app
4. **Session Reset**: Clear WalletConnect sessions

### Transaction Failures

#### Common Error Messages
```javascript
// Error types and solutions
const errors = {
  "insufficient funds": "Add HyperEVM ETH for gas",
  "gas limit exceeded": "Increase gas limit by 20%",
  "nonce too low": "Reset account in MetaMask settings",
  "network changed": "Switch back to HyperEVM"
};
```

#### Debug Steps
1. **Check Balances**: Ensure sufficient ETH for gas
2. **Verify Network**: Confirm HyperEVM is active
3. **Reset Nonce**: Use MetaMask account reset if needed
4. **Clear Cache**: Refresh browser and reconnect wallet

### Performance Issues

#### Slow Transaction Processing
- **Network Congestion**: Wait for lower activity periods
- **Gas Price**: Increase priority fee for faster inclusion
- **RPC Issues**: Try different RPC endpoints

#### UI Responsiveness
- **Browser Performance**: Close unnecessary tabs
- **Wallet Performance**: Restart wallet application
- **Network Issues**: Check internet connectivity

## Advanced Features

### Multi-Account Management
```javascript
// Managing multiple accounts
const accounts = await ethereum.request({
  method: 'eth_accounts'
});

// Switch between accounts
await ethereum.request({
  method: 'wallet_requestPermissions',
  params: [{ eth_accounts: {} }]
});
```

### Custom Network Configuration
For advanced users setting up custom RPC endpoints:

```json
{
  "chainId": "0x3e6",
  "chainName": "HyperEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpcUrls": ["https://api.hyperliquid.xyz/evm"],
  "blockExplorerUrls": ["https://explorer.hyperliquid.xyz"]
}
```

### Programmatic Integration
For developers building on Silhouette:

```javascript
// Detect wallet and connect
if (window.ethereum) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  // Check network
  const network = await provider.getNetwork();
  if (network.chainId !== 998) {
    // Request network switch
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x3e6' }]
    });
  }
}
```

## Getting Help

### Official Support Channels
- **Documentation**: [docs.silhouette.exchange](https://docs.silhouette.exchange)
- **Discord**: Official Silhouette community
- **GitHub Issues**: For technical problems and feature requests

### Community Resources
- **User Guides**: Community-created tutorials
- **Video Walkthroughs**: Step-by-step video guides
- **FAQ Updates**: Regular FAQ improvements

:::tip Quick Setup Summary
1. **Install** compatible wallet (MetaMask recommended)
2. **Add** HyperEVM network configuration
3. **Fund** wallet with ETH for gas fees
4. **Connect** to silhouette.exchange
5. **Verify** all transaction details before signing
6. **Bookmark** official site for future access
:::
