---
title: Encryption Key
sidebar_label: Encryption Key
pagination_label: Encryption Key
---

The purpose of your encryption key is to shield your Silhouette balances and trading activity from **everyone but you**.

The key is created in your browser and registered with the Silhouette contract using your EVM wallet. It is used by both the secure enclave and your browser to derive a shared secret which is used to encrypt your intents. **This key is not seen nor directly used by traders.**

## How It Works

Your encryption key is an X25519 key pair generated locally in your browser. The private key never leaves your browser environment, while the public key is registered on-chain with the Silhouette smart contract. This enables end-to-end encryption between your browser and the Silhouette TEE.

For detailed technical information, see [webapp architecture](/docs/architecture/webapp).

## Secure Storage Options

:::warning Critical Security Notice
Your encryption key controls access to your trading data and order history. If lost, **your historical trading data cannot be recovered**. If compromised, an attacker may view your trading activity and potentially submit orders on your behalf.
:::

### Browser Storage (Default)
By default, your encryption key is stored in your browser's IndexedDB:
- **Pros**: Convenient, automatic persistence across sessions
- **Cons**: Vulnerable to browser data loss, device theft, or malware
- **Best for**: Testing and small amounts

**Security Tips for Browser Storage:**
- Use a dedicated browser profile for trading
- Enable browser security features (password manager, safe browsing)
- Regularly backup your browser data
- Use a secure, updated operating system

### Hardware Wallet Export
For maximum security, export your encryption key to a hardware wallet:

1. **Generate and Export**:
   ```javascript
   // In browser console (development only)
   // Use the webapp's export functionality in production
   const privateKey = await silhouette.exportEncryptionKey();
   ```

2. **Store on Hardware Wallet**:
   - Use hardware wallets that support custom key storage (Ledger, Trezor)
   - Store as a secure note or custom application
   - Label clearly: "Silhouette Encryption Key - [Date]"

3. **Import When Needed**:
   - Use the webapp's import functionality
   - Verify the public key matches your registered key

### Password Manager Storage
Store your encryption key in a reputable password manager:

1. **Export Process**:
   - Use webapp's "Export Key" feature
   - Copy the private key (64-character hex string)

2. **Password Manager Storage**:
   - Create new entry: "Silhouette Encryption Key"
   - Store private key in secure notes section
   - Include public key for verification
   - Add creation date and associated EVM address

3. **Recommended Password Managers**:
   - 1Password, Bitwarden, LastPass
   - Ensure end-to-end encryption is enabled
   - Use strong master password with 2FA

### Multi-Signature Recovery (Advanced)
For institutional or high-value accounts, implement multi-signature recovery:

1. **Split Key Approach**:
   - Use Shamir's Secret Sharing to split the private key
   - Distribute shares among trusted parties/devices
   - Require M-of-N shares for reconstruction

2. **Implementation**:
   ```javascript
   // Example using secrets.js library
   const secrets = require('secrets.js');
   const shares = secrets.share(privateKey, 5, 3); // 5 shares, 3 required
   ```

3. **Distribution Strategy**:
   - Different physical locations
   - Different trusted individuals
   - Different storage methods (hardware, password manager, physical)

## Recovery Flows

### Standard Recovery
If you lose access to your encryption key:

1. **Generate New Key**: Create a new encryption key in the webapp
2. **Update Registration**: Register the new public key with the smart contract
3. **Data Loss**: Previous trading history will be inaccessible
4. **Fresh Start**: Begin trading with the new key

### Backup Recovery
If you have a backup of your encryption key:

1. **Import Key**: Use webapp's import functionality
2. **Verify Match**: Confirm the public key matches your registered key
3. **Test Decryption**: Verify you can view historical data
4. **Resume Trading**: Continue with restored access

### Emergency Procedures
In case of suspected key compromise:

1. **Immediate Actions**:
   - Generate new encryption key immediately
   - Register new public key on-chain
   - Monitor for unauthorized activity

2. **Security Assessment**:
   - Review recent trading activity
   - Check for unexpected orders
   - Verify balances are correct

3. **Prevention**:
   - Implement more secure storage method
   - Enable additional monitoring
   - Consider hardware wallet upgrade

## Best Practices

### Key Generation
- **Always generate in secure environment**: Use updated browser on secure device
- **Verify randomness**: Ensure good entropy sources
- **One key per account**: Don't reuse keys across different EVM addresses

### Operational Security
- **Regular backups**: Export and securely store keys periodically
- **Access logging**: Monitor when and where you access stored keys
- **Device security**: Keep trading devices secure and updated
- **Network security**: Use VPN when trading on public networks

### Recovery Planning
- **Document procedures**: Write down your recovery process
- **Test recovery**: Periodically test key import/export
- **Update contacts**: Keep recovery contact information current
- **Regular audits**: Review and update security measures quarterly

## Migration Strategies

### Upgrading Security
When moving to more secure storage:

1. **Prepare New Storage**: Set up hardware wallet or password manager
2. **Export Current Key**: Use webapp export functionality
3. **Store Securely**: Import to new secure storage
4. **Test Recovery**: Verify you can import the key
5. **Document Process**: Record new procedures

### Key Rotation (Future Feature)
Planned features for enhanced security:

- **Periodic Rotation**: Automatic key rotation on schedule
- **Breach Response**: Rapid key rotation in emergencies
- **Multi-Key Support**: Multiple valid keys for redundancy
- **Hardware Integration**: Direct hardware wallet integration

:::tip Recovery Recommendations
1. **Backup immediately** after key generation
2. **Test recovery process** at least once
3. **Use multiple backup methods** for redundancy
4. **Document your procedures** clearly
5. **Review security regularly** and upgrade as needed
:::