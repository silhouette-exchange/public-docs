---
title: Order Details
sidebar_label: Order Details
pagination_label: Order Details
---

# Order Details

Silhouette currently only supports limit orders. Market orders and perpetual trading are planned features coming soon.

## Order Structure

Orders specify the following parameters:
- `token_pair`: The token pair being traded (e.g. HYPE/USDC).
- `side`: Whether this is a buy or sell order.
- `amount`: The amount of tokens being bought or sold.
- `price`: The limit price for the order.
- `expiry`: The timestamp after which the order expires in Silhouette's order book. Expired orders are settled on HyperCore in the next batch (see [Matching Engine](matching-engine)).

## Fee Structure

### Alpha Phase Fee Model

:::info Alpha Phase Pricing
During the alpha phase, **all trading fees are waived** to encourage testing and feedback. This includes:
- **Trading Fees**: 0% on all limit orders
- **Gas Fees**: User pays only HyperEVM gas costs
- **Settlement Fees**: No additional fees for batch settlements
:::

### Planned Fee Structure (Post-Alpha)

When Silhouette transitions from alpha, the following fee structure will be implemented:

#### Trading Fees
- **Maker Orders**: 0.02% (orders that add liquidity)
- **Taker Orders**: 0.05% (orders that remove liquidity)
- **Volume Discounts**: Reduced fees for high-volume traders

#### Gas Costs
Users are responsible for HyperEVM gas costs:

```javascript
// Typical gas costs on HyperEVM
const gasCosts = {
  deposit: '~50,000 gas',           // ~$0.001 at 1 GWEI
  withdrawal: '~75,000 gas',        // ~$0.0015 at 1 GWEI
  orderSubmission: '~30,000 gas',   // ~$0.0006 at 1 GWEI
  orderCancellation: '~25,000 gas', // ~$0.0005 at 1 GWEI
  encryptionKeyUpdate: '~45,000 gas' // ~$0.0009 at 1 GWEI
};
```

#### Fee Calculation Examples

```javascript
// Example: Buy 1000 HYPE at $1.25
const tradeAmount = 1000;
const price = 1.25;
const tradeValue = tradeAmount * price; // $1,250

// Alpha Phase
const alphaFees = 0; // All fees waived

// Post-Alpha (Maker Order)
const makerFee = tradeValue * 0.0002; // $0.25
const gaseFee = 30000 * 0.000000001; // ~$0.0006 (at 1 GWEI)
const totalPostAlpha = makerFee + gaseFee; // ~$0.25
```

### Fee Payment Methods

- **Trading Fees**: Deducted from order proceeds in the traded token
- **Gas Fees**: Paid in ETH from your connected EVM wallet
- **Automatic Deduction**: No manual fee payment required

## Order Lifecycle

### 1. Order Creation
```javascript
// Order creation flow
const order = {
  token_pair: 'HYPE/USDC',
  side: 'buy',
  amount: '1000.0000',    // 4 decimal precision for HYPE
  price: '1.2500',        // 4 decimal precision for HYPE/USDC
  expiry: 1704110400,     // Unix timestamp
  nonce: 1704024000123    // Unique identifier
};
```

### 2. Encryption and Submission
- Order details are encrypted end-to-end
- Submitted to Silhouette smart contract
- Smart contract stores encrypted payload only

### 3. TEE Processing
- Trusted Execution Environment decrypts orders
- Orders enter the private matching engine
- Matches are computed without revealing details

### 4. Settlement
- Filled orders are batched for settlement
- Settlement occurs on HyperCore via Hyperliquid
- Balance updates reflect in user accounts

### 5. Order States

| State | Description | Next Actions |
|-------|-------------|--------------|
| `pending` | Order created but not yet submitted | Submit to blockchain |
| `submitted` | Encrypted order on blockchain | TEE processing |
| `active` | Order in matching engine | Wait for fill or cancel |
| `partially_filled` | Partial execution occurred | Continue matching |
| `filled` | Order completely executed | Settlement complete |
| `cancelled` | Order cancelled by user | Remove from matching |
| `expired` | Order passed expiry time | Automatic cancellation |
| `failed` | Order submission failed | Retry or fix issues |

## Order Cancellation

### Cancellation Methods

#### 1. Manual Cancellation via Webapp
1. Navigate to "Open Orders" section
2. Click "Cancel" next to the target order
3. Confirm cancellation in wallet popup
4. Pay gas fee for cancellation transaction

