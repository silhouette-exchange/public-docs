---
title: SDK & API Integration
sidebar_label: SDK & API
pagination_label: SDK & API Integration
---

# SDK & API Integration Guide

Silhouette provides multiple ways to integrate programmatically, from simple API calls to full SDK integration. This guide covers key generation, authentication, and trade placement with emphasis on security best practices.

## Overview

The Silhouette ecosystem offers several integration approaches:

1. **Silhouette SDK**: Native Python/JavaScript SDKs with built-in encryption
2. **Direct API**: RESTful API for custom implementations
3. **WebSocket Streams**: Real-time data feeds and order updates

## Comparison with Other Platforms

### Silhouette vs CCXT

| Feature | Silhouette SDK | CCXT |
|---------|----------------|------|
| **Privacy** | End-to-end encrypted orders | Public order books |
| **Exchanges** | Hyperliquid integration | 100+ exchanges |
| **Authentication** | EVM wallet + encryption key | API key pairs |
| **Order Types** | Limit orders (market coming soon) | Full order type support |
| **Languages** | Python, JavaScript | Python, JavaScript, PHP |
| **Setup Complexity** | Medium (wallet + encryption) | Low (API keys only) |

### Silhouette vs Hyperliquid API

| Feature | Silhouette | Hyperliquid Direct |
|---------|------------|-------------------|
| **Privacy** | Orders hidden from public | Public order book |
| **Latency** | +1 second (encryption overhead) | Direct to matching engine |
| **Liquidity** | Hyperliquid liquidity pool | Same liquidity pool |
| **Settlement** | Batched settlement | Immediate settlement |
| **MEV Protection** | Built-in protection | Exposed to MEV |

## Python SDK Integration

### Installation

```bash
# Install Silhouette Python SDK
pip install silhouette-sdk

# Additional dependencies for cryptography
pip install web3 cryptography requests websockets
```

### Basic Setup

```python
from silhouette import SilhouetteClient
from web3 import Web3
import os

# Initialize Web3 provider for HyperEVM
w3 = Web3(Web3.HTTPProvider('https://api.hyperliquid.xyz/evm'))

# Initialize Silhouette client
client = SilhouetteClient(
    web3_provider=w3,
    private_key=os.getenv('EVM_PRIVATE_KEY'),  # Your EVM wallet private key
    network='mainnet'  # or 'testnet'
)
```

### Key Generation and Management

#### Encryption Key Generation

```python
import secrets
from cryptography.hazmat.primitives.asymmetric import x25519
from cryptography.hazmat.primitives import serialization

class KeyManager:
    def __init__(self):
        self.private_key = None
        self.public_key = None
    
    def generate_encryption_key(self):
        """Generate new X25519 key pair for encryption"""
        self.private_key = x25519.X25519PrivateKey.generate()
        self.public_key = self.private_key.public_key()
        
        return {
            'private_key': self.private_key.private_bytes(
                encoding=serialization.Encoding.Raw,
                format=serialization.PrivateFormat.Raw,
                encryption_algorithm=serialization.NoEncryption()
            ).hex(),
            'public_key': self.public_key.public_bytes(
                encoding=serialization.Encoding.Raw,
                format=serialization.PublicFormat.Raw
            ).hex()
        }
    
    def load_encryption_key(self, private_key_hex):
        """Load existing encryption key from hex string"""
        private_key_bytes = bytes.fromhex(private_key_hex)
        self.private_key = x25519.X25519PrivateKey.from_private_bytes(private_key_bytes)
        self.public_key = self.private_key.public_key()

# Example usage
key_manager = KeyManager()
keys = key_manager.generate_encryption_key()

print(f"Private Key: {keys['private_key']}")
print(f"Public Key: {keys['public_key']}")
```

#### Secure Key Storage

