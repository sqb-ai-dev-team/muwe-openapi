# Payment Flow

Payment APIs can return a final result or an uncertain result. Clients must handle both.

## Barcode Payment

1. Cashier scans the customer's payment barcode.
2. Client calls `POST /upay/v2/pay` with a unique `client_sn`.
3. If `biz_response.result_code` is `PAY_SUCCESS` and `order_status` is `PAID`, show paid.
4. If the response is in progress, unknown, or the network fails after submission, query by `client_sn` or `sn`.
5. If the payment cannot complete before timeout, call cancel and query again if cancel is uncertain.

## QR Pre-create

1. Client calls `POST /upay/v2/precreate`.
2. Server returns a QR code or provider payment payload.
3. Customer completes payment.
4. Client waits for callback or queries the order. A pre-created order is normally valid for about four minutes.

## Refund

1. Client calls `POST /upay/v2/refund` with `sn` or `client_sn`.
2. `refund_request_no` is the idempotency key for that refund. Retries of the same refund must reuse it.
3. For uncertain refund responses, query with `refund_request_no`.

## Cancel and Revoke

Use cancel for unpaid or uncertain orders before completion. Revoke is a provider/window-dependent same-day reversal capability and should not replace normal refund handling.

## Final Order Statuses

| Status | Meaning |
| --- | --- |
| `PAID` | Payment completed. |
| `PAY_CANCELED` | Payment failed and was canceled. |
| `REFUNDED` | Fully refunded. |
| `PARTIAL_REFUNDED` | Partially refunded. |
| `CANCELED` | Order canceled. |

Uncertain states are not final. Query until a final state is returned or the timeout policy requires cancellation.