#### 2. Programmatic Cancellation via SDK
```python
# Python SDK cancellation
cancellation_result = trade_manager.cancel_order(order_id="1704024000123")

# JavaScript SDK cancellation
const cancellation = await silhouette.cancelOrder({
  orderId: "1704024000123",
  gasLimit: 25000
});
```

#### 3. Automatic Expiry
Orders automatically expire based on the `expiry` timestamp:
- Expired orders are removed from the matching engine
- No gas fee required for automatic expiry
- Settlement of any partial fills occurs in next batch

### Cancellation Mechanics

#### Immediate Cancellation
- **Full Orders**: Cancelled immediately if no partial fills
- **Gas Cost**: ~25,000 gas (~$0.0005 at 1 GWEI)
- **Confirmation**: Usually within 1-2 seconds on HyperEVM

#### Partial Fill Handling
- **Partially Filled Orders**: Only unfilled portion is cancelled
- **Filled Portion**: Automatically settles in next batch
- **Refund**: Unfilled portion returns to available balance

#### Race Conditions
```javascript
// Handling cancellation race conditions
try {
  const cancellation = await cancelOrder(orderId);
  
  if (cancellation.status === 'cancelled') {
    console.log('Order cancelled successfully');
  } else if (cancellation.status === 'filled_before_cancel') {
    console.log('Order filled before cancellation');
  } else if (cancellation.status === 'partially_filled') {
    console.log(`Partial fill: ${cancellation.filled_amount}`);
  }
} catch (error) {
  if (error.code === 'ORDER_NOT_FOUND') {
    console.log('Order may have already been filled or expired');
  }
}
```

## Error Handling

### Common Order Errors

#### 1. Insufficient Balance
```javascript
// Error: Insufficient balance for order
{
  "error": "INSUFFICIENT_BALANCE",
  "message": "Insufficient USDC balance for buy order",
  "required": "1250.00",
  "available": "1000.00",
  "currency": "USDC"
}

// Solution: Deposit more funds or reduce order size
const depositTx = await silhouette.deposit({
  token: 'USDC',
  amount: '500.00'
});
```

#### 2. Invalid Price Precision
```javascript
// Error: Price precision exceeds maximum
{
  "error": "INVALID_PRECISION",
  "message": "Price precision exceeds maximum for HYPE/USDC",
  "provided": "1.123456",
  "maximum_decimals": 4
}

// Solution: Round price to valid precision
const validPrice = parseFloat(price).toFixed(4); // "1.1235"
```

#### 3. Order Expiry Issues
```javascript
// Error: Order expiry too far in future
{
  "error": "INVALID_EXPIRY",
  "message": "Order expiry exceeds maximum allowed time",
  "provided": 1704110400,
  "maximum": 1704024000
}

// Solution: Set expiry within allowed range (typically 24 hours)
const maxExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
```

#### 4. Gas Estimation Failures
```javascript
// Error: Gas estimation failed
{
  "error": "GAS_ESTIMATION_FAILED",
  "message": "Unable to estimate gas for transaction",
  "suggested_gas_limit": 35000
}

// Solution: Use suggested gas limit with buffer
const gasLimit = Math.floor(suggestedGas * 1.2); // 20% buffer
```

### Error Recovery Strategies

#### Automatic Retry Logic
```python
import time
from functools import wraps

def retry_order_submission(max_retries=3, backoff_factor=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    
                    # Exponential backoff
                    wait_time = backoff_factor ** attempt
                    print(f"Attempt {attempt + 1} failed: {e}")
                    print(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    
                    # Adjust parameters for retry
                    kwargs = adjust_for_retry(kwargs, e)
            
            return wrapper
        return decorator

def adjust_for_retry(params, error):
    """Adjust order parameters based on error type"""
    if 'GAS_LIMIT' in str(error):
        params['gas_limit'] = int(params.get('gas_limit', 30000) * 1.2)
    elif 'PRICE_CHANGED' in str(error):
        # Refresh market price for retry
        params['price'] = get_current_market_price(params['token_pair'])
    
    return params
```