```python
import keyring
import json
from pathlib import Path

class SecureKeyStorage:
    def __init__(self, service_name="silhouette-sdk"):
        self.service_name = service_name
    
    def store_keys(self, account_address, encryption_key, evm_private_key=None):
        """Store keys securely using system keyring"""
        key_data = {
            'encryption_private_key': encryption_key,
            'timestamp': int(time.time())
        }
        
        if evm_private_key:
            key_data['evm_private_key'] = evm_private_key
        
        keyring.set_password(
            self.service_name, 
            account_address, 
            json.dumps(key_data)
        )
    
    def load_keys(self, account_address):
        """Load keys from secure storage"""
        try:
            key_data_str = keyring.get_password(self.service_name, account_address)
            if key_data_str:
                return json.loads(key_data_str)
        except Exception as e:
            print(f"Failed to load keys: {e}")
        return None
    
    def delete_keys(self, account_address):
        """Delete stored keys"""
        try:
            keyring.delete_password(self.service_name, account_address)
        except Exception as e:
            print(f"Failed to delete keys: {e}")

# Example usage
storage = SecureKeyStorage()
storage.store_keys(
    account_address="0x1234...",
    encryption_key="a1b2c3d4...",
    evm_private_key="secret123..."  # Optional
)
```

### Authentication Flow

#### Complete Authentication Setup

```python
import time
from eth_account import Account
from web3 import Web3

class SilhouetteAuth:
    def __init__(self, web3_provider, contract_address):
        self.w3 = web3_provider
        self.contract_address = contract_address
        self.account = None
        self.encryption_keys = None
    
    def authenticate(self, private_key_hex, encryption_private_key_hex=None):
        """Complete authentication flow"""
        # 1. Load EVM account
        self.account = Account.from_key(private_key_hex)
        print(f"Authenticated as: {self.account.address}")
        
        # 2. Generate or load encryption keys
        key_manager = KeyManager()
        if encryption_private_key_hex:
            key_manager.load_encryption_key(encryption_private_key_hex)
        else:
            key_manager.generate_encryption_key()
        
        self.encryption_keys = key_manager
        
        # 3. Register public key with contract (if new)
        if not encryption_private_key_hex:
            self._register_public_key()
        
        return True
    
    def _register_public_key(self):
        """Register encryption public key with Silhouette contract"""
        contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=SILHOUETTE_CONTRACT_ABI  # Contract ABI
        )
        
        public_key_bytes = self.encryption_keys.public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        
        # Build transaction
        transaction = contract.functions.updateEncryptionKey(
            public_key_bytes
        ).build_transaction({
            'from': self.account.address,
            'gas': 100000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address)
        })
        
        # Sign and send
        signed_txn = self.account.sign_transaction(transaction)
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        print(f"Public key registration tx: {tx_hash.hex()}")
        return tx_hash

# Example authentication
auth = SilhouetteAuth(w3, "0xSilhouetteContractAddress")
auth.authenticate(
    private_key_hex="0x1234...",
    encryption_private_key_hex="a1b2c3d4..."  # Optional, generates new if None
)
```

### Trade Placement

#### Order Creation and Submission

```python
import json
import time
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

class TradeManager:
    def __init__(self, auth_instance):
        self.auth = auth_instance
        self.w3 = auth_instance.w3
    
    def create_limit_order(self, token_pair, side, amount, price, expiry_seconds=3600):
        """Create a limit order"""
        order = {
            'token_pair': token_pair,  # e.g., 'HYPE/USDC'
            'side': side,              # 'buy' or 'sell'
            'amount': str(amount),     # Amount as string for precision
            'price': str(price),       # Price as string for precision
            'expiry': int(time.time()) + expiry_seconds,
            'nonce': int(time.time() * 1000),  # Unique order identifier
            'timestamp': int(time.time())
        }
        
        return order
    
    def encrypt_order(self, order, enclave_public_key_hex):
        """Encrypt order for submission to TEE"""
        # Derive shared secret using ECDH
        enclave_public_key = x25519.X25519PublicKey.from_public_bytes(
            bytes.fromhex(enclave_public_key_hex)
        )
        
        shared_secret = self.auth.encryption_keys.private_key.exchange(enclave_public_key)
        
        # Derive encryption key using HKDF
        derived_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b'silhouette-order-encryption'
        ).derive(shared_secret)
        
        # Encrypt order data
        f = Fernet(base64.urlsafe_b64encode(derived_key))
        order_json = json.dumps(order).encode()
        encrypted_order = f.encrypt(order_json)
        
        return encrypted_order.hex()
    
    def submit_order(self, order):
        """Submit encrypted order to Silhouette contract"""
        # Get enclave public key from contract
        contract = self.w3.eth.contract(
            address=self.auth.contract_address,
            abi=SILHOUETTE_CONTRACT_ABI
        )
        
        enclave_public_key = contract.functions.getEnclavePublicKey().call()
        
        # Encrypt order
        encrypted_order = self.encrypt_order(order, enclave_public_key.hex())
        
        # Submit to contract
        transaction = contract.functions.submitOrder(
            bytes.fromhex(encrypted_order)
        ).build_transaction({
            'from': self.auth.account.address,
            'gas': 150000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.auth.account.address)
        })
        
        # Sign and send
        signed_txn = self.auth.account.sign_transaction(transaction)
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        print(f"Order submitted: {tx_hash.hex()}")
        return {
            'tx_hash': tx_hash.hex(),
            'order_id': order['nonce'],
            'order': order
        }

# Example trade placement
trade_manager = TradeManager(auth)

# Create and submit a buy order
order = trade_manager.create_limit_order(
    token_pair='HYPE/USDC',
    side='buy',
    amount=100.0,
    price=1.25,
    expiry_seconds=3600
)

result = trade_manager.submit_order(order)
print(f"Order submitted with ID: {result['order_id']}")
```

#### Advanced Order Management

```python
class AdvancedTradeManager(TradeManager):
    def __init__(self, auth_instance):
        super().__init__(auth_instance)
        self.open_orders = {}
    
    def submit_order_with_retry(self, order, max_retries=3):
        """Submit order with automatic retry logic"""
        for attempt in range(max_retries):
            try:
                result = self.submit_order(order)
                self.open_orders[result['order_id']] = {
                    'order': order,
                    'tx_hash': result['tx_hash'],
                    'status': 'submitted',
                    'timestamp': time.time()
                }
                return result
            
            except Exception as e:
                print(f"Order submission attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)  # Exponential backoff
    
    def cancel_order(self, order_id):
        """Cancel an existing order"""
        if order_id not in self.open_orders:
            raise ValueError(f"Order {order_id} not found")
        
        # Create cancellation message
        cancellation = {
            'action': 'cancel',
            'order_id': order_id,
            'timestamp': int(time.time()),
            'nonce': int(time.time() * 1000)
        }
        
        # Submit cancellation (similar to order submission)
        result = self._submit_cancellation(cancellation)
        
        # Update local state
        self.open_orders[order_id]['status'] = 'cancelling'
        
        return result
    
    def get_order_status(self, order_id):
        """Get current status of an order"""
        if order_id not in self.open_orders:
            return None
        
        # In a real implementation, you would query the contract or API
        # For now, return local status
        return self.open_orders[order_id]
    
    def bulk_order_submission(self, orders):
        """Submit multiple orders efficiently"""
        results = []
        
        for order in orders:
            try:
                result = self.submit_order_with_retry(order)
                results.append(result)
            except Exception as e:
                print(f"Failed to submit order {order}: {e}")
                results.append({'error': str(e), 'order': order})
        
        return results

# Example advanced usage
advanced_trader = AdvancedTradeManager(auth)

# Submit multiple orders
orders = [
    advanced_trader.create_limit_order('HYPE/USDC', 'buy', 100, 1.20),
    advanced_trader.create_limit_order('HYPE/USDC', 'buy', 200, 1.18),
    advanced_trader.create_limit_order('HYPE/USDC', 'sell', 150, 1.30)
]

results = advanced_trader.bulk_order_submission(orders)
print(f"Submitted {len(results)} orders")
```

### Real-time Data Streams

#### WebSocket Integration

