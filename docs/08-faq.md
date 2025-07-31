---
title: Community FAQs
sidebar_label: FAQ
pagination_label: FAQ
slug: /faq
---

# Frequently Asked Questions

## System Architecture & Integration

### How does Silhouette integrate with HyperCore and the HyperEVM?

The Silhouette system is comprised of a smart contract, smart wallets, and a TEE that connect together to enable private trading. The TEE interacts with the smart contracts and HyperCore for state management, deposits/withdrawals, and order settlement.

### What is the difference between obfuscation and mixing? What is Silhouette doing?

Obfuscation hides trade and order data from outsiders. Mixing prevents traceability of funds by intertwining the funds of multiple users. Silhouette is an **obfuscation** system, since it only aims to hide order and balance data, while deposits and withdrawals remain "open" on HyperCore.

### Is Silhouette just an off-chain orderbook?

Silhouette is a matching and privacy engine that contains a built-in orderbook, along with privacy-enhancing mechanisms to protect users' trades. It leverages the Hyperliquid blockchain for settlement, providing more liquidity access than a standalone off-chain orderbook.

In order for Silhouette to work as designed, we need an underlying settlement chain. This is the Hyperliquid. The net result of all trades on Silhouette go through Hyperliquid

### Is Silhouette a mixer?

No. Mixers enable private transactions between two addresses to obfuscate the movement of funds. Silhouette only permits deposits and withdrawals from the same address.

### How does Silhouette address latency by composing it with the challenge of the EVM? What is the latency for trades performed on Silhouette?

Silhouette's primary constraint is the time between fast blocks on the HyperEVM, which is currently 1 second.

## Trading & Order Management

### What if my order doesn't match with any other orders?

If your order doesn't find a match, it will remain in the Silhouette order book until:

1. **A matching order arrives**: Your order will execute when a compatible order is submitted
2. **Your order expires**: Orders automatically expire based on the expiry timestamp you set
3. **You cancel the order**: You can manually cancel unfilled orders at any time

**Troubleshooting unmatched orders:**
- **Check your price**: Ensure your price is competitive with current market conditions
- **Verify order parameters**: Confirm token pair, amount, and side are correct
- **Consider market liquidity**: Some token pairs may have lower trading volume
- **Adjust expiry time**: Longer expiry times give more opportunity for matching

### Why didn't my order execute at market price?

Silhouette currently only supports **limit orders**, not market orders. Your order will only execute when:
- Another trader submits a matching limit order
- The prices overlap (your buy price ≥ their sell price, or vice versa)

**Market orders are coming soon** and will execute immediately against the best available prices.

### How do I check if my order was filled?

Monitor your order status through:

1. **Webapp Dashboard**: Real-time order status updates
2. **Transaction History**: Complete record of fills and settlements
3. **Balance Changes**: Filled orders update your token balances
4. **SDK/API**: Programmatic order status checking

```javascript
// Example: Check order status via SDK
const orderStatus = await silhouette.getOrderStatus(orderId);
console.log(`Order ${orderId} status: ${orderStatus.state}`);
```

### Can I modify an order after submitting it?

No, orders cannot be modified once submitted to maintain the integrity of the encrypted matching engine. To change an order:

1. **Cancel the existing order**
2. **Submit a new order** with updated parameters
3. **Pay gas fees** for both cancellation and new submission

### What happens to partial fills?

Partial fills are handled automatically:
- **Filled portion**: Settles normally in the next batch
- **Unfilled portion**: Remains active in the order book
- **Cancellation**: You can cancel the unfilled portion anytime
- **Balance updates**: Filled amounts reflect immediately in your balance

## Technical Troubleshooting

### My wallet won't connect to Silhouette

**Common solutions:**

1. **Check network**: Ensure you're connected to HyperEVM
   ```javascript
   // Verify network in MetaMask
   const chainId = await window.ethereum.request({ method: 'eth_chainId' });
   console.log('Current chain ID:', chainId); // Should be 0x3e6 for HyperEVM
   ```

2. **Clear browser cache**: Reset cookies and local storage
3. **Disable conflicting extensions**: Turn off other wallet extensions
4. **Update wallet software**: Install latest MetaMask/wallet version
5. **Try different browser**: Test in incognito mode or different browser

### My transaction failed with "insufficient gas"

**Solutions:**