#### Error Logging and Monitoring
```python
import logging
from datetime import datetime

class OrderErrorLogger:
    def __init__(self):
        self.logger = logging.getLogger('silhouette_orders')
        self.error_counts = {}
    
    def log_error(self, order_id, error_type, error_message, order_params=None):
        """Log order errors with context"""
        self.logger.error(f"Order {order_id} failed: {error_type} - {error_message}")
        
        # Track error frequencies
        self.error_counts[error_type] = self.error_counts.get(error_type, 0) + 1
        
        # Alert on repeated errors
        if self.error_counts[error_type] > 5:
            self.send_alert(f"High frequency of {error_type} errors: {self.error_counts[error_type]}")
    
    def get_error_summary(self):
        """Get summary of recent errors"""
        return {
            'total_errors': sum(self.error_counts.values()),
            'error_breakdown': self.error_counts,
            'timestamp': datetime.now().isoformat()
        }

# Usage
error_logger = OrderErrorLogger()

try:
    result = submit_order(order)
except OrderError as e:
    error_logger.log_error(order['nonce'], e.error_type, str(e), order)
    raise
```

## Advanced Order Management

### Order Validation
```python
def validate_order(order, account_balance):
    """Comprehensive order validation"""
    errors = []
    
    # Check required fields
    required_fields = ['token_pair', 'side', 'amount', 'price', 'expiry']
    for field in required_fields:
        if field not in order:
            errors.append(f"Missing required field: {field}")
    
    # Validate token pair format
    if not re.match(r'^[A-Z]+/[A-Z]+$', order.get('token_pair', '')):
        errors.append("Invalid token pair format")
    
    # Validate side
    if order.get('side') not in ['buy', 'sell']:
        errors.append("Side must be 'buy' or 'sell'")
    
    # Validate amounts and prices
    try:
        amount = float(order['amount'])
        price = float(order['price'])
        
        if amount <= 0:
            errors.append("Amount must be positive")
        if price <= 0:
            errors.append("Price must be positive")
        
        # Check precision limits
        token_pair = order['token_pair']
        if not check_precision(amount, get_amount_precision(token_pair)):
            errors.append(f"Amount precision exceeds limit for {token_pair}")
        if not check_precision(price, get_price_precision(token_pair)):
            errors.append(f"Price precision exceeds limit for {token_pair}")
        
        # Check balance requirements
        required_balance = calculate_required_balance(order)
        if required_balance > account_balance.get(get_base_currency(order), 0):
            errors.append("Insufficient balance for order")
    
    except (ValueError, TypeError):
        errors.append("Invalid numeric values for amount or price")
    
    # Validate expiry
    expiry = order.get('expiry', 0)
    now = int(time.time())
    max_expiry = now + (24 * 60 * 60)  # 24 hours max
    
    if expiry <= now:
        errors.append("Expiry must be in the future")
    if expiry > max_expiry:
        errors.append("Expiry too far in the future (max 24 hours)")
    
    return errors

# Example usage
validation_errors = validate_order(order, account_balance)
if validation_errors:
    raise ValidationError(f"Order validation failed: {'; '.join(validation_errors)}")
```

### Batch Order Management
```python
class BatchOrderManager:
    def __init__(self, trade_manager):
        self.trade_manager = trade_manager
        self.batch_limit = 50
    
    def submit_batch_orders(self, orders):
        """Submit multiple orders with coordination"""
        results = []
        failed_orders = []
        
        # Validate all orders first
        for i, order in enumerate(orders):
            try:
                self.trade_manager.validate_order(order)
            except ValidationError as e:
                failed_orders.append({
                    'index': i,
                    'order': order,
                    'error': str(e)
                })
        
        # Submit valid orders
        valid_orders = [order for i, order in enumerate(orders) 
                       if i not in [f['index'] for f in failed_orders]]
        
        for order in valid_orders:
            try:
                result = self.trade_manager.submit_order(order)
                results.append(result)
            except Exception as e:
                failed_orders.append({
                    'order': order,
                    'error': str(e)
                })
        
        return {
            'successful': results,
            'failed': failed_orders,
            'summary': {
                'total_submitted': len(orders),
                'successful_count': len(results),
                'failed_count': len(failed_orders)
            }
        }
    
    def cancel_batch_orders(self, order_ids):
        """Cancel multiple orders efficiently"""
        results = []
        
        for order_id in order_ids:
            try:
                result = self.trade_manager.cancel_order(order_id)
                results.append({
                    'order_id': order_id,
                    'status': 'cancelled',
                    'result': result
                })
            except Exception as e:
                results.append({
                    'order_id': order_id,
                    'status': 'failed',
                    'error': str(e)
                })
        
        return results
```