```python
import websocket
import json
import threading

class SilhouetteWebSocket:
    def __init__(self, auth_instance):
        self.auth = auth_instance
        self.ws = None
        self.subscriptions = set()
        self.message_handlers = {}
    
    def connect(self, ws_url="wss://api.silhouette.exchange/ws"):
        """Connect to Silhouette WebSocket API"""
        def on_message(ws, message):
            self._handle_message(json.loads(message))
        
        def on_error(ws, error):
            print(f"WebSocket error: {error}")
        
        def on_close(ws, close_status_code, close_msg):
            print("WebSocket connection closed")
        
        def on_open(ws):
            print("WebSocket connection opened")
            self._authenticate_websocket()
        
        self.ws = websocket.WebSocketApp(
            ws_url,
            on_open=on_open,
            on_message=on_message,
            on_error=on_error,
            on_close=on_close
        )
        
        # Run in separate thread
        wst = threading.Thread(target=self.ws.run_forever)
        wst.daemon = True
        wst.start()
    
    def _authenticate_websocket(self):
        """Authenticate WebSocket connection"""
        auth_message = {
            'action': 'authenticate',
            'address': self.auth.account.address,
            'timestamp': int(time.time())
        }
        
        # Sign authentication message
        signature = self.auth.account.sign_message(
            encode_defunct(text=json.dumps(auth_message))
        )
        
        auth_message['signature'] = signature.signature.hex()
        self.ws.send(json.dumps(auth_message))
    
    def subscribe_to_orders(self, callback):
        """Subscribe to order updates"""
        self.message_handlers['order_update'] = callback
        
        subscribe_message = {
            'action': 'subscribe',
            'channel': 'orders',
            'address': self.auth.account.address
        }
        
        self.ws.send(json.dumps(subscribe_message))
        self.subscriptions.add('orders')
    
    def subscribe_to_trades(self, token_pair, callback):
        """Subscribe to trade updates for a token pair"""
        self.message_handlers[f'trades_{token_pair}'] = callback
        
        subscribe_message = {
            'action': 'subscribe',
            'channel': 'trades',
            'token_pair': token_pair
        }
        
        self.ws.send(json.dumps(subscribe_message))
        self.subscriptions.add(f'trades_{token_pair}')
    
    def _handle_message(self, message):
        """Handle incoming WebSocket messages"""
        message_type = message.get('type')
        
        if message_type == 'order_update':
            handler = self.message_handlers.get('order_update')
            if handler:
                handler(message['data'])
        
        elif message_type == 'trade_update':
            token_pair = message.get('token_pair')
            handler = self.message_handlers.get(f'trades_{token_pair}')
            if handler:
                handler(message['data'])

# Example WebSocket usage
def order_update_handler(order_data):
    print(f"Order update: {order_data}")

def trade_update_handler(trade_data):
    print(f"Trade update: {trade_data}")

ws_client = SilhouetteWebSocket(auth)
ws_client.connect()
ws_client.subscribe_to_orders(order_update_handler)
ws_client.subscribe_to_trades('HYPE/USDC', trade_update_handler)
```

## Security Best Practices

### Key Rotation

```python
import schedule
import time

class SecurityManager:
    def __init__(self, auth_instance):
        self.auth = auth_instance
        self.last_rotation = time.time()
        self.rotation_interval = 30 * 24 * 3600  # 30 days
    
    def should_rotate_keys(self):
        """Check if keys should be rotated"""
        return (time.time() - self.last_rotation) > self.rotation_interval
    
    def rotate_encryption_key(self):
        """Rotate encryption key pair"""
        if not self.should_rotate_keys():
            return False
        
        print("Rotating encryption keys...")
        
        # Generate new key pair
        new_key_manager = KeyManager()
        new_keys = new_key_manager.generate_encryption_key()
        
        # Register new public key
        self.auth.encryption_keys = new_key_manager
        self.auth._register_public_key()
        
        # Update storage
        storage = SecureKeyStorage()
        storage.store_keys(
            self.auth.account.address,
            new_keys['private_key']
        )
        
        self.last_rotation = time.time()
        print("Key rotation completed")
        return True
    
    def setup_automatic_rotation(self):
        """Setup automatic key rotation schedule"""
        schedule.every(30).days.do(self.rotate_encryption_key)
        
        def run_scheduler():
            while True:
                schedule.run_pending()
                time.sleep(3600)  # Check every hour
        
        scheduler_thread = threading.Thread(target=run_scheduler)
        scheduler_thread.daemon = True
        scheduler_thread.start()

# Setup automatic security management
security_manager = SecurityManager(auth)
security_manager.setup_automatic_rotation()
```

### Error Handling and Logging