1. **Increase gas limit**: Add 20% buffer to estimated gas
2. **Check ETH balance**: Ensure sufficient ETH for gas fees
3. **Retry with higher gas price**: Network congestion may require higher fees

```javascript
// Recommended gas settings
const gasSettings = {
  gasLimit: Math.floor(estimatedGas * 1.2), // 20% buffer
  maxFeePerGas: await web3.eth.getGasPrice(),
  maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei')
};
```

### I can't see my order history or balances

**Troubleshooting steps:**

1. **Verify encryption key**: Ensure your browser has the correct encryption key
2. **Check key registration**: Confirm your public key is registered on-chain
3. **Browser storage**: Check if IndexedDB contains your key data
4. **Re-import key**: If you have a backup, try importing your encryption key

```javascript
// Check if encryption key exists in browser
const keyExists = await silhouette.hasEncryptionKey();
if (!keyExists) {
  console.log('No encryption key found - generate or import one');
}
```

### Orders are taking too long to process

**Possible causes and solutions:**

1. **Network congestion**: 
   - Wait for lower traffic periods
   - Increase gas price for faster processing

2. **TEE processing delays**:
   - Normal processing time is 1-3 seconds
   - Delays may occur during high volume periods

3. **Matching engine queue**:
   - Your order may be waiting for compatible matches
   - Check current order book depth

### Error: "Order encryption failed"

**Resolution steps:**

1. **Verify encryption key**: Ensure key is properly loaded
2. **Check TEE public key**: Confirm the enclave public key is accessible
3. **Browser compatibility**: Try latest Chrome/Firefox versions
4. **Regenerate keys**: Create new encryption key if corruption suspected

```python
# Test encryption functionality
try:
    test_order = {'token_pair': 'HYPE/USDC', 'side': 'buy', 'amount': '100'}
    encrypted_data = encrypt_order(test_order)
    print("Encryption test passed")
except Exception as e:
    print(f"Encryption test failed: {e}")
```

## Privacy & Security

### How private are my trades really?

**What is hidden:**
- Order details (price, amount, timing)
- Trading patterns and strategies
- Account balances and positions
- Order book participation

**What remains visible:**
- Deposit and withdrawal transactions (on HyperCore)
- Gas payments (on HyperEVM)
- Smart contract interactions (encrypted payloads only)

**Who cannot see your trading data:**
- Other traders
- Hyperliquid validators
- Silhouette team members
- External observers

**Who can see your trading data:**
- Only you (with your encryption key)
- The TEE (for matching purposes only)

### What if someone steals my encryption key?

**Immediate risks:**
- Attacker can view your trading history
- Potential to submit new orders on your behalf
- Access to your private trading strategies

**What is NOT at risk:**
- Your EVM wallet private keys
- Direct access to your funds
- Ability to withdraw to different addresses

**Recovery steps:**
1. **Generate new encryption key** immediately
2. **Register new public key** on-chain
3. **Monitor for unauthorized activity**
4. **Review recent trading history**

### Can the Silhouette team see my trades?

No. The Silhouette team cannot decrypt your trading data. The system is designed with:
- **End-to-end encryption** between your browser and the TEE
- **No backdoors** or administrative overrides
- **Trustless design** where even operators cannot access trade details

The TEE (Trusted Execution Environment) processes encrypted orders in isolation, and the decrypted data never leaves the secure enclave.

## Regulatory & Compliance

### What are the regulatory risks of using Silhouette?

:::warning Regulatory Considerations
Silhouette is an **obfuscation system**, not a mixer. However, users should consider:

- **Local regulations** may vary by jurisdiction
- **Some regions** may restrict privacy-enhancing trading tools
- **Tax obligations** remain in effect regardless of trade privacy
- **KYC requirements** may apply depending on your location
:::

**Key distinctions:**
- **Not a mixer**: Deposits and withdrawals are publicly visible
- **Privacy focus**: Only trade details are obfuscated
- **Regulatory compliance**: Designed to work within existing frameworks
- **Audit trail**: All transactions have traceable on-chain footprints

### How do I report Silhouette trades for taxes?

**Tax reporting obligations:**
1. **Capital gains/losses** must be reported regardless of privacy
2. **Export trade history** using your encryption key
3. **Maintain records** of all deposits, withdrawals, and trades
4. **Consult tax professionals** for jurisdiction-specific advice

