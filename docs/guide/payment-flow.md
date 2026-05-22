# Payment Flow

Payment APIs can return a final result or an uncertain result. Clients must handle both.

## Barcode Payment

1. Cashier scans the customer's payment barcode.
2. Client calls `POST /upay/v2/pay` with a unique `client_sn`.
3. If the response is successful, show paid.
4. If the response is in progress or the network fails after submission, query by `client_sn`.
5. If the payment cannot complete before timeout, call cancel.

## QR Pre-create

1. Client calls `POST /upay/v2/precreate`.
2. Server returns a QR code or provider payment payload.
3. Customer completes payment.
4. Client waits for callback or queries the order.

## Final Order Statuses

| Status | Meaning |
| --- | --- |
| `PAID` | Payment completed. |
| `PAY_CANCELED` | Payment failed and was canceled. |
| `REFUNDED` | Fully refunded. |
| `PARTIAL_REFUNDED` | Partially refunded. |
| `CANCELED` | Order canceled. |

Uncertain states are not final. Query until a final state is returned or the timeout policy requires cancellation.