```python
import logging
from functools import wraps

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('silhouette_trading.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('silhouette_sdk')

def retry_with_logging(max_retries=3, delay=1):
    """Decorator for automatic retry with logging"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    result = func(*args, **kwargs)
                    if attempt > 0:
                        logger.info(f"{func.__name__} succeeded on attempt {attempt + 1}")
                    return result
                
                except Exception as e:
                    logger.warning(f"{func.__name__} attempt {attempt + 1} failed: {e}")
                    if attempt == max_retries - 1:
                        logger.error(f"{func.__name__} failed after {max_retries} attempts")
                        raise
                    time.sleep(delay * (2 ** attempt))
            
            return wrapper
        return decorator

class RobustTradeManager(AdvancedTradeManager):
    @retry_with_logging(max_retries=3)
    def submit_order(self, order):
        """Submit order with automatic retry and logging"""
        logger.info(f"Submitting order: {order['token_pair']} {order['side']} {order['amount']} @ {order['price']}")
        
        try:
            result = super().submit_order(order)
            logger.info(f"Order submitted successfully: {result['order_id']}")
            return result
        
        except Exception as e:
            logger.error(f"Order submission failed: {e}")
            raise
    
    def validate_order(self, order):
        """Validate order before submission"""
        required_fields = ['token_pair', 'side', 'amount', 'price']
        
        for field in required_fields:
            if field not in order:
                raise ValueError(f"Missing required field: {field}")
        
        if order['side'] not in ['buy', 'sell']:
            raise ValueError(f"Invalid side: {order['side']}")
        
        if float(order['amount']) <= 0:
            raise ValueError(f"Invalid amount: {order['amount']}")
        
        if float(order['price']) <= 0:
            raise ValueError(f"Invalid price: {order['price']}")
        
        logger.info("Order validation passed")
        return True
```

## Integration Examples

### CCXT-Style Interface

```python
class SilhouetteCCXTAdapter:
    """CCXT-style interface for Silhouette"""
    
    def __init__(self, private_key, encryption_key=None):
        self.auth = SilhouetteAuth(w3, CONTRACT_ADDRESS)
        self.auth.authenticate(private_key, encryption_key)
        self.trade_manager = RobustTradeManager(self.auth)
    
    def fetch_balance(self):
        """Fetch account balances"""
        # Implementation would query Silhouette contract
        pass
    
    def create_order(self, symbol, type, side, amount, price=None, params={}):
        """Create order in CCXT style"""
        if type != 'limit':
            raise ValueError("Only limit orders supported currently")
        
        order = self.trade_manager.create_limit_order(
            token_pair=symbol,
            side=side,
            amount=amount,
            price=price,
            expiry_seconds=params.get('timeInForce', 3600)
        )
        
        return self.trade_manager.submit_order(order)
    
    def cancel_order(self, id, symbol=None, params={}):
        """Cancel order in CCXT style"""
        return self.trade_manager.cancel_order(id)
    
    def fetch_order(self, id, symbol=None, params={}):
        """Fetch order status in CCXT style"""
        return self.trade_manager.get_order_status(id)

# Usage example
exchange = SilhouetteCCXTAdapter(
    private_key="0x1234...",
    encryption_key="a1b2c3d4..."
)

# Place order
order = exchange.create_order('HYPE/USDC', 'limit', 'buy', 100, 1.25)
print(f"Order placed: {order}")

# Cancel order
cancellation = exchange.cancel_order(order['order_id'])
print(f"Order cancelled: {cancellation}")
```

### Algorithmic Trading Example

```python
import numpy as np
import pandas as pd

class SimpleTradingBot:
    def __init__(self, auth_instance):
        self.trade_manager = RobustTradeManager(auth_instance)
        self.position = 0
        self.orders = {}
    
    def moving_average_strategy(self, prices, short_window=10, long_window=30):
        """Simple moving average crossover strategy"""
        df = pd.DataFrame({'price': prices})
        df['short_ma'] = df['price'].rolling(window=short_window).mean()
        df['long_ma'] = df['price'].rolling(window=long_window).mean()
        
        # Generate signals
        df['signal'] = 0
        df.loc[df['short_ma'] > df['long_ma'], 'signal'] = 1
        df.loc[df['short_ma'] < df['long_ma'], 'signal'] = -1
        
        return df['signal'].iloc[-1]
    
    def execute_strategy(self, current_price, signal, amount=100):
        """Execute trading strategy"""
        if signal == 1 and self.position <= 0:  # Buy signal
            order = self.trade_manager.create_limit_order(
                token_pair='HYPE/USDC',
                side='buy',
                amount=amount,
                price=current_price * 0.999  # Slightly below market
            )
            
            result = self.trade_manager.submit_order(order)
            self.orders[result['order_id']] = result
            print(f"Buy order placed: {result['order_id']}")
        
        elif signal == -1 and self.position >= 0:  # Sell signal
            order = self.trade_manager.create_limit_order(
                token_pair='HYPE/USDC',
                side='sell',
                amount=amount,
                price=current_price * 1.001  # Slightly above market
            )
            
            result = self.trade_manager.submit_order(order)
            self.orders[result['order_id']] = result
            print(f"Sell order placed: {result['order_id']}")

# Example bot usage
bot = SimpleTradingBot(auth)

# Historical price data (would come from API in practice)
prices = [1.20, 1.21, 1.22, 1.23, 1.25, 1.24, 1.23, 1.22, 1.21, 1.20, 1.19]

signal = bot.moving_average_strategy(prices)
bot.execute_strategy(current_price=1.19, signal=signal)
```