**Available tools:**
- CSV export functionality (coming soon)
- API access for automated record keeping
- Integration with tax reporting software (planned)

### Is Silhouette legal in my country?

Silhouette operates as a privacy-focused trading platform within existing regulatory frameworks. However:

- **Check local laws** regarding cryptocurrency trading
- **Privacy regulations** vary by jurisdiction
- **Consult legal counsel** if uncertain about compliance
- **Stay informed** about evolving regulations

**Generally permitted activities:**
- Private trading between consenting parties
- Obfuscating trade strategies from competitors
- Protecting against MEV exploitation

### What about KYC (Know Your Customer) requirements?

**Current approach:**
- **No KYC required** for basic trading (alpha phase)
- **Wallet-based identity** using EVM addresses
- **Optional compliance paths** being developed

**Future developments:**
- **Selective KYC** for larger trading volumes
- **Institutional compliance** options
- **Regulatory-friendly features** for specific jurisdictions
- **Privacy-preserving identity verification**

### Can law enforcement access Silhouette data?

**Technical capabilities:**
- **Encrypted trade data** cannot be decrypted without user keys
- **No central authority** has backdoor access
- **TEE security** prevents unauthorized data extraction

**Legal considerations:**
- **Compliance obligations** vary by jurisdiction
- **Court orders** may require user cooperation
- **Users retain control** over their encryption keys
- **Voluntary disclosure** may be required in some cases

## Development & Features

### What features are currently under development?

**Confirmed upcoming features:**

🔄 **Market Orders**: Execute immediately at best available prices
🔄 **Perpetual Trading**: Leverage trading with perpetual contracts  
🔄 **Mobile App**: Native iOS and Android applications
🔄 **Advanced Order Types**: Stop-loss, take-profit, conditional orders
🔄 **Portfolio Analytics**: Comprehensive trading performance metrics
🔄 **API Enhancements**: Expanded programmatic trading capabilities

**Planned roadmap items:**
- Multi-asset support beyond HYPE/USDC
- Cross-chain integration
- Institutional features
- Enhanced privacy mechanisms

### How can I contribute to Silhouette development?