## Precision and Limits

### Token-Specific Precision
Silhouette follows Hyperliquid's levels of precision for prices and amounts, which are represented by a `uint64` in the smart contract. Token prices may have up to 5 significant figures. Each token on Hyperliquid has a `szDecimals` (for example, ETH has a `szDecimals` of 4). Prices for a specific token can have a maximum of `8 - szDecimals` decimal places. For example, ETH transactions have 5 significant figures and up to 4 decimal places.

`szDecimals` is also the highest number of decimal places when specifying the size of a trade in a token: you can specify ETH amounts up to 4 decimals of precision.

#### Common Token Precision Limits
```javascript
const tokenPrecision = {
  'ETH': { szDecimals: 4, maxPriceDecimals: 4 },
  'HYPE': { szDecimals: 4, maxPriceDecimals: 4 },
  'USDC': { szDecimals: 6, maxPriceDecimals: 2 },
  'BTC': { szDecimals: 3, maxPriceDecimals: 5 }
};

// Example: Valid HYPE order
const hypeOrder = {
  token_pair: 'HYPE/USDC',
  amount: '1000.0000',  // 4 decimal places max
  price: '1.2500'       // 4 decimal places max
};

// Example: Valid USDC order
const usdcOrder = {
  token_pair: 'ETH/USDC',
  amount: '0.5000',     // 4 decimal places for ETH
  price: '2500.00'      // 2 decimal places for USDC price
};
```

### Order Size Limits

#### Minimum Order Sizes
- **HYPE**: 1.0000 minimum
- **ETH**: 0.0100 minimum  
- **BTC**: 0.001 minimum
- **USDC**: 10.000000 minimum

#### Maximum Order Sizes
- Limited by available account balance
- No arbitrary maximum order size limits
- Large orders may be subject to additional verification

See the [Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size) for more information.

## Performance Monitoring

### Order Metrics
```python
class OrderMetrics:
    def __init__(self):
        self.metrics = {
            'total_orders': 0,
            'successful_orders': 0,
            'failed_orders': 0,
            'cancelled_orders': 0,
            'average_fill_time': 0,
            'gas_usage': []
        }
    
    def record_order_submission(self, order_id, gas_used=None):
        """Record order submission metrics"""
        self.metrics['total_orders'] += 1
        
        if gas_used:
            self.metrics['gas_usage'].append(gas_used)
    
    def record_order_fill(self, order_id, fill_time):
        """Record order fill metrics"""
        self.metrics['successful_orders'] += 1
        
        # Update average fill time
        current_avg = self.metrics['average_fill_time']
        total_fills = self.metrics['successful_orders']
        
        self.metrics['average_fill_time'] = (
            (current_avg * (total_fills - 1) + fill_time) / total_fills
        )
    
    def record_order_failure(self, order_id, error_reason):
        """Record order failure metrics"""
        self.metrics['failed_orders'] += 1
    
    def get_performance_summary(self):
        """Get performance summary"""
        total = self.metrics['total_orders']
        if total == 0:
            return "No orders submitted yet"
        
        success_rate = (self.metrics['successful_orders'] / total) * 100
        avg_gas = sum(self.metrics['gas_usage']) / len(self.metrics['gas_usage']) if self.metrics['gas_usage'] else 0
        
        return {
            'success_rate': f"{success_rate:.2f}%",
            'average_fill_time': f"{self.metrics['average_fill_time']:.2f}s",
            'average_gas_usage': f"{avg_gas:.0f} gas",
            'total_orders': total
        }

# Usage
metrics = OrderMetrics()
metrics.record_order_submission("order_123", gas_used=32000)
metrics.record_order_fill("order_123", fill_time=15.5)
print(metrics.get_performance_summary())
```

:::tip Order Best Practices
1. **Validate orders** before submission to avoid gas waste
2. **Set appropriate expiry** times (typically 1-24 hours)
3. **Monitor gas prices** and adjust limits accordingly
4. **Use proper precision** for token amounts and prices
5. **Implement retry logic** for network-related failures
6. **Track order states** to ensure proper execution
7. **Cancel unused orders** before expiry to free up balance
:::

:::warning Important Considerations
- Orders cannot be modified once submitted - cancel and resubmit instead
- Partial fills cannot be prevented - orders may fill incrementally
- Network congestion can delay order processing
- Always verify order details before submission
- Keep sufficient ETH balance for gas fees
:::