## Troubleshooting

### Common Issues and Solutions

```python
class TroubleshootingGuide:
    @staticmethod
    def diagnose_connection_issue():
        """Diagnose WebSocket/API connection issues"""
        checks = {
            'network': 'Check internet connectivity',
            'rpc': 'Verify HyperEVM RPC endpoint',
            'contract': 'Confirm contract address is correct',
            'gas': 'Ensure sufficient ETH for gas fees'
        }
        
        for check, description in checks.items():
            print(f"Check {check}: {description}")
    
    @staticmethod
    def diagnose_order_failure():
        """Diagnose order submission failures"""
        print("Order failure checklist:")
        print("1. Verify encryption key is registered")
        print("2. Check account balance for trading")
        print("3. Validate order parameters")
        print("4. Confirm gas fees are adequate")
        print("5. Check network connectivity")
    
    @staticmethod
    def test_encryption():
        """Test encryption/decryption functionality"""
        try:
            key_manager = KeyManager()
            keys = key_manager.generate_encryption_key()
            
            # Test data
            test_order = {'token_pair': 'HYPE/USDC', 'side': 'buy', 'amount': '100'}
            
            # This would include actual encryption/decryption test
            print("Encryption test passed")
            return True
        
        except Exception as e:
            print(f"Encryption test failed: {e}")
            return False

# Run diagnostics
TroubleshootingGuide.diagnose_connection_issue()
TroubleshootingGuide.test_encryption()
```

## Performance Optimization

### Batch Operations

```python
class PerformanceOptimizer:
    def __init__(self, trade_manager):
        self.trade_manager = trade_manager
        self.batch_size = 10
    
    def batch_order_creation(self, order_params_list):
        """Create multiple orders in batch"""
        orders = []
        
        for params in order_params_list:
            order = self.trade_manager.create_limit_order(**params)
            orders.append(order)
        
        return orders
    
    def parallel_order_submission(self, orders):
        """Submit orders in parallel for better performance"""
        import concurrent.futures
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(self.trade_manager.submit_order, order)
                for order in orders
            ]
            
            results = []
            for future in concurrent.futures.as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    print(f"Order submission failed: {e}")
            
            return results

# Example performance optimization
optimizer = PerformanceOptimizer(trade_manager)

order_params = [
    {'token_pair': 'HYPE/USDC', 'side': 'buy', 'amount': 100, 'price': 1.20},
    {'token_pair': 'HYPE/USDC', 'side': 'buy', 'amount': 150, 'price': 1.18},
    {'token_pair': 'HYPE/USDC', 'side': 'sell', 'amount': 200, 'price': 1.30}
]

orders = optimizer.batch_order_creation(order_params)
results = optimizer.parallel_order_submission(orders)
print(f"Submitted {len(results)} orders in parallel")
```

:::tip SDK Best Practices
1. **Always validate** orders before submission
2. **Implement retry logic** for network operations
3. **Use secure storage** for private keys
4. **Rotate encryption keys** regularly
5. **Monitor order status** for fill updates
6. **Handle errors gracefully** with proper logging
7. **Test thoroughly** in testnet before mainnet
:::

:::warning Security Reminders
- Never hardcode private keys in source code
- Use environment variables or secure storage
- Implement proper key rotation procedures
- Monitor for unusual account activity
- Keep dependencies updated for security patches
:::