**Documentation contributions:**
- **GitHub Repository**: [silhouette-exchange/public-docs](https://github.com/silhouette-exchange/public-docs)
- **Issue reporting**: Found a bug or unclear documentation? [Open an issue](https://github.com/silhouette-exchange/public-docs/issues)
- **Pull requests**: Submit improvements to documentation
- **Community examples**: Share integration examples and tutorials

**Types of contributions welcome:**
- 📝 **Documentation improvements**: Clarify existing content, add examples
- 🐛 **Bug reports**: Report issues with clear reproduction steps  
- 💡 **Feature suggestions**: Propose new functionality or improvements
- 🌐 **Translations**: Help translate docs to other languages
- 📊 **Code examples**: Share trading bots, integration scripts, tools

**How to contribute:**
1. **Fork** the [public-docs repository](https://github.com/silhouette-exchange/public-docs)
2. **Create a branch** for your changes
3. **Make improvements** following our style guide
4. **Submit a pull request** with clear description
5. **Engage with feedback** from maintainers

**Contribution guidelines:**
- Follow existing documentation style and structure
- Test all code examples before submitting
- Include proper error handling in examples
- Add clear explanations for complex concepts
- Keep content beginner-friendly where possible

### How do I report bugs or request features?

**Bug reports:**
1. **Check existing issues** on GitHub first
2. **Use the bug report template** when creating new issues
3. **Include reproduction steps** and error messages
4. **Specify environment details** (browser, wallet, network)

**Feature requests:**
1. **Search existing requests** to avoid duplicates
2. **Describe the use case** clearly
3. **Explain expected behavior** and benefits
4. **Consider implementation complexity**

**Community discussion:**
- **Discord**: Join our community for real-time discussions
- **GitHub Discussions**: Long-form feature discussions and Q&A
- **Developer Forums**: Technical implementation discussions

### When will market orders be available?

Market orders are a **high priority feature** currently in development. Expected timeline:

- **Alpha testing**: Q2 2025
- **Testnet release**: Q3 2025  
- **Mainnet deployment**: Q4 2025

Market orders will enable:
- Immediate execution at best available prices
- Integration with trading bots and algorithms
- Better user experience for casual traders
- Reduced slippage for smaller orders

### What about mobile support?

**Current mobile experience:**
- **Mobile web**: Fully functional through mobile browsers
- **WalletConnect**: Native mobile wallet integration
- **Responsive design**: Optimized for mobile screens

**Planned native apps:**
- **iOS app**: Native iPhone/iPad application
- **Android app**: Native Android application  
- **Enhanced features**: Push notifications, biometric auth
- **Timeline**: Native apps planned for 2025

## Performance & Scalability

### How many orders can Silhouette handle?

**Current capacity:**
- **TEE throughput**: ~1000 orders per second
- **Settlement batching**: Optimized for efficiency
- **Network limitations**: Bounded by HyperEVM block times

**Scaling plans:**
- **Multiple TEE instances** for higher throughput
- **Layer 2 integration** for reduced costs
- **Batch optimization** for better efficiency

### Why does settlement take time?

**Settlement process:**
1. **Order matching** occurs instantly in TEE
2. **Batch formation** groups multiple trades
3. **Blockchain submission** to HyperCore/Hyperliquid
4. **Confirmation waiting** for finality

**Typical timing:**
- **Order matching**: 1-3 seconds
- **Batch settlement**: 30-60 seconds
- **Balance updates**: Immediate after settlement

### Can I trade during high network congestion?

**Network congestion effects:**
- **Higher gas costs** for order submission
- **Slower transaction confirmation**
- **Delayed settlement batching**

**Mitigation strategies:**
- **Increase gas prices** for faster processing
- **Use limit orders** instead of waiting for market orders
- **Monitor network conditions** before trading
- **Consider off-peak trading** times

## Getting Help

### Where can I get additional support?

**Official channels:**
- **Documentation**: [docs.silhouette.exchange](https://docs.silhouette.exchange)
- **GitHub Issues**: [Bug reports and feature requests](https://github.com/silhouette-exchange/public-docs/issues)
- **Discord Community**: Real-time community support
- **Developer Forums**: Technical implementation discussions

**Community resources:**
- **User guides**: Community-created tutorials and walkthroughs
- **Video content**: Step-by-step setup and trading guides
- **Integration examples**: Sample code and implementations
- **Troubleshooting wiki**: Community-maintained solutions

### How do I stay updated on new features?

**Official updates:**
- **Blog**: [silhouette.exchange/blog](https://silhouette.exchange/blog)
- **Twitter**: [@SilhouetteExch](https://twitter.com/SilhouetteExch)
- **Discord announcements**: Feature releases and updates
- **GitHub releases**: Technical changelog and updates

**Community tracking:**
- **Newsletter**: Monthly development updates
- **Roadmap page**: Public feature tracking
- **Developer calls**: Regular community update sessions

### What should I do if I find a security issue?

**Security reporting process:**
1. **Do NOT open a public issue** for security vulnerabilities
2. **Email security concerns** to: security@silhouette.exchange
3. **Include detailed information** about the potential issue
4. **Allow reasonable time** for investigation and resolution

**What to include:**
- Clear description of the potential vulnerability
- Steps to reproduce (if applicable)
- Potential impact assessment
- Your contact information for follow-up

**Bug bounty program:**
- **Security vulnerabilities**: Rewards for verified issues
- **Documentation improvements**: Recognition for contributions
- **Community contributions**: Ongoing contributor rewards

:::tip Contributing to Documentation
We welcome community contributions to improve these docs! 

**Quick ways to help:**
- Spot a typo or unclear explanation? [Open an issue](https://github.com/silhouette-exchange/public-docs/issues)
- Have a great code example? [Submit a pull request](https://github.com/silhouette-exchange/public-docs/pulls)
- Missing information? [Start a discussion](https://github.com/silhouette-exchange/public-docs/discussions)

**All skill levels welcome** - from fixing typos to adding comprehensive tutorials!
:::

:::info Areas Marked "Under Development"
Some features and documentation sections are still being developed:

- 🚧 **Market Orders**: Implementation in progress
- 🚧 **Mobile Apps**: Native applications planned
- 🚧 **Advanced Analytics**: Portfolio tracking features
- 🚧 **Multi-asset Support**: Additional trading pairs

**Want to help?** Join our [GitHub discussions](https://github.com/silhouette-exchange/public-docs/discussions) to shape these features!
:::